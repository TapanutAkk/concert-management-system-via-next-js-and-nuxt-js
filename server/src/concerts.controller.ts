import { Controller, Post, Body, HttpCode, HttpStatus, HttpException, UsePipes } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import * as createConcertDto from './dto/create-concert.dto';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';
import { Prisma } from '@prisma/client';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(createConcertDto.concertSchema)) 
    createConcertDto: createConcertDto.CreateConcertDto
  ) {
    try {
      const newConcert = await this.concertsService.create(createConcertDto); 

      return {
        message: 'Concert created successfully',
        concert: newConcert,
      };

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') { 
          throw new HttpException(
            'The concert name is already taken. Please choose another one.',
            HttpStatus.CONFLICT,
          );
        }
      }
      
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}