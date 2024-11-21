import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ControllerError } from "../utils/controller";
import { db } from "../providers/db";
import { UserWithRoles } from "../services/user.service";
import { reply } from "../utils/http";
import env from "../services/env.service";
import { EnumUserRole } from "@sigl/types";
import logger from "../utils/logger";

export interface CustomRequestUser extends Request {
  user?: JwtPayload;
}

const authMiddleware = (authorisedRoles: EnumUserRole[] = []) => {
  return (req: CustomRequestUser, res: Response, next: NextFunction): Response | void => {
    if (!req.headers["authorization"]) {
      logger.error("No authorization header");
      return reply(res, ControllerError.UNAUTHORIZED());
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      logger.error("No token provided");
      return reply(res, ControllerError.UNAUTHORIZED());
    }

    jwt.verify(token, env.get.TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        logger.error("Invalid token");
        return reply(res, ControllerError.UNAUTHORIZED());
      }

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

        if (!user) {
          logger.error("User not found");
          return reply(
            res,
            ControllerError.UNAUTHORIZED({
              message: "You are not authorised to perform this action",
            }),
          );
        }

        const roles: EnumUserRole[] = [];
        if (user.apprentice) roles.push(EnumUserRole.APPRENTICE);
        if (user.apprenticeCoordinator) roles.push(EnumUserRole.APPRENTICE_COORDINATOR);
        if (user.apprenticeMentor) roles.push(EnumUserRole.APPRENTICE_MENTOR);
        if (user.curriculumManager) roles.push(EnumUserRole.CURICULUM_MANAGER);
        if (user.educationalTutor) roles.push(EnumUserRole.EDUCATIONAL_TUTOR);
        if (user.teacher) roles.push(EnumUserRole.TEACHER);
        if (user.admin) roles.push(EnumUserRole.ADMIN);

        if (authorisedRoles.length > 0 && !authorisedRoles.some((role) => roles.includes(role))) {
          logger.error("User not authorised");
          return reply(
            res,
            ControllerError.UNAUTHORIZED({
              message: "You are not authorised to perform this action",
            }),
          );
        }
        req.context.user = user as UserWithRoles;
        next();
      } catch {
        return reply(res, ControllerError.INTERNAL());
      }
    });
  };
};

export default authMiddleware;
