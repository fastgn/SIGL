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

  createBiannualEvaluationWithSkills: async (biannualData: any): Promise<ControllerResponse> => {
    try {
      const biannualEvaluation = await db.biannualEvaluation.create({
        data: {
          ...biannualData,
          skillEvaluations: {
            create: biannualData.skillEvaluations,
          },
        },
      });
      return ControllerSuccess.SUCCESS({ data: biannualEvaluation });
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      return ControllerError.INTERNAL();
    }
  },

  updateBiannualEvaluationWithSkills: async (biannualData: any): Promise<ControllerResponse> => {
    try {
      const biannualEvaluation = await db.biannualEvaluation.update({
        where: {
          id: biannualData.id,
        },
        data: {
          semester: biannualData.semester,
          skillEvaluations: {
            updateMany: biannualData.skillEvaluations.map((skillEval: any) => ({
              where: {
                id: skillEval.id,
              },
              data: {
                status: skillEval.status,
                comment: skillEval.comment,
                skillId: skillEval.skillId,
              },
            })),
          },
        },
      });
      return ControllerSuccess.SUCCESS({ data: biannualEvaluation });
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      return ControllerError.INTERNAL();
    }
  },

  getSkills: async (): Promise<ControllerResponse> => {
    try {
      const skills = await db.skill.findMany();
      return ControllerSuccess.SUCCESS({ data: skills });
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      return ControllerError.INTERNAL();
    }
  },
};
