import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, DeletedAt, ForeignKey, Model, Table } from "sequelize-typescript";
import { Gender } from "src/common/enums";
import { Doctor } from "src/doctor/entities/doctor.entity";

interface TableCreationAttrs {
    doctorId: number;
    fullName: string;
    birthDate: Date;
    gender: Gender;
    phone: string;
    email?: string;
    note?: string;
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
    @Column({ type: DataType.STRING, allowNull: false })
    fullName: string;

    @ApiProperty({ example: '1894-10-04', description: 'Дата рождения' })
    @Column({ type: DataType.DATEONLY, allowNull: false })
    birthDate: Date;

    @ApiProperty({ example: 'male', description: 'Пол', enum: Object.values(Gender), })
    @Column({ type: DataType.ENUM(...Object.values(Gender)), allowNull: false })
    gender: Gender;

    @ApiProperty({ example: '+77714563464', description: 'Номер телефона' })
    @Column({ type: DataType.STRING, allowNull: false, })
    phone: string;

    @ApiProperty({ example: 'doctor@mail.ru', description: 'Email для связи', required: false, })
    @Column({ type: DataType.STRING, allowNull: false, })
    email?: string;

    @ApiProperty({ example: 'Странные колени', description: 'Заметка', required: false, })
    @Column({ type: DataType.STRING, allowNull: false })
    note?: string;

    @ApiProperty({ example: '2026-03-27T16:00:00.000Z', description: 'Дата удаления', })
    @DeletedAt
    @Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
    declare deletedAt: Date | null;
}
