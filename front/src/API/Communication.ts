import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ILogin } from "@/model/Login";
import { Student } from "@/model/IStudent";

export class Communication {
  private axiosServer: AxiosInstance;
  constructor() {
    this.axiosServer = axios.create({
      baseURL: "http://localhost:8083/api/v1",
    });
  }

  async getStudentsUuid(): Promise<{ uuid: string }[]> {
    const response = await this.axiosServer.get<{ uuid: string }[]>(
      "/students"
    );
    return response.data;
  }
  async getStudent(uuid: string): Promise<Student> {
    const response = await this.axiosServer.get<Student>(
      "/students/" + uuid
    );
    return response.data;
  }
  async sendLogin(login: ILogin): Promise<AxiosResponse> {
    return this.axiosServer.post("/auth/login", login);
  }
}
