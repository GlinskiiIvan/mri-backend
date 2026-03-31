import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsObject, IsString } from "class-validator";

export class CreateInstanceImageDto {
    @ApiProperty({ example: 1, description: 'Уникальный ID серии' })
    @IsNumber({}, { message: 'seriesId должен быть числом' })
    readonly seriesId: number;

    @ApiProperty({ example: '00005-dd5595a4.png', description: 'Название изображения' })
    @IsString({ message: 'imageName должно быть строкой' })
    readonly imageName: string;

    @ApiProperty({ example: 4, description: 'Последоватльный номер изображения в серии' })
    @IsNumber({}, { message: 'instanceNumber должен быть числом' })
    instanceNumber: number;

    @ApiProperty({
        example: {
            "SOP Instance UID": "1.2.840.113619.2.312.6945.201972.14618.14619.1",
            "Instance Number": "5",
            "Rows": 512,
            "Columns": 512,
            "Photometric Interpretation": "MONOCHROME2",
            "Bits Allocated": 16,
            "Bits Stored": 12,
            "High Bit": 11,
            "Pixel Representation": 0,
            "Image Position (Patient)": [0.0, 0.0, -50.0],
            "Image Orientation (Patient)": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0],
            "Slice Thickness": 5.0,
            "Pixel Spacing": [0.9765625, 0.9765625],
            "Modality": "MR"
        },
        description: 'Сырые метаданные конкретного изображения (Instance) в DICOM. Включает все ключевые теги уровня изображения, такие как позиция, ориентация, размеры и параметры пикселей.'
    })
    @IsObject({ message: 'rawMetadata должно быть объектом' })
    readonly rawMetadata: JSON;
}
