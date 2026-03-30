import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, DeletedAt, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Modality, Status } from "src/common/enums";
import { Patient } from "src/patient/entities/patient.entity";
import { Series } from "src/series/entities/series.entity";

interface TableCreationAttrs {
    readonly patientId: number;
    readonly studyDate: Date;
    readonly modality: Modality;
    readonly description?: string;
    readonly status: Status;
    readonly path: string;
    readonly note?: string;
}

@Table({ tableName: 'study', paranoid: true })
export class Study extends Model<Study, TableCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Уникальный ID исследования' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true, })
    id: number;

    // Внешний ключ укзаывающий на пациента
    @ApiProperty({ example: 1, description: 'Уникальный ID пациента' })
    @ForeignKey(() => Patient)
    @Column({ type: DataType.INTEGER, })
    patientId: number;

    // alias для пациента
    @BelongsTo(() => Patient)
    patient: Patient;

    @ApiProperty({ example: '2026-03-27 15:05:29.277 +0600', description: 'Дата прохождения исследования' })
    @Column({ type: DataType.DATE, })
    studyDate: Date;

    @ApiProperty({ example: Modality.MR, description: 'Модальность исследования', enum: Object.values(Modality), })
    @Column({ type: DataType.ENUM(...Object.values(Modality)), })
    modality: Modality;

    @ApiProperty({ example: 'Представим, что это описание всего исследования.', description: 'Описание', required: false, })
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
    description?: string | null;

    @ApiProperty({ example: Status.Completed, description: 'Статус', enum: Object.values(Status), })
    @Column({ type: DataType.ENUM(...Object.values(Status)), defaultValue: Status.Pending })
    status: Status;

    @ApiProperty({ example: '/patient_{id}/study_{id}/', description: 'Путь до директории с сериями исследования', })
    @Column({ type: DataType.STRING, })
    path: string;

    @ApiProperty({ example: 'Странные колени', description: 'Заметка', required: false, })
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
    note?: string | null;

    @ApiProperty({ example: '2026-03-27T16:00:00.000Z', description: 'Дата удаления', })
    @DeletedAt
    @Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
    declare deletedAt?: Date | null;

    // Одно исследование — много серий
    @HasMany(() => Series)
    series: Series[];
}
