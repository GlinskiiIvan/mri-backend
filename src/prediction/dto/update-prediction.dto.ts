import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreatePredictionDto } from './create-prediction.dto';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Status } from 'src/common/enums';

export class UpdatePredictionDto extends PartialType(OmitType(CreatePredictionDto, ['runId'])) {
    @ApiProperty({ example: '2026-03-27T16:00:01.000Z', description: 'Дата завершения', })
    @IsOptional()
    @IsDateString({}, { message: 'finishedAt должна быть корректной датой в формате ISO 8601 (например, 2026-03-27T15:05:29.277+06:00)', })
    readonly finishedAt?: string;

    @ApiProperty({ example: Status.Pending, description: 'Статус обработки', enum: Object.values(Status), })
    @IsOptional()
    @IsEnum(Status, { message: `status должен быть одним из значений: ${Object.values(Status).join(', ')}` })
    readonly status: Status;
}
