import { EnumUserRole, UserSchema } from "../../../../packages/types/dist";
import bcrypt from "bcrypt";
import { ControllerError, ControllerSuccess } from "../utils/controller";
import z from "zod";
import { ControllerResponse } from "../types/controller";
import { db } from "../providers/db";

const userController = {
  add: async (payload: z.infer<typeof UserSchema.create>): Promise<ControllerResponse> => {
    try {
      let form;
      // Validate the input data
      try {
        form = UserSchema.create.parse(payload);
      } catch (_err) {
        return ControllerError.INVALID_PARAMS();
      }

      // Vérifier si l'email est déjà utilisée
      const emailAlreadyUsed = await db.user.findFirst({
        where: {
          email: form.email,
        },
      });
      if (emailAlreadyUsed) {
        return ControllerError.INVALID_PARAMS({
          message: "Adresse email déjà utilisée",
        });
      }

      const newPassword = Math.random().toString(36).slice(-8);
      console.log("New password: ", newPassword);
      const passwordHash = bcrypt.hashSync(newPassword, 10);

      // Objet role créé en fonction du rôle de l'utilisateur
      const defaultRoleObjects: Record<EnumUserRole, { [key: string]: {} }> = {
        [EnumUserRole.APPRENTICE]: {
          apprentice: {},
        },
        [EnumUserRole.APPRENTICE_COORDINATOR]: {
          apprenticeCoordinator: {},
        },
        [EnumUserRole.APPRENTICE_MENTOR]: {
          apprenticeMentor: {},
        },
        [EnumUserRole.CURICULUM_MANAGER]: {
          curriculumManager: {},
        },
        [EnumUserRole.EDUCATIONAL_TUTOR]: {
          educationalTutor: {},
        },
        [EnumUserRole.TEACHER]: {
          teacher: {},
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
      const { password, ...userWithoutPassword } = user;
      return ControllerSuccess.SUCCESS({ data: userWithoutPassword });
    } catch (error: any) {
      console.error(error);
      return ControllerError.INTERNAL({ message: error });
    }
  },
};

export default userController;
