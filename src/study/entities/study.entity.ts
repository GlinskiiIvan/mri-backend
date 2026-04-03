import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, DeletedAt, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Modality, Status } from "src/common/enums";
import { Patient } from "src/patient/entities/patient.entity";
import { PredictionRun } from "src/prediction-run/entities/prediction-run.entity";
import { Series } from "src/series/entities/series.entity";

interface TableCreationAttrs {
    readonly patientId: number;
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

    @ApiProperty({ example: '1.2.840.113619.2.312.6945.201972.14618.1691291532.417', description: 'Уникальный ID пациента' })
    @Column({ type: DataType.STRING, unique: true, allowNull: true, defaultValue: null, })
    studyInstanceUID?: string | null;

    @ApiProperty({ example: '2345', description: 'Опциональный идентификатор исследования, присвоенный системой (Study ID)', required: false })
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
    studyId?: string | null;

    @ApiProperty({ example: 'ISO_IR 100', description: 'Кодировка символов, используемая в DICOM файле (Specific Character Set)', required: false })
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
    specificCharacterSet?: string | null;

    @ApiProperty({example: '2026-03-27T15:05:29.277+06:00', description: 'Дата и время прохождения исследования', })
    @Column({type: DataType.DATE, allowNull: true, defaultValue: null, })
    studyDateTime?: Date | null;

    @ApiProperty({ example: Modality.MR, description: 'Модальность исследования', enum: Object.values(Modality), })
    @Column({ type: DataType.ENUM(...Object.values(Modality)), allowNull: true, defaultValue: null, })
    modality?: Modality | null;

    @ApiProperty({ example: 'Представим, что это описание всего исследования.', description: 'Описание', required: false, })
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
    description?: string | null;

    @ApiProperty({ example: 'TESLA-MED', description: 'Название учреждения, где проводилось исследование (Institution Name)', required: false })
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
    institutionName?: string | null;

    @ApiProperty({ example: 'GE MEDICAL SYSTEMS', description: 'Производитель оборудования для исследования (Manufacturer)', required: false })
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
    manufacturer?: string | null;

    @ApiProperty({ example: 'Signa HDxt', description: 'Модель аппарата, использованного для исследования (Manufacturer\'s Model Name)', required: false })
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
    manufacturersModelName?: string | null;

    @ApiProperty({ example: 'GEHCGEHC', description: 'Имя станции (Station Name) или идентификатор сканера', required: false })
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
    stationName?: string | null;

    @ApiProperty({ example: '', description: 'Имя направившего врача (Referring Physician\'s Name)', required: false })
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
    referringPhysiciansName?: string | null;

    @ApiProperty({ example: Status.Processing, description: 'Статус', enum: Object.values(Status), })
    @Column({ type: DataType.ENUM(...Object.values(Status)), defaultValue: Status.Pending })
    status: Status;

    @ApiProperty({ example: '/patient_{id}/study_{id}/', description: 'Путь до директории с сериями исследования', })
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
    path?: string | null;

    @ApiProperty({ example: 5, description: 'Количество серий в исследовании', })
    @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null, })
    seriesCount?: number | null;

    @ApiProperty({ example: 5, description: 'Количество изображений в исследовании', })
    @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null, })
    imagesCount?: number | null;

    @ApiProperty({ example: 'Странные колени', description: 'Заметка', required: false, })
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
    note?: string | null;

    @ApiProperty({ example: '2026-03-27T16:00:00.000Z', description: 'Дата удаления', required: false, })
    @DeletedAt
    @Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
    declare deletedAt?: Date | null;

    // Одно исследование — много серий
    @HasMany(() => Series)
    series: Series[];

    @HasMany(() => PredictionRun)
    runs: PredictionRun[];
}

// (0020,000D) - Study Instance UID: 1.2.840.113619.2.312.6945.201972.14618.1691291532.417

// (0008,0005) - Specific Character Set: ISO_IR 100

// (0008,0020) - Study Date: 20230807
// (0008,0030) - Study Time: 142115

// (0008,0060) - Modality: MR

// (0008,0080) - Institution Name: TESLA-MED

// (0008,0070) - Manufacturer: GE MEDICAL SYSTEMS
// (0008,1090) - Manufacturer's Model Name: Signa HDxt
// (0008,1010) - Station Name: GEHCGEHC

// (0008,0090) - Referring Physician's Name: 

// (0008,1030) - Study Description: L-KNEE