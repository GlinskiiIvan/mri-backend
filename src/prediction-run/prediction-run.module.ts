import { Module } from '@nestjs/common';
import { PredictionRunService } from './prediction-run.service';
import { PredictionRunController } from './prediction-run.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PredictionRun } from './entities/prediction-run.entity';
import { SeriesModule } from 'src/series/series.module';
import { DoctorModule } from 'src/doctor/doctor.module';

@Module({
  controllers: [PredictionRunController],
  providers: [PredictionRunService],
  imports: [SequelizeModule.forFeature([PredictionRun]), SeriesModule, DoctorModule],
  exports: [PredictionRunService],
})
export class PredictionRunModule {}
