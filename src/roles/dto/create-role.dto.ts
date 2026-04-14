import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: 'Название роли' })
  @IsString({ message: 'Должно быть строкой' })
  readonly value: string;

  @ApiProperty({ example: 'Роль обладающая полным доступом', description: 'Описание роли', })
  @IsString({ message: 'Должно быть строкой' })
  readonly description: string;
}
