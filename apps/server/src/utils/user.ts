import { User } from "@prisma/client";

export const removePassword = (user: User) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
