import axios, { AxiosInstance } from "axios";
import env from "./env.service";

/**
 * Service d'intéraction avec l'API
 */
class ApiService {
  private api: AxiosInstance = axios.create({
    baseURL: env.get.API_URL,
    withCredentials: true,
  });

  constructor() {
    // Ajout d'un intercepteur pour chaque réponse
    this.api.interceptors.response.use(
      (response) => {
        // Code executé pour chaque réponse (code 2xx)
        return response;
      },
      (error) => {
        // Code executé pour chaque erreur
        console.error(error);
        return Promise.reject(error);
      },
    );
  }

  public post = this.api.post;

  public get = this.api.get;

  public put = this.api.put;

  public delete = this.api.delete;
}

/**
 * Instance unique du service
 */
const serviceInstance = new ApiService();
export default serviceInstance;
