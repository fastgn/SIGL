import dotenv from "dotenv";
import z from "zod";
import logger from "../utils/logger";

/**
 * Variables d'environnement requises obligatoirement
 */
export type RequiredAppEnv = {
  CLIENT_URL: string;
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
class EnvService {
  private variables: (AppEnv & { [key: string]: string | number }) | undefined;

  private validationSchema = z.object({
    PORT: z
      .union([z.string(), z.number()])
      .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val)),
    CLIENT_URL: z.string(),
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
  public init(options?: {
    skipEnvFile?: boolean;
    skipProcessEnv?: boolean;
    env?: { [key: string]: string | number | boolean };
  }): void {
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

  public get get(): AppEnv {
    if (!this.variables) {
      throw new Error("Environment variables have not been initialized.");
    }
    return this.variables;
  }
}

const env = new EnvService();
try {
  env.init();
} catch (error) {
  logger.error("Error loading environment variables, env file may be missing or invalid");
  process.exit(1);
}

export default env;
