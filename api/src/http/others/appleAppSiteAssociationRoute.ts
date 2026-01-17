import express from "express";

const router = express.Router();

// Using hardcoded association file in web frontend for now
if (process.env["USE-DYNAMIC-APPLE-APP-SITE-ASSOCIATION"]) {
  router.get("/.well-known/apple-app-site-association", function (_, res) {
    // @todo Add cache headers
    res.status(200).json({
      applinks: {
        apps: [],
        details: [
          {
            appID: `${process.env["APPLE_TEAM_ID"]}.com.voieech-app`,
            paths: ["/podcast/channel/*", "/podcast/episode/*"],
          },
        ],
      },
    });
  });
}

export const appleAppSiteAssociationRoute = router;
