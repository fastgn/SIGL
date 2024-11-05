import { z } from "zod";
import { EnumUserRole } from "../enums";
import validator from "validator";

/**
 * Schéma de validation pour la création d'un utilisateur
 */
const create = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().refine((value) => validator.isMobilePhone(value, "any", { strictMode: true })),
  role: z.nativeEnum(EnumUserRole),
  birthDate: z.coerce.date(),
});

const login = z.object({
  email: z.string().email(),
  password: z.string(),
});

const UserSchema = {
  create,
  login,
};

export { UserSchema };
