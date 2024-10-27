import { PrismaClient, User } from "@prisma/client";

import logger from "../utils/logger";

const userModel = () => ({
  findByKey: async (
    key: keyof User,
    value: unknown,
    withPassword: boolean = false,
  ): Promise<User | null> => {
    const db = new PrismaClient();

    try {
      const user: User | null = await db.user.findUnique({
        where: {
          [key]: value,
        },
        omit: withPassword
          ? undefined
          : {
              password: true,
            },
        // eslint-disable-next-line
      } as any);

      return user;
    } catch (error) {
      logger.error(`Erreur lors de la recherche de l'utilisateur : ${(error as Error).message}`);
      return null;
    }
  },

  findById: async (id: string, withPassword: boolean = false) => {
    return await userModel().findByKey("id", id, withPassword);
  },

  findByEmail: async (email: string, withPassword: boolean = false) => {
    return await userModel().findByKey("email", email, withPassword);
  },
});

export default userModel;
