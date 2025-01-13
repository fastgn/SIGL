import express from "express";
import companyController from "../controllers/companyController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import logger from "../utils/logger";
import authMiddleware from "../middleware/authMiddleware";
import { EnumUserRole } from "@sigl/types";

const router = express.Router();

router.post(
  "/",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { name, address, city, country, description, apprenticeNumber, opco } = req.body;
      logger.info(`Création de l'entreprise`);
      const result = await companyController.createCompany(
        name,
        address,
        city,
        country,
        description,
        apprenticeNumber,
        opco,
      );
      logger.info(`Entreprise créée`);

      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.delete(
  "/:company_id",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { company_id } = req.params;
      logger.info(`Suppression de l'entreprise`);
      const result = await companyController.deleteCompany(parseInt(company_id));
      logger.info(`Entreprise supprimée`);

      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get("/:company_id", authMiddleware(), async (req, res) => {
  try {
    const { company_id } = req.params;
    logger.info(`Récupération de l'entreprise`);
    const result = await companyController.getCompany(parseInt(company_id));
    logger.info(`Entreprise récupérée`);

    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.get("/", authMiddleware(), async (req, res) => {
  try {
    logger.info(`Récupération de toutes les entreprises`);
    const result = await companyController.getAllCompany();
    logger.info(`Entreprises récupérées`);

    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.patch(
  "/:id",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, address, city, country, description, apprenticeNumber, opco } = req.body;
      logger.info(`Modification de l'entreprise`);
      const result = await companyController.updateCompany(
        parseInt(id),
        name,
        address,
        city,
        country,
        description,
        apprenticeNumber,
        opco,
      );
      logger.info(`Entreprise modifiée`);

      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

export default router;
