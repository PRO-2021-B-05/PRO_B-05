import { Controller, Get, PathParams, QueryParams } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { deserialize } from '@tsed/json-mapper';
import { Returns } from '@tsed/schema';
import { getRepository } from 'typeorm';

import { Pagination } from '../../entities/Pagination';
import { Project } from '../../entities/Project';
import { Student } from '../../entities/Student';

/**
 * Contrôleur permettant d'accèder aux informations d'un projet.
 *
 */
@Controller('/projects')
export class ProjectController {
  /**
   * Accès à la table des étudiants dans la base de données.
   *
   */
  private studentRepository = getRepository(Student);

  /**
   * Accès à la table des projets dans la base de données.
   *
   */
  private projectRepository = getRepository(Project);

  /**
   * Permet de lister tous les projets.
   *
   * @param offset Le numéro de premier projet de la liste.
   * @param limit Le nombre de projet de la liste à renvoyer.
   * @returns La liste des projets à partir du numéro donné.
   *
   */
  @Get('/')
  @(Returns(200, Pagination)
    .Of(Project)
    .Groups('project.showAll', 'user.show', 'image.show'))
  async listAll(
    @QueryParams('offset') offset: number,
    @QueryParams('limit') limit: number
  ) {
    const results = deserialize(
      await this.projectRepository.find({
        relations: ['student', 'images', 'event', 'images.project'],
        order: { publishAt: 'DESC' },
        skip: offset,
        take: limit,
      }),
      {
        type: Project,
        groups: ['project.showAll', 'user.show', 'image.show'],
      }
    );
    const total = await this.projectRepository.count();
    return new Pagination<Project>({ results, total, offset, limit });
  }

  /**
   * Permet de lister tous les projets d'un étudiant donné.
   *
   * @param userId L'identifiant unique de l'étudiant.
   * @param offset Le numéro du premier projet de la liste.
   * @param limit Le nombre de projet de la liste à renvoyer.
   * @returns La liste des projets à partir du numéro donné.
   *
   */
  @Get('/users/:userId')
  @(Returns(200, Pagination)
    .Of(Project)
    .Groups('project.showAll', 'user.show', 'image.show'))
  async listUser(
    @PathParams('userId') userId: string,
    @QueryParams('offset') offset: number,
    @QueryParams('limit') limit: number
  ) {
    const student = await this.studentRepository.findOne({ uuid: userId });

    if (!student) {
      throw new NotFound('Could not find requested user');
    }

    const results = deserialize(
      await this.projectRepository.find({
        where: { student },
        relations: ['student', 'images', 'event', 'images.project'],
        order: { publishAt: 'DESC' },
        skip: offset,
        take: limit,
      }),
      {
        type: Project,
        groups: ['project.showAll', 'user.show', 'image.show'],
      }
    );
    const total = await this.projectRepository.count({ where: { student } });
    return new Pagination<Project>({ results, total, offset, limit });
  }

  /**
   * Permet de lire les informations d'un projet.
   *
   * @param uuid L'identifiant unique du projet.
   * @returns Les informations du projet demandé.
   *
   */
  @Get('/:uuid')
  @(Returns(200, Project).Groups('project.show', 'user.show', 'image.show'))
  async get(@PathParams('uuid') uuid: string) {
    const project = await this.projectRepository.findOne({
      where: { uuid },
      relations: ['student', 'images', 'event', 'images.project'],
    });

    if (!project) {
      throw new NotFound('Could not find requested project');
    }

    return project;
  }
}
