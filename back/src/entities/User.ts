import {
    Groups,
    Ignore,
    MaxLength,
    Min,
    MinLength,
    Pattern,
    Property,
    ReadOnly,
    Required, RequiredGroups,
    DateTime,
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
@TableInheritance({column: {type: "varchar", name: "type"}})
export class User {
    @PrimaryGeneratedColumn('uuid')
    @ReadOnly()
    @Groups("show")
    uuid: string;

    @Column()
    @Pattern(/^[a-zA-Z0-9_-]{3,15}$/)
    @MinLength(3)
    @MaxLength(15)
    @RequiredGroups("register")
    @Required()
    @Groups("show", "register")
    username: string;

    @Column()
    @RequiredGroups("register")
    @Required()
    @Groups("admin", "register")
    @MinLength(8)
    password: string;

    @Column()
    @RequiredGroups("register")
    @Required()
    @Groups("show", "update", "register")
    firstname: string;

    @Column()
    @RequiredGroups("register")
    @Required()
    @Groups("show", "update", "register")
    lastname: string;

    @Column()
    @CreateDateColumn()
    @ReadOnly()
    @Groups("show")
    @DateTime()
    createAt: Date

    @Column()
    @UpdateDateColumn()
    @ReadOnly()
    @Groups("show")
    @DateTime()
    updateAt: Date;

    @Column()
    type: string;


    public verifyPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}
