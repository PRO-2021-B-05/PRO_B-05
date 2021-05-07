import { User } from "./User";
import { ChildEntity, Column, Entity, OneToMany } from "typeorm";
import { Project } from "./Project";
import { Nullable } from "@tsed/schema";

@ChildEntity()
export class Student extends User {
    @Column({type : "text"})
    @Nullable()
    description?: string;

    @OneToMany(() => Project, project => project.student)
    projects: Project[];
}