import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreatePredictionDto } from './create-prediction.dto';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Status } from 'src/common/enums';

export class UpdatePredictionDto extends PartialType(OmitType(CreatePredictionDto, ['runId', 'imageId'])) {
    @ApiProperty({ example: Status.Pending, description: 'Статус обработки', enum: Object.values(Status), required: false, })
    @IsOptional()
    @IsEnum(Status, { message: `status должен быть одним из значений: ${Object.values(Status).join(', ')}` })
    readonly status?: Status;
}
