import { z } from "zod";
import { EventFileSchema } from "./eventFile.schema";
import { GroupSchema } from "./group.schema";
import { DeliverableSchema } from "./deliverable.schema";

/**
 * Schéma de validation pour la création d'un event
 */
const getData = z.object({
  id: z.number(),
  type: z.string(),
  description: z.string(),
  endDate: z.coerce.date(),
  groups: z.array(GroupSchema.getData),
  files: z.array(EventFileSchema.getData),
  delivrables: z.array(DeliverableSchema.getData).optional(),
});

const EventSchema = {
  getData,
};

export { EventSchema };