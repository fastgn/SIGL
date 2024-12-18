import { PrismaClient, TrainingDiary, User } from "@prisma/client";
import logger from "../utils/logger";

const db = new PrismaClient();

const trainingDiaryModel = () => ({
  insertNewDiary: async (user_id: User["id"]): Promise<TrainingDiary | null> => {
    try {
      const trainingDiary = await db.trainingDiary.create({
        data: {
          description: "Journal de formation",
          apprenticeId: user_id,
        },
      });
      return trainingDiary;
    } catch (error) {
      logger.error(
        `Erreur lors de la création du journal de formation : ${(error as Error).message}`,
      );
      return null;
    }
  },
});

export default trainingDiaryModel;
