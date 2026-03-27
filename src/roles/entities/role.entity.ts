import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserRoles } from 'src/intermediary-tables/user-roles.entity';
import { User } from 'src/users/entities/user.entity';

interface TableCreationAttrs {
  value: string;
  description: string;
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, TableCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Уникальный ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'admin', description: 'Название роли' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  value: string;

  @ApiProperty({
    example: 'Роль обладающая полным доступом',
    description: 'Описание роли',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  // Связь многие ко многим с пользователями
  @BelongsToMany(() => User, () => UserRoles)
  users: User[];
}
