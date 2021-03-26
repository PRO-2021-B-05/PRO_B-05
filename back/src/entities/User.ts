import {Email, MinLength} from '@tsed/schema';
import bcrypt from 'bcrypt';
import {Column, Entity, PrimaryGeneratedColumn, Unique} from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  @Email()
  email: string;

  @Column()
  @MinLength(8)
  password: string;

  public role = 'admin';

  public verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
