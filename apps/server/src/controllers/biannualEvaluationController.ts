import { db } from "../providers/db";
import { ControllerResponse } from "../types/controller";
import { ControllerError, ControllerSuccess } from "../utils/controller";
import logger from "../utils/logger";

export const biannualEvaluationController = {
  getBiannualEvaluations: async (id: number): Promise<ControllerResponse> => {
    try {
      const biannualEvaluations = await db.biannualEvaluation.findMany({
        include: {
          skillEvaluations: {
            include: {
              skill: true,
            },
          },
        },
        where: {
          trainingDiaryId: id,
        },
      });
      return ControllerSuccess.SUCCESS({ data: biannualEvaluations });
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      return ControllerError.INTERNAL();
    }
  },
};
