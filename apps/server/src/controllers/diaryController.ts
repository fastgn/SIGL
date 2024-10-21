import { Request, Response } from "express";
import trainingDiaryModel from "../models/trainingDiary";

const diaryController = {
  createDiary: async (req: Request, res: Response) => {
    const { user_id } = req.body;

    if (!user_id) {
      return res
        .status(400)
        .json({ message: "Veuillez renseigner le user pour associer le journal" });
    }

    if (typeof user_id !== "string") {
      return res.status(400).json({ message: "Le user doit être une chaîne de caractères" });
    }

    const diary = await trainingDiaryModel().insertNewDiary(parseInt(user_id as string));

    if (!diary) {
      return res.status(500).json({ message: "Erreur lors de la création du journal" });
    }

    return res.status(201).json(diary);
  },
};

export default diaryController;
