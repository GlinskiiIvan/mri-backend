import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Gender } from 'src/common/enums';
import { Patient } from 'src/patient/entities/patient.entity';
import { User } from 'src/users/entities/user.entity';

interface TableCreationAttrs {
  readonly userId: number;
  readonly fullName: string;
  readonly birthDate: Date;
  readonly gender: Gender;
  readonly phone: string;
  readonly contactEmail?: string;
  readonly specialization: string;
  readonly department: string;
  readonly licenseNumber?: string;
  readonly note?: string;
}

@Table({ tableName: 'doctor', paranoid: true })
export class Doctor extends Model<Doctor, TableCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Уникальный ID доктора' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  // Внешний ключ укзаывающий на пользователя
  @ApiProperty({ example: 1, description: 'Уникальный ID пользователя' })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    unique: true,
  })
  userId: number;

  // Связь один к одному с пользователем
  @BelongsTo(() => User)
  user: User;

  @ApiProperty({
    example: 'Глинский Иван Николаевич',
    description: 'Полное имя',
  })
  @Column({ type: DataType.STRING, })
  fullName: string;

  @ApiProperty({ example: '1894-10-04', description: 'Дата рождения' })
  @Column({ type: DataType.DATEONLY, })
  birthDate: Date;

  @ApiProperty({
    example: Gender.Male,
    description: 'Пол',
    enum: Object.values(Gender),
  })
  @Column({ type: DataType.ENUM(...Object.values(Gender)), })
  gender: Gender;

  @ApiProperty({ example: '+77714563464', description: 'Номер телефона' })
  @Column({ type: DataType.STRING, })
  phone: string;

  @ApiProperty({
    example: 'doctor@mail.ru',
    description: 'Email для связи',
    required: false,
  })
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
  contactEmail?: string | null;

  @ApiProperty({ example: 'Ортопедия', description: 'Специализация' })
  @Column({ type: DataType.STRING, })
  specialization: string;

  @ApiProperty({ example: 'Хирургическое', description: 'Отделение' })
  @Column({ type: DataType.STRING, })
  department: string;

  @ApiProperty({
    example: 'KN-202345',
    description: 'Номер лицензии',
    required: false,
  })
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
  licenseNumber?: string | null;

  @ApiProperty({
    example: 'Опыт работы 10 лет, специализация на коленных операциях',
    description: 'Заметка',
    required: false,
  })
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
  note?: string | null;

  @ApiProperty({
    example: '2026-03-27T16:00:00.000Z',
    description: 'Дата удаления',
    required: false,
  })
  @DeletedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: null, })
  declare deletedAt?: Date | null;

  // Один доктор — много пациентов
  @HasMany(() => Patient)
  patients: Patient[];
}
