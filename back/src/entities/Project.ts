import {
  Groups,
  MinLength,
  Property,
  ReadOnly,
  Required,
  RequiredGroups,
} from '@tsed/schema';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Event } from './Event';
import { Image } from './Image';
import { Student } from './Student';

/**
 * Classe représentant un projet dans la base de donnée.
 *
 */
@Entity()
export class Project {
  /**
   * Identifiant unique du projet.
   *
   */
  @Property()
  @PrimaryGeneratedColumn('uuid')
  @Groups('project.show', 'project.showAll')
  uuid: string;

  /**
   * Titre du projet.
   *
   */
  @Column()
  @RequiredGroups('project.create')
  @Required()
  @MinLength(5)
  @Groups('project.show', 'project.showAll', 'project.create', 'project.update')
  title: string;

  /**
   * Description du projet.
   *
   */
  @Column({ type: 'text' })
  @RequiredGroups('project.create')
  @Required()
  @MinLength(5)
  @Groups('project.show', 'project.showAll', 'project.create', 'project.update')
  description: string;

  /**
   * Date de création du projet.
   *
   */
  @Property()
  @Column()
  @CreateDateColumn()
  @Groups('project.show', 'project.showAll')
  publishAt: Date;

  /**
   * Date de la dernière modification du projet.
   *
   */
  @Property()
  @Column()
  @UpdateDateColumn()
  @Groups('project.show', 'project.showAll')
  updateAt: Date;

  /**
   * Etudiant ayant créé le projet.
   *
   */
  @Property()
  @Groups('project.show', 'project.showAll')
  @ManyToOne(() => Student, student => student.projects, {
    onDelete: 'CASCADE',
  })
  student: Student;

  // TODO: Supprimer.
  @Property()
  @Groups('project.show', 'project.showAll')
  @ManyToOne(() => Event, event => event.projects)
  event?: Event;

  /**
   * Liste des images appartenant au projet.
   *
   */
  @Property()
  @Groups('project.show')
  @OneToMany(() => Image, image => image.project)
  images: Image[];

  /**
   * Adresse Url permettant d'accèder à la miniature du projet.
   *
   */
  @Property(String)
  @ReadOnly()
  @Groups('project.showAll')
  get thumbnailUrl(): string {
    if (!this.images || !this.images[0]) return '';
    return this.images[0].thumbnailUrl;
  }

  set thumbnailUrl(value: string) { }
}
