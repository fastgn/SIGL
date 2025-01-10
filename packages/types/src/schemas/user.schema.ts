import validator from "validator";
import {z} from "zod";
import {EnumUserRole} from "../enums";

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

const getData = z.object({
  id: z.number(),
  lastName: z.string(),
  firstName: z.string(),
  email: z.string().email(),
});

/**
 * Schéma de validation pour la modification role apprenti
 */
const roleDescription = z.object({
  apprentice: z.object({
    id: z.number().optional(),
    poste: z.string().optional().nullable(),
    company: z.string().optional().nullable(),
    companyId: z.number().optional(),
    educationalTutor: z.string().optional(),
    apprenticeMentor: z.string().optional(),
  }),
  apprenticeMentorId: z.number().optional(),
  educationalTutorId: z.number().optional(),
});

const apprentice = z.object({
  id: z.number(),
  userId: z.number().optional(),
  companyId: z.number().optional(),
  company: z.object({
    id: z.number(),
    name: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    apprenticeNumber: z.number().optional().nullable(),
    opco: z.string().optional().nullable(),
  }).optional().nullable(),
  promotion: z.string().optional().nullable(),
  poste: z.string().optional().nullable(),
  educationalTutorId: z.number(),
  apprenticeMentorId: z.number(),
  educationalTutor: z.object({
    id: z.number(),
    userId: z.number(),
    user: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
  }).optional().nullable(),
  apprenticeMentor: z.object({
    id: z.number(),
    userId: z.number(),
    companyId: z.number(),
    poste: z.string(),
    user: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
  }).optional().nullable(),
});

const apprenticeMentor = z.object({
  id: z.number(),
  userId: z.number(),
  companyId: z.number().nullable(),
  poste: z.string().nullable(),
  user: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
});

const educationalTutor = z.object({
  id: z.number(),
  userId: z.number(),
  companyId: z.number().nullable(),
  poste: z.string().nullable(),
  user: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
});

const company = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  description: z.string().optional(),
  apprenticeNumber: z.number().optional(),
  opco: z.string().optional(),
});

const UserSchema = {
  create,
  login,
  getData,
  roleDescription,
  apprentice,
  apprenticeMentor,
  educationalTutor,
  company,
};

export { UserSchema };
