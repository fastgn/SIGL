import { EnumUserRole, UserSchema } from "@sigl/types";
import bcrypt from "bcrypt";
import { ControllerError, ControllerSuccess } from "../utils/controller";
import z from "zod";
import { ControllerResponse } from "../types/controller";
import { db } from "../providers/db";
import logger from "../utils/logger";
import { removePassword } from "../utils/user";

const userController = {
  add: async (payload: z.infer<typeof UserSchema.create>): Promise<ControllerResponse> => {
    try {
      let form;
      // Validate the input data
      try {
        form = UserSchema.create.parse(payload);
      } catch {
        logger.error("Invalid params");
        return ControllerError.INVALID_PARAMS();
      }

      // Vérifier si l'email est déjà utilisée
      const emailAlreadyUsed = await db.user.findFirst({
        where: {
          email: form.email,
        },
      });
      if (emailAlreadyUsed) {
        logger.error("Adresse email déjà utilisée");
        return ControllerError.INVALID_PARAMS({
          message: "Adresse email déjà utilisée",
        });
      }

      const newPassword = Math.random().toString(36).slice(-8);
      console.log("New password: ", newPassword);
      const passwordHash = bcrypt.hashSync(newPassword, 10);

      // Objet role créé en fonction du rôle de l'utilisateur
      const defaultRoleObjects: Record<EnumUserRole, { [key: string]: { create: {} } }> = {
        [EnumUserRole.APPRENTICE]: {
          apprentice: { create: {} },
        },
        [EnumUserRole.APPRENTICE_COORDINATOR]: {
          apprenticeCoordinator: { create: {} },
        },
        [EnumUserRole.APPRENTICE_MENTOR]: {
          apprenticeMentor: { create: {} },
        },
        [EnumUserRole.CURICULUM_MANAGER]: {
          curriculumManager: { create: {} },
        },
        [EnumUserRole.EDUCATIONAL_TUTOR]: {
          educationalTutor: { create: {} },
        },
        [EnumUserRole.TEACHER]: {
          teacher: { create: {} },
        },
        [EnumUserRole.ADMIN]: {
          admin: { create: {} },
        },
      };

      // Forcer l'heure de naissance à 00:00:00
      form.birthDate.setHours(0, 0, 0, 0);

      const user = await db.user.create({
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          birthDate: form.birthDate,
          active: true,
          gender: "male",
          password: passwordHash,
          ...defaultRoleObjects[form.role],
        },
      });

      // Retirer le mot de passe de la réponse
      const userWithoutPassword = removePassword(user);
      return ControllerSuccess.SUCCESS({ data: userWithoutPassword });
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      return ControllerError.INTERNAL();
    }
  },
  get: async (id: number): Promise<ControllerResponse> => {
    try {
      if (!id || isNaN(id)) {
        logger.error("Invalid params");
        return ControllerError.INVALID_PARAMS();
      }
      const user = await db.user.findFirst({
        where: {
          id,
        },
        include: {
          apprentice: true,
          apprenticeCoordinator: true,
          apprenticeMentor: true,
          curriculumManager: true,
          educationalTutor: true,
          teacher: true,
        },
      });
      if (!user) {
        logger.error("User not found");
        return ControllerError.NOT_FOUND();
      }
      const userWithoutPassword = removePassword(user);
      return ControllerSuccess.SUCCESS({ data: userWithoutPassword });
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      return ControllerError.INTERNAL();
    }
  },
  getAll: async (): Promise<ControllerResponse> => {
    try {
      const users = await db.user.findMany({
        include: {
          apprentice: true,
          apprenticeCoordinator: true,
          apprenticeMentor: true,
          curriculumManager: true,
          educationalTutor: true,
          teacher: true,
        },
      });
      const usersWithoutPassword = users.map(removePassword);
      return ControllerSuccess.SUCCESS({ data: usersWithoutPassword });
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      return ControllerError.INTERNAL();
    }
  },
  delete: async (id: number): Promise<ControllerResponse> => {
    let user;
    try {
      user = await db.user.delete({
        where: {
          id,
        },
      });
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      return ControllerError.INTERNAL();
    }

    if (!user) {
      logger.error("User not found");
      return ControllerError.NOT_FOUND();
    }

    return ControllerSuccess.SUCCESS({ data: user });
  },

  updatePasswordAdmin: async (
    id: number,
    password: string,
    confirmPassword: string,
  ): Promise<ControllerResponse> => {
    try {
      if (password !== confirmPassword) {
        logger.error("Passwords do not match");
        return ControllerError.INVALID_PARAMS({
          message: "Passwords do not match",
        });
      }
      const passwordHash = bcrypt.hashSync(password, 10);
      await db.user.update({
        where: {
          id,
        },
        data: {
          password: passwordHash,
        },
      });
      return ControllerSuccess.SUCCESS();
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      return ControllerError.INTERNAL();
    }
  },
};

export default userController;
