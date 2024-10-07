import { PrismaClient } from "../prisma";
import { Context } from "./index.d";

const prisma = new PrismaClient();

export const createContext = async (): Promise<Context> => ({ prisma });
