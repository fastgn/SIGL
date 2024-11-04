import express from "express";
const router = express.Router();

import authController from "../controllers/authController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authController.login({
      email,
      password,
    });

    reply(res, result);
  } catch (error) {
    console.error(error);
    return reply(res, ControllerError.INTERNAL());
  }
});

export default router;
