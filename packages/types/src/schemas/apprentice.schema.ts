import { z } from "zod";
import { TrainingDiarySchema } from "./trainingDiary.schema";
import { UserSchema } from "./user.schema";

const getData = z.object({
  id: z.number(),
  user: UserSchema.getData,
});

const getWithBiannualEvaluations = z.object({
  id: z.number(),
  user: UserSchema.getData,
  trainingDiary: TrainingDiarySchema.getData,
});

const ApprenticeSchema = {
  getData,
  getWithBiannualEvaluations,
};

export { ApprenticeSchema };

