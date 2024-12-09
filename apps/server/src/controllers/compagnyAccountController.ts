import { ControllerError, ControllerSuccess } from "../utils/controller";
import { db } from "../providers/db";
import logger from "../utils/logger";


const compagnyAccountController = {
  createCompagnyAccount: async (compagny_id: number, user_id: number) => {
    if (!compagny_id || !user_id) {
        logger.error("compagny_id et user_id sont requis");
        return ControllerError.INVALID_PARAMS({ message: "compagny_id et user_id sont requis" });
        };
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
    const checkCompagnyExist = await db.compagny.findFirst({
        select: { id: true },
        where: {
            id: compagny_id,
        },
    });
    if (checkCompagnyExist === null) {
        logger.error("La compagnie n'existe pas");
        return ControllerError.INVALID_PARAMS({ message: "La compagnie n'existe pas" });
    }
    const compagnyAccount = await db.compagnyAccount.create({
        data: {
            compagnyId: compagny_id,
            userId: user_id,
        },
    });
    if (!compagnyAccount) {
        logger.error("Erreur lors de la création du compte compagnie");
        return ControllerError.INTERNAL({ message: "Erreur lors de la création du compte compagnie" });
    }
    return ControllerSuccess.SUCCESS({ message: "Compte compagny créé avec succès", data: compagnyAccount });
    },
    deleteCompagnyAccount: async (compagny_id: number, user_id: number) => {
        if (!compagny_id || !user_id) {
            logger.error("compagny_id et user_id sont requis");
            return ControllerError.INVALID_PARAMS({ message: "compagny_id et user_id sont requis" });
        }
        const checkCompagnyAccountExist = await db.compagnyAccount.findFirst({
            where: {
                compagnyId: compagny_id,
                userId: user_id,
            },
        });
        if (checkCompagnyAccountExist === null) {
            logger.error("Le compte compagnie n'existe pas");
            return ControllerError.INVALID_PARAMS({ message: "Le compte compagnie n'existe pas" });
        }
        const compagnyAccount = await db.compagnyAccount.delete({
            where: {
                compagnyId: compagny_id,
                userId: user_id,
                },
            },
        );
        if (!compagnyAccount) {
            logger.error("Erreur lors de la suppression du compte compagnie");
            return ControllerError.INTERNAL({ message: "Erreur lors de la suppression du compte compagnie" });
        }
        return ControllerSuccess.SUCCESS({ message: "Compte compagny supprimé avec succès" });
    },
};
export default compagnyAccountController;

