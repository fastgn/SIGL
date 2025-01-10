import express, { Request, Response } from "express";
const router = express.Router();

import tutorController from "../controllers/tutorController";
import { ControllerError } from "../utils/controller";
import { reply } from "../utils/http";
import logger from "../utils/logger";

router.get("/apprentices/:id", async (req: Request, res: Response) => {
  try {
    logger.info("Récupération des apprentis");
    const result = await tutorController.getApprentices(parseInt(req.params.id));
    logger.info("Apprentis récupérés");
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

export default router;
