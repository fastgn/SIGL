import { logger } from "@azure/storage-blob";
import express, { Request, Response } from "express";
import { biannualEvaluationController } from "../controllers/biannualEvaluationController";
import { ControllerError } from "../utils/controller";
import { reply } from "../utils/http";
const router = express.Router();

router.get("/:trainingDiaryId", async (_req: Request, res: Response) => {
  try {
    logger.info("Récupération des evaluations semestrielles");
    const id = parseInt(_req.params.trainingDiaryId);
    const result = await biannualEvaluationController.getBiannualEvaluations(id);
    logger.info("Evaluations semestrielles récupérées");
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

export default router;
