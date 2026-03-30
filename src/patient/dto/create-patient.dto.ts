import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsEnum, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { Gender } from "src/common/enums";

export class CreatePatientDto {
    @ApiProperty({ example: 1, description: 'Уникальный ID доктора' })
    @IsNumber({}, { message: 'doctorId должен быть числом' })
    readonly doctorId: number;

    @ApiProperty({ example: 'Глинский Иван Николаевич', description: 'Полное имя', })
    @IsString({ message: 'fullName должно быть строкой' })
    readonly fullName: string;

    @ApiProperty({ example: '1894-10-04', description: 'Дата рождения' })
    @IsDateString( {}, { message: 'birthDate должна быть корректной датой в формате YYYY-MM-DD' }, )
    readonly birthDate: string;

    @ApiProperty({ example: 'male', description: 'Пол', enum: Object.values(Gender), })
    @IsEnum(Gender, { message: `gender должен быть одним из значений: ${Object.values(Gender).join(', ')}` })
    readonly gender: Gender;

    @ApiProperty({ example: '+77714563464', description: 'Номер телефона' })
    @IsPhoneNumber('KZ', { message: 'phone должен быть корректным номером телефона Казахстана, например +77001234567' })
    readonly phone: string;

    @ApiProperty({ example: 'doctor@mail.ru', description: 'Email для связи', required: false, })
    @IsOptional()
    @IsEmail({}, { message: 'email должен быть корректным адресом электронной почты' })
    readonly email?: string;

    @ApiProperty({ example: 'Странные колени', description: 'Заметка', required: false, })
    @IsOptional()
    @IsString({ message: 'note должно быть строкой' })
    readonly note?: string;
}
