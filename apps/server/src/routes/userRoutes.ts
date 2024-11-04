import express from "express";
const router = express.Router();

import userController from "../controllers/userController";

router.post("/", userController.add);

export default router;
