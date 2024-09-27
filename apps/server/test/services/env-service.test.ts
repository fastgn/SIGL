import { expect, test } from "vitest";
import EnvService from "../../src/services/env-service";

test("init Env Service with valid values", () => {
  process.env.CLIENT_URL = "http://localhost:3000";
  process.env.DATABASE_URL = "postgres://localhost:12345/mydb";
  process.env.TOKEN_SECRET = "mysecret";
  expect(() => EnvService.init({ skipEnvFile: true })).not.toThrow();
});

test("init Env Service with missing values", () => {
  delete process.env.CLIENT_URL;
  process.env.DATABASE_URL = "postgres://localhost:12345/mydb";
  process.env.TOKEN_SECRET = "mysecret";
  expect(() => EnvService.init({ skipEnvFile: true })).toThrowError();
});
