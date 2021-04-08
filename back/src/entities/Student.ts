import {User} from "./User";
import {ChildEntity, Column, Entity} from "typeorm";

@ChildEntity()
export class Student extends User{
    @Column()
    description: string;
}