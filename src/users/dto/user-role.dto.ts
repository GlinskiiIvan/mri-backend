import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UserRoleDto {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  @IsNumber({}, { message: 'Должно быть числом' })
  readonly userId: number;

  @ApiProperty({ example: 3, description: 'ID роли' })
  @IsNumber({}, { message: 'Должно быть числом' })
  readonly roleId: number;
}
