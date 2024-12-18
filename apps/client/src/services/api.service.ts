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
      // Code executé pour chaque réponse (code 2xx)
      (response) => {
        return response;
      },
      // Code executé pour chaque erreur
      (error) => {
        // Si nous ne sommes pas autorisé
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
  }

  public setToken(token: string | null, persist: boolean = false) {
    if (!token) {
      this.clearToken();
      return;
    }
    if (persist) localStorage.setItem("authToken", token);
    else sessionStorage.setItem("authToken", token);

    this.api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  public getToken() {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) this.api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return !token ? null : token;
  }

  public clearToken() {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    delete this.api.defaults.headers.common["Authorization"];
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
