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
    const user = await db.user.findFirst({
      include: {
        apprentice: true,
      },
      where: {
        id: user_id,
      },
    });

    if (user === null) {
      logger.error("L'utilisateur n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'utilisateur n'existe pas" });
    }

    if (user.apprentice === null) {
      logger.error("L'apprenti n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'apprenti n'existe pas" });
    }

    const diary = await db.trainingDiary.create({
      data: {
        description: "Journal de formation",
        apprentice: {
          connect: {
            id: user.apprentice?.id,
          },
        },
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

    const user = await db.user.findFirst({
      include: {
        apprentice: true,
      },
      where: {
        id: user_id,
      },
    });

    if (user === null) {
      logger.error("L'utilisateur n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'utilisateur n'existe pas" });
    }

    const deleteDiary = await db.trainingDiary.delete({
      select: { id: true },
      where: {
        apprenticeId: user.apprentice?.id,
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

    const user = await db.user.findFirst({
      include: {
        apprentice: {
          include: {
            trainingDiary: true,
          },
        },
      },
      where: {
        id: user_id,
      },
    });

    if (user === null) {
      logger.error("L'utilisateur n'existe pas");
      return ControllerError.USER_NOT_FOUND({ message: "L'utilisateur n'existe pas" });
    }

    const apprentice = user.apprentice;
    if (!apprentice) {
      logger.error("L'apprenti n'existe pas");
      return ControllerError.APPRENTICE_NOT_FOUND({ message: "L'apprenti n'existe pas" });
    }

    const diary = apprentice.trainingDiary;

    if (!diary) {
      logger.error("Le journal n'existe pas");
      return ControllerError.DIARY_NOT_FOUND({ message: "Le journal n'existe pas" });
    }

    return ControllerSuccess.SUCCESS({ message: "Journal trouvé avec succès", data: diary });
  },
};

export default diaryController;
