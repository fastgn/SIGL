import trainingDiaryModel from "../models/trainingDiary";
import { ControllerError, ControllerSuccess } from "../utils/controller";
import { db } from "../providers/db";

const diaryController = {
  createDiary: async (user_id: number) => {
    //const { user_id } = req.body;

    if (!user_id) {
      return ControllerError.INVALID_PARAMS({ message: "user_id est requis" });
    }

    if (typeof user_id !== "number") {
      return ControllerError.INVALID_PARAMS({ message: "user_id doit être un nombre" });
    }
    const checkUserExist = await db.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (checkUserExist === null) {
      return ControllerError.INVALID_PARAMS({ message: "L'utilisateur n'existe pas" });
    }

    const diary = await db.trainingDiary.create({
      data: {
        description: "Journal de formation",
        event: [],
        deliverable: [],
        apprenticeId: user_id,
      },
    });

    if (!diary) {
      return ControllerError.INTERNAL({ message: "Erreur lors de la création du journal" });
    }

    return ControllerSuccess.SUCCESS({ message: "Journal créé avec succès", data: diary });
  },
  deleteDiary: async (user_id: number) => {
    //const { user_id } = req.body;

    if (!user_id) {
      return ControllerError.INVALID_PARAMS({ message: "user_id est requis" });
    }

    if (typeof user_id !== "number") {
      return ControllerError.INVALID_PARAMS({ message: "user_id doit être un nombre" });
    }

    const checkUserExist = await db.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (checkUserExist === null) {
      return ControllerError.INVALID_PARAMS({ message: "L'utilisateur n'existe pas" });
    }

    const deleteDiary = await db.trainingDiary.delete({
      where: {
        apprenticeId: user_id,
      },
    });

    if (!deleteDiary) {
      return ControllerError.INTERNAL({ message: "Erreur lors de la création du journal" });
    }

    return ControllerSuccess.SUCCESS({
      message: "Journal supprimer avec succès",
      data: deleteDiary,
    });
  },
};

export default diaryController;
