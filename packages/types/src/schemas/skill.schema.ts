import { z } from "zod";
import { EnumSemester } from "../enums";

const getData = z.object({
    code: z.string(),
    name: z.string(),
    description: z.string(),
    inProgressSemester: z.nativeEnum(EnumSemester).optional(),
    obtainedSemester: z.nativeEnum(EnumSemester),
});

const SkillSchema = {
    getData,
};

export { SkillSchema };