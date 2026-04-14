import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({ 
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJicm9keWdhQG1haWwucnUiLCJiYW5uZWQiOmZhbHNlLCJyb2xlcyI6W3siaWQiOjEsInZhbHVlIjoiYWRtaW4ifV0sImlhdCI6MTc3NTIxOTcyNywiZXhwIjoxNzc1ODI0NTI3fQ.W4H5UHtLeI4OdrvZ7_RQnLew2qIbpGujSCMkcOWPDR4', 
        description: 'Refresh токен пользователя', required: false,
     })
    @IsOptional()
    @IsString({ message: 'refreshToken должен быть строкой' })
    refreshToken?: string | null;
}
