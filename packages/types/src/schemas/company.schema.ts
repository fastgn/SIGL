import { z } from "zod";
import { ApprenticeSchema } from "./apprentice.schema";

const getData = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  description: z.string(),
  apprenticeNumber: z.number().optional(),
  opco: z.string(),
  apprentices: z.array(ApprenticeSchema.getData).optional(),
});

const CompanySchema = {
  getData,
};

export { CompanySchema };

