import { db } from "../providers/db";
import { ControllerResponse } from "../types/controller";
import { ControllerError, ControllerSuccess } from "../utils/controller";
import logger from "../utils/logger";

const tutorController = {
  getApprentices: async (userId: number): Promise<ControllerResponse> => {
    try {
      if (!userId || isNaN(userId)) {
        logger.error("Invalid params");
        return ControllerError.INVALID_PARAMS();
      }

      const educationalTutor = await db.educationalTutor.findFirst({
        where: {
          userId,
        },
        include: {
          apprentices: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  id: true,
                },
              },
              trainingDiary: {
                include: {
                  biannualEvaluation: {
                    include: {
                      skillEvaluations: {
                        include: {
                          skill: {
                            select: {
                              name: true,
                              code: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!educationalTutor) {
        logger.error("Educational tutor not found");
        return ControllerError.NOT_FOUND();
      }

      return ControllerSuccess.SUCCESS({ data: educationalTutor.apprentices });
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      return ControllerError.INTERNAL();
    }
  },
};

export default tutorController;
