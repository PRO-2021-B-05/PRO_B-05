import { Student } from "@/model/IStudent";

export interface IProject {
  title: string;
  description: string;
  publishAt: string;
  updateAt: string;
  uuid: string;
  student: Student;
  thumbnailUrl: string;
}
