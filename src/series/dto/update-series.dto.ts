import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateSeriesDto } from './create-series.dto';
import { Status } from 'src/common/enums';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateSeriesDto extends PartialType(OmitType(CreateSeriesDto, ['studyId'])) {
    @ApiProperty({ example: Status.Pending, description: 'Статус обработки', enum: Object.values(Status), })
    @IsOptional()
    @IsEnum(Status, { message: `status должен быть одним из значений: ${Object.values(Status).join(', ')}` })
    readonly status: Status;
}
