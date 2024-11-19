import express from "express";
import { Request, Response } from "express";
const router = express.Router();

import userController from "../controllers/userController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import logger from "../utils/logger";
import authMiddleware, { CustomRequestUser } from "../middleware/authMiddleware";
import { EnumUserRole } from "@sigl/types";

router.post(
  "/",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const body = req.body;
      const result = await userController.add(body);
      reply(res, result);
    } catch (error: any) {
      console.error(error);
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get("/", authMiddleware(), async (_req: Request, res: Response) => {
  try {
    const result = await userController.getAll();
    reply(res, result);
  } catch (error: any) {
    console.error(error);
    reply(res, ControllerError.INTERNAL());
  }
});

router.get("/:id", authMiddleware(), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await userController.get(id);
    reply(res, result);
  } catch (error) {
    console.error(error);
    reply(res, ControllerError.INTERNAL());
  }
});

router.delete(
  "/:id",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await userController.delete(id);
      reply(res, result);
    } catch (error) {
      console.error(error);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.patch("/:id/password", authMiddleware(), async (req: CustomRequestUser, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (req.user?.id !== id && !req.user?.role?.includes(EnumUserRole.ADMIN)) {
      return reply(res, ControllerError.UNAUTHORIZED());
    }

    const body = req.body;
    const result = await userController.updatePasswordAdmin(
      id,
      body.password,
      body.confirmPassword,
    );
    reply(res, result);
  } catch (error) {
    console.error(error);
    reply(res, ControllerError.INTERNAL());
  }
});

export default router;
