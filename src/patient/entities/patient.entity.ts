import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, DeletedAt, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Gender } from "src/common/enums";
import { Doctor } from "src/doctor/entities/doctor.entity";
import { Study } from "src/study/entities/study.entity";

interface TableCreationAttrs {
    readonly doctorId: number;
    readonly fullName: string;
    readonly birthDate: Date;
    readonly gender: Gender;
    readonly phone: string;
    readonly email?: string;
    readonly note?: string;
}

@Table({ tableName: 'patient', paranoid: true })
export class Patient extends Model<Patient, TableCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Уникальный ID пациента' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true, })
    id: number;

    // Внешний ключ укзаывающий на доктора
    @ApiProperty({ example: 1, description: 'Уникальный ID доктора' })
    @ForeignKey(() => Doctor)
    @Column({ type: DataType.INTEGER, })
    doctorId: number;

    // Связь один ко многим с доктором
    @BelongsTo(() => Doctor)
    doctor: Doctor;

    @ApiProperty({ example: false, description: 'Флаг публичности' })
    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    isPublic: boolean;

    @ApiProperty({ example: 'Глинский Иван Николаевич', description: 'Полное имя', })
    @Column({ type: DataType.STRING, })
    fullName: string;

    @ApiProperty({ example: '1894-10-04', description: 'Дата рождения' })
    @Column({ type: DataType.DATEONLY, })
    birthDate: Date;

    @ApiProperty({ example: 'male', description: 'Пол', enum: Object.values(Gender), })
    @Column({ type: DataType.ENUM(...Object.values(Gender)), })
    gender: Gender;

    @ApiProperty({ example: '+77714563464', description: 'Номер телефона' })
    @Column({ type: DataType.STRING, })
    phone: string;

    @ApiProperty({ example: 'doctor@mail.ru', description: 'Email для связи', required: false, })
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
    email?: string | null;

    @ApiProperty({ example: 'Странные колени', description: 'Заметка', required: false, })
    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
    note?: string | null;

    @ApiProperty({ example: '2026-03-27T16:00:00.000Z', description: 'Дата удаления', required: false, })
    @DeletedAt
    @Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
    declare deletedAt?: Date | null;

    // Один пациент - много исследований
    @HasMany(() => Study)
    studies: Study[];
}
