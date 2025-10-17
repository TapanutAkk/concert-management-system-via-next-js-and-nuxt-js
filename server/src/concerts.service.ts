import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { Concert, Action, ReservationLog } from '@prisma/client';

@Injectable()
export class ConcertsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateConcertDto): Promise<Concert> {
    return this.prisma.concert.create({
      data: {
        name: data.concertName,
        totalSeats: data.totalSeat,
        description: data.description ?? '',
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
  
  async getSeatSum(): Promise<number> {
    const result = await this.prisma.concert.aggregate({
      _sum: {
        totalSeats: true,
      },
    });

    return result._sum.totalSeats || 0; 
  }

  async remove(id: string): Promise<Concert> {
    return this.prisma.concert.delete({
      where: { id },
    });
  }

  private async getCurrentUserStatus(
    concertId: string,
    userName: string,
  ): Promise<Action | null> {
    const latestLog = await this.prisma.reservationLog.findFirst({
      where: { concertId, userName },
      orderBy: { createdAt: 'desc' },
      select: { action: true },
    });
    return latestLog?.action || null;
  }

  private async updateConcertReservedCount(concertId: string) {
    const reserveCount = await this.prisma.reservationLog.count({
      where: { concertId, action: Action.RESERVE }
    });
    const cancelCount = await this.prisma.reservationLog.count({
      where: { concertId, action: Action.CANCEL }
    });

    const newReservedCount = reserveCount - cancelCount;

    await this.prisma.concert.update({
      where: { id: concertId },
      data: { reservedCount: newReservedCount }
    });
  }

  async findAllAvailableForUser(userName: string): Promise<(Concert & { latestAction?: Action | null })[]> {
    const concerts = await this.prisma.concert.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    const allUserLogs = await this.prisma.reservationLog.findMany({
      where: { userName: userName },
      orderBy: { createdAt: 'desc' },
    });

    return concerts.map((concert) => {
      const latestLog = allUserLogs.find((log) => log.concertId === concert.id);

      const latestAction = latestLog?.action || null; 
      
      return {
        ...concert,
        latestAction: latestAction,
      };
    });
  }

  async findAllReservationLogs(
    userName: string
  ): Promise<(ReservationLog & { concertName?: string; formattedAt: string })[]> {
    const whereClause = userName ? { userName } : {};
    const logs = await this.prisma.reservationLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    const concerts = await this.prisma.concert.findMany({});

    const formatDateTime = (input: Date | string) => {
      const d = input instanceof Date ? input : new Date(input);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
    };

    return logs.map((log) => {
      const concert = concerts.find((c) => c.id === log.concertId);

      return {
        ...log,
        concertName: concert?.name,
        formattedAt: formatDateTime(log.createdAt),
      };
    });
  }

  async logReservation(concertId: string, userName: string): Promise<ReservationLog> {
    const currentStatus = await this.getCurrentUserStatus(concertId, userName);

    if (currentStatus === Action.RESERVE) {
        throw new BadRequestException('You already have an active reservation.');
    }
    
    const concert = await this.prisma.concert.findUnique({ where: { id: concertId } });
    if (!concert || concert.reservedCount >= concert.totalSeats) {
        throw new BadRequestException('No seats available.');
    }

    const log = await this.prisma.reservationLog.create({
      data: { concertId, userName, action: Action.RESERVE },
    });
    
    await this.updateConcertReservedCount(concertId);
    return log;
  }

  async logCancellation(concertId: string, userName: string): Promise<ReservationLog> {
    const currentStatus = await this.getCurrentUserStatus(concertId, userName);

    if (currentStatus !== Action.RESERVE) {
        throw new BadRequestException('No active reservation to cancel.');
    }

    const log = await this.prisma.reservationLog.create({
      data: { concertId, userName, action: Action.CANCEL },
    });
    
    await this.updateConcertReservedCount(concertId);
    return log;
  }

  async getReservedSum(): Promise<number> {
    const result = await this.prisma.concert.aggregate({
      _sum: {
        reservedCount: true,
      },
    });

    return result._sum.reservedCount || 0; 
  }
}