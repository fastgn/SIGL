import dotenv from "dotenv";
import z from "zod";

enum EnvironmentName {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

type RequiredEnv = {
  PORT: number;
  CLIENT_URL: string;
  DATABASE_URL: string;
  TOKEN_SECRET: string;
  NODE_ENV: EnvironmentName;
};

const DEFAULT_ENV: Partial<RequiredEnv> = {
  PORT: 3000,
  NODE_ENV: EnvironmentName.DEVELOPMENT,
};

/**
 * Service pour gérer les variables d'environnement
 */
export default class EnvService {
  private static variables: RequiredEnv & NodeJS.ProcessEnv;

  private static validationSchema = z.object({
    PORT: z
      .string()
      .transform((val) => parseInt(val, 10))
      .default(String(DEFAULT_ENV.PORT)),
    CLIENT_URL: z.string(),
    DATABASE_URL: z.string(),
    TOKEN_SECRET: z.string(),
    NODE_ENV: z.nativeEnum(EnvironmentName),
  });

  public static async init(): Promise<void> {
    console.log("Chargement des variables d'environnement...");
    dotenv.config();

    // Valider les variables d'environnement
    const validation = this.validationSchema.safeParse({
      ...DEFAULT_ENV,
      ...process.env,
    });

    // Afficher les erreurs de validation
    if (!validation.success) {
      for (const error of validation.error.issues) {
        console.error(`Invalid environment variable "${error.path}": ${error.message}`);
      }
      process.exit(1);
    }

    this.variables = validation.data as RequiredEnv & NodeJS.ProcessEnv;
  }

  public static get get(): RequiredEnv & NodeJS.ProcessEnv {
    return this.variables;
  }
}
