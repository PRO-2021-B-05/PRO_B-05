import { Student } from "@/model/IStudent";

/**
 * interface pour les objets projet
 */
export interface IProject {
  title: string;
  description: string;
  publishAt: string;
  updateAt: string;
  uuid: string;
  student: Student;
  thumbnailUrl: string;
}
