import {z} from "zod";

/**
 * Schéma de validation pour les journaux de formation
 */
const getData = z.object({
  id: z.number(),
  description: z.string(),
  apprenticeId: z.number(),
});

const DiarySchema = {
  getData,
};

export { DiarySchema };
