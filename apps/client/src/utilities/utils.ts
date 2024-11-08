import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { httpStatusCodes } from "./httpStatusCodes";

export function getErrorInformation(code: string | number) {
  if (typeof code === "number") {
    code = code.toString();
  }
  return httpStatusCodes[code];
}
