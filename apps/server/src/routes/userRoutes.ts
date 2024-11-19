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

router.get("/", async (_req, res) => {
  try {
    console.log("GET /");
    const result = await userController.getAll();
    reply(res, result);
  } catch (error) {
    console.error(error);
    reply(res, ControllerError.INTERNAL());
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await userController.get(id);
    reply(res, result);
  } catch (error) {
    console.error(error);
    reply(res, ControllerError.INTERNAL());
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await userController.delete(id);
    reply(res, result);
  } catch (error) {
    console.error(error);
    reply(res, ControllerError.INTERNAL());
  }
});

router.patch("/:id/password", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
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
