import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ILogin } from "@/model/Login";
import { Student } from "@/model/IStudent";

export class Communication {
  private token?: string;
  private axiosServer: AxiosInstance;
  constructor() {
    this.axiosServer = axios.create({
      baseURL: "http://localhost:8083/api/v1",
    });
    this.setToken(localStorage.getItem("token") ?? "");
  }

  async getStudentsUuid(): Promise<{ uuid: string }[]> {
    const response = await this.axiosServer.get<{ uuid: string }[]>(
      "/students"
    );
    return response.data;
  }
  async getStudent(uuid: string): Promise<Student> {
    const response = await this.axiosServer.get<Student>("/students/" + uuid);
    return response.data;
  }
  async sendLogin(login: ILogin): Promise<AxiosResponse> {
    const response = await this.axiosServer.post("/auth/login", login);
    this.setToken(response.data.token);
    return response;
  }

  public setToken(token: string) {
    this.token = token;
    localStorage.setItem("token", token);
    this.axiosServer.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  public clearToken() {
    localStorage.removeItem("token");
    this.axiosServer.defaults.headers.common.Authorization = ``;
  }

  public async isConnected(): Promise<boolean> {
    return !!this.token;
  }
}
