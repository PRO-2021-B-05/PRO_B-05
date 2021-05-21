import { User } from "./User";
import { ChildEntity, Column, Entity, OneToMany } from "typeorm";
import { Project } from "./Project";
import {Groups, Nullable, RequiredGroups} from "@tsed/schema";

@ChildEntity()
export class Student extends User {
    @Column({type : "text"})
    @Nullable(String)
    @Groups("user.update", "user.show","user.register")
    description?: string;

    @OneToMany(() => Project, project => project.student)
    projects: Project[];
}