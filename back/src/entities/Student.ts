import {Groups, Nullable} from '@tsed/schema';
import {ChildEntity, Column, OneToMany} from 'typeorm';

import {Project} from './Project';
import {User} from './User';

@ChildEntity()
export class Student extends User {
  @Column({type: 'text'})
  @Nullable(String)
  @Groups('user.update', 'user.show', 'user.register')
  description?: string;

  @OneToMany(() => Project, project => project.student)
  projects: Project[];
}
