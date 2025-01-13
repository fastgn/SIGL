import { logger } from "@azure/storage-blob";
import express, { Request, Response } from "express";
import { biannualEvaluationController } from "../controllers/biannualEvaluationController";
import { ControllerError } from "../utils/controller";
import { reply } from "../utils/http";
import authMiddleware from "../middleware/authMiddleware";
import { EnumUserRole } from "@sigl/types";

const router = express.Router();

router.get(
  "/trainingDiary/:trainingDiaryId",
  authMiddleware(),
  async (_req: Request, res: Response) => {
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
  },
);

router.post(
  "/",
  authMiddleware([EnumUserRole.EDUCATIONAL_TUTOR, EnumUserRole.APPRENTICE_MENTOR]),
  async (req: Request, res: Response) => {
    try {
      logger.info("Création d'une evaluation semestrielle");
      const result = await biannualEvaluationController.createBiannualEvaluationWithSkills(
        req.body,
      );
      logger.info("Evaluation semestrielle crée");
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.put(
  "/",
  authMiddleware([EnumUserRole.EDUCATIONAL_TUTOR]),
  async (req: Request, res: Response) => {
    try {
      logger.info("Modification d'une evaluation semestrielle");
      const result = await biannualEvaluationController.updateBiannualEvaluationWithSkills(
        req.body,
      );
      logger.info("Evaluation semestrielle modifiée");
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get("/skills", authMiddleware(), async (_req: Request, res: Response) => {
  try {
    logger.info("Récupération des skills");
    const result = await biannualEvaluationController.getSkills();
    logger.info("Skills sélectionnes");
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

export default router;
