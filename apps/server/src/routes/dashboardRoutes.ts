import express from "express";
import { Request, Response } from "express";
const router = express.Router();

import userController from "../controllers/userController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import logger from "../utils/logger";
import authMiddleware from "../middleware/authMiddleware";
import { EnumUserRole } from "@sigl/types";
import dashboardController from "../controllers/dashboardsController";

router.get(
  "/evaluation/skills",
  authMiddleware([
    EnumUserRole.ADMIN,
    EnumUserRole.APPRENTICE_COORDINATOR,
    EnumUserRole.APPRENTICE,
  ]),
  async (_req: Request, res: Response) => {
    try {
      logger.info("Récupération des compétences");
      const result = await dashboardController.getSkills();
      logger.info("Compétences récupérées");
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get(
  "/evaluation/user/:userId",
  authMiddleware([
    EnumUserRole.ADMIN,
    EnumUserRole.APPRENTICE_COORDINATOR,
    EnumUserRole.APPRENTICE,
  ]),
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      logger.info("Récupération des évaluations pour l'utilisateur " + userId);
      const result = await dashboardController.getEvaluationPerUser(parseInt(userId));
      logger.info("Evaluations récupérées");
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get(
  "/users/count",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (_req: Request, res: Response) => {
    try {
      logger.info("Récupération du nombre total d'utilisateurs");
      const result = await userController.getCount();
      logger.info("Nombre total d'utilisateurs récupéré");
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get(
  "/users/count/role",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (_req: Request, res: Response) => {
    try {
      logger.info("Récupération du nombre d'utilisateurs par rôle");
      const result = await userController.getCountForRole();
      logger.info("Nombre d'utilisateurs par rôle récupéré");
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get(
  "/users/:id/apprentices",
  authMiddleware([
    EnumUserRole.ADMIN,
    EnumUserRole.APPRENTICE_COORDINATOR,
    EnumUserRole.APPRENTICE_MENTOR,
    EnumUserRole.EDUCATIONAL_TUTOR,
  ]),
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const role = req.query.role as string;
      logger.info("Récupération des apprentis pour l'utilisateur " + id);
      if (role === "mentor") {
        const result = await dashboardController.getApprenticeOfMentor(parseInt(id));
        logger.info("Apprentis récupérés");
        reply(res, result);
      } else if (role === "tutor") {
        const result = await dashboardController.getApprenticesOfTutor(parseInt(id));
        logger.info("Apprentis récupérés");
        reply(res, result);
      } else {
        logger.error("Rôle invalide : " + role);
        reply(res, ControllerError.INVALID_PARAMS({ message: "Rôle invalide" }));
        return;
      }
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get(
  "/notes/:userId",
  authMiddleware([
    EnumUserRole.ADMIN,
    EnumUserRole.APPRENTICE,
    EnumUserRole.APPRENTICE_MENTOR,
    EnumUserRole.EDUCATIONAL_TUTOR,
  ]),
  async (req: Request, res: Response) => {
    try {
      logger.info("Récupération de la dernière note");
      const userId = req.params.userId;
      const limite = (req.query.limite as string) || "10";
      const result = await dashboardController.getLastNote(parseInt(userId), parseInt(limite));
      logger.info("Dernière note récupérée");
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL({ message: error.message }));
    }
  },
);
router.get(
  "/events/:userId",
  authMiddleware([
    EnumUserRole.ADMIN,
    EnumUserRole.APPRENTICE,
    EnumUserRole.APPRENTICE_MENTOR,
    EnumUserRole.EDUCATIONAL_TUTOR,
  ]),
  async (req: Request, res: Response) => {
    try {
      logger.info("Récupération du prochain événement");
      const userId = req.params.userId;
      const limit = (req.query.limit as string) || "10";
      const role = req.query.role as string;
      if (!role) {
        logger.error("Le rôle est requis");
        reply(res, ControllerError.INVALID_PARAMS({ message: "Le rôle est requis" }));
        return;
      }

      if (role === "apprentice") {
        const result = await dashboardController.getNextEvent(parseInt(userId), parseInt(limit));
        logger.info("Prochain événement récupéré");
        reply(res, result);
      } else if (role === "mentor") {
        const apprenticeRes = await dashboardController.getApprenticeOfMentor(parseInt(userId));
        const apprentices = apprenticeRes.data;
        const apprenticesIds = apprentices.map((apprentice: any) => apprentice.id);
        const result = await dashboardController.getNextEventForApprentices(
          apprenticesIds,
          parseInt(limit),
        );
        logger.info("Prochain événement récupéré");
        reply(res, result);
      } else if (role === "tutor") {
        const apprenticeRes = await dashboardController.getApprenticesOfTutor(parseInt(userId));
        const apprentices = apprenticeRes.data as number[];
        const apprenticesIds = apprentices.map((apprentice: any) => apprentice.id);
        const result = await dashboardController.getNextEventForApprentices(
          apprenticesIds,
          parseInt(limit),
        );
        logger.info("Prochain événement récupéré");
        reply(res, result);
      } else {
        logger.error("Rôle invalide");
        reply(res, ControllerError.INVALID_PARAMS({ message: "Rôle invalide" }));
      }
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);
router.get(
  "/groups",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (_req: Request, res: Response) => {
    try {
      const limit = (_req.query.limit as string) || "10";
      logger.info("Récupération de tous les groupes");
      const result = await dashboardController.getAllGroups(parseInt(limit));
      logger.info("Groupes récupérés");
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);
router.get(
  "/apprentices/promotion",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (_req: Request, res: Response) => {
    try {
      logger.info("Récupération du nombre d'apprentis par promotion");
      const result = await dashboardController.getNumberOfApprenticesByPromotion();
      logger.info("Nombre d'apprentis par promotion récupéré");
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);
router.get(
  "/deliverable/event/:eventId",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req: Request, res: Response) => {
    try {
      const eventId = req.params.eventId;
      logger.info("Récupération des livrables pour l'événement " + eventId);
      const result = await dashboardController.getDelivrablesPerEvent(parseInt(eventId));
      logger.info("Livrables par événement récupérés");
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
  router.get(
    "/deliverable/event",
    authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
    async (req: Request, res: Response) => {
      try {
        const limit = (req.query.limit as string) || "10";
        logger.info("Récupération des livrables par événement");
        const result = await dashboardController.getAllDelivrablesPerEvent(parseInt(limit));
        logger.info("Livrables par événement récupérés");
        reply(res, result);
      } catch (error: any) {
        logger.error(`Erreur serveur : ${error.message}`);
        reply(res, ControllerError.INTERNAL());
      }
    },
  ),
);

export default router;
