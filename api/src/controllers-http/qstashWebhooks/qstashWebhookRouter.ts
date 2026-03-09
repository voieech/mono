import express from "express";

import { InvalidInternalStateException } from "../../exceptions/index.js";
import { apiDB } from "../../kysely/index.js";
import { expo } from "../../notifications-push/index.js";
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
        case "podcast-episode-created": {
          const subscribersUserID = await apiDB
            .selectFrom("user_subscription")
            .select("user_id")
            .where("item_type", "=", "podcast_channel")
            .where("item_id", "=", event.data.podcastChannel.id)
            .execute()
            .then((rows) => rows.map((row) => row.user_id));

          const userDeviceExpoPushNotificationTokens = await apiDB
            .selectFrom("user_push_notif_tokens")
            .select("expo_token")
            .where("user_id", "in", subscribersUserID)
            .execute();

          const notifications = userDeviceExpoPushNotificationTokens.map(
            ({ expo_token }) => ({
              to: expo_token,
              title: event.data.podcastChannel.name,
              body: event.data.podcastEpisode.title,
            }),
          );

          const expoPushNotificationChunks =
            expo.chunkPushNotifications(notifications);

          const expoPushTickets = [];

          // @todo Send the chunks in parallel in the future to improve throughput
          for (const chunk of expoPushNotificationChunks) {
            try {
              const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
              expoPushTickets.push(...ticketChunk);

              // @todo
              // save tickets into DB to check delivery receipts later, to
              // find and remove tokens with 'DeviceNotRegistered' errors
            } catch (error) {
              // On failure, log it and continue with the next chunk instead of
              // failing for everything else
              req.logger
                .withError(error)
                .error("Failed to submit expo push notification chunk");
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
