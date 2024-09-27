import dotenv from "dotenv";
import z from "zod";

enum EnvironmentName {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

type RequiredAppEnv = {
  PORT: number;
  CLIENT_URL: string;
  DATABASE_URL: string;
  TOKEN_SECRET: string;
  NODE_ENV: EnvironmentName;
};

const DEFAULT_ENV: Partial<RequiredAppEnv> = {
  PORT: 3000,
  NODE_ENV: EnvironmentName.DEVELOPMENT,
};

/**
 * Service pour gérer les variables d'environnement
 */
export default class EnvService {
  private static variables: RequiredAppEnv & { [key: string]: string | number };

  private static validationSchema = z.object({
    PORT: z
      .union([z.string(), z.number()])
      .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val)),
    CLIENT_URL: z.string(),
    DATABASE_URL: z.string(),
    TOKEN_SECRET: z.string(),
    NODE_ENV: z.nativeEnum(EnvironmentName),
  });

  /**
   * Charger les variables d'environnement
   * @param options Options de chargement
   * @param options.skipEnvFile Ne pas charger les variables d'environnement à partir du fichier .env
   * @throws Error si une variable d'environnement est manquante ou invalide
   */
  public static init(options?: { skipEnvFile?: boolean }): void {
    console.log("Chargement des variables d'environnement...");
    if (!options?.skipEnvFile) dotenv.config();

    // Valider les variables d'environnement
    const validation = this.validationSchema.safeParse({
      ...DEFAULT_ENV,
      ...process.env,
    });

    // Afficher les erreurs de validation
    if (!validation.success) {
      let message = "Invalid environment variables:";
      for (const error of validation.error.issues) {
        message += `\n- "${error.path}": ${error.message}`;
      }
      throw new Error(message);
    }

    this.variables = validation.data as RequiredAppEnv;
  }

  public static get get() {
    return this.variables;
  }
}
