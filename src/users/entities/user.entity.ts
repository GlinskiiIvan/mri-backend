import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  DeletedAt,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { UserRoles } from 'src/intermediary-tables/user-roles.entity';
import { PredictionRun } from 'src/prediction-run/entities/prediction-run.entity';
import { Role } from 'src/roles/entities/role.entity';

interface TableCreationAttrs {
  readonly email: string;
  readonly password: string;
}

@Table({ tableName: 'users', paranoid: true })
export class User extends Model<User, TableCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Уникальный ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'example@mail.ru',
    description: 'Email пользователя',
  })
  @Column({ type: DataType.STRING, unique: true, })
  email: string;

  @ApiProperty({ example: 'Example1@', description: 'Пароль пользователя' })
  @Column({ type: DataType.STRING, })
  password: string;

  @ApiProperty({
    example: true,
    description: 'Поле отображающее забанен пользователь или нет',
  })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  banned: boolean;

  @ApiProperty({
    example: 'Хулиганство',
    description: 'Причина бана пользователя',
    required: false,
  })
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
  banReason?: string | null;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJicm9keWdhQG1haWwucnUiLCJiYW5uZWQiOmZhbHNlLCJyb2xlcyI6W3siaWQiOjEsInZhbHVlIjoiYWRtaW4ifV0sImlhdCI6MTc3NTIxOTcyNywiZXhwIjoxNzc1ODI0NTI3fQ.W4H5UHtLeI4OdrvZ7_RQnLew2qIbpGujSCMkcOWPDR4', description: 'Refresh токен пользователя' })
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
  refreshToken?: string | null;

  @ApiProperty({ example: '2026-03-27T16:00:00.000Z', description: 'Дата удаления', required: false })
  @DeletedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: null, })
  declare deletedAt?: Date | null;

  // Связь многие ко многим с ролями
  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  // Связь один к одному с доктором
  @HasOne(() => Doctor)
  doctor?: Doctor;

  // Связь один к одному с доктором
  @HasMany(() => PredictionRun)
  runs?: PredictionRun[];
}
