import axios, { AxiosInstance } from "axios";

/**
 * Service d'intéraction avec l'API
 */
class ApiService {
  private api: AxiosInstance = axios.create();

  constructor() {}

  public init(url: string) {
    this.api.defaults.baseURL = url;
    this.api.defaults.withCredentials = true;

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

  public patch = this.api.patch;

  public delete = this.api.delete;
}

/**
 * Instance unique du service
 */
const serviceInstance = new ApiService();
export default serviceInstance;
