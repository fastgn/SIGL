import { httpStatusCodes } from "./http-status-codes";

export function getErrorInformation(code: string | number) {
  if (typeof code === "number") {
    code = code.toString();
  }
  return httpStatusCodes[code];
}
