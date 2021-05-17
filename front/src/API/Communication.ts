import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ILogin } from "@/model/Login";
import { Student } from "@/model/IStudent";
import { IProject } from "@/model/IProject";
import { Image } from "@/model/IImage";

export class Communication {
  private token?: string;
  private axiosServer: AxiosInstance;

  constructor() {
    this.axiosServer = axios.create({
      baseURL: "http://localhost:8083/api/v1",
    });
    this.setToken(localStorage.getItem("token") ?? "");
  }

  async getProjects(offset: number, limit: number): Promise<IProject[]> {
    const response = await this.axiosServer.get<IProject[]>(
      "/projects?offset=" + offset + "&limit=" + limit
    );
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

  async getStudentProjects(studentUuid: string): Promise<IProject[]> {
    const response = await this.axiosServer.get<IProject[]>(
      "/projects/users/" + studentUuid
    );
    return response.data;
  }

  async getStudentsUuid(
    //todo : adapter car ça renvoie plus de trucs maintenant
    offset: number,
    limit: number
  ): Promise<{ uuid: string }[]> {
    const response = await this.axiosServer.get<{ uuid: string }[]>(
      "/students?offset=" + offset + "&limit=" + limit
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

  async getMyProfile(): Promise<Student> {
    const response = await this.axiosServer.get<Student>("/my/profile/");
    return {
      uuid: response.data.uuid, //"b081f3ca-ef85-4c09-8bec-c94ce7e101a8", // TODO supprimer
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

  async sendCreateProject(
    studentUuid: string,
    project: { title: string; description: string }
  ): Promise<string> {
    const response = await this.axiosServer.post<string>(
      "/my/projects",
      project
    );
    return response.data;
  }

  async sendModifyProject(
    uuid: string,
    project: { title: string; description: string }
  ): Promise<void> {
    await this.axiosServer.put("/my/projects/" + uuid, project);
  }
  async sendDeleteProject(uuid: string): Promise<void> {
    await this.axiosServer.delete("/my/projects/" + uuid);
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
      "/my/projects/" + projectUuid + "/images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  async deleteImage(projectUuid: string, imageUuid: string): Promise<void> {
    await this.axiosServer.delete(
      "/my/projects/" + projectUuid + "/images/" + imageUuid
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
