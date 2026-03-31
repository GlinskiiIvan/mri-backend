import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateInstanceImageDto } from './create-instance-image.dto';

export class UpdateInstanceImageDto extends PartialType(OmitType(CreateInstanceImageDto, ['seriesId'])) {}
