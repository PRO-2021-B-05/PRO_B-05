import { Groups, Nullable, Property, ReadOnly } from '@tsed/schema';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Project } from './Project';

/**
 * Classe représentant les métadonnées d'un image dans la base de données.
 *
 */
@Entity()
export class Image {
  /**
   * Identifiant unique de l'image.
   *
   */
  @PrimaryGeneratedColumn('uuid')
  @Groups('image.show')
  uuid: string;

  /**
   * Titre de l'image.
   *
   */
  @Column()
  @Nullable(String)
  @Groups('image.show', 'image.update')
  title: string;

  /**
   * Description de l'image.
   *
   */
  @Column()
  @Nullable(String)
  @Groups('image.show', 'image.update')
  description: string;

  /**
   * @return L'adresse Url permettant d'accèder à l'image.
   *
   */
  @Property()
  @ReadOnly()
  @Groups('image.show')
  get url() {
    if (!this.project) return '';
    return `${process.env.BASE_URL_IMAGE}/${this.project.uuid}/${this.uuid}/original`;
  }

  set url(value: string) { }

  /**
   * @return L'adresse Url permettant d'accèder à la miniature de l'image.
   *
   */
  @Property()
  @ReadOnly()
  @Groups('image.show')
  get thumbnailUrl() {
    if (!this.project) return '';
    return `${process.env.BASE_URL_IMAGE}/${this.project.uuid}/${this.uuid}/thumbnail`;
  }

  set thumbnailUrl(value: string) { }

  /**
   * Projet auquel l'image appartient.
   *
   */
  @ManyToOne(() => Project, project => project.images, {
    onDelete: 'CASCADE',
  })
  @Groups('image.show', '!project.show', '!project.showAll')
  project: Project;
}
