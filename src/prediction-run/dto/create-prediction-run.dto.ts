import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsString } from "class-validator";

export class CreatePredictionRunDto {
    @ApiProperty({ example: 1, description: 'Уникальный ID исследования' })
    @IsNumber({}, { message: 'studyId должен быть числом' })
    readonly studyId: number;

    @ApiProperty({ example: 1, description: 'Уникальный ID того кто запустил предсказание' })
    @IsNumber({}, { message: 'createdById должен быть числом' })
    readonly createdById: number;

    @ApiProperty({ example: 'YOLO', description: 'Модель' })
    @IsString({ message: 'model должна быть строкой' })
    readonly model: string;

    @ApiProperty({ example: '8l', description: 'Версия' })
    @IsString({ message: 'version должна быть строкой' })
    readonly version: string;
}
