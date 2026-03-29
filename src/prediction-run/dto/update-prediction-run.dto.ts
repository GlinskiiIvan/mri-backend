import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePredictionRunDto } from './create-prediction-run.dto';

export class UpdatePredictionRunDto extends PartialType(OmitType(CreatePredictionRunDto, ['seriesId', 'createdById'])) {}
