import { forwardRef, Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Patient } from './entities/patient.entity';
import { DoctorModule } from 'src/doctor/doctor.module';
import { StudyModule } from 'src/study/study.module';

@Module({
  controllers: [PatientController],
  providers: [PatientService],
  imports: [
    SequelizeModule.forFeature([Patient]), 
    forwardRef(() => StudyModule),
    DoctorModule,
  ],
  exports: [PatientService],
})
export class PatientModule {}
