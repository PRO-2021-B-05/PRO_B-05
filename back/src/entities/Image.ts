import { Nullable, Property } from "@tsed/schema";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./Project";

@Entity()
export class Image {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    @Nullable(String)
    title: string;

    @Column()
    @Nullable(String)
    description: string;

    @Property()
    get url() {
        // TODO: Mettre a jour l'url.
        return `https://s3.studimax-cloud.ch/minio/start/${this.project.uuid}/${this.uuid}`;
    }

    @Property()
    get thumbnailUrl() {
        // TODO: Mettre a jour l'url.
        return `https://s3.studimax-cloud.ch/minio/start/${this.project.uuid}/${this.uuid}-thumbnail`;
    }

    @ManyToOne(() => Project, project => project.images)
    project: Project;
}