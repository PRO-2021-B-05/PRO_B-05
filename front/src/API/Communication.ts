import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { ILogin } from "@/model/Login";
import { Student } from "@/model/IStudent";

export class Communication {
  private axiosServer: AxiosInstance;
  constructor() {
    this.axiosServer = axios.create({
      baseURL: "http://localhost:8083/api/v1",
    });
  }

  async getProjects(): Promise<SimpleProject[]> {
    const response = await this.axiosServer.get<SimpleProject[]>(
      "/projects"
    );
    return response.data;
  }
  async getStudentsUuid(): Promise<{ uuid: string }[]> {
    const response = await this.axiosServer.get<{ uuid: string }[]>(
      "/students"
    );
    return response.data;
  }
  async getStudent(uuid: string): Promise<Student> {
    const response = await this.axiosServer.get<Student>("/students/" + uuid);
    return {
      uuid: uuid,
      username: response.data.username,
      password: "",
      firstname: response.data.firstname,
      lastname: response.data.lastname,
      description: response.data.description,
    };
  }
  async deleteStudent(uuid: string): Promise<void> {
    await this.axiosServer.delete("/students/" + uuid);
  }
  async sendCreateStudent(student: Student): Promise<void> {
    const newStudent = {
      username:
        student.firstname.toLowerCase().slice(0, 7) +
        "-" +
        student.lastname.toLowerCase().slice(0, 8),
      password: student.password,
      firstname: student.firstname,
      lastname: student.lastname,
      createAt: "12-12-2020",
      updateAt: "12-12-2020",
      description: student.description,
    };
    await this.axiosServer.post("/auth/register2", newStudent);
  }
  async sendModifyStudent(student: Student): Promise<void> {
    const newStudent = {
      username: student.username,
      password: student.password,
      firstname: student.firstname,
      lastname: student.lastname,
      createAt: "12-12-2020",
      updateAt: "12-12-2020",
      description: "", //student.description,
    };
    await this.axiosServer.put("/students/" + student.uuid, newStudent);
  }
  async sendLogin(login: ILogin): Promise<AxiosResponse> {
    return this.axiosServer.post("/auth/login", login);
  }
}
