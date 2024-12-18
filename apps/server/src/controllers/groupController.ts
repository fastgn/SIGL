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
