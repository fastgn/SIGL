import { createContext, PrismaClient } from "@fastgn/database";

let dbClient: PrismaClient;

/**
 * Obtenir le client de base de données
 */
const getClient = () => {
  return dbClient;
};

/**
 * Initialiser le service de base de données
 */
const initDB = async () => {
  const { prisma: db } = await createContext();
  dbClient = db as PrismaClient;
  return dbClient;
};

export { initDB, getClient };
