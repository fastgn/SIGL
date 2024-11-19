import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ControllerError } from "../utils/controller";
import { db } from "../providers/db";
import { EnumUserRole } from "@sigl/types";

interface CustomRequest extends Request {
  user?: JwtPayload;
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    ControllerError.UNAUTHORIZED({ message: "No token provided" });
  }

  jwt.verify(token as string, process.env.TOKEN_SECRET as string, (err, decoded) => {
    if (err) {
      ControllerError.UNAUTHORIZED({ message: "Invalid token" });
    }

    const payload = decoded as JwtPayload;
    req.user = {
      id: payload.id,
      email: payload.email,
    };

    const _ = db.user
      .findUnique({
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
      })
      .then((user) => {
        if (!user) {
          ControllerError.UNAUTHORIZED({ message: "User not found" });
        }

        if (req.user) {
          req.user.role = [];
          if (user?.apprentice) {
            req.user.role.push(EnumUserRole.APPRENTICE);
          }

          if (user?.apprenticeCoordinator) {
            req.user.role.push(EnumUserRole.APPRENTICE_COORDINATOR);
          }

          if (user?.apprenticeMentor) {
            req.user.role.push(EnumUserRole.APPRENTICE_MENTOR);
          }

          if (user?.curriculumManager) {
            req.user.role.push(EnumUserRole.CURICULUM_MANAGER);
          }

          if (user?.educationalTutor) {
            req.user.role.push(EnumUserRole.EDUCATIONAL_TUTOR);
          }

          if (user?.teacher) {
            req.user.role.push(EnumUserRole.TEACHER);
          }

          if (user?.admin) {
            req.user.role.push(EnumUserRole.ADMIN);
          }
        }

        next();
      })
      .catch((error) => {
        ControllerError.INTERNAL({ message: error.message });
      });
  });
};

export default authMiddleware;
