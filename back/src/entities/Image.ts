import { Nullable } from "@tsed/schema";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./Project";

@Entity()
export class Image {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    @Nullable()
    title?: string;

    @Column()
    @Nullable()
    description?: string;

    @ManyToOne(() => Project, project => project.images)
    project: Project;
}