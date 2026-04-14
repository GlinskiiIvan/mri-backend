import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, DeletedAt, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Modality, Orientation, Protocol, Status } from "src/common/enums";
import { InstanceImage } from "src/instance-image/entities/instance-image.entity";
import { Study } from "src/study/entities/study.entity";

interface TableCreationAttrs {
    readonly studyId: number;
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

    @ApiProperty({ example: 'SE000007', description: 'Номер серии', required: false, })
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
    seriesNumber?: string | null;

    @ApiProperty({ example: Modality.MR, description: 'Модальность серии', enum: Object.values(Modality), required: false, })
    @Column({ type: DataType.ENUM(...Object.values(Modality)), allowNull: true, defaultValue: null, })
    modality?: Modality | null;

    @ApiProperty({ example: Protocol.PD, description: 'Протокол серии', enum: Object.values(Protocol), required: false, })
    @Column({ type: DataType.ENUM(...Object.values(Protocol)), allowNull: true, defaultValue: null, })
    protocol?: Protocol | null;
    
    @ApiProperty({ example: Orientation.Sagittal, description: 'Ориентация серии', enum: Object.values(Orientation), required: false, })
    @Column({ type: DataType.ENUM(...Object.values(Orientation)), allowNull: true, defaultValue: null, })
    orientation?: Orientation | null;

    @ApiProperty({ example: 13, description: 'Количество снимков в серии', required: false, })
    @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null, })
    imagesCount?: number | null;

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
        required: false,
    })
    @Column({ type: DataType.JSONB, allowNull: true, defaultValue: null, })
    rawMetadata?: JSON | null;

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

    @HasMany(() => InstanceImage)
    images: InstanceImage[];
}
