import express from "express";

// import { apiDB } from "../../kysely/index.js";

export const createRoutes = express
  .Router()

  .post("/v1/create/youtube-video-summary", (req, res) => {
    const youtubeVideoID = req.body.youtubeVideoID;

    youtubeVideoID;

    // @todo
    // apiDB
    //   .insertTable("...")
    //   .values({ youtubeVideoID })

    res.status(200).json({});
  });
