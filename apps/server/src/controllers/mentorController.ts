import { db } from "../providers/db";
import { ControllerResponse } from "../types/controller";
import { ControllerError, ControllerSuccess } from "../utils/controller";
import logger from "../utils/logger";

const mentorController = {
  getApprentices: async (userId: number): Promise<ControllerResponse> => {
    try {
      if (!userId || isNaN(userId)) {
        logger.error("Invalid params");
        return ControllerError.INVALID_PARAMS();
      }

      const apprenticeMentor = await db.apprenticeMentor.findFirst({
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

      if (!apprenticeMentor) {
        logger.error("Apprentice mentor not found");
        return ControllerError.NOT_FOUND();
      }

      return ControllerSuccess.SUCCESS({ data: apprenticeMentor.apprentices });
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      return ControllerError.INTERNAL();
    }
  },
};

export default mentorController;
