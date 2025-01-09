import { db } from "../providers/db";
import { ControllerError, ControllerSuccess } from "../utils/controller";
import logger from "../utils/logger";

const compagnyAccountController = {
  createCompagnyAccount: async (compagny_id: number, user_id: number) => {
    if (!compagny_id || !user_id) {
      logger.error("compagny_id et user_id sont requis");
      return ControllerError.INVALID_PARAMS({ message: "compagny_id et user_id sont requis" });
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
    const checkCompagnyExist = await db.company.findFirst({
      select: { id: true },
      where: {
        id: compagny_id,
      },
    });
    if (checkCompagnyExist === null) {
      logger.error("La compagnie n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "La compagnie n'existe pas" });
    }
    const compagnyAccount = await db.companyAccount.create({
      data: {
        company: { connect: { id: compagny_id } },
        user: { connect: { id: user_id } },
      },
    });
    if (!compagnyAccount) {
      logger.error("Erreur lors de la création du compte compagnie");
      return ControllerError.INTERNAL({
        message: "Erreur lors de la création du compte compagnie",
      });
    }
    return ControllerSuccess.SUCCESS({
      message: "Compte compagny créé avec succès",
      data: compagnyAccount,
    });
  },
  deleteCompagnyAccount: async (user_id: number) => {
    if (!user_id) {
      logger.error("compagny_id et user_id sont requis");
      return ControllerError.INVALID_PARAMS({ message: "compagny_id et user_id sont requis" });
    }
    const checkCompagnyAccountExist = await db.companyAccount.findMany({
      where: {
        userId: user_id,
      },
    });
    if (checkCompagnyAccountExist === null) {
      logger.error("Le compte compagnie n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "Le compte compagnie n'existe pas" });
    }
    const compagnyAccount = await db.companyAccount.delete({
      where: {
        userId: user_id,
      },
    });
    if (!compagnyAccount) {
      logger.error("Erreur lors de la suppression du compte compagnie");
      return ControllerError.INTERNAL({
        message: "Erreur lors de la suppression du compte compagnie",
      });
    }
    return ControllerSuccess.SUCCESS({ message: "Compte compagny supprimé avec succès" });
  },
  getCompagnyAccount: async (compagny_id: number) => {
    if (!compagny_id) {
      logger.error("compagny_id est requis");
      return ControllerError.INVALID_PARAMS({ message: "compagny_id est requis" });
    }
    const compagnyAccount = await db.companyAccount.findMany({
      where: {
        companyId: compagny_id,
      },
    });
    return ControllerSuccess.SUCCESS({
      message: "Compte compagny récupéré avec succès",
      data: compagnyAccount,
    });
  },
  getAllCompagnyAccount: async () => {
    const compagnyAccount = await db.companyAccount.findMany();
    return ControllerSuccess.SUCCESS({
      message: "Tous les Compte compagny récupéré avec succès",
      data: compagnyAccount,
    });
  },
};
export default compagnyAccountController;
