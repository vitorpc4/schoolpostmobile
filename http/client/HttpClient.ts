import TokenControl from "@/ModelViews/TokenControl";
import axios, { AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";

export default abstract class HttpClient {
  protected instance: AxiosInstance | undefined;

  protected async createInstance(): Promise<AxiosInstance> {
    this.instance = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const token = await this.getToken();

    if (token != null) {
      this.initializeResponseInterceptor(token);
    }

    return this.instance;
  }

  private initializeResponseInterceptor = (token: string) => {
    if (token) {
      this.instance?.interceptors.request.use((config: any) => {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
        return config;
      });
    }
  };

  private getToken = async (): Promise<string | undefined> => {
    const token = await SecureStore.getItemAsync("session");

    if (token == null) return undefined;

    return token;
  };
}
