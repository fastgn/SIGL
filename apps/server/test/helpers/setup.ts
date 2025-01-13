import resetDb from "./db-reset";
import { beforeEach } from "vitest";

beforeEach(async () => {
  // Vider la base de données avant chaque tests
  await resetDb();
});
