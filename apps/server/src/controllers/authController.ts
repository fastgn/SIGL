import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import userModel from "../models/userModel";
import { ControllerResponse } from "../types/controller";
import { ControllerError, ControllerSuccess } from "../utils/controller";

const authController = {
  login: async (payload: { email: string; password: string }): Promise<ControllerResponse> => {
    if (!payload.email || !payload.password) {
      return ControllerError.INVALID_PARAMS();
    }

    // Get the user from the database
    const user = await userModel().findByEmail(payload.email, true);

    // Si l'utilisateur n'existe pas ou que le mot de passe est incorrect
    if (!user || !user.password || !bcrypt.compareSync(payload.password, user.password)) {
      return ControllerError.UNAUTHORIZED({ message: "Email ou mot de passe incorrect" });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    return ControllerSuccess.SUCCESS({ data: { token } });
  },
};

export default authController;
