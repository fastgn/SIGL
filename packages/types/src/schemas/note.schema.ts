import { z } from "zod";

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

const NoteSchema = {
  create,
  update,
};

export { NoteSchema };
