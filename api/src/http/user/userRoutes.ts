import express from "express";

// import { apiDB } from "../../kysely/index.js";

export const userRoutes = express
  .Router()

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
