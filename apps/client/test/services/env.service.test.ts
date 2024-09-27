import { expect, test } from "vitest";
import EnvService, { RequiredAppEnv } from "../../src/services/env.service";

test("init Env Service with valid required values", () => {
  const env: RequiredAppEnv = {
    API_URL: "http://localhost:3000",
  };
  expect(() =>
    EnvService.init({
      skipViteEnv: true,
      env,
    }),
  ).not.toThrow();
});

test("init Env Service with missing required values", () => {
  const env: Partial<RequiredAppEnv> = {};
  expect(() => EnvService.init({ skipViteEnv: true, env })).toThrowError();
});
