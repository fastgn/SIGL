import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { httpStatusCodes } from "./http-status-codes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorInformation(code: string | number) {
  if (typeof code === "number") {
    code = code.toString();
  }
  return httpStatusCodes[code];
}

export function incrementNumber(
  duration: number,
  start: number,
  end: number,
  displayNumberSetter: (number: number) => void,
) {
  let range = end - start;
  let current = start;
  let increment = end > start ? 1 : -1;
  let stepTime = Math.abs(Math.floor(duration / range));
  let timer = setInterval(() => {
    current += increment;
    displayNumberSetter(current);
    if (current === end) {
      clearInterval(timer);
    }
  }, stepTime);
}
