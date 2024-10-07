import { PrismaClient } from "../prisma";
export * from "../prisma";

export interface Context {
  prisma: PrismaClient;
}

export function createContext(): Promise<Context>;
