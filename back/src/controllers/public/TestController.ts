import Jimp from 'jimp';
import * as uuid from 'uuid';
import {Controller, Err, Get, MulterOptions, MultipartFile, PlatformMulterFile, Post, Req, Res} from '@tsed/common';
import {Inject} from '@tsed/di';

import {SMS3StorageService} from '../../services/SMS3StorageService';
import {MulterError} from "multer";
import {OnlyAdmin} from "../../decorators/OnlyAdmin";
import {Authenticate} from "@tsed/passport";
import {Admin} from "../../entities/Admin";

@Controller('/test')
export class TestController {
  @Inject()
  s3: SMS3StorageService;

  @Get('/adminTest')
  @Authenticate()
  @OnlyAdmin()
  async adminTest(@Req() request: Req){
    const admin = request.user as Admin;
    return request.user;
  }

  @Get('/deleteTest')
  async deleteTest(){
    await this.s3.deleteFolder('start', 'd339b014-1fde-4e80-889e-4ba6873ec8dc/4cca4b0d-08d8-4eb2-a96e-d8596c6434b9');
  }

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
  @MulterOptions({limits : {
    fileSize: 20*1000*1000
    } })
  async upload(@MultipartFile("file") file: PlatformMulterFile){
    const image = await Jimp.read(file.buffer)
    image.resize(250, Jimp.AUTO);
    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);

    return this.s3.putFile('start', uuid.v4(), buffer, {
      'Content-Type':Jimp.MIME_PNG,
      'Original-Name': file.originalname
    });
  }
}