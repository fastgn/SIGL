import { z } from "zod";
import { EnumSkillStatus } from "../enums";
import { SkillSchema } from "./skill.schema";

const getData = z.object({
  id: z.number(),
  skill: SkillSchema.getData,
  status: z.nativeEnum(EnumSkillStatus),
  comment: z.string(),
});

const sendData = z.object({
  skillId: z.number(),
  status: z.nativeEnum(EnumSkillStatus),
  comment: z.string(),
});

const SkillEvaluationSchema = {
  getData,
  sendData,
};

export { SkillEvaluationSchema };

