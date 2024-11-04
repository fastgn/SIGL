import { Response } from "express";
import { ControllerResponse } from "../types/controller";

export const reply = (res: Response, controllerResult: ControllerResponse) => {
  const { status, ...rest } = controllerResult;
  return res.status(status).json(rest);
};
