import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { UserSchema } from "@sigl/types";
import z from "zod";
import { User } from "@prisma/client";
import { db } from "../providers/db";
import { ControllerResponse } from "../types/controller";
import { ControllerError, ControllerSuccess } from "../utils/controller";

const authController = {
  login: async (payload: z.infer<typeof UserSchema.login>): Promise<ControllerResponse> => {
    let form;

    try {
      form = UserSchema.login.parse(payload);
    } catch (_err) {
      return ControllerError.INVALID_PARAMS();
    }

    const user: User | null = await db.user.findUnique({
      select: {
        id: true,
        email: true,
        password: true,
      },
      where: {
        email: form.email,
      },
    } as any);

    if (!user || !user.password || !bcrypt.compareSync(form.password, user.password)) {
      return ControllerError.UNAUTHORIZED({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.TOKEN_SECRET as string, {
      expiresIn: "1h",
    });

    return ControllerSuccess.SUCCESS({ data: { token } });
  },
};

export default authController;
