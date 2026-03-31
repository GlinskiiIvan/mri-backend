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

    @ApiProperty({ example: ResultClass.Tear, description: 'Класс', enum: Object.values(ResultClass), })
    @IsEnum(ResultClass, { message: `resultClass должн быть одним из значений: ${Object.values(ResultClass).join(', ')}` })
    readonly resultClass: ResultClass;

    @ApiProperty({ example: 0.97, description: 'Максимальная точность', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'maxConfidence должна быть числом' })
    readonly maxConfidence?: number;

    @ApiProperty({ example: 0.89, description: 'Минимальная точность', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'minConfidence должна быть числом' })
    readonly minConfidence?: number;

    @ApiProperty({
        example: [
            {
                class: ResultClass.Normal,
                confidence: 0.97,
                bbox: {x: 0.32, y: 0.47, width: 0.15, height: 0.12} as BBox,
            },
            {
                class: ResultClass.Tear,
                confidence: 0.95,
                bbox: {x: 0.49, y: 0.50, width: 0.12, height: 0.10} as BBox,
            }
        ],
        description: 'Результаты работы модели. Поле является универсальным и может содержать произвольную JSON-структуру в зависимости от используемой модели (например, bounding boxes, сегментации, ключевые точки и др.). Конкретный формат определяется типом модели и её версией. В данном примере bbox представлен в формате { x: number; y: number; width: number; height: number; } в нормализованных координатах (0–1).',
        type: 'array',
    })
    @IsArray({ message: 'rawOutput должно быть массивом' })
    readonly rawOutput: JSON[];
}
