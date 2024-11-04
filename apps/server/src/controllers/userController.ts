import { Request, Response } from "express";
import { UserSchema } from "../../../../packages/types/dist";
import { PrismaClient } from "@prisma/client";

const authController = {
  add: async (req: Request, res: Response) => {
    try {
      const body = req.body;

      let form;
      // Validate the request body
      try {
        form = UserSchema.create.parse(body);
      } catch (error) {
        return res.status(400).json({ message: "Données invalides" });
      }

      const db = new PrismaClient();

      // Vérifier si l'email est déjà utilisée
      const emailAlreadyUsed = await db.user.findFirst({
        where: {
          email: form.email,
        },
      });
      if (emailAlreadyUsed) {
        return res.status(400).json({ message: "Adresse email déjà utilisée" });
      }

      const user = await db.user.create({
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          birthDate: form.birthDate,
          active: true,
          gender: "male",
          password: "password",
        },
      });

      // Retirer le mot de passe de la réponse
      const { password, ...userWithoutPassword } = user;

      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur" });
    }
  },
};

export default authController;
