/**
 * interface pour représenter des étudiants
 */
export interface Student {
  uuid?: string;
  username: string;
  password?: string;
  firstname: string;
  lastname: string;
  description?: string;
}
