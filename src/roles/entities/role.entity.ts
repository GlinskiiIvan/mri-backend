import { ApiProperty } from '@nestjs/swagger';
import { BelongsToMany, Column, DataType, DeletedAt, Model, Table, } from 'sequelize-typescript';
import { UserRoles } from 'src/intermediary-tables/user-roles.entity';
import { User } from 'src/users/entities/user.entity';

interface TableCreationAttrs {
  readonly value: string;
  readonly description: string;
}

@Table({ tableName: 'roles', paranoid: true })
export class Role extends Model<Role, TableCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Уникальный ID' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true, })
  id: number;

  @ApiProperty({ example: 'admin', description: 'Название роли' })
  @Column({ type: DataType.STRING, unique: true, })
  value: string;

  @ApiProperty({ example: 'Роль обладающая полным доступом', description: 'Описание роли', })
  @Column({ type: DataType.STRING, })
  description: string;

  @ApiProperty({ example: '2026-03-27T16:00:00.000Z', description: 'Дата удаления', required: false })
  @DeletedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: null, })
  declare deletedAt?: Date | null;

  // Связь многие ко многим с пользователями
  @BelongsToMany(() => User, () => UserRoles)
  users: User[];
}
