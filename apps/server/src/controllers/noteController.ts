import { NoteSchema } from "@sigl/types";
import { ControllerError, ControllerSuccess } from "../utils/controller";
import z from "zod";
import { ControllerResponse } from "../types/controller";
import { db } from "../providers/db";
import logger from "../utils/logger";
import { UserWithRoles } from "../services/user.service";

const noteController = {
  add: async (
    user: UserWithRoles,
    payload: z.infer<typeof NoteSchema.create>,
  ): Promise<ControllerResponse> => {
    try {
      const { success, data: form } = NoteSchema.create.safeParse(payload);
      if (!success) return ControllerError.INVALID_PARAMS();

      console.log("noteController -> form", form);

      // Seuls les apprentis peuvent créer des notes
      // TODO : Retirer admin
      if (!user.apprentice)
        return ControllerError.UNAUTHORIZED({
          message: "Seuls les apprentis peuvent créer des notes",
        });

      // Trouver le journal de formation de l'apprenti
      const trainingDiary = await db.trainingDiary.findFirst({
        where: {
          apprenticeId: user.apprentice.id,
        },
      });
      if (!trainingDiary)
        return ControllerError.NOT_FOUND({
          message: "Un journal de formation doit être créé avant de pouvoir ajouter des notes",
        });

      const note = await db.note.create({
        data: {
          title: form.title,
          content: form.content,
          trainingDiaryId: trainingDiary.id,
        },
      });

      return ControllerSuccess.SUCCESS({ data: note });
    } catch (error: any) {
      console.error(error);
      logger.error(`Erreur serveur : ${error.message}`);
      return ControllerError.INTERNAL();
    }
  },
  getAllFromUser: async (userId: number, user: UserWithRoles): Promise<ControllerResponse> => {
    try {
      // Vérifier les droits de l'utilisateur
      // TODO : Autoriser l'équipe tutorale de l'apprenti
      if (userId !== user.id) {
        return ControllerError.UNAUTHORIZED();
      }

      if (!user.apprentice) {
        return ControllerError.UNAUTHORIZED({
          message: "Seuls les apprentis peuvent voir leurs notes",
        });
      }

      const notes = await db.note.findMany({
        where: {
          trainingDiary: {
            apprenticeId: user.apprentice.id,
          },
        },
      });

      return ControllerSuccess.SUCCESS({ data: notes });
    } catch (error: any) {
      console.error(error);
      return ControllerError.INTERNAL();
    }
  },
  update: async (
    user: UserWithRoles,
    payload: z.infer<typeof NoteSchema.update>,
  ): Promise<ControllerResponse> => {
    try {
      const { success, data: form } = NoteSchema.update.safeParse(payload);
      if (!success) return ControllerError.INVALID_PARAMS();

      // Au moins un champ doit être renseigné (title ou contenu)
      if (!form.title && !form.content) return ControllerError.INVALID_PARAMS();

      // Vérifier les droits de l'utilisateur
      // TODO : Autoriser l'équipe tutorale de l'apprenti
      if (!user.apprentice) {
        return ControllerError.UNAUTHORIZED({
          message: "Seuls les apprentis peuvent modifier leurs notes",
        });
      }

      // Récupérer le propriétaire de la note
      const trainingDiary = await db.trainingDiary.findFirst({
        where: {
          apprenticeId: user.apprentice.id,
        },
      });
      if (!trainingDiary) {
        return ControllerError.NOT_FOUND({
          message: "Un journal de formation doit être créé avant de pouvoir ajouter des notes",
        });
      }
      if (trainingDiary.apprenticeId !== user.apprentice.id) {
        return ControllerError.UNAUTHORIZED();
      }

      const data = {
        ...(form.title && { title: form.title }),
        ...(form.content && { content: form.content }),
      };
      console.log("noteController -> data", data);
      const note = await db.note.update({
        where: {
          id: form.noteId,
        },
        data,
      });

      return ControllerSuccess.SUCCESS({ data: note });
    } catch (error: any) {
      console.error(error);
      return ControllerError.INTERNAL();
    }
  },
};

export default noteController;
