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

  /**
   * Redirect user here to generate WorkOS AuthKit link for user to authenticate
   */
  .get("/auth/workos/login", (req, res) => {
    const target = req.query["target"]?.toString() || "web";
    if (target !== "web" && target !== "mobile") {
      throw new Error("Invalid target type");
    }

    const codeChallenge = req.query["codeChallenge"]?.toString();
    if (typeof codeChallenge !== "string") {
      throw new Error("Invalid code challenge");
    }

    const challengeMethod = req.query["challengeMethod"]?.toString();
    if (!isValidChallengeMethod(challengeMethod)) {
      throw new Error("Invalid challenge method");
    }

    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
      clientId: WORKOS_CLIENT_ID,
      codeChallenge: codeChallenge,
      codeChallengeMethod: challengeMethod,

      // Use AuthKit to handle the authentication flow
      provider: "authkit",

      // WorkOS will redirect to this callback endpoint to after a user authenticates
      redirectUri: WORKOS_REDIRECT_URI,

      // Encode target in state to know how to respond in callback
      state: JSON.stringify({ target }),
    });

    // Mobile app will open the authUrl
    if (target === "mobile") {
      res.json({ authUrl: authorizationUrl });
      return;
    }

    // Redirect web client to the authUrl
    if (target === "web") {
      res.redirect(authorizationUrl);
      return;
    }
  })

  /**
   * Called after user successfully authenticates.
   * This URL is the "WORKOS_REDIRECT_URI"
   */
  .get("/auth/workos/login/callback", async (req, res) => {
    // This state is custom state that is set previously during auth URL
    // generation, and it is reflected back to us on successful authentication.
    if (req.query["state"] === undefined) {
      res.status(400).json({
        error: "No state reflected back from auth provider",
      });
      return;
    }

    const reflectedState = JSON.parse(req.query["state"]?.toString());
    if (typeof reflectedState !== "object") {
      res.status(400).json({
        error: "Reflected state from auth provider is not an object",
      });
      return;
    }

    // @todo Validate shape of reflected state

    const authorizationCodeFromAuthkit = req.query["code"]?.toString();

    if (authorizationCodeFromAuthkit === undefined) {
      switch (reflectedState.target) {
        case "mobile": {
          res.redirect(`voieech://auth/callback?error='no_code'`);
          return;
        }

        case "web": {
          res.status(400).send({
            error: "No auth code provided",
          });
          return;
        }

        default:
          throw new Error("Invalid client type in reflected auth state");
      }
    }

    switch (reflectedState.target) {
      case "mobile": {
        // Redirect back to mobile with auth code
        // instead of redirecting back through deep link we could do universal link instead
        // https://voieech/auth/callback - have to implement route on web and app association scheme for redirection back to mobile app
        // universal links requires secure and verified association with specific domain
        // could unify app in this way
        res.redirect(
          `voieech://auth/callback?code=${encodeURIComponent(authorizationCodeFromAuthkit)}`,
        );
        return;
      }

      case "web": {
        try {
          const authenticationResponse =
            await workos.userManagement.authenticateWithCode({
              code: authorizationCodeFromAuthkit,
              clientId: WORKOS_CLIENT_ID,
              session: {
                sealSession: true,
                cookiePassword: WORKOS_COOKIE_PASSWORD,
              },
            });

          res.cookie(WORKOS_COOKIE_NAME, authenticationResponse.sealedSession, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
          });

          // Use the information in `user` as needed for other business logic
          // authenticationResponse.user;

          // Redirect the user to the homepage
          res.redirect("/");
          return;
        } catch (error) {
          res.redirect("/auth/workos/login");
          return;
        }
      }

      default:
        throw new Error("Invalid client type in reflected auth state");
    }
  })

  /**
   * Mobile exchanges for tokens using one time auth code from workos
   *
   * @todo Add mobile prefix in URL if this is mobile only
   */
  .post("/auth/workos/exchange-code", async (req, res) => {
    const authorizationCodeFromAuthkit = req.body["code"]?.toString();
    if (typeof authorizationCodeFromAuthkit !== "string") {
      res.status(400).json({
        error: "Authorization Code must be a string",
      });
      return;
    }

    const pkceCodeVerifier = req.body["codeVerifier"]?.toString();
    if (typeof pkceCodeVerifier !== "string") {
      res.status(400).json({
        error: "PKCE Code Verifier must be a string",
      });
      return;
    }

    try {
      const authenticationResponse =
        await workos.userManagement.authenticateWithCode({
          code: authorizationCodeFromAuthkit,
          codeVerifier: pkceCodeVerifier,
          clientId: WORKOS_CLIENT_ID,
        });

      if (!authenticationResponse) {
        res.status(404).json({
          error: "Invalid or expired code",
        });
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

  /**
   * Refresh endpoint for mobile
   *
   * @todo Add mobile prefix in URL if this is mobile only
   */
  .post("/auth/workos/refresh", async (req, res) => {
    const { refreshToken } = req.body;

    if (refreshToken === undefined) {
      res.status(401).json({
        error: "No refresh token provided",
        user: null,
        accessToken: null,
        refreshToken: null,
      });
      return;
    }

    try {
      const refreshedTokens =
        await workos.userManagement.authenticateWithRefreshToken({
          refreshToken,
          clientId: WORKOS_CLIENT_ID,
        });

      res.json({
        user: mapWorkOsUser(refreshedTokens.user),
        accessToken: refreshedTokens.accessToken,
        refreshToken: refreshedTokens.refreshToken,
      });
      return;
    } catch (error) {
      res.status(401).json({
        error: "Invalid or expired refresh token",
        user: null,
        accessToken: null,
        refreshToken: null,
      });
    }
  })

  /**
   * Redirect here to log user out
   */
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
