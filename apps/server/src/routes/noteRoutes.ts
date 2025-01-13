import express from "express";
import noteController from "../controllers/noteController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import logger from "../utils/logger";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware(), async (req, res) => {
  try {
    const { title, content } = req.body;
    const user = req.context.user!;
    const result = await noteController.add(user, { title, content });
    reply(res, result);
  } catch (error: any) {
    console.error(error);
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

// Récupérer toutes les notes de l'utilisateur connecté
router.get("/", authMiddleware(), async (req, res) => {
  try {
    const user = req.context.user!;
    const result = await noteController.getAllFromUser(user.id, user);
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

// Récupérer toutes les notes de l'utilisateur en paramètre
router.get("/:userId", authMiddleware(), async (req, res) => {
  try {
    const { userId } = req.params;
    const user = req.context.user!;
    const result = await noteController.getAllFromUser(parseInt(userId), user);
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.patch("/:noteId", authMiddleware(), async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content } = req.body;
    const user = req.context.user!;
    const result = await noteController.update(user, { noteId: parseInt(noteId), title, content });
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.delete("/:noteId", authMiddleware(), async (req, res) => {
  try {
    const { noteId } = req.params;
    const user = req.context.user!;
    const result = await noteController.delete(user, parseInt(noteId));
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

export default router;
