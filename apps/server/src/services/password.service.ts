import bcrypt from "bcrypt";
import logger from "../utils/logger";

class PasswordService {
  /**
   * Crypter un mot de passe
   * @param password Mot de passe
   * @returns Hash du mot de passe
   */
  public async crypt(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Comparer un mot de passe avec un hash
   * @param password Mot de passe
   * @param hash Hash
   * @returns Vrai si le mot de passe correspond au hash
   */
  public async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

const env = new PasswordService();
export default env;
