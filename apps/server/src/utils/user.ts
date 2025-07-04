import { User } from "@prisma/client";
import { UserWithRoles } from "../services/user.service";

export const removePassword = (user: User | UserWithRoles) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
