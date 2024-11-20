import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { UserSchema } from "@sigl/types";
import z from "zod";
import { db } from "../providers/db";
import { ControllerResponse } from "../types/controller";
import { ControllerError, ControllerSuccess } from "../utils/controller";
import logger from "../utils/logger";
import { removePassword } from "../utils/user";
import userService, { UserWithRoles } from "../services/user.service";

const authController = {
  login: async (payload: z.infer<typeof UserSchema.login>): Promise<ControllerResponse> => {
    let form;

    try {
      form = UserSchema.login.parse(payload);
    } catch (_err) {
      logger.error("Invalid params: ", _err);
      return ControllerError.INVALID_PARAMS();
    }

    const user: UserWithRoles | null = await db.user.findUnique({
      include: {
        apprentice: true,
        apprenticeCoordinator: true,
        apprenticeMentor: true,
        curriculumManager: true,
        educationalTutor: true,
        teacher: true,
        admin: true,
      },
      where: {
        email: form.email,
      },
    });

    if (!user || !user.password || !bcrypt.compareSync(form.password, user.password)) {
      logger.error("Email ou mot de passe incorrect");
      return ControllerError.UNAUTHORIZED({ message: "Email ou mot de passe incorrect" });
    }
    const userRoles = userService.getRoles(user);
    const usersWithoutPassword = removePassword(user);
    // Add roles to the user object and remove roles keys
    const finalUser: any = usersWithoutPassword;
    finalUser.roles = userRoles;
    delete finalUser.admin;
    delete finalUser.apprentice;
    delete finalUser.apprenticeCoordinator;
    delete finalUser.apprenticeMentor;
    delete finalUser.curriculumManager;
    delete finalUser.educationalTutor;
    delete finalUser.teacher;

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.TOKEN_SECRET as string, {
      expiresIn: "1h",
    });

    return ControllerSuccess.SUCCESS({ data: { token, user: finalUser } });
  },
};

export default authController;
