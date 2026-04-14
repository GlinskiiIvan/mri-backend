import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Modality, Status } from "src/common/enums";

export class CreateStudyDto {
    @ApiProperty({ example: 1, description: 'Уникальный ID пациента' })
    @IsNumber({}, { message: 'patientId должен быть числом' })
    readonly patientId: number;

    @ApiProperty({ example: 'Странные колени', description: 'Заметка', required: false, })
    @IsOptional()
    @IsString({ message: 'note должно быть строкой' })
    readonly note?: string;
}
