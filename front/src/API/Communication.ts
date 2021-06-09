import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ILogin } from "@/model/Login";
import { Student } from "@/model/IStudent";
import { IProject } from "@/model/IProject";
import { Image } from "@/model/IImage";
import { Pagination } from "@/model/Pagination";
import { SERVER_ADDRESS } from "@/config";

export class Communication {
  private token?: string;
  private axiosServer: AxiosInstance;

  /**
   * crée l'instance axios
   */
  constructor() {
    this.axiosServer = axios.create({
      baseURL: `${SERVER_ADDRESS}/api/v1`,
    });
    this.setToken(localStorage.getItem("token") ?? "");
  }

  /**
   * récupère des projets
   * @param offset indice du premier élément cherché
   * @param limit nombre d'éléments à récupérer
   */
  async getProjects(
    offset: number,
    limit: number
  ): Promise<Pagination<IProject>> {
    const response = await this.axiosServer.get<Pagination<IProject>>(
      "/projects?offset=" + offset + "&limit=" + limit
    );
    return response.data;
  }

  /**
   * récupère un projet
   * @param projectUuid uuid du proket
   */
  async getProject(projectUuid: string): Promise<IProject> {
    const response = await this.axiosServer.get<IProject>(
      "/projects/" + projectUuid
    );
    return response.data;
  }

  /**
   * récupère les images d'un projet
   * @param projectUuid uuid du projet
   * @param offset indice du premier élément cherché
   * @param limit nombre d'éléments à récupérer
   */
  async getProjectImages(
    projectUuid: string,
    offset: number,
    limit: number
  ): Promise<Pagination<Image>> {
    const response = await this.axiosServer.get<Pagination<Image>>(
      "/projects/" +
        projectUuid +
        "/images?offset=" +
        offset +
        "&limit=" +
        limit
    );
    return response.data;
  }

  /**
   * récupère les projets d'un étudiant
   * @param studentUuid uuid de l'étudiant
   * @param offset indice du premier élément cherché
   * @param limit nombre d'éléments à récupérer
   */
  async getStudentProjects(
    studentUuid: string,
    offset: number,
    limit: number
  ): Promise<Pagination<IProject>> {
    const response = await this.axiosServer.get<Pagination<IProject>>(
      "/projects/users/" + studentUuid + "?offset=" + offset + "&limit=" + limit
    );
    return response.data;
  }

  async getStudents(
    offset: number,
    limit: number
  ): Promise<Pagination<Student>> {
    const response = await this.axiosServer.get<Pagination<Student>>(
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
    return response.data;
  }

  async modifyDescription(
    firstname: string,
    lastname: string,
    description: string
  ): Promise<Student> {
    const response = await this.axiosServer.put<Student>("/my/profile/", {
      firstname: firstname,
      lastname: lastname,
      description: description,
    });
    return response.data;
  }

  async deleteStudent(uuid: string): Promise<void> {
    await this.axiosServer.delete("/students/" + uuid);
  }

  async sendCreateStudent(student: Student): Promise<void> {
    const newStudent = {
      username:
        student.firstname.toLowerCase().slice(0, 7) +
        "-" +
        student.lastname.toLowerCase().slice(0, 7),
      password: student.password,
      firstname: student.firstname,
      lastname: student.lastname,
      createAt: "12-12-2020",
      updateAt: "12-12-2020",
      description: student.description,
    };
    await this.axiosServer.post("/auth/registerStudent", newStudent);
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
    console.log(project);
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

  /**
   * supprimer un projet
   * @param uuid du projet à supprimer
   */
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

  public async isAdmin(): Promise<boolean> {
    let admin = false;
    await this.axiosServer
      .get("/admin/")
      .then(() => {
        admin = true;
      })
      .catch(() => {
        admin = false;
      });
    return admin;
  }
}
