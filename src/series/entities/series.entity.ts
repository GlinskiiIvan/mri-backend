import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, DeletedAt, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Modality, Orientation, Protocol, Status } from "src/common/enums";
import { InstanceImage } from "src/instance-image/entities/instance-image.entity";
import { PredictionRun } from "src/prediction-run/entities/prediction-run.entity";
import { Study } from "src/study/entities/study.entity";

interface TableCreationAttrs {
    readonly studyId: number;
    readonly seriesNumber: string;
    readonly modality: Modality;
    readonly protocol: Protocol;
    readonly orientation?: Orientation;
    readonly imagesCount: number;
    readonly rawMetadata: JSON;
    readonly path: string;
    readonly description?: string;
}
@Table({ tableName: 'series', paranoid: true })
export class Series extends Model<Series, TableCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Уникальный ID серии' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true, })
    id: number;

    // Внешний ключ укзаывающий на исследование
    @ApiProperty({ example: 1, description: 'Уникальный ID исследования' })
    @ForeignKey(() => Study)
    @Column({ type: DataType.INTEGER, })
    studyId: number;

    // alias для исследования
    @BelongsTo(() => Study)
    study: Study;

    @ApiProperty({ example: 'SE000007', description: 'Номер серии' })
    @Column({ type: DataType.STRING, })
    seriesNumber: string;

    @ApiProperty({ example: Modality.MR, description: 'Модальность серии', enum: Object.values(Modality), })
    @Column({ type: DataType.ENUM(...Object.values(Modality)), })
    modality: Modality;

    @ApiProperty({ example: Protocol.PD, description: 'Протокол серии', enum: Object.values(Protocol), required: false, })
    @Column({ type: DataType.ENUM(...Object.values(Protocol)), allowNull: true, defaultValue: null, })
    protocol?: Protocol | null;
    
    @ApiProperty({ example: Orientation.Sagittal, description: 'Ориентация серии', enum: Object.values(Orientation), required: false, })
    @Column({ type: DataType.ENUM(...Object.values(Orientation)), allowNull: true, defaultValue: null, })
    orientation?: Orientation | null;

    @ApiProperty({ example: 13, description: 'Количество снимков в серии', })
    @Column({ type: DataType.INTEGER, })
    imagesCount: number;

    @ApiProperty({
        example: {
            studyInstanceUID: "1.2.840.113619.2.55.3.604688433.1234.1678901234.567",
            seriesCount: 3,
            imagesCount: 120,
            modality: "MR",
            bodyPartExamined: "KNEE",
            manufacturer: "Siemens",
        },
        description: 'Сырые метаданные серии (например, данные из DICOM: UID исследования, количество снимков, модальность, область исследования и оборудование)',
    })
    @Column({ type: DataType.JSONB, })
    rawMetadata: JSON;

    @ApiProperty({ example: '/patient_{id}/study_{id}/series_{id}', description: 'Путь до директории со снимками серии', })
    @Column({ type: DataType.STRING, })
    path: string;

    @ApiProperty({ example: Status.Pending, description: 'Статус обработки', enum: Object.values(Status), })
    @Column({ type: DataType.ENUM(...Object.values(Status)), defaultValue: Status.Pending })
    status: Status;

    @ApiProperty({ example: 'Представим, что это описание всего исследования.', description: 'Описание', required: false, })
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
    description?: string | null;

    @ApiProperty({ example: '2026-03-27T16:00:00.000Z', description: 'Дата удаления', required: false, })
    @DeletedAt
    @Column({ type: DataType.DATE, allowNull: true, defaultValue: null, })
    declare deletedAt?: Date | null;

    @HasMany(() => PredictionRun)
    runs: PredictionRun[];

    @HasMany(() => InstanceImage)
    images: InstanceImage[];
}
