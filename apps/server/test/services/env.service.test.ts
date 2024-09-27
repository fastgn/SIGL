import { expect, test } from "vitest";
import EnvService, { RequiredAppEnv } from "../../src/services/env.service";

test("init Env Service with valid required values", () => {
  const env: RequiredAppEnv = {
    CLIENT_URL: "http://localhost:3000",
    DATABASE_URL: "postgres://localhost:12345/db",
    TOKEN_SECRET: "secret",
  };
  expect(() => EnvService.init({ skipEnvFile: true, skipProcessEnv: true, env })).not.toThrow();
});

test("init Env Service with missing required values", () => {
  const env: Partial<RequiredAppEnv> = {
    DATABASE_URL: "postgres://localhost:12345/db",
    TOKEN_SECRET: "secret",
  };
  expect(() => EnvService.init({ skipEnvFile: true, skipProcessEnv: true, env })).toThrowError();
});
