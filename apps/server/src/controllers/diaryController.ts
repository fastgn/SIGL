import { ControllerError, ControllerSuccess } from "../utils/controller";
import { db } from "../providers/db";
import logger from "../utils/logger";

const diaryController = {
  createDiary: async (user_id: number) => {
    //const { user_id } = req.body;
    if (!user_id) {
      logger.error("user_id est requis");
      return ControllerError.INVALID_PARAMS({ message: "user_id est requis" });
    }

    if (typeof user_id !== "number") {
      logger.error("user_id doit être un nombre");
      return ControllerError.INVALID_PARAMS({ message: "user_id doit être un nombre" });
    }
    const checkUserExist = await db.user.findFirst({
      select: { id: true },
      where: {
        id: user_id,
      },
    });

    if (checkUserExist === null) {
      logger.error("L'utilisateur n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'utilisateur n'existe pas" });
    }

    const diary = await db.trainingDiary.create({
      data: {
        description: "Journal de formation",
        apprenticeId: user_id,
      },
    });

    if (!diary) {
      logger.error("Erreur lors de la création du journal");
      return ControllerError.INTERNAL({ message: "Erreur lors de la création du journal" });
    }

    return ControllerSuccess.SUCCESS({ message: "Journal créé avec succès", data: diary });
  },

  deleteDiary: async (user_id: number) => {
    if (!user_id) {
      logger.error("user_id est requis");
      return ControllerError.INVALID_PARAMS({ message: "user_id est requis" });
    }

    if (typeof user_id !== "number") {
      logger.error("user_id doit être un nombre");
      return ControllerError.INVALID_PARAMS({ message: "user_id doit être un nombre" });
    }

    const checkUserExist = await db.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (checkUserExist === null) {
      logger.error("L'utilisateur n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'utilisateur n'existe pas" });
    }

    const deleteDiary = await db.trainingDiary.delete({
      select: { id: true },
      where: {
        apprenticeId: user_id,
      },
    });

    if (!deleteDiary) {
      logger.error("Erreur lors de la suppression du journal");
      return ControllerError.INTERNAL({ message: "Erreur lors de la création du journal" });
    }

    return ControllerSuccess.SUCCESS({
      message: "Journal supprimer avec succès",
      data: deleteDiary,
    });
  },

  getDiary: async (user_id: number) => {
    //const { user_id } = req.body;

    if (!user_id) {
      logger.error("user_id est requis");
      return ControllerError.INVALID_PARAMS({ message: "user_id est requis" });
    }

    if (typeof user_id !== "number") {
      logger.error("user_id doit être un nombre");
      return ControllerError.INVALID_PARAMS({ message: "user_id doit être un nombre" });
    }

    const checkUserExist = await db.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (checkUserExist === null) {
      logger.error("L'utilisateur n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'utilisateur n'existe pas" });
    }

    const diary = await db.trainingDiary.findFirst({
      where: {
        apprenticeId: user_id,
      },
    });

    if (!diary) {
      logger.error("Le journal n'existe pas");
      return ControllerError.INTERNAL({ message: "Le journal n'existe pas" });
    }

    return ControllerSuccess.SUCCESS({ message: "Journal trouvé avec succès", data: diary });
  },
};

export default diaryController;
