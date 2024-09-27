import z from "zod";

/**
 * Variables d'environnement requises obligatoirement
 */
export type RequiredAppEnv = {
  API_URL: string;
};

/**
 * Variables d'environnement optionnelles
 */
export type OptionalAppEnv = {
  ENV_MODE: EnvironmentName;
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
  ENV_MODE: EnvironmentName.DEVELOPMENT,
};

/**
 * Service de gestion et de validation des variables d'environnement
 */
class EnvService {
  private variables!: AppEnv & { [key: string]: string | number };

  private validationSchema = z.object({
    API_URL: z.string(),
  });

  constructor() {
    this.init();
  }

  /**
   * Charger les variables d'environnement
   * @param options Options de chargement
   * @param options.skipViteEnv Ne pas charger les variables d'environnement Vite
   * @param options.env Variables d'environnement à ajouter ou remplacer
   * @throws Error si une variable d'environnement est manquante ou invalide
   */
  public init(options?: {
    skipViteEnv?: true;
    env?: { [key: string]: string | number | boolean };
  }): void {
    const viteEnv = options?.skipViteEnv ? {} : import.meta.env;

    const validation = this.validationSchema.safeParse(
      this.formatViteEnv({
        ...DEFAULT_ENV,
        ...viteEnv,
        ...options?.env,
      }),
    );

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

  /**
   * Transformer les variables d'environnement Vite en un objet
   * @param viteEnv Variables d'environnement Vite
   * @returns Variables d'environnement formatées (sans le préfixe "VITE_")
   */
  private formatViteEnv(viteEnv: { [key: string]: string | number | boolean }): {
    [key: string]: string | number | boolean;
  } {
    const parsedEnv: { [key: string]: string | number | boolean } = {};
    for (const key in viteEnv) {
      if (key.startsWith("VITE_")) parsedEnv[key.slice(5)] = viteEnv[key];
      else parsedEnv[key] = viteEnv[key];
    }
    return parsedEnv;
  }

  /**
   * Accesseur pour les variables d'environnement
   */
  public get get(): AppEnv {
    return this.variables;
  }
}

/**
 * Instance unique du service
 */
const serviceInstance = new EnvService();
export default serviceInstance;
