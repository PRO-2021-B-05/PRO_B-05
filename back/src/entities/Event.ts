import {Required} from '@tsed/schema';
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';

import {Project} from './Project';

/**
 * Classe représentant un événement (Pas utilisée pour le moment)
 */
@Entity()
export class Event {
  /**
   * Identifiant unique de l'événement.
   *
   */
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  /**
   * Nom de l'événement.
   *
   */
  @Column()
  @Required()
  title: string;

  /**
   * Description de l'événement.
   *
   */
  @Column()
  @Required()
  description: string;

  /**
   * Date à laquelle l'événement commence.
   *
   */
  @Column()
  @Required()
  beginAt: Date;

  /**
   * Date à laquelle l'événement se termine.
   *
   */
  @Column()
  @Required()
  endAt: Date;

  /**
   * Projets faisant partie de l'événement.
   *
   */
  @OneToMany(() => Project, project => project.event)
  projects: Project[];
}
