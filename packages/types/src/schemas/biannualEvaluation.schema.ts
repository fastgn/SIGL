import { z } from "zod";
import { EnumSemester } from "../enums";
import { SkillEvaluationSchema } from "./skillEvaluation.schema";

const getData = z.object({
    id: z.number(),
    semester: z.nativeEnum(EnumSemester),
    createdAt: z.coerce.date(),
    skillEvaluations: z.array(SkillEvaluationSchema.getData),
});

const BiannualEvaluationSchema = {
    getData,
};

export { BiannualEvaluationSchema };