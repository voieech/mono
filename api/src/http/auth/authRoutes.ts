import express from "express";
import { mapWorkOsUser } from "src/util/mapWorkOsUser.js";

import {
  workos,
  WORKOS_CLIENT_ID,
  WORKOS_REDIRECT_URI,
  WORKOS_COOKIE_PASSWORD,
  WORKOS_COOKIE_NAME,
} from "./workos.js";

function isValidChallengeMethod(txt: unknown): txt is "S256" {
  return txt === "S256";
}

/**
 * Routes for auth using WorkOS
 */
export const authRoutes = express
  .Router()

  // Redirect user here to generate WorkOS AuthKit link for user to authenticate
  .get("/auth/workos/login", (req, res) => {
    const target = req.query["target"]?.toString() || "web";
    const codeChallenge = req.query["codeChallenge"]?.toString();
    const challengeMethod = req.query["challengeMethod"]?.toString();
    if (!isValidChallengeMethod(challengeMethod)) {
      throw new Error("Invalid challenge method");
    }

    if (typeof codeChallenge !== "string") {
      throw new Error("Invalid code challenge");
    }

    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
      clientId: WORKOS_CLIENT_ID,
      codeChallenge: codeChallenge,
      codeChallengeMethod: challengeMethod,

      // Use AuthKit to handle the authentication flow
      provider: "authkit",

      // Callback endpoint that WorkOS redirects to after a user authenticates
      redirectUri: WORKOS_REDIRECT_URI,

      // Encode target in state to know how to respond in callback
      state: JSON.stringify({ target }),
    });

    // For web: redirect directly
    // For mobile: return JSON with authUrl (mobile will open it)
    if (target === "mobile") {
      res.json({ authUrl: authorizationUrl });
    } else {
      res.redirect(authorizationUrl);
    }
  })

  // Called after user successfully authenticates
  // This is the "WORKOS_REDIRECT_URI"
  .get("/auth/workos/login/callback", async (req, res) => {
    // Get authorization code string returned by AuthKit
    const code = req.query["code"]?.toString?.();

    // Decode state to determine client type
    const state = req.query["state"]
      ? JSON.parse(req.query["state"].toString())
      : { target: "web" };

    if (code === undefined) {
      if (state.target === "mobile") {
        return res.redirect(
          `voieech://auth/callback?error=${encodeURIComponent("no_code")}`,
        );
      }
      res.status(400).send("No auth code provided");
      return;
    }

    if (state.target === "mobile") {
      return res.redirect(
        `voieech://auth/callback?code=${encodeURIComponent(code)}`,
      );
    }

    try {
      const authenticationResponse =
        await workos.userManagement.authenticateWithCode({
          code,
          clientId: WORKOS_CLIENT_ID,
          session: {
            sealSession: true,
            cookiePassword: WORKOS_COOKIE_PASSWORD,
          },
        });

        // For web: store cookie in session and redirect to homepage
        res.cookie(WORKOS_COOKIE_NAME, authenticationResponse.sealedSession, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });

        // Use the information in `user` as needed for other business logic
        // authenticationResponse.user;
        // @todo Modifiable
        // Redirect the user to the homepage
        res.redirect("/");
        return;
      }
    } catch (error) {
      // Redirect to login based on client type
      if (state.target === "mobile") {
        res.redirect("voieech://auth/error");
      } else {
        res.redirect("/auth/workos/login");
      }
      return;
    }
  })

  // Mobile exchanges one-time code for tokens
  .post("/auth/exchange-code", async (req, res) => {
    // Get authorization code string returned by AuthKit
    const code = req.body["code"]?.toString();
    const codeVerifier = req.body["codeVerifier"]?.toString();
    if (!code || typeof code !== "string") {
      res.status(400).json({ error: "Code must be a string" });
      return;
    }
    if (!codeVerifier || typeof codeVerifier !== "string") {
      res.status(400).json({ error: "Code Verifier must be a string" });
      return;
    }

    try {
      const authenticationResponse =
        await workos.userManagement.authenticateWithCode({
          code,
          codeVerifier: codeVerifier,
          clientId: WORKOS_CLIENT_ID,
        });

      if (!authenticationResponse) {
        res.status(404).json({ error: "Invalid or expired code" });
        return;
      }

      // Response to mobile app
      res.json({
        accessToken: authenticationResponse.accessToken,
        refreshToken: authenticationResponse.refreshToken,
        user: mapWorkOsUser(authenticationResponse.user),
      });
      return;
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  })

  // Refresh endpoint for mobile
  .post("/auth/refresh", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({
        error: "No refresh token provided",
        user: null,
        accessToken: null,
        refreshToken: null,
      });
      return;
    }

    try {
      const refreshed =
        await workos.userManagement.authenticateWithRefreshToken({
          refreshToken,
          clientId: WORKOS_CLIENT_ID,
        });

      res.json({
        user: mapWorkOsUser(refreshed.user),
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
      });
    } catch (error) {
      res.status(401).json({
        error: "Invalid or expired refresh token",
        user: null,
        accessToken: null,
        refreshToken: null,
      });
    }
  })

  // Redirect here to log user out
  .get("/auth/workos/logout/", async (req, res) => {
    res.redirect(
      await workos.userManagement
        .loadSealedSession({
          sessionData: req.cookies[WORKOS_COOKIE_NAME],
          cookiePassword: WORKOS_COOKIE_PASSWORD,
        })
        .getLogoutUrl(),
    );
    res.clearCookie(WORKOS_COOKIE_NAME);
  });
