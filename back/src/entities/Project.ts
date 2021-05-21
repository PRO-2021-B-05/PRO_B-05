import {Groups, Property, ReadOnly, Required} from '@tsed/schema';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {Event} from './Event';
import {Image} from './Image';
import {Student} from './Student';

@Entity()
export class Project {
  @Property()
  @PrimaryGeneratedColumn('uuid')
  @Groups('project.show', 'project.showAll')
  uuid: string;

  @Property()
  @Column()
  @Required()
  @Groups('project.show', 'project.showAll')
  title: string;

  @Property()
  @Column({type: 'text'})
  @Required()
  @Groups('project.show', 'project.showAll')
  description: string;

  @Property()
  @Column()
  @CreateDateColumn()
  @Groups('project.show', 'project.showAll')
  publishAt: Date;

  @Property()
  @Column()
  @UpdateDateColumn()
  @Groups('project.show', 'project.showAll')
  updateAt: Date;

  @Property()
  @Groups('project.show', 'project.showAll')
  @ManyToOne(() => Student, student => student.projects, {
    onDelete: 'CASCADE',
  })
  student: Student;

  @Property()
  @Groups('project.show', 'project.showAll')
  @ManyToOne(() => Event, event => event.projects)
  event?: Event;

  @Property()
  @Groups('project.show')
  @OneToMany(() => Image, image => image.project)
  images: Image[];

  @Property(String)
  @ReadOnly()
  @Groups('project.showAll')
  get thumbnailUrl(): string {
    if (!this.images || !this.images[0]) return '';
    return this.images[0].thumbnailUrl;
  }

  set thumbnailUrl(value: string) {}
}
