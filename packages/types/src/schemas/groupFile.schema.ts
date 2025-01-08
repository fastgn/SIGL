import {z} from "zod";

/**
 * Schéma de validation pour la création d'un utilisateur
 */
const getData = z.object({
  id: z.number(),
  name: z.string(),
  comment: z.string(),
  blobName: z.string(),
  createdAt: z.string(),
  groupId: z.number(),
});

const GroupFileSchema = {
  getData,
};

export { GroupFileSchema };
