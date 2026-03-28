import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateStudyDto } from './create-study.dto';

export class UpdateStudyDto extends PartialType(OmitType(CreateStudyDto, ['patientId'])) {}
