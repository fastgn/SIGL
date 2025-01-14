import { z } from "zod";
import { UserSchema } from "./user.schema";
import { GroupFileSchema } from "./groupFile.schema";

/**
 * Schéma de validation pour la création d'un group
 */
const getData = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  color: z.string(),
  users: z.array(UserSchema.getData).optional().nullable(),
  files: z.array(GroupFileSchema.getData).optional(),
});

const GroupSchema = {
  getData,
};

export { GroupSchema };

