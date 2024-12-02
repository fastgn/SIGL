import { z } from "zod";
import { EventSchema } from "./event.schema";
import { UserSchema } from "./user.schema";

/**
 * Schéma de validation pour la création d'un group
 */
const getData = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  color: z.string(),
  users: z.array(UserSchema.getData).optional().nullable(),
  events: z.array(EventSchema.getData).optional().nullable(),
});

const GroupSchema = {
  getData,
};

export { GroupSchema };
