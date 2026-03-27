import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { UserRoles } from 'src/intermediary-tables/user-roles.entity';
import { Role } from 'src/roles/entities/role.entity';

interface TableCreationAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
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
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: 'Example1@', description: 'Пароль пользователя' })
  @Column({ type: DataType.STRING, allowNull: false })
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
  })
  @Column({ type: DataType.STRING, allowNull: true })
  banReason?: string;

  // Связь многие ко многим с ролями
  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  // Связь один к одному с доктором
  @HasOne(() => Doctor)
  doctor?: Doctor;
}
