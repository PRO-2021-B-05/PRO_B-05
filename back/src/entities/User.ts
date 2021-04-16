import {MaxLength, Min, MinLength, Pattern, Property, Required} from '@tsed/schema';
import bcrypt from 'bcrypt';
import {Column, Entity, PrimaryGeneratedColumn, TableInheritance, Unique} from 'typeorm';

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
  @MinLength(8)
  password: string;

  @Column()
  @Required()
  firstname: string;

  @Column()
  @Required()
  lastname: string;

  @Column()
  type: string;



  public verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
