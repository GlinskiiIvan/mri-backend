import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Первый пост', description: 'Заголовок поста' })
  @IsString({ message: 'Должно быть строкой' })
  readonly title: string;

  @ApiProperty({
    example: 'Это мой первый пост',
    description: 'Содержимое поста',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly content: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Изображение поста (загружается как файл)',
  })
  readonly image: any;
}
