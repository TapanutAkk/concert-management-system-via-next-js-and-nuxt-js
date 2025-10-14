import { Module } from '@nestjs/common';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [ConcertsController],
  providers: [ConcertsService, PrismaService],
  exports: [ConcertsService],
})
export class ConcertsModule {}