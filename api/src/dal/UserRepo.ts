import { apiDB } from "../kysely/index.js";

export const userRepo = {
  async create(user: {
    id?: string | null;
    workos_id: string;
    email: string;
    email_verified: boolean;
    locale: string | null;
    created_at?: $DateTime.ISO.DateTime.Strong;
    first_name?: string | null;
    last_name?: string | null;
    profile_picture_url?: string | null;
  }) {
    const dbUserObject = {
      id: user.id ?? crypto.randomUUID(),
      workos_id: user.workos_id,
      created_at:
        user.created_at == null
          ? $DateTime.now.asIsoDateTime()
          : $DateTime.ISO.DateTime.makeStrongAndThrowOnError(user.created_at),
      email: user.email,
      email_verified: user.email_verified,
      locale: user.locale,
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      profile_picture_url: user.profile_picture_url ?? null,
    };

    await apiDB.insertInto("user").values(dbUserObject).execute();

    return dbUserObject;
  },

  async getUserByWorkosId(workosId: string) {
    return await apiDB
      .selectFrom("user")
      .selectAll()
      .where("workos_id", "=", workosId)
      .executeTakeFirst();
  },

  async updateUserByWorkosId(
    workosId: string,
    user: {
      email: string;
      email_verified: boolean;
      locale: string | null;
      created_at?: $DateTime.ISO.DateTime.Strong;
      first_name?: string | null;
      last_name?: string | null;
      profile_picture_url?: string | null;
    },
  ) {
    return await apiDB
      .updateTable("user")
      .where("workos_id", "=", workosId)
      .set({
        email: user.email,
        email_verified: user.email_verified,
        locale: user.locale,
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        profile_picture_url: user.profile_picture_url ?? null,
      })
      .execute();
  },

  async deleteUserByWorkosId(workosId: string) {
    return await apiDB
      .deleteFrom("user")
      .where("workos_id", "=", workosId)
      .execute();
  },
};
