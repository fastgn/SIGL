import { z } from "zod";
import { TrainingDiarySchema } from "./trainingDiary.schema";
import { UserSchema } from "./user.schema";

const getWithBiannualEvaluations = z.object({
  id: z.number(),
  user: UserSchema.getData,
  trainingDiary: TrainingDiarySchema.getData,
});

const ApprenticeSchema = {
  getWithBiannualEvaluations,
};

export { ApprenticeSchema };

