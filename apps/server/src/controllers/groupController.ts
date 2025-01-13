import { deleteFileFromBlob } from "../middleware/fileMiddleware";
import { db } from "../providers/db";
import { ControllerError, ControllerSuccess } from "../utils/controller";
import logger from "../utils/logger";

export const groupController = {
  getGroups: async () => {
    const groups = await db.group.findMany({
      include: {
        users: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
            birthDate: true,
            gender: true,
            email: true,
            password: false,
            phone: true,
            active: true,
            creationDate: true,
            updateDate: true,
          },
        },
        files: true,
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

  linkUsersToGroup: async (userIds: number[], groupId: number) => {
    const groupExists = await db.group.findUnique({
      where: { id: groupId },
    });

    if (!groupExists) {
      logger.error(`Group with id ${groupId} not found`);
      return ControllerError.NOT_FOUND({ message: "Group not found" });
    }

    const existingUsers = await db.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });

    const existingUserIds = existingUsers.map((user) => user.id);
    const missingUserIds = userIds.filter((id) => !existingUserIds.includes(id));

    if (missingUserIds.length > 0) {
      logger.error(`Users with ids ${missingUserIds} not found`);
      return ControllerError.NOT_FOUND({
        message: `Users with ids ${missingUserIds.join(", ")} not found`,
      });
    }

    const group = await db.group.update({
      where: { id: groupId },
      data: {
        users: {
          connect: existingUserIds.map((id) => ({ id })),
        },
      },
      include: {
        users: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
            birthDate: true,
            gender: true,
            email: true,
            password: false,
            phone: true,
            active: true,
            creationDate: true,
            updateDate: true,
          },
        },
      },
    });

    return ControllerSuccess.SUCCESS({
      message: "Users linked to group successfully",
      data: group,
    });
  },

  unlinkUsersFromGroup: async (userIds: number[], groupId: number) => {
    const groupExists = await db.group.findUnique({
      where: { id: groupId },
    });

    if (!groupExists) {
      logger.error(`Group with id ${groupId} not found`);
      return ControllerError.NOT_FOUND({ message: "Group not found" });
    }

    const existingUsers = await db.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });

    const existingUserIds = existingUsers.map((user) => user.id);
    const missingUserIds = userIds.filter((id) => !existingUserIds.includes(id));

    if (missingUserIds.length > 0) {
      logger.error(`Users with ids ${missingUserIds} not found`);
      return ControllerError.NOT_FOUND({
        message: `Users with ids ${missingUserIds.join(", ")} not found`,
      });
    }

    const group = await db.group.update({
      where: { id: groupId },
      data: {
        users: {
          disconnect: existingUserIds.map((id) => ({ id })),
        },
      },
      include: {
        users: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
            birthDate: true,
            gender: true,
            email: true,
            password: false,
            phone: true,
            active: true,
            creationDate: true,
            updateDate: true,
          },
        },
      },
    });

    return ControllerSuccess.SUCCESS({
      message: "Users unlinked from group successfully",
      data: group,
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
    const groupFiles = await db.groupFile.findMany({
      where: {
        groupId: id,
      },
    });

    if (groupFiles) {
      groupFiles.forEach((groupFile) => {
        deleteFileFromBlob(groupFile.blobName);
      });
    }

    await db.groupFile.deleteMany({
      where: {
        groupId: id,
      },
    });

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

  getFilesFromGroup: async (groupId: number) => {
    const group = await db.group.findFirst({
      where: {
        id: groupId,
      },
      include: {
        files: true,
      },
    });

    if (!group) {
      logger.error("Le groupe n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "Le groupe n'existe pas" });
    }

    return ControllerSuccess.SUCCESS({
      message: "Fichiers récupérés avec succès",
      data: group.files,
    });
  },

  addFileToGroup: async (name: string, comment: string, blobName: string, groupId: number) => {
    const group = await db.group.findFirst({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      logger.error("Le groupe n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "Le groupe n'existe pas" });
    }

    const groupFile = await db.groupFile.create({
      data: {
        name: name,
        comment: comment,
        blobName: blobName,
        group: {
          connect: {
            id: groupId,
          },
        },
      },
    });

    if (!groupFile) {
      logger.error("Erreur lors de l'ajout du fichier au groupe");
      return ControllerError.INTERNAL({
        message: "Erreur lors de l'ajout du fichier au groupe",
      });
    }

    return ControllerSuccess.SUCCESS({
      message: "Fichier ajouté au groupe avec succès",
      data: groupFile,
    });
  },

  deleteFileFromGroup: async (groupId: number, fileId: number) => {
    const group = await db.groupFile.findFirst({
      where: {
        id: fileId,
        groupId: groupId,
      },
    });

    if (!group) {
      logger.error("Le groupe n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "Le groupe n'existe pas" });
    }

    const groupFile = await db.groupFile.delete({
      where: {
        id: fileId,
      },
    });

    if (!groupFile) {
      logger.error("Erreur lors de la suppression du fichier du groupe");
      return ControllerError.INTERNAL({
        message: "Erreur lors de la suppression du fichier du groupe",
      });
    }

    deleteFileFromBlob(groupFile.blobName);

    return ControllerSuccess.SUCCESS({
      message: "Fichier supprimé du groupe avec succès",
      data: groupFile,
    });
  },
};
