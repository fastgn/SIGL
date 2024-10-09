import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import userModel from "../models/userModel";

const authController = {
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Veuillez renseigner tous les champs" });
    }

    // Get the user from the database
    const user = await userModel().findByEmail(email, true);

    // Si l'utilisateur n'existe pas ou que le mot de passe est incorrect
    if (!user || !user.password || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token });
  },
};

export default authController;
