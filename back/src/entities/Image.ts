import {Groups, Nullable, Property, ReadOnly} from "@tsed/schema";
import {Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Project} from "./Project";

@Entity()
export class Image {
    @PrimaryGeneratedColumn('uuid')
    @Groups('image.show')
    uuid: string;

    @Column()
    @Nullable(String)
    @Groups('image.show')
    title: string;

    @Column()
    @Nullable(String)
    @Groups('image.show')
    description: string;

    @Property()
    @ReadOnly()
    @Groups('image.show')
    get url() {
        if (!this.project) return "";
        return `https://s3.studimax.ch/start/${this.project.uuid}/${this.uuid}/original`;
    }

    set url(value: string) {
    }

    @Property()
    @ReadOnly()
    @Groups('image.show')
    get thumbnailUrl() {
        if (!this.project) return "";
        return `https://s3.studimax.ch/start/${this.project.uuid}/${this.uuid}/thumbnail`;
    }

    set thumbnailUrl(value: string) {
    }

    @ManyToOne(() => Project, project => project.images, {
        onDelete: 'CASCADE',
    })
    @Groups('image.show', '!project.show', '!project.showAll')
    project: Project;
}