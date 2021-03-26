import {Controller, Get, MultipartFile, PlatformMulterFile, Post, Res} from '@tsed/common';
import {Inject} from '@tsed/di';

import {SMS3StorageService} from '../services/SMS3StorageService';

@Controller('/test')
export class TestController {
  @Inject()
  s3: SMS3StorageService;

  @Get('/')
  async index(@Res() response: Res) {
    //return await this.s3.client.fPutObject("streamboard", "test.sbplugin", "./test.sbplugin", {});
    //return this.s3.client.getObject("streamboard", "test.sbplugin");
    //return this.s3.client.statObject("streamboard", "test.sbplugin")
    //response.redirect(await this.s3.client.presignedUrl("get","streamboard", "test.sbplugin"));
    //return this.s3.client.presignedUrl("delete","streamboard", "test.sbplugin")

    await this.s3.putFileFromFile(
      'start',
      'test.sbplugin',
      './test.sbplugin',
      {owner: 'maxime'}
    );

    return this.s3.listFiles('start', '', true);
  }

  @Get('/2')
  async index2(@Res() response: Res) {
    return this.s3.fileInfo('start', 'test.sbplugin');
  }

  @Post('/file')
  async upload(@MultipartFile("file") file: PlatformMulterFile){
    return this.s3.putFile('start', file.originalname, file.buffer, {
      'Content-Type':file.mimetype
    });
  }
}
