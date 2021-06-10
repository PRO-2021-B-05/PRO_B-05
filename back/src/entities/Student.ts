import { Groups, Nullable } from '@tsed/schema';
import { ChildEntity, Column, OneToMany } from 'typeorm';

import { Project } from './Project';
import { User } from './User';

/**
 * Classe représentant un étudiant dans la base de données.
 *
 */
@ChildEntity()
export class Student extends User {
  /**
   * Description de l'étudiant.
   *
   */
  @Column({ type: 'text' })
  @Nullable(String)
  @Groups('user.update', 'user.show', 'user.register')
  description?: string;

  /**
   * Liste des projets créés par l'étudiant.
   *
   */
  @OneToMany(() => Project, project => project.student)
  projects: Project[];
}
