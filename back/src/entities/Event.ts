import {Required} from '@tsed/schema';
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';

import {Project} from './Project';

// TODO: Supprimer.
@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  @Required()
  title: string;

  @Column()
  @Required()
  description: string;

  @Column()
  @Required()
  beginAt: Date;

  @Column()
  @Required()
  endAt: Date;

  @OneToMany(() => Project, project => project.event)
  projects: Project[];
}
