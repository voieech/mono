import { apiDB, sqlExistenceCheck } from "../kysely/index.js";

export const userPushNotificationTokenRepo = {
  async upsert(userPushNotificationToken: {
    user_id: string;
    expo_token: string;
    device_token?: undefined | string;
    device_platform?: undefined | "ios" | "android";
  }) {
    return await apiDB
      .insertInto("user_push_notif_tokens")
      .values({
        id: crypto.randomUUID(),
        created_at: $DateTime.now.asIsoDateTime(),
        updated_at: $DateTime.now.asIsoDateTime(),
        ...userPushNotificationToken,
      })
      // Upsert behaviour
      .onConflict((oc) => {
        return oc.column("expo_token").doUpdateSet({
          updated_at: $DateTime.now.asIsoDateTime(),
          user_id: userPushNotificationToken.user_id,
          device_token: userPushNotificationToken.device_token,
          device_platform: userPushNotificationToken.device_platform,
        });
      })
      .execute();
  },

  async getUserDeviceExpoPushNotificationTokenExists(filters: {
    expoPushToken: string;
    userID: string;
  }) {
    return await apiDB
      .selectFrom("user_push_notif_tokens")
      .select(sqlExistenceCheck)
      .where("expo_token", "=", filters.expoPushToken)
      .where("user_id", "=", filters.userID)
      .executeTakeFirst()
      .then((data) => data?.exists === true);
  },

  async deleteByExpoPushToken(expoPushToken: string) {
    return await apiDB
      .deleteFrom("user_push_notif_tokens")
      .where("expo_token", "=", expoPushToken)
      .execute();
  },

  async deleteManyByExpoPushToken(expoPushTokens: Array<string>) {
    return await apiDB
      .deleteFrom("user_push_notif_tokens")
      .where("expo_token", "in", expoPushTokens)
      .execute();
  },
};
