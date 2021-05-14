import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ILogin } from "@/model/Login";
import { Student } from "@/model/IStudent";
import { SimpleProject } from "@/model/SimpleProject";
import { IProject } from "@/model/IProject";
import { Image } from "@/model/IImage";

export class Communication {
  private token?: string;
  private axiosServer: AxiosInstance;

  constructor() {
    this.axiosServer = axios.create({
      baseURL: "http://localhost:8083/api/v1"
    });
    this.setToken(localStorage.getItem("token") ?? "");
  }

  async getProjects(): Promise<SimpleProject[]> {
    const response = await this.axiosServer.get<SimpleProject[]>("/projects");
    return response.data;
  }

  async getProject(projectUuid: string): Promise<IProject> {
    const response = await this.axiosServer.get<IProject>(
      "/projects/" + projectUuid
    );
    return response.data;
  }

  async getProjectImages(projectUuid: string): Promise<Image[]> {
    const response = await this.axiosServer.get<Image[]>(
      "/projects/" + projectUuid + "/images"
    );
    return response.data;
  }

  async getStudentProjects(studentUuid: string): Promise<SimpleProject[]> {
    const response = await this.axiosServer.get<SimpleProject[]>(
      "/projects/users/" + studentUuid
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
      description: response.data.description
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
      description: student.description
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
      description: "" //student.description,
    };
    await this.axiosServer.put("/students/" + student.uuid, newStudent);
  }

  async sendCreateProject(
    studentUuid: string,
    project: { title: string; description: string }
  ): Promise<string> {
    const response = await this.axiosServer.post<string>(
      "/projects/users/" + studentUuid,
      project
    );
    return response.data;
  }

  async sendModifyProject(
    uuid: string,
    project: { title: string; description: string }
  ): Promise<void> {
    await this.axiosServer.put("/projects/" + uuid, project);
  }

  async sendImage(
    projectUuid: string,
    fileObject: { file: File; title: string }
  ): Promise<void> {
    const formData = new FormData();
    formData.append("file", fileObject.file);
    formData.append("title", fileObject.title);
    formData.append("description", "");
    await this.axiosServer.post(
      "/projects/" + projectUuid + "/images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
  }

  async deleteImage(projectUuid: string, imageUuid: string): Promise<void> {
    await this.axiosServer.delete(
      "/projects/" + projectUuid + "/images/" + imageUuid
    );
  }

  async sendLogin(login: ILogin): Promise<AxiosResponse> {
    const response = await this.axiosServer.post("/auth/login", login);
    this.setToken(response.data.token);
    return response;
  }

  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem("token", token);
    this.axiosServer.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  public clearToken(): void {
    localStorage.removeItem("token");
    this.axiosServer.defaults.headers.common.Authorization = ``;
  }

  public async isConnected(): Promise<boolean> {
    return !!this.token;
  }
}
