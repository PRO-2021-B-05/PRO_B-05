import axios, { AxiosInstance } from "axios";
import { UserAPI } from "@/model/IUserAPI";

export class Communication {
  private axiosUser: AxiosInstance;
  constructor() {
    this.axiosUser = axios.create({
      baseURL: "https://randomuser.me/api/",
    });
  }

  async getUser(): Promise<UserAPI> {
    const response = await this.axiosUser.get<UserAPI>("/");
    return response.data;
  }
}
