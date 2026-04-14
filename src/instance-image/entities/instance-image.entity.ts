import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, DeletedAt, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Prediction } from "src/prediction/entities/prediction.entity";
import { Series } from "src/series/entities/series.entity";

interface TableCreationAttrs {
    readonly seriesId: number;
    readonly imageName: string;
    readonly instanceNumber: number;
    readonly rawMetadata: JSON;
}

@Table({ tableName: 'instance_image', paranoid: true })
export class InstanceImage extends Model<InstanceImage, TableCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Уникальный ID изображения' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true, })
    id: number;

    // Внешний ключ укзаывающий на серию
    @ApiProperty({ example: 1, description: 'Уникальный ID серии' })
    @ForeignKey(() => Series)
    @Column({ type: DataType.INTEGER, })
    seriesId: number;

    // alias для серии
    @BelongsTo(() => Series)
    series: Series;

    @ApiProperty({ example: '00005-dd5595a4.png', description: 'Название изображения' })
    @Column({ type: DataType.STRING })
    imageName: string;

    @ApiProperty({ example: '/patient_{id}/study_{id}/series_{id}/00005-dd5595a4.png', description: 'Путь до изображения' })
    @Column({ type: DataType.STRING, unique: true })
    imagePath: string;

    @ApiProperty({ example: 4, description: 'Последоватльный номер изображения в серии' })
    @Column({ type: DataType.INTEGER, })
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
    @Column({ type: DataType.JSONB, })
    rawMetadata: JSON;

    @ApiProperty({ example: '2026-03-27T16:00:00.000Z', description: 'Дата удаления', required: false, })
    @DeletedAt
    @Column({ type: DataType.DATE, allowNull: true, defaultValue: null, })
    declare deletedAt?: Date | null;

    // alias для предсказаний
    @HasMany(() => Prediction)
    predictions: Prediction[];
}

// (0020,0013) - Instance Number: 4