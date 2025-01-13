import { z } from "zod";
import { TrainingDiarySchema } from "./trainingDiary.schema";

/**
 * Schéma de validation pour la création d'une note
 */
const create = z.object({
  title: z.string(),
  content: z.string(),
});

const update = z.object({
  noteId: z.number(),
  title: z.string().optional(),
  content: z.string().optional(),
});

const getData = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  trainingDiaryId: z.number(),
  trainingDiary: TrainingDiarySchema.getData.optional(),
  creationDate: z.date(),
  updateDate: z.date(),
});


const NoteSchema = {
  create,
  update,
  getData,
};

export { NoteSchema };
