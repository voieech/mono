import { z } from "zod";

const qstashBaseEventSchema = z.object({
  /**
   * Opaque unique ID using their custom format
   */
  qstashMessageID: z.string(),

  /**
   * UUID set by the publisher (our own code)
   */
  id: z.uuidv4(),

  /**
   * When was this "event" created at?
   */
  createdAt: z.iso.datetime(),

  /**
   * A fixed set of allowed event type names, each with their own different
   * corresponding properties. The specific event zod schemas will individually
   * specify this as literal strings.
   */
  type: z.string(),
});

/**
 * Union of all QStash event object types
 *
 * Extend this whenever you need to handle a new incoming event type from qstash
 */
export const qstashEventSchema = z.discriminatedUnion("type", [
  qstashBaseEventSchema.safeExtend({
    type: z.literal("expo-push-notification-receipt-check"),
    data: z.object({
      tickets: z.array(
        z.object({
          id: z.string(),
          expoToken: z.string(),
        }),
      ),
    }),
  }),
  qstashBaseEventSchema.safeExtend({
    type: z.literal("podcast-episode-created"),
    data: z.object({
      podcastEpisode: z.object({
        id: z.uuidv4(),
        title: z.string(),
      }),
      podcastChannel: z.object({
        id: z.uuidv4(),
        name: z.string(),
      }),
    }),
  }),
]);

export type QstashEvent = z.infer<typeof qstashEventSchema>;
