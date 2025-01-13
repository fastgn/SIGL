import express, { Request, Response } from "express";
import userController from "../controllers/userController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import logger from "../utils/logger";
import authMiddleware, { CustomRequestUser } from "../middleware/authMiddleware";
import { EnumUserRole } from "@sigl/types";
import userService from "../services/user.service";

const router = express.Router();

router.post(
  "/",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      logger.info("Création d'un utilisateur");
      const body = req.body;
      const result = await userController.add(body);
      logger.info(`Utilisateur créé`);
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get("/", authMiddleware(), async (_req: Request, res: Response) => {
  try {
    logger.info("Récupération des utilisateurs");
    const result = await userController.getAll();
    logger.info("Utilisateurs récupérés");
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.get(
  "/tutors",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req: Request, res: Response) => {
    try {
      logger.info(`Récupération des tuteurs`);
      const result = await userController.getAllTutors();
      logger.info(`Tuteurs récupérés`);
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get(
  "/mentors",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req: Request, res: Response) => {
    try {
      logger.info(`Récupération des mentors`);
      const result = await userController.getAllMentors();
      logger.info(`Mentors récupérés`);
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get("/apprentice/:id", authMiddleware(), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    logger.info(`Récupération de l'apprenti ${id}`);
    const result = await userController.getApprentice(id);
    logger.info(`Apprenti ${id} récupéré`);
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.put(
  "/:id",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      logger.info(`Modification de l'utilisateur ${id}`);
      const body = req.body;
      const result = await userController.update(id, body);
      logger.info(`Utilisateur ${id} modifié`);
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get("/:id", authMiddleware(), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    logger.info(`Récupération de l'utilisateur ${id}`);
    const result = await userController.get(id);
    logger.info(`Utilisateur ${id} récupéré`);
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.delete(
  "/:id",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      logger.info(`Suppression de l'utilisateur ${id}`);
      const result = await userController.delete(id);
      logger.info(`Utilisateur ${id} supprimé`);
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.patch(
  "/:id/password",
  authMiddleware([
    EnumUserRole.ADMIN,
    EnumUserRole.APPRENTICE_COORDINATOR,
    EnumUserRole.APPRENTICE,
  ]),
  async (req: CustomRequestUser, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      logger.info(`Modification du mot de passe de l'utilisateur ${id}`);

      if (!req.context.user) {
        return reply(res, ControllerError.UNAUTHORIZED());
      }
      const roles = userService.getRoles(req.context.user);

      if (req.context.user?.id !== id && !roles.includes(EnumUserRole.ADMIN)) {
        return reply(res, ControllerError.UNAUTHORIZED());
      }

      const body = req.body;
      if (roles.includes(EnumUserRole.ADMIN)) {
        const result = await userController.updatePasswordAdmin(
          id,
          body.password,
          body.confirmPassword,
        );
        return reply(res, result);
      } else {
        const result = await userController.updatePasswordUser(
          id,
          body.password,
          body.confirmPassword,
          body.currentPassword,
        );
        return reply(res, result);
      }
    } catch (error) {
      console.error(error);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get("/:id/groups", authMiddleware(), async (req: CustomRequestUser, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    logger.info(`Récupération des groupes de l'utilisateur ${id}`);
    const result = await userController.getFiles(id);
    logger.info(`Groupes de l'utilisateur ${id} récupérés`);
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.get("/roles/:id/", authMiddleware(), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    logger.info(`Récupération des rôles de l'utilisateur ${id}`);
    const result = await userController.getRoles(id);
    logger.info(`Rôles de l'utilisateur ${id} récupérés`);
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.patch(
  "/:id/tutors",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const body = req.body;
      logger.info(`Modification des tuteurs de l'apprenti ${id}`);
      const result = await userController.updateTutors(
        id,
        body.educationalTutorId,
        body.apprenticeMentorId,
      );
      logger.info(`Tuteurs de l'apprenti ${id} modifiés`);
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.patch(
  "/:id/company",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const body = req.body;
      logger.info(`Modification de l'entreprise de l'apprenti ${id}`);
      const result = await userController.updateCompany(id, body.companyId);
      logger.info(`Entreprise de l'apprenti ${id} modifiée`);
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.patch(
  "/:id/post",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const body = req.body;
      logger.info(`Modification du poste de l'apprenti ${id}`);
      const result = await userController.updatePost(id, body.poste);
      logger.info(`Poste de l'apprenti ${id} modifié`);
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

export default router;
