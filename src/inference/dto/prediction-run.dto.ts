import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class PredictionRunDto {
    @ApiProperty({ example: 'YOLO-bbox', description: 'ИИ модель', })
    @IsString({ message: 'model должна быть строкой' })
    readonly model: string;

    @ApiProperty({ example: '8x', description: 'Версия модели', })
    @IsString({ message: 'version должна быть строкой' })
    readonly version: string;
}