import express, { Request, Response } from "express";
import authMiddleware from "../middleware/authMiddleware";
import logger from "../utils/logger";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import { MeetingController } from "../controllers/meetingController";
import { EnumUserRole } from "@sigl/types";
import userService from "../services/user.service";
import { db } from "../providers/db";

const router = express.Router();

router.get(
  "/",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req: Request, res: Response) => {
    try {
      logger.info("Récupération de toutes les réunions");
      const result = await MeetingController.getAllMeetings();
      logger.info("Réunions récupérées");
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get("/:id", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Récupération de la réunion ${id}`);
    const result = await MeetingController.getMeetingById(parseInt(id));
    logger.info(`Réunions ${id} récupérée`);
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.get("/user/:id", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Récupération des réunions de l'utilisateur ${id}`);
    const result = await MeetingController.getMeetingsByUser(parseInt(id));
    logger.info(`Réunions de l'utilisateur ${id} récupérées`);
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.post("/", authMiddleware(), async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, date, presenter, jury, events } = req.body;

    if (!req.context.user) {
      return reply(res, ControllerError.UNAUTHORIZED());
    }

    const roles = userService.getRoles(req.context.user);
    if (
      !roles.includes(EnumUserRole.ADMIN) &&
      !roles.includes(EnumUserRole.APPRENTICE_COORDINATOR) &&
      !presenter.includes(req.context.user.id) &&
      !jury.includes(req.context.user.id)
    ) {
      return reply(res, ControllerError.UNAUTHORIZED());
    }

    if (!title || !date || !presenter || !jury) {
      logger.error(`Erreur serveur : paramètres manquants`);
      reply(res, ControllerError.INVALID_PARAMS());
      return;
    }

    logger.info(`Création de la réunion ${title}`);
    const result = await MeetingController.createMeeting(
      title,
      description,
      date,
      presenter,
      jury,
      events,
    );
    logger.info(`Réunion ${title} créée`);
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.delete("/:id", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.context.user) {
      return reply(res, ControllerError.UNAUTHORIZED());
    }

    const roles = userService.getRoles(req.context.user);
    const meeting = await db.meeting.findFirst({
      where: {
        id: parseInt(id),
      },
      include: {
        presenter: true,
        jury: true,
      },
    });

    if (
      !roles.includes(EnumUserRole.ADMIN) &&
      !roles.includes(EnumUserRole.APPRENTICE_COORDINATOR) &&
      !meeting?.presenter.find((presenter) => presenter.id === req.context.user?.id) &&
      !meeting?.jury.find((juryMember) => juryMember.id === req.context.user?.id)
    ) {
      return reply(res, ControllerError.UNAUTHORIZED());
    }

    logger.info(`Suppression de la réunion ${id}`);
    const result = await MeetingController.deleteMeeting(parseInt(id));
    logger.info(`Réunion ${id} supprimée`);
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

export default router;
