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

import {Event} from './Event';
import {Image} from './Image';
import {Student} from './Student';

@Entity()
export class Project {
  @Property()
  @PrimaryGeneratedColumn('uuid')
  @Groups('project.show', 'project.showAll')
  uuid: string;

  @Column()
  @RequiredGroups('project.create')
  @Required()
  @MinLength(5)
  @Groups('project.show', 'project.showAll', 'project.create', 'project.update')
  title: string;

  @Column({type: 'text'})
  @RequiredGroups('project.create')
  @Required()
  @MinLength(5)
  @Groups('project.show', 'project.showAll', 'project.create', 'project.update')
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
