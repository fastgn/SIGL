import z from "zod";

type RequiredAppEnv = {
  API_URL: string;
};

/**
 * Service de gestion et de validation des variables d'environnement
 */
class EnvService {
  private variables!: RequiredAppEnv & { [key: string]: string | number };

  private validationSchema = z.object({
    API_URL: z.string(),
  });

  constructor() {
    const viteEnv = import.meta.env;

    const validation = this.validationSchema.safeParse({
      ...this.formatViteEnv(viteEnv),
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
  public get get() {
    return this.variables;
  }
}

/**
 * Instance unique du service
 */
const serviceInstance = new EnvService();
export default serviceInstance;
