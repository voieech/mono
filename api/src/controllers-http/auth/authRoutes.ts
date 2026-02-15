import express from "express";
import { mapWorkOsUser } from "src/util/mapWorkOsUser.js";

import {
  workos,
  WORKOS_CLIENT_ID,
  WORKOS_REDIRECT_URI,
  WORKOS_COOKIE_PASSWORD,
  WORKOS_COOKIE_NAME,
} from "../../workos/index.js";

const isValidPkceCodeChallengeMethod = (txt: unknown): txt is "S256" =>
  txt === "S256";

/**
 * Routes for auth using WorkOS
 */
export const authRoutes = express
  .Router()

  /**
   * Make API call to this endpoint to generate a WorkOS AuthKit link for user
   * to authenticate at. This could be done on device/client in theory, but the
   * benefits of doing it in the API server are:
   * 1. Better security since we prevent redirect_uri hijacking and state
   * manipulation.
   * 2. Better update strategy where changes to the auth URL generation does not
   * require a new app deployment.
   */
  .get("/auth/workos/login", (req, res) => {
    const clientType = req.query["clientType"]?.toString() || "web";
    if (clientType !== "web" && clientType !== "mobile") {
      throw new Error("Invalid client type");
    }

    const pkceCodeChallenge = req.query["pkceCodeChallenge"]?.toString();
    if (typeof pkceCodeChallenge !== "string") {
      throw new Error("Invalid PKCE code challenge");
    }

    const pkceCodeChallengeMethod =
      req.query["pkceCodeChallengeMethod"]?.toString();
    if (!isValidPkceCodeChallengeMethod(pkceCodeChallengeMethod)) {
      throw new Error("Invalid PKCE code challenge method");
    }

    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
      clientId: WORKOS_CLIENT_ID,
      codeChallenge: pkceCodeChallenge,
      codeChallengeMethod: pkceCodeChallengeMethod,

      // Use AuthKit to handle the authentication flow
      provider: "authkit",

      // WorkOS will redirect to this callback endpoint to after a user authenticates
      redirectUri: WORKOS_REDIRECT_URI,

      // Encode state so that the callback API endpoint knows how to respond
      state: JSON.stringify({
        clientType,
      }),

      // Require user to select account (e.g. google account) instead of auto
      // signing in with your last signed in account. This prompt will be
      // forwarded to the actual auth provider like google.
      prompt: "select_account",
    });

    // Mobile app will open the authUrl
    if (clientType === "mobile") {
      res.json({ authUrl: authorizationUrl });
      return;
    }

    // Redirect web client to the authUrl
    if (clientType === "web") {
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

    const reflectedState = JSON.parse(req.query["state"]?.toString()) as {
      clientType: "mobile" | "web";
    };
    if (typeof reflectedState !== "object") {
      res.status(400).json({
        error: "Reflected state from auth provider is not an object",
      });
      return;
    }

    // @todo Validate shape of reflected state

    const authorizationCodeFromAuthkit = req.query["code"]?.toString();

    if (authorizationCodeFromAuthkit === undefined) {
      switch (reflectedState.clientType) {
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

    switch (reflectedState.clientType) {
      case "mobile": {
        // Redirect back to mobile with auth code
        // instead of redirecting back through deep link we could do universal link instead
        // https://voieech/auth/callback - have to implement route on web and app association scheme for redirection back to mobile app
        // universal links requires secure and verified association with specific domain
        // could unify app in this way
        res.redirect(
          `voieech://auth/callback?authorizationCode=${encodeURIComponent(authorizationCodeFromAuthkit)}`,
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
    const authorizationCodeFromAuthkit =
      req.body["authorizationCode"]?.toString();
    if (typeof authorizationCodeFromAuthkit !== "string") {
      res.status(400).json({
        error: "Authorization Code must be a string",
      });
      return;
    }

    const pkceCodeVerifier = req.body["pkceCodeVerifier"]?.toString();
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
      // eslint-disable-next-line no-console
      console.error(err);
      res
        .status(500)
        .json({ error: (err as any)?.msg ?? "Internal server error" });
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
        userData: mapWorkOsUser(refreshedTokens.user),
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
