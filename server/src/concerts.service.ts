import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { Concert } from '@prisma/client';

@Injectable()
export class ConcertsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateConcertDto): Promise<Concert> {
    return this.prisma.concert.create({
      data: {
        name: data.concertName,
        totalSeats: data.totalSeat,
        description: data.description,
      },
    });
  }

  async findAll(): Promise<Concert[]> {
    return this.prisma.concert.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Concert | null> {
    return this.prisma.concert.findUnique({
      where: {
        id: id,
      },
    });
  }
  
  async getConcertCount(): Promise<number> {
    const result: any[] = await this.prisma.$queryRaw`SELECT COUNT(*) FROM "Concert"`;
    return Number(result[0].count);
  }

  async remove(id: string): Promise<Concert> {
    return this.prisma.concert.delete({
      where: { id },
    });
  }
}