import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, DeletedAt, ForeignKey, Model, Table } from "sequelize-typescript";
import { ResultClass, Status } from "src/common/enums";
import { InstanceImage } from "src/instance-image/entities/instance-image.entity";
import { PredictionRun } from "src/prediction-run/entities/prediction-run.entity";
import { BBox } from "src/types";

interface TableCreationAttrs {
    readonly runId: number;
    readonly imageId: number;
}

@Table({ tableName: 'prediction', paranoid: true })
export class Prediction extends Model<Prediction, TableCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Уникальный ID предсказания' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true, })
    id: number;

    // Внешний ключ укзаывающий на запуск
    @ApiProperty({ example: 1, description: 'Уникальный ID запуска' })
    @ForeignKey(() => PredictionRun)
    @Column({ type: DataType.INTEGER, })
    runId: number;

    // alias для запуска
    @BelongsTo(() => PredictionRun)
    run: PredictionRun;

    // Внешний ключ укзаывающий на изображение
    @ApiProperty({ example: 1, description: 'Уникальный ID изображения' })
    @ForeignKey(() => InstanceImage)
    @Column({ type: DataType.INTEGER, })
    imageId: number;

    // alias для изображения
    @BelongsTo(() => InstanceImage)
    image: InstanceImage;

    @ApiProperty({ example: Status.Pending, description: 'Статус обработки', enum: Object.values(Status), })
    @Column({ type: DataType.ENUM(...Object.values(Status)), defaultValue: Status.Pending })
    status: Status;

    @ApiProperty({ example: ResultClass.Tear, description: 'Класс', enum: Object.values(ResultClass), required: false, })
    @Column({ type: DataType.ENUM(...Object.values(ResultClass)), allowNull: true, defaultValue: null, })
    resultClass?: ResultClass | null;

    @ApiProperty({ example: 0.97, description: 'Максимальная точность', required: false, })
    @Column({ type: DataType.FLOAT, allowNull: true, defaultValue: null, })
    maxConfidence?: number | null;

    @ApiProperty({ example: 0.89, description: 'Минимальная точность', required: false, })
    @Column({ type: DataType.FLOAT, allowNull: true, defaultValue: null, })
    minConfidence?: number | null;

    @ApiProperty({ example: 89, description: 'Время выполнения в ms', required: false, })
    @Column({ type: DataType.BIGINT, allowNull: true, defaultValue: null, })
    executionTime?: number | null;

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
        required: false,
    })
    @Column({ type: DataType.JSONB, allowNull: true, defaultValue: null, })
    rawOutput?: JSON[] | null;

    @ApiProperty({ example: '2026-03-27T16:00:00.000Z', description: 'Дата удаления', required: false, })
    @DeletedAt
    @Column({ type: DataType.DATE, allowNull: true, defaultValue: null, })
    declare deletedAt?: Date | null;
}
