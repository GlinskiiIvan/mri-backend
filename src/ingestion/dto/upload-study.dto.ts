import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UploadStudyDto {
    @ApiProperty({ example: 1, description: 'Уникальный ID пациента' })
    @Type(() => Number)
    @IsNumber({}, { message: 'patientId должен быть числом' })
    readonly patientId: number;

    @ApiProperty({ example: 'Странные колени', description: 'Заметка', required: false, })
    @IsOptional()
    @IsString({ message: 'note должно быть строкой' })
    readonly note?: string;
}