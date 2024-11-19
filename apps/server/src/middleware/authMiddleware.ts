import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ControllerError } from "../utils/controller";
import { db } from "../providers/db";
import { UserWithRoles } from "../services/user.service";
import { reply } from "../utils/http";
import env from "../services/env.service";

interface CustomRequest extends Request {
  user?: JwtPayload;
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return reply(res, ControllerError.UNAUTHORIZED());

  jwt.verify(token, env.get.TOKEN_SECRET, async (err, decoded) => {
    if (err) return reply(res, ControllerError.INTERNAL());

    try {
      const payload = decoded as JwtPayload;
      const user = await db.user.findUnique({
        select: {
          admin: true,
          apprentice: true,
          apprenticeCoordinator: true,
          apprenticeMentor: true,
          curriculumManager: true,
          educationalTutor: true,
          teacher: true,
        },
        where: {
          id: payload.id,
        },
      });

      if (!user) return reply(res, ControllerError.UNAUTHORIZED());
      req.context.user = user as UserWithRoles;
      next();
    } catch {
      return reply(res, ControllerError.INTERNAL());
    }
  });
};

export default authMiddleware;
