import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Gender } from 'src/common/enums';
import { User } from 'src/users/entities/user.entity';

interface TableCreationAttrs {
  userId: number;
  fullName: string;
  birthDate: Date;
  gender: Gender;
  phone: string;
  contactEmail?: string;
  specialization: string;
  department: string;
  licenseNumber?: string;
  note?: string;
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
  @Column({ type: DataType.STRING, allowNull: false })
  fullName: string;

  @ApiProperty({ example: '1894-10-04', description: 'Дата рождения' })
  @Column({ type: DataType.DATEONLY, allowNull: false })
  birthDate: Date;

  @ApiProperty({
    example: 'male',
    description: 'Пол',
    enum: ['male', 'female'],
  })
  @Column({ type: DataType.ENUM(...Object.values(Gender)), allowNull: false })
  gender: Gender;

  @ApiProperty({ example: '+77714563464', description: 'Номер телефона' })
  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  @ApiProperty({
    example: 'doctor@mail.ru',
    description: 'Email для связи',
    required: false,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  contactEmail?: string;

  @ApiProperty({ example: 'Ортопедия', description: 'Специализация' })
  @Column({ type: DataType.STRING, allowNull: false })
  specialization: string;

  @ApiProperty({ example: 'Хирургическое', description: 'Отделение' })
  @Column({ type: DataType.STRING, allowNull: false })
  department: string;

  @ApiProperty({
    example: 'KN-202345',
    description: 'Номер лицензии',
    required: false,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  licenseNumber?: string;

  @ApiProperty({
    example: 'Опыт работы 10 лет, специализация на коленных операциях',
    description: 'Заметка',
    required: false,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  note?: string;

  @ApiProperty({
    example: '2026-03-27T16:00:00.000Z',
    description: 'Дата удаления',
    required: false,
  })
  @DeletedAt
  @Column({ type: DataType.DATE, allowNull: true })
  declare deletedAt?: Date | null;
}
