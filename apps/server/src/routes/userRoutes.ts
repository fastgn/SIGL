import express from "express";
const router = express.Router();

import userController from "../controllers/userController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import logger from "../utils/logger";

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const result = await userController.add(body);
    reply(res, result);
  } catch (error: any) {
    console.error(error);
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

export default router;
