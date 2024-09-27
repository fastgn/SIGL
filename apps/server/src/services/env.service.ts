import dotenv from "dotenv";
import z from "zod";

/**
 * Variables d'environnement requises obligatoirement
 */
export type RequiredAppEnv = {
  CLIENT_URL: string;
  DATABASE_URL: string;
  TOKEN_SECRET: string;
};

/**
 * Variables d'environnement optionnelles
 */
export type OptionalAppEnv = {
  PORT: number;
  NODE_ENV: EnvironmentName;
};

/**
 * Variables d'environnement de l'application
 */
export type AppEnv = RequiredAppEnv & OptionalAppEnv;

/**
 * Enumération des types d'environnement
 */
enum EnvironmentName {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

/**
 * Variables d'environnement par défaut
 */
const DEFAULT_ENV: OptionalAppEnv = {
  PORT: 3000,
  NODE_ENV: EnvironmentName.DEVELOPMENT,
};

/**
 * Service pour gérer les variables d'environnement
 */
export default class EnvService {
  private static variables: AppEnv & { [key: string]: string | number };

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
   * @param options.skipProcessEnv Ne pas charger les variables d'environnement du process
   * @param options.env Variables d'environnement à ajouter ou remplacer
   * @throws Error si une variable d'environnement est manquante ou invalide
   */
  public static init(options?: {
    skipEnvFile?: boolean;
    skipProcessEnv?: boolean;
    env?: { [key: string]: string | number | boolean };
  }): void {
    console.log("Chargement des variables d'environnement...");
    if (!options?.skipEnvFile) dotenv.config();
    const processEnv = options?.skipProcessEnv ? {} : process.env;

    // Valider les variables d'environnement
    const validation = this.validationSchema.safeParse({
      ...DEFAULT_ENV,
      ...processEnv,
      ...options?.env,
    });

    // Afficher les erreurs de validation
    if (!validation.success) {
      let message = "Invalid environment variables:";
      for (const error of validation.error.issues) {
        message += `\n- "${error.path}": ${error.message}`;
      }
      throw new Error(message);
    }

    this.variables = validation.data as AppEnv;
  }

  public static get get(): AppEnv {
    return this.variables;
  }
}
