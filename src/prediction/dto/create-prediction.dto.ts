import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsEnum, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { ResultClass } from "src/common/enums";
import { BBox } from "src/types";

export class CreatePredictionDto {
    @ApiProperty({ example: 1, description: 'Уникальный ID запуска' })
    @IsNumber({}, { message: 'runId должен быть числом' })
    readonly runId: number;

    @ApiProperty({ example: 1, description: 'Уникальный ID изображения' })
    @IsNumber({}, { message: 'imageId должен быть числом' })
    readonly imageId: number;
}
