import express from "express";

// import { apiDB } from "../../kysely/index.js";

export const createRoutes = express
  .Router()

  // @todo Add in Zod and do validation first
  // @todo Add in authn middleware before allowing to continue
  .post("/v1/create/youtube-video-summary", (req, res) => {
    const youtubeVideoID = req.body.youtubeVideoID;

    youtubeVideoID;

    // @todo
    // apiDB
    //   .insertTable("...")
    //   .values({ youtubeVideoID })

    res.status(200).json({});
  });
