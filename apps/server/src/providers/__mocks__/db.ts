import { PrismaClient } from "@prisma/client";
import { mockDeep } from "vitest-mock-extended";

export const db = mockDeep<PrismaClient>();
