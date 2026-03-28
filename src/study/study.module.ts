import { Module } from '@nestjs/common';
import { StudyService } from './study.service';
import { StudyController } from './study.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Study } from './entities/study.entity';
import { PatientModule } from 'src/patient/patient.module';

@Module({
  controllers: [StudyController],
  providers: [StudyService],
  imports: [SequelizeModule.forFeature([Study]), PatientModule],
  exports: [StudyService],
})
export class StudyModule {}
