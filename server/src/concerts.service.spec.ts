import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsService } from './concerts.service';
import { PrismaService } from './prisma/prisma.service';
import { Action } from '@prisma/client';

const MOCK_USER = 'testuser_windows';
const MOCK_CONCERT_ID = 'e9c8a1b7-4d6c-4f1e-8b0d-2a3c4e5f6d7a';
const MOCK_CONCERT = {
  id: MOCK_CONCERT_ID,
  name: 'Test Concert',
  description: 'Desc',
  totalSeats: 100,
  reservedCount: 0,
};

const mockPrismaService = {
  concert: {
    findUnique: jest.fn().mockResolvedValue(MOCK_CONCERT),
    update: jest.fn().mockImplementation((args) => ({ 
        ...MOCK_CONCERT, 
        ...args.data 
    })),
    findMany: jest.fn().mockResolvedValue([MOCK_CONCERT]),
  },
  reservationLog: {
    findFirst: jest.fn(),
    create: jest.fn().mockImplementation((args) => ({
        id: 'new-log-id',
        createdAt: new Date(),
        ...args.data,
    })),
    count: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('ConcertsService (Reservation Log Logic)', () => {
  let service: ConcertsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logReservation', () => {
    
    it('should create a RESERVE log when no previous log exists', async () => {
      jest.spyOn(service as any, 'getCurrentUserStatus').mockResolvedValue(null);
      
      jest.spyOn(service as any, 'updateConcertReservedCount').mockResolvedValue(undefined);
      
      const result = await service.logReservation(MOCK_CONCERT_ID, MOCK_USER);

      expect(prisma.reservationLog.create).toHaveBeenCalledTimes(1);
      expect(prisma.reservationLog.create).toHaveBeenCalledWith({
        data: {
          concertId: MOCK_CONCERT_ID,
          userName: MOCK_USER,
          action: Action.RESERVE,
        },
      });
      expect(result.action).toBe(Action.RESERVE);
      expect(service['updateConcertReservedCount']).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if user already has an active RESERVE log', async () => {
      jest.spyOn(service as any, 'getCurrentUserStatus').mockResolvedValue(Action.RESERVE);
      
      await expect(service.logReservation(MOCK_CONCERT_ID, MOCK_USER)).rejects.toThrow(
        'You already have an active reservation.'
      );

      expect(prisma.reservationLog.create).not.toHaveBeenCalled();
      expect(service['updateConcertReservedCount']).not.toHaveBeenCalled();
    });
    
  });

  describe('logCancellation', () => {
    
    it('should create a CANCEL log when an active RESERVE log exists', async () => {
      jest.spyOn(service as any, 'getCurrentUserStatus').mockResolvedValue(Action.RESERVE);
      jest.spyOn(service as any, 'updateConcertReservedCount').mockResolvedValue(undefined);
      
      const result = await service.logCancellation(MOCK_CONCERT_ID, MOCK_USER);

      expect(prisma.reservationLog.create).toHaveBeenCalledTimes(1);
      expect(prisma.reservationLog.create).toHaveBeenCalledWith({
        data: {
          concertId: MOCK_CONCERT_ID,
          userName: MOCK_USER,
          action: Action.CANCEL,
        },
      });
      expect(result.action).toBe(Action.CANCEL);
    });

    it('should throw BadRequestException if no active RESERVE log exists', async () => {
      jest.spyOn(service as any, 'getCurrentUserStatus').mockResolvedValue(Action.CANCEL);
      
      await expect(service.logCancellation(MOCK_CONCERT_ID, MOCK_USER)).rejects.toThrow(
        'No active reservation found to cancel.'
      );

      jest.spyOn(service as any, 'getCurrentUserStatus').mockResolvedValue(null);
      await expect(service.logCancellation(MOCK_CONCERT_ID, MOCK_USER)).rejects.toThrow(
        'No active reservation found to cancel.'
      );

      expect(prisma.reservationLog.create).not.toHaveBeenCalled();
    });
  });

  describe('findAllAvailableForUser', () => {
      it('should return isReserved: true when latest log is RESERVE', async () => {
        mockPrismaService.reservationLog.findMany.mockResolvedValue([
            { concertId: MOCK_CONCERT_ID, action: Action.RESERVE } as any,
        ]);

        const result = await service.findAllAvailableForUser(MOCK_USER);

        expect(result[0].latestAction).toBe(Action.RESERVE);
      });
      
      it('should return latestAction: null when no logs exist for user', async () => {
        mockPrismaService.reservationLog.findMany.mockResolvedValue([]);

        const result = await service.findAllAvailableForUser(MOCK_USER);

        expect(result[0].latestAction).toBeNull(); 
      });
  });
});