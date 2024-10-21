import express from "express";
import diaryController from "../controllers/diaryController";
const router = express.Router();

router.post("/", diaryController.createDiary);

export default router;
