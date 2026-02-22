import express from "express";

import { tApi } from "../../util/tApi.js";

if (process.env["TELE_ADMINBOT_BOT_TOKEN"] === undefined) {
  throw new Error(`process.env.TELE_ADMINBOT_BOT_TOKEN is undefined`);
}
const TELE_ADMINBOT_BOT_TOKEN = process.env["TELE_ADMINBOT_BOT_TOKEN"];

if (process.env["TELE_ADMINBOT_ADMIN_CHAT_ID"] === undefined) {
  throw new Error(`process.env.TELE_ADMINBOT_ADMIN_CHAT_ID is undefined`);
}
const TELE_ADMINBOT_ADMIN_CHAT_ID = process.env["TELE_ADMINBOT_ADMIN_CHAT_ID"];

export const contactFormRoutes = express
  .Router()

  .post("/v1/contact-form", async (req, res) => {
    const contactFormData = req.body;
    const userID = req.isUserAuthenticated
      ? await req.genAuthenticatedUserID()
      : null;

    const contactFormFullData = {
      userID,
      ...contactFormData,
    };

    const message =
      `VOIEECH CONTACT FORM:\n\n` +
      JSON.stringify(contactFormFullData, null, 2);

    await tApi(
      TELE_ADMINBOT_BOT_TOKEN,
      "sendMessage",
      JSON.stringify({
        chat_id: TELE_ADMINBOT_ADMIN_CHAT_ID,
        text: message,
      }),
    );

    res.status(200).json({});
  });
