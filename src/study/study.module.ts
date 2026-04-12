import { forwardRef, Module } from '@nestjs/common';
import { StudyService } from './study.service';
import { StudyController } from './study.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Study } from './entities/study.entity';
import { PatientModule } from 'src/patient/patient.module';
import { PredictionRunModule } from 'src/prediction-run/prediction-run.module';

@Module({
  controllers: [StudyController],
  providers: [StudyService],
  imports: [
    SequelizeModule.forFeature([Study]), 
    forwardRef(() => PatientModule), 
    forwardRef(() => PredictionRunModule)
  ],
  exports: [StudyService],
})
export class StudyModule {}
