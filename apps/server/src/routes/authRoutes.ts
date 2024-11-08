import express from "express";
const router = express.Router();

import authController from "../controllers/authController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import logger from "../utils/logger";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authController.login({
      email,
      password,
    });

    reply(res, result);
  } catch (error: any) {
    console.error(error);
    logger.error(`Erreur serveur : ${error.message}`);
    return reply(res, ControllerError.INTERNAL());
  }
});

export default router;
