import {
  Groups,
  Ignore,
  MaxLength,
  Min,
  MinLength,
  Pattern,
  Property,
  ReadOnly,
  Required,
  WriteOnly
} from '@tsed/schema';
import bcrypt from 'bcrypt';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  Unique,
  UpdateDateColumn
} from 'typeorm';

@Entity()
@Unique(['username'])
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  @Pattern(/^[a-zA-Z0-9_-]{3,15}$/)
  @MinLength(3)
  @MaxLength(15)
  username: string;

  @Column()
  password: string;

  @Column()
  @Required()
  @Groups("test")
  firstname: string;

  @Column()
  @Required()
  @Groups("test")
  lastname: string;

  @Column()
  @CreateDateColumn()
  @ReadOnly()
  createAt: Date

  @Column()
  @UpdateDateColumn()
  @ReadOnly()
  updateAt: Date;

  @Column()
  type: string;



  public verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
