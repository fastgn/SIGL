import express from "express";
const router = express.Router();

import userController from "../controllers/userController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const result = await userController.add(body);
    reply(res, result);
  } catch (error) {
    console.error(error);
    reply(res, ControllerError.INTERNAL());
  }
});

export default router;
