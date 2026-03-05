import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorService } from './sector.service';
import { SectorController } from './sector.controller';
import { Sector } from './entities/sector.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sector])],
  controllers: [SectorController],
  providers: [SectorService],
  exports: [SectorService],
})
export class SectorModule {}
