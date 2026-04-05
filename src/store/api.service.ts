import axios, { AxiosInstance } from "axios";
import KeycloakService from "@/services/keycloak";

// Define types for the ApiService instance
interface ApiServiceType {
  api1: AxiosInstance | null; // Main API
  api2: AxiosInstance | null; // Upload API
  init(): void;
  setHeader(): void;
  query<T>(resource: string, params?: object): Promise<T>;
  get<T>(resource: string, params?: { session?: string }): Promise<T>;
  post<T>(resource: string, params: object): Promise<T>;
  upload<T>(resource: string, params: File): Promise<T>;
  update<T>(resource: string, slug: string, params: object): Promise<T>;
  put<T>(resource: string, params: object): Promise<T>;
  patch<T>(resource: string, params: object): Promise<T>;
  delete<T>(resource: string): Promise<T>;
}

const ApiService: ApiServiceType = {
  api1: null,
  api2: null,

  init() {
    this.api1 = axios.create({
      baseURL: process.env.VUE_APP_API_URL,
    });

    this.api2 = axios.create({
      baseURL: process.env.VUE_APP_API_UPLOAD,
    });

    this.api1.interceptors.request.use(async (config) => {
      const token = await KeycloakService.getValidToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api2.interceptors.request.use(async (config) => {
      const token = await KeycloakService.getValidToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  },

  setHeader() {
    if (this.api1) {
      const token = KeycloakService.getToken();
      if (token) {
        this.api1.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    }
  },

  // Query method for main API
  async query<T>(resource: string, params?: object): Promise<T> {
    if (!this.api1) {
      return Promise.reject(new Error("ApiService is not initialized"));
    }

    return this.api1.get<T>(resource, { params })
      .then(response => response.data)
      .catch((error: any) => {
        throw new Error(`ApiService ${error}`);
      });
  },

  async get<T>(resource: string, params?: { session?: string }): Promise<T> {
    if (!this.api1) {
      return Promise.reject(new Error("ApiService is not initialized"));
    }

    return this.api1.get<T>(resource, { params })
      .then(response => response.data);
  },

  // POST request for main API
  async post<T>(resource: string, params: object): Promise<T> {
    if (!this.api1) {
      return Promise.reject(new Error("ApiService is not initialized"));
    }
      const response = await this.api1.post<T>(resource, params, {
        headers: {
          "Content-Type": "application/json", // Use JSON content type for main API
        },
      });
      return response.data;
  },

  // Upload method for upload API (accepts File as parameter)
  async upload<T>(resource: string, params: object): Promise<T> {
    if (!this.api2) {
      return Promise.reject(new Error("ApiService is not initialized"));
    }

    const response = await this.api2.post<T>(resource, params, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure upload content type is correct
      },
    });

    return response.data;
  },

  // PUT request for main API
  update<T>(resource: string, slug: string, params: object): Promise<T> {
    if (!this.api1) {
      return Promise.reject(new Error("ApiService is not initialized"));
    }

    return this.api1.put<T>(`${resource}/${slug}`, params)
      .then(response => response.data)
      .catch((error: any) => {
        throw new Error(`ApiService ${error}`);
      });
  },

  // PUT request for main API with general content
  async put<T>(resource: string, params: object): Promise<T> {
    if (!this.api1) {
      return Promise.reject(new Error("ApiService is not initialized"));
    }
    
    const response = await this.api1.put<T>(resource, params, {
      headers: {
        "Content-Type": "application/json", // Use JSON content type
      },
    });

    return response.data;
  },

  // PATCH request for main API
  patch<T>(resource: string, params: object): Promise<T> {
    if (!this.api1) {
      return Promise.reject(new Error("ApiService is not initialized"));
    }

    return this.api1.patch<T>(resource, params)
      .then(response => response.data)
      .catch((error: any) => {
        throw new Error(`ApiService ${error}`);
      });
  },

  // DELETE request for main API
  delete<T>(resource: string): Promise<T> {
    if (!this.api1) {
      return Promise.reject(new Error("ApiService is not initialized"));
    }

    return this.api1.delete<T>(resource)
      .then(response => response.data)
      .catch((error: any) => {
        throw new Error(`ApiService ${error}`);
      });
  }
};

export default ApiService;
