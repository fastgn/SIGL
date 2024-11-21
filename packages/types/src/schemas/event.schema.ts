import { z } from "zod";
import { FileSchema } from "./file.schema";

/**
 * Schéma de validation pour la création d'un event
 */
const getData = z.object({
  id: z.number(),
  type: z.string(),
  description: z.string(),
  endDate: z.coerce.date(),
  promotion: z.string().optional().nullable(),
  files: z.array(FileSchema.getData),
});

const EventSchema = {
  getData,
};

export { EventSchema };