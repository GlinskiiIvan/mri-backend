import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Gender } from 'src/common/enums';

export class CreateDoctorDto {
  @ApiProperty({ example: 1, description: 'Уникальный ID пользователя' })
  @IsNumber({}, { message: 'Должно быть числом' })
  readonly userId: number;

  @ApiProperty({
    example: 'Глинский Иван Николаевич',
    description: 'Полное имя',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly fullName: string;

  @ApiProperty({ example: '1894-10-04', description: 'Дата рождения' })
  @IsDateString(
    {},
    { message: 'Должно быть корректной датой в формате YYYY-MM-DD' },
  )
  readonly birthDate: string;

  @ApiProperty({
    example: 'male',
    description: 'Пол',
    enum: ['male', 'female'],
  })
  @IsEnum(Gender, { message: 'Должно быть одним из опредленных значений' })
  readonly gender: Gender;

  @ApiProperty({ example: '+77714563464', description: 'Номер телефона' })
  @IsPhoneNumber('KZ', { message: 'Некорректный номер телефона' })
  readonly phone: string;

  @ApiProperty({
    example: 'doctor@mail.ru',
    description: 'Email для связи',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Некорректный email' })
  readonly contactEmail?: string;

  @ApiProperty({ example: 'Ортопедия', description: 'Специализация' })
  @IsString({ message: 'Должно быть строкой' })
  readonly specialization: string;

  @ApiProperty({ example: 'Хирургическое', description: 'Отделение' })
  @IsString({ message: 'Должно быть строкой' })
  readonly department: string;

  @ApiProperty({
    example: 'KN-202345',
    description: 'Номер лицензии',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  readonly licenseNumber?: string;

  @ApiProperty({
    example: 'Опыт работы 10 лет, специализация на коленных операциях',
    description: 'Заметка',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  readonly note?: string;
}
