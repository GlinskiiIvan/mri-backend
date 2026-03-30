import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Modality, Status } from "src/common/enums";

export class CreateStudyDto {
    @ApiProperty({ example: 1, description: 'Уникальный ID пациента' })
    @IsNumber({}, { message: 'patientId должен быть числом' })
    readonly patientId: number;
    
    @ApiProperty({ example: '2026-03-27T15:05:29.277+06:00', description: 'Дата и время прохождения исследования в формате ISO 8601' })
    @IsDateString({}, { message: 'studyDate должна быть корректной датой в формате ISO 8601 (например, 2026-03-27T15:05:29.277+06:00)', })
    readonly studyDate: string;

    @ApiProperty({ example: Modality.MR, description: 'Модальность исследования', enum: Object.values(Modality), })
    @IsEnum(Modality, { message: `modality должна быть одним из значений: ${Object.values(Modality).join(', ')}` })
    readonly modality: Modality;

    @ApiProperty({ example: 'Представим, что это описание всего исследования.', description: 'Описание', required: false, })
    @IsOptional()
    @IsString({ message: 'description должно быть строкой' })
    readonly description?: string;

    @ApiProperty({ example: 'Странные колени', description: 'Заметка', required: false, })
    @IsOptional()
    @IsString({ message: 'note должно быть строкой' })
    readonly note?: string;
}
