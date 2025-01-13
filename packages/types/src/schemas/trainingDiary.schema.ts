import { z } from "zod";
import { BiannualEvaluationSchema } from "./biannualEvaluation.schema";
import { ApprenticeSchema } from "./apprentice.schema";

const getData = z.object({
    id: z.number(),
    biannualEvaluation: BiannualEvaluationSchema.getData.array(),
});


const TrainingDiarySchema = {
  getData,
};

export { TrainingDiarySchema };

