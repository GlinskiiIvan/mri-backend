import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { Modality, Orientation, Protocol } from "src/common/enums";

export class CreateSeriesDto {
    @ApiProperty({ example: 1, description: 'Уникальный ID исследования' })
    @IsNumber({}, { message: 'studyId должен быть числом' })
    readonly studyId: number;
}
