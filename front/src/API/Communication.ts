import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UserAPI } from "@/model/IUserAPI";
import { ILogin } from "@/model/Login";

export class Communication {
  private axiosUser: AxiosInstance;
  private axiosServer: AxiosInstance;
  constructor() {
    this.axiosUser = axios.create({
      baseURL: "https://randomuser.me/api/",
    });
    this.axiosServer = axios.create({
      baseURL: "http://localhost:8083/api/v1",
    });
  }

  async getUser(): Promise<UserAPI> {
    const response = await this.axiosUser.get<UserAPI>("/");
    return response.data;
  }
  async sendLogin(login: ILogin): Promise<AxiosResponse> {
    return this.axiosServer.post("/auth/login", login);
  }
}
