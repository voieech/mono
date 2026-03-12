import type { PublishRequest } from "@upstash/qstash";

import type { DistributiveOmit } from "../util/DistributiveOmit.js";
import type { QstashEvent } from "./qstashEventSchema.js";

import { QSTASH_WEBHOOK_HANDLER_BASE_URL, qstashClient } from "./qstash.js";

/**
 * Where is the QStash event webhook handler running at, for QStash to deliver
 * the events to later on?
 *
 * It can be on the same domain as the main API service, or be a standalone
 * deployment of the API server just for the sake of running these background
 * jobs and handle incoming events.
 */
const url = `${QSTASH_WEBHOOK_HANDLER_BASE_URL}/qstash/webhooks`;

/**
 * Publish a QStash event
 */
export function publishQstashEvent(config: {
  body: DistributiveOmit<QstashEvent, "qstashMessageID" | "id" | "createdAt">;
  delay?: PublishRequest["delay"];
  contentBasedDeduplication?: true;
}) {
  const jsonEvent: PublishRequest<Omit<QstashEvent, "qstashMessageID">> = {
    url,
    body: {
      id: crypto.randomUUID(),
      createdAt: $DateTime.now.asIsoDateTime(),
      ...config.body,
    },
  };

  // @todo
  // Need to do this because their SDK does not support setting undefined
  // on optional fields... ugh
  if (config.delay !== undefined) {
    jsonEvent.delay = config.delay;
  }
  if (config.contentBasedDeduplication !== undefined) {
    jsonEvent.contentBasedDeduplication = config.contentBasedDeduplication;
  }

  return qstashClient.publishJSON(jsonEvent);
}
