import { z } from "zod";
import { UserSchema } from "./user.schema";
import { TrainingDiarySchema } from "./trainingDiary.schema";

const getWithBiannualEvaluations = z.object({
  id: z.number(),
  user: UserSchema.getData,
  trainingDiary: TrainingDiarySchema.getData,
});

const getData = z.object({
  id: z.number(),
  user: UserSchema.getData,
  trainingDiary: TrainingDiarySchema.getData,
});

const ApprenticeSchema = {
  getWithBiannualEvaluations,
  getData,
};

export { ApprenticeSchema };

