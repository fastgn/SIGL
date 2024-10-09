import { PrismaClient } from "@prisma/client";

import logger from "../utils/logger";

interface User {
  id: string;
  profile_image: string;
  firstName: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  birth_date: string;
  gender: string;
  active: boolean;
  updated_date: string;
  created_date: string;
}

const userModel = () => ({
  findByKey: async (
    key: keyof User,
    value: string,
    withPassword: boolean = false,
  ): Promise<User | null> => {
    const db = new PrismaClient();
    try {
      const user: User = await db.user.findUnique({
        where: {
          [key]: value,
        },
      });

      if (user && !withPassword) {
        delete user.password;
      }

      return user;
    } catch (error) {
      logger.error(`Erreur lors de la recherche de l'utilisateur : ${(error as Error).message}`);
      return null;
    }
  },

  findById: async (id: string, withPassword: boolean = false) => {
    // Changez le type en string
    return await userModel().findByKey("id", id, withPassword);
  },

  findByEmail: async (email: string, withPassword: boolean = false) => {
    return await userModel().findByKey("email", email, withPassword);
  },
});

export default userModel;
