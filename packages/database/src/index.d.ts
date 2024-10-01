import { PrismaClient } from "@prisma/client";
export * from "../prisma";

export interface Context {
  prisma: PrismaClient;
}

export function createContext(): Promise<Context>;
