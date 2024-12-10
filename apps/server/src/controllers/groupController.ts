import { db } from "../providers/db";
import { ControllerError, ControllerSuccess } from "../utils/controller";
import logger from "../utils/logger";

export const groupController = {
  getGroups: async () => {
    const groups = await db.group.findMany({
      include: {
        users: true,
      },
    });

    if (!groups) {
      logger.error("Erreur lors de la récupération des groupes");
      return ControllerError.INTERNAL({ message: "Erreur lors de la récupération des groupes" });
    }
    return ControllerSuccess.SUCCESS({
      message: "Groupes récupérés avec succès",
      data: groups,
    });
  },

  createGroup: async (name: string, description: string, color: string) => {
    const group = await db.group.create({
      data: {
        name: name,
        description: description,
        color: color,
      },
    });

    if (!group) {
      logger.error("Erreur lors de la création du groupe");
      return ControllerError.INTERNAL({ message: "Erreur lors de la création du groupe" });
    }

    return ControllerSuccess.SUCCESS({ message: "Groupe créé avec succès", data: group });
  },

  deleteGroup: async (id: number) => {
    const group = await db.group.deleteMany({
      where: {
        id: id,
      },
    });

    if (!group) {
      logger.error("Erreur lors de la suppression du groupe");
      return ControllerError.INTERNAL({ message: "Erreur lors de la suppression du groupe" });
    }

    return ControllerSuccess.SUCCESS({ message: "Groupe supprimé avec succès", data: group });
  },
};
