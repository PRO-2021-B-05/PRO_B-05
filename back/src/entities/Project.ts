import { Nullable, Required } from "@tsed/schema";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Event } from "./Event";
import { Image } from "./Image";
import { Student } from "./Student";
import { User } from "./User";

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    @Required()
    title: string;

    @Column({type : "text"})
    @Required()
    description: string;

    @Column()
    @CreateDateColumn()
    publishAt: Date;

    @Column()
    @UpdateDateColumn()
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