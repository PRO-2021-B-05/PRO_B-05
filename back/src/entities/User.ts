import {
  DateTime,
  Groups,
  MaxLength,
  MinLength,
  Pattern,
  ReadOnly,
  Required,
  RequiredGroups,
} from '@tsed/schema';
import bcrypt from 'bcrypt';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['username'])
@TableInheritance({column: {type: 'varchar', name: 'type'}})
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ReadOnly()
  @Groups('user.show')
  uuid: string;

  @Column()
  @Pattern(/^[a-zA-Z0-9_-]{3,15}$/)
  @MinLength(3)
  @MaxLength(15)
  @RequiredGroups('user.register')
  @Required()
  @Groups('user.show', 'user.register')
  username: string;

  @Column()
  @RequiredGroups('user.register')
  @Required()
  @Groups('user.admin', 'user.register')
  @MinLength(8)
  password: string;

  @Column()
  @RequiredGroups('user.register')
  @Required()
  @Groups('user.show', 'user.update', 'user.register')
  firstname: string;

  @Column()
  @RequiredGroups('user.register')
  @Required()
  @Groups('user.show', 'user.update', 'user.register')
  lastname: string;

  @Column()
  @CreateDateColumn()
  @ReadOnly()
  @Groups('user.show')
  @DateTime()
  createAt: Date;

  @Column()
  @UpdateDateColumn()
  @ReadOnly()
  @Groups('user.show')
  @DateTime()
  updateAt: Date;

  @Column()
  type: string;

  public verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
