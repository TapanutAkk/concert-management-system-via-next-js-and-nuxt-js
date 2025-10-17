import { Controller, Post, Body, HttpCode, HttpStatus, HttpException, Get, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import * as createConcertDto from './dto/create-concert.dto';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';
import { Prisma } from '@prisma/client';

class UserActionDto {
  userName: string; 
}

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

  @Get('seats')
  async getSeatSum() {
    try {
      const totalSeat = await this.concertsService.getSeatSum();

      return {
        status: totalSeat > 0 ? true : false,
        data: totalSeat,
      };

    } catch (error) {
      console.error('Error fetching concerts:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('user/:userName')
  async findAllAvailableForUser(@Param('userName') userName: string) {
    try {
      const concerts = await this.concertsService.findAllAvailableForUser(userName);
      return {
          status: concerts.length > 0 ? true : false,
          count: concerts.length,
          data: concerts,
      };
    } catch (error) {
      console.error('Error fetching user concerts:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('reserve/:id')
  reserve(
    @Param('id', ParseUUIDPipe) concertId: string, 
    @Body() body: UserActionDto 
  ) {
    return this.concertsService.logReservation(concertId, body.userName);
  }

  @Post('cancel/:id')
  cancel(
    @Param('id', ParseUUIDPipe) concertId: string, 
    @Body() body: UserActionDto 
  ) {
    return this.concertsService.logCancellation(concertId, body.userName);
  }

  @Get('log/:userName')
  async findAllReservationLogs(@Param('userName') userName: string) {
    try {
      const logs = await this.concertsService.findAllReservationLogs(userName);
      return {
          status: logs.length > 0 ? true : false,
          count: logs.length,
          data: logs,
      };
    } catch (error) {
      console.error('Error fetching user concerts:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}