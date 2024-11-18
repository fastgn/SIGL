import { expect, test } from "vitest";
import password from "../../src/services/password.service";

test("Crypter un mot de passe", async () => {
  const hash = await password.crypt("password");
  expect(hash).not.toEqual("password");
});

test("Comparer un mot de passe avec un hash", async () => {
  const hash = await password.crypt("password");
  const result = await password.compare("password", hash);
  expect(result).toBeTruthy();
});
