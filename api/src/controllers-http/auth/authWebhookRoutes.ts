import express from "express";

import { apiDB } from "../../kysely/index.js";
import { workos, WORKOS_WEBHOOK_PATH_SECRET } from "../../workos/index.js";
import { workOsIpAddressMiddleware } from "./workOsIpAddressMiddleware.js";
import { workOsWebhookSignatureVerificationMiddleware } from "./workOsWebhookSignatureVerificationMiddleware.js";

/**
 * Routes for WorkOS auth webhook calls
 */
export const authWebhookRoutes = express
  .Router()

  /**
   * Common endpoint for all WorkOS event webhook API calls
   */
  .post(
    // Uses WORKOS_WEBHOOK_PATH_SECRET to obfuscate endpoint URL
    `/auth/workos/webhooks/${WORKOS_WEBHOOK_PATH_SECRET}`,

    // Use a no-op if not enabled
    process.env["WORKOS_ENABLE_WEBHOOK_IP_ADDRESS_CHECK"] === "true"
      ? workOsIpAddressMiddleware
      : (_req, _res, next) => next(),

    workOsWebhookSignatureVerificationMiddleware,

    async (req, res) => {
      if (req.workosWebhookEvent?.event === undefined) {
        throw new Error("Missing WorkOS webhook event type.");
      }

      // Return 200 asap to signal "event is received". This does not mean that
      // our own processing succeeded since WorkOS does not care about that.
      res.status(200).send("");

      // @todo Ignore duplicate events as it is possible to receive the same event more than once.
      // Store for 7 days since WorkOS will retry for up to 6 days
      // req.workosWebhookEvent.id;
      // We might want to save the event in case we fail to process it and want to retry later on

      // eslint-disable-next-line no-console
      console.log(
        `[WorkOS webhook]: Processing event "${req.workosWebhookEvent.event}"`,
      );

      switch (req.workosWebhookEvent.event) {
        case "user.created": {
          const userID = crypto.randomUUID();

          await apiDB
            .insertInto("user")
            .values({
              id: userID,
              workos_id: req.workosWebhookEvent.data.id,
              created_at: $DateTime.ISO.DateTime.makeStrongAndThrowOnError(
                req.workosWebhookEvent.data.createdAt,
              ),
              email: req.workosWebhookEvent.data.email,
              email_verified: req.workosWebhookEvent.data.emailVerified,
              locale: req.workosWebhookEvent.data.locale,
              first_name: req.workosWebhookEvent.data.firstName ?? "",
              last_name: req.workosWebhookEvent.data.lastName ?? "",
              profile_picture_url:
                req.workosWebhookEvent.data.profilePictureUrl,
            })
            .execute();

          // Note that this might trigger an immediate second webhook API call
          // for the "user.updated" event.
          await workos.userManagement.updateUser({
            userId: req.workosWebhookEvent.data.id,
            externalId: userID,
          });

          return;
        }

        case "user.updated": {
          await apiDB
            .updateTable("user")
            .where("workos_id", "=", req.workosWebhookEvent.data.id)
            .set({
              email: req.workosWebhookEvent.data.email,
              email_verified: req.workosWebhookEvent.data.emailVerified,
              locale: req.workosWebhookEvent.data.locale,
              first_name: req.workosWebhookEvent.data.firstName ?? "",
              last_name: req.workosWebhookEvent.data.lastName ?? "",
              profile_picture_url:
                req.workosWebhookEvent.data.profilePictureUrl,
            })
            .execute();

          return;
        }

        case "user.deleted": {
          await apiDB
            .deleteFrom("user")
            .where("workos_id", "=", req.workosWebhookEvent.data.id)
            .execute();

          return;
        }

        default: {
          // eslint-disable-next-line no-console
          console.error(
            `[WorkOS webhook]: No event handlers for "${req.workosWebhookEvent.event}"`,
          );
          return;
        }
      }
    },
  );
