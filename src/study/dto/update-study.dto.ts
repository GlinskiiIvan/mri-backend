import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateStudyDto } from './create-study.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Status } from 'src/common/enums';

export class UpdateStudyDto extends PartialType(OmitType(CreateStudyDto, ['patientId', 'studyInstanceUID'])) {
    @ApiProperty({ example: Status.Completed, description: 'Статус обработки', enum: Object.values(Status), })
    @IsOptional()
    @IsEnum(Status, { message: `status должен быть одним из значений: ${Object.values(Status).join(', ')}` })
    readonly status: Status;
}
