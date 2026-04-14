import { forwardRef, Module } from '@nestjs/common';
import { PredictionRunService } from './prediction-run.service';
import { PredictionRunController } from './prediction-run.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PredictionRun } from './entities/prediction-run.entity';
import { DoctorModule } from 'src/doctor/doctor.module';
import { StudyModule } from 'src/study/study.module';
import { PredictionModule } from 'src/prediction/prediction.module';

@Module({
  controllers: [PredictionRunController],
  providers: [PredictionRunService],
  imports: [
    SequelizeModule.forFeature([PredictionRun]), 
    forwardRef(() => StudyModule), 
    forwardRef(() => PredictionModule), 
    DoctorModule,
  ],
  exports: [PredictionRunService],
})
export class PredictionRunModule {}
