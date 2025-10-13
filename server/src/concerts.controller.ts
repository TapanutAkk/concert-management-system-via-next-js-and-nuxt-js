import { Controller, Post, Body, HttpCode, HttpStatus, HttpException, Get, Delete, Param } from '@nestjs/common';
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

  @Get()
  async findAll() {
    try {
      const concerts = await this.concertsService.findAll();

      return {
        status: concerts.length > 0 ? true : false,
        count: concerts.length,
        data: concerts,
      };

    } catch (error) {
      console.error('Error fetching concerts:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id') 
  @HttpCode(HttpStatus.NO_CONTENT) 
  async remove(@Param('id') id: string) {
    try {
      await this.concertsService.remove(id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') { 
          throw new HttpException(
            `Not Found Concert ID: ${id}`,
            HttpStatus.NOT_FOUND,
          );
        }
      }
      
      console.error('Delete Error:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}