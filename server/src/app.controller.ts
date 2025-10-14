import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

interface PostDataDto {
  name: string;
  topic: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { message: string } {
    return { message: 'Hello from NestJS Backend!' };
  }

  @Post('messages')
  postData(@Body() body: PostDataDto): { status: string, received: PostDataDto } {
    console.log('Received data:', body);
    
    return {
      status: 'Data received successfully!',
      received: body,
    };
  }
}
