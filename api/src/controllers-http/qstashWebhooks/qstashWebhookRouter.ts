import type { ExpoPushMessage } from "expo-server-sdk";

import express from "express";

import {
  userPushNotificationTokenRepo,
  userSubscriptionRepo,
} from "../../dal/index.js";
import { InvalidInternalStateException } from "../../exceptions/index.js";
import { expo } from "../../notifications-push/index.js";
import { publishQstashEvent } from "../../qstash/index.js";
import { qstashWebhookSignatureVerificationMiddleware } from "./qstashWebhookSignatureVerificationMiddleware.js";

export const qstashWebhookRouter = express
  .Router()

  /**
   * Common endpoint for all QStash event webhook API calls
   */
  .post(
    `/qstash/webhooks`,
    qstashWebhookSignatureVerificationMiddleware,
    async (req, res) => {
      const event = req.qstashEvent;

      if (event === undefined) {
        throw new InvalidInternalStateException(
          "Missing QStash webhook event object",
        );
      }

      req.logger
        .withMetadata({
          qstashEventType: event.type,
        })
        .info("Qstash webhook: Processing event");

      switch (event.type) {
        case "expo-push-notification-receipt-check": {
          const ticketIDs = event.data.tickets.map((ticket) => ticket.id);
          const ticketChunks = expo.chunkPushNotificationReceiptIds(ticketIDs);

          for (const ticketChunk of ticketChunks) {
            try {
              const receipts =
                await expo.getPushNotificationReceiptsAsync(ticketChunk);

              for (const receiptID in receipts) {
                // Using non-null operator since we are iterating the given
                // object using its own keys
                const receipt = receipts[receiptID]!;

                // Do nothing if there is no error
                if (
                  receipt.status !== "error" ||
                  receipt.details?.error === undefined
                ) {
                  continue;
                }

                switch (receipt.details.error) {
                  case "DeviceNotRegistered": {
                    const expoPushToken =
                      receipt.details.expoPushToken ??
                      event.data.tickets.find(
                        (ticket) => ticket.id === receiptID,
                      )?.expoToken!;

                    await userPushNotificationTokenRepo.deleteByExpoPushToken(
                      expoPushToken,
                    );

                    req.logger.info("Removed invalid expo push token");

                    break;
                  }

                  default: {
                    req.logger
                      .withContext({
                        receipt,
                      })
                      .error(
                        "Missing Expo Push Notification receipt error handler",
                      );

                    // @todo Return 489 for DLQ?
                  }
                }
              }
            } catch (error) {
              req.logger.withError(error).error("Error fetching receipts");

              // @todo Return 5xx to retry?
            }
          }

          break;
        }

        case "podcast-episode-created": {
          const subscribersUserIds =
            await userSubscriptionRepo.getManySubscriptionUserIdByItem({
              itemType: "podcast_channel",
              itemID: event.data.podcastChannel.id,
            });

          if (subscribersUserIds.length === 0) {
            break;
          }

          const userDeviceExpoPushNotificationTokens =
            await userPushNotificationTokenRepo.getManyUserDeviceExpoPushNotificationTokenByUserIds(
              subscribersUserIds,
            );

          const notifications: Array<ExpoPushMessage> =
            userDeviceExpoPushNotificationTokens.map(({ expo_token }) => ({
              to: expo_token,
              title: event.data.podcastChannel.name,
              body: event.data.podcastEpisode.title,
              data: {
                // @todo
                // Have a validator or smth to ensure that we must always use a
                // URL with a scheme, regardless of whether is it the voieech://
                // or https:// or someApp:// schemes!
                // appRoute handles https:// schemes like "https://voieech.com"
                // by opening the link in the in app browser
                appRoute: `voieech://podcast/episode/${event.data.podcastEpisode.id}`,
              },
            }));

          const expoPushNotificationChunks =
            expo.chunkPushNotifications(notifications);

          // @todo Send the chunks in parallel in the future to improve throughput
          for (const expoPushNotificationChunk of expoPushNotificationChunks) {
            try {
              const expoPushTickets = await expo.sendPushNotificationsAsync(
                expoPushNotificationChunk,
              );

              const successfulExpoPushTickets: Array<{
                id: string;
                expoToken: string;
              }> = [];
              const failedExpoPushTokensToDelete: Array<string> = [];

              for (const [index, expoPushTicket] of expoPushTickets.entries()) {
                const expoToken =
                  expoPushNotificationChunk[index]?.to?.toString();
                // This should not be possible, but if it is somehow missing,
                // this will prevent erroring out
                if (expoToken === undefined) {
                  continue;
                }

                if (expoPushTicket.status === "ok") {
                  successfulExpoPushTickets.push({
                    id: expoPushTicket.id,
                    expoToken,
                  });
                } else {
                  // Push ticket only have "DeveloperError" as error type
                  if (expoPushTicket.details?.error === "DeveloperError") {
                    failedExpoPushTokensToDelete.push(expoToken);
                  }
                }
              }

              if (failedExpoPushTokensToDelete.length !== 0) {
                await userPushNotificationTokenRepo.deleteManyByExpoPushToken(
                  failedExpoPushTokensToDelete,
                );
              }

              // Send tickets to Q with a delay (20 mins as advised to ensure
              // that the downstream Apple/Google services have completed
              // processing) to check delivery receipts later, to handle any
              // delivery errors.
              await publishQstashEvent({
                delay: "20m",
                body: {
                  type: "expo-push-notification-receipt-check",
                  data: {
                    tickets: successfulExpoPushTickets,
                  },
                },
              });
            } catch (error) {
              // On failure, log it and continue with the next chunk instead of
              // failing for everything else
              req.logger
                .withError(error)
                .error("Failed to submit expo push notification chunk");

              // @todo Might want to do something like moving it to DLQ instead of just logging failure
            }
          }

          break;
        }

        default: {
          req.logger
            .withMetadata({
              event,
            })
            .error("QStash webhook: Missing event handler");

          // Return the custom HTTP 489 code to signal "event cannot be
          // processed, please move it to the DLQ".
          res.status(489).send();
          return;
        }
      }

      // Return 200 to signal "event is received and processed successfully".
      // If there is any errors, it would be thrown and bubbled to errorHandler
      // to respond with a 4xx, 5xx, or timeout and qstash will try again after
      // a backoff period.
      // @todo How long is the timeout?
      res.status(200).send();
    },
  );
