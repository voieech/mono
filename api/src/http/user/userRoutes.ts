import express from "express";

// import { apiDB } from "../../kysely/index.js";

export const userRoutes = express
  .Router()

  // @todo Add in Zod and do validation first
  // @todo Add in authn middleware before allowing to continue
  .post("/v1/user/settings/content-preference", (req, res) => {
    const userContentPreferenceTags = req.body.userContentPreferenceTags;

    userContentPreferenceTags;

    // @todo Maybe it should be rows instead of a single array so we can query/filter it?
    // apiDB
    //   .updateTable("user_content_preference")
    //   .set(userContentPreferenceTags)
    //   .where("user_id", "==", authn.userID);

    res.status(200).json({});
  });
