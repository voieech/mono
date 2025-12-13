import express from "express";

import { requireJwt } from "../auth/jwtMiddleware.js";

export const userRoutes = express
  .Router()
  .get("/me", requireJwt, (req, res) => {
    res.json({
      user: {
        id: req.jwtUser!.id,
        email: req.jwtUser!.email,
      },
    });
  });
