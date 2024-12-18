import {z} from "zod";

/**
 * Schéma de validation pour la création d'un utilisateur
 */
const getData = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
  createdAt: z.string(),
  eventId: z.number(),
});

const FileSchema = {
  getData,
};

export { FileSchema };
