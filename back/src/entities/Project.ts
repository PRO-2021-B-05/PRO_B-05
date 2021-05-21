import { Nullable, Required } from "@tsed/schema";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Event } from "./Event";
import { Image } from "./Image";
import { Student } from "./Student";
import { User } from "./User";

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    @Groups('project.show', 'project.showAll')
    uuid: string;

    @Column()
    @Required()
    @Groups('project.show', 'project.showAll')
    title: string;

    @Column({type : "text"})
    @Required()
    @Groups('project.show', 'project.showAll')
    description: string;

    @Column()
    @CreateDateColumn()
    @Groups('project.show', 'project.showAll')
    publishAt: Date;

    @Column()
    @UpdateDateColumn()
    @Groups('project.show', 'project.showAll')
    updateAt: Date;

    @ManyToOne(() => Student, student => student.projects, {
        onDelete: 'CASCADE',
    })
    student: Student;

    @ManyToOne(() => Event, event => event.projects)
    event?: Event;

    @OneToMany(() => Image, image => image.project)
    images: Image[];
}