import {Controller, Get} from '@tsed/common';
import {Inject} from '@tsed/di';
import bcrypt from 'bcrypt';
import faker from 'faker';
import Jimp from 'jimp';
import request from 'request';
import {getRepository} from 'typeorm';

import {Admin} from '../../entities/Admin';
import {Image} from '../../entities/Image';
import {Project} from '../../entities/Project';
import {Student} from '../../entities/Student';
import {SMS3StorageService} from '../../services/SMS3StorageService';

/**
 * Contrôleur servant à remplir la base de données avec des fausses données
 * générées.
 *
 */
@Controller('/faker')
export class FakerController {
  /**
   * Accès au stockage des images.
   *
   */
  @Inject() s3: SMS3StorageService;

  /**
   * Accès au repository des divers entités de la BDD.
   *
   */
  private studentRepository = getRepository(Student);
  private adminRepository = getRepository(Admin);
  private projectRepository = getRepository(Project);
  private imageRepository = getRepository(Image);

  /**
   * Permet de générer des étudiants dans la base de données avec "password" comme mdp.
   *
   */
  @Get('/students')
  async populateDbStudents() {
    for (let i = 0; i < 20; ++i) {
      const student = new Student();
      student.firstname = faker.name.firstName();
      student.lastname = faker.name.lastName();
      student.username = faker.internet.userName(
        student.firstname,
        student.lastname
      );
      student.description = faker.commerce.productDescription();
      student.password = await bcrypt.hash('password', 10);
      await this.studentRepository.save(student);
    }
  }

  /**
   * Permet de créer un admin du nom de "admin" et de mdp "password"
   */
  @Get('/admin')
  async populateDbAdmin() {
    const admin = new Admin();
    admin.firstname = faker.name.firstName();
    admin.lastname = faker.name.lastName();
    admin.username = 'admin';
    admin.password = await bcrypt.hash('password', 10);
    await this.adminRepository.save(admin);
  }

  /**
   * Permet de créer 20 projets attribués aléatoirement à un étudiant
   */
  @Get('/projects')
  async populateDbProjects() {
    const students = await this.studentRepository.find();
    for (let i = 0; i < 20; ++i) {
      const project = new Project();
      project.title = faker.commerce.productName();
      project.description = faker.commerce.productDescription();
      project.student = students[Math.floor(Math.random() * students.length)];
      await this.projectRepository.save(project);
    }
  }

  /**
   * Permet de générer des images et leurs métadonnées dans la base de données.
   *
   */
  @Get('/images')
  async populateDbImages() {
    const projects = await this.projectRepository.find({relations: ['images']});

    const url = 'https://picsum.photos/550/400';

    const nbImages = 3;
    for (const project of projects) {
      for (let i = 0; i < nbImages - project.images.length; ++i) {
        await new Promise<void>(resolve => {
          request({url, encoding: null}, async (err, resp, buffer) => {
            if (err) return;
            const createdImage = await this.imageRepository.save({
              project,
              title: faker.commerce.productName(),
              description: faker.commerce.productDescription(),
            });

            await this.s3.putFile(
              'start',
              `${project.uuid}/${createdImage.uuid}/original`,
              buffer,
              {
                'Content-Type': Jimp.MIME_JPEG,
              }
            );

            const thumbnail = await Jimp.read(buffer);
            thumbnail.resize(250, Jimp.AUTO);
            const bufferResized = await thumbnail.getBufferAsync(Jimp.MIME_PNG);

            await this.s3.putFile(
              'start',
              `${project.uuid}/${createdImage.uuid}/thumbnail`,
              bufferResized,
              {
                'Content-Type': Jimp.MIME_PNG,
              }
            );
            resolve();
          });
        });
      }
    }
  }
}
