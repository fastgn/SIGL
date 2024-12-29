import { z } from "zod";
import { EnumSkillStatus } from "../enums";
import { SkillSchema } from "./skill.schema";

const getData = z.object({
  skill: SkillSchema.getData,
  status: z.nativeEnum(EnumSkillStatus),
  comment: z.string(),
});

const SkillEvaluationSchema = {
  getData,
};

export { SkillEvaluationSchema };
