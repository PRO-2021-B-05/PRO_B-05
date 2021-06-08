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

/**
 * Classe représentant un utilisateur dans la base de données.
 *
 */
@Entity()
@Unique(['username'])
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User {
  /**
   * Identifiant unique de l'utilisateur.
   *
   */
  @PrimaryGeneratedColumn('uuid')
  @ReadOnly()
  @Groups('user.show')
  uuid: string;

  /**
   * Pseudo de l'utilisateur.
   *
   */
  @Column()
  @Pattern(/^[a-zA-Z0-9_-]{3,15}$/)
  @MinLength(3)
  @MaxLength(15)
  @RequiredGroups('user.register')
  @Required()
  @Groups('user.show', 'user.register')
  username: string;

  /**
   * Mot de passe haché de l'utilisateur.
   *
   */
  @Column()
  @RequiredGroups('user.register')
  @Required()
  @Groups('user.admin', 'user.register')
  @MinLength(8)
  password: string;

  /**
   * Prénom de l'utilisateur.
   *
   */
  @Column()
  @RequiredGroups('user.register')
  @Required()
  @Groups('user.show', 'user.update', 'user.register')
  firstname: string;

  /**
   * Nom de famille de l'utilisateur.
   *
   */
  @Column()
  @RequiredGroups('user.register')
  @Required()
  @Groups('user.show', 'user.update', 'user.register')
  lastname: string;

  /**
   * Date de création de l'utilisateur.
   *
   */
  @Column()
  @CreateDateColumn()
  @ReadOnly()
  @Groups('user.show')
  @DateTime()
  createAt: Date;

  /**
   * Date de la dernière modification de l'utilisateur.
   *
   */
  @Column()
  @UpdateDateColumn()
  @ReadOnly()
  @Groups('user.show')
  @DateTime()
  updateAt: Date;

  /**
   * Type d'utilisateur.
   *
   */
  @Column()
  type: string;

  /**
   * Compare le mot de passe donné avec le mot de passe haché de l'utilisateur.
   *
   * @param password Le mot de passe à comparer.
   * @returns Si le mot de passe correspond au mot de passe haché ou non.
   *
   */
  public verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
