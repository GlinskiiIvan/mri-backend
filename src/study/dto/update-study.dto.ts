import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateStudyDto } from './create-study.dto';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Modality, Status } from 'src/common/enums';

export class UpdateStudyDto extends PartialType(OmitType(CreateStudyDto, ['patientId'])) {
    @ApiProperty({ example: '1.2.840.113619.2.312.6945.201972.14618.1691291532.417', description: 'Уникальный ID пациента', required: false })
    @IsOptional()
    @IsString({ message: 'studyInstanceUID должно быть строкой' })
    readonly studyInstanceUID?: string | null;

    @ApiProperty({ example: '2345', description: 'Опциональный идентификатор исследования, присвоенный системой (Study ID)', required: false })
    @IsOptional()
    @IsString({ message: 'studyId должно быть строкой' })
    readonly studyId?: string | null;

    @ApiProperty({ example: 'ISO_IR 100', description: 'Кодировка символов, используемая в DICOM файле (Specific Character Set)', required: false })
    @IsOptional()
    @IsString({ message: 'specificCharacterSet должно быть строкой' })
    readonly specificCharacterSet?: string | null;

    @ApiProperty({example: '2026-03-27T15:05:29.277+06:00', description: 'Дата и время прохождения исследования', required: false })
    @IsOptional()
    @IsDateString({}, { message: 'studyDate должна быть корректной датой в формате ISO 8601 (например, 2026-03-27T15:05:29.277+06:00)', })
    readonly studyDateTime?: string | null;

    @ApiProperty({ example: Modality.MR, description: 'Модальность исследования', enum: Object.values(Modality), required: false })
    @IsOptional()
    @IsEnum(Modality, { message: `modality должна быть одним из значений: ${Object.values(Modality).join(', ')}` })
    readonly modality?: Modality | null;

    @ApiProperty({ example: 'Представим, что это описание всего исследования.', description: 'Описание', required: false, })
    @IsOptional()
    @IsString({ message: 'description должно быть строкой' })
    readonly description?: string | null;

    @ApiProperty({ example: 'TESLA-MED', description: 'Название учреждения, где проводилось исследование (Institution Name)', required: false })
    @IsOptional()
    @IsString({ message: 'institutionName должно быть строкой' })
    readonly institutionName?: string | null;

    @ApiProperty({ example: 'GE MEDICAL SYSTEMS', description: 'Производитель оборудования для исследования (Manufacturer)', required: false })
    @IsOptional()
    @IsString({ message: 'manufacturer должно быть строкой' })
    readonly manufacturer?: string | null;

    @ApiProperty({ example: 'Signa HDxt', description: 'Модель аппарата, использованного для исследования (Manufacturer\'s Model Name)', required: false })
    @IsOptional()
    @IsString({ message: 'manufacturersModelName должно быть строкой' })
    readonly manufacturersModelName?: string | null;

    @ApiProperty({ example: 'GEHCGEHC', description: 'Имя станции (Station Name) или идентификатор сканера', required: false })
    @IsOptional()
    @IsString({ message: 'stationName должно быть строкой' })
    readonly stationName?: string | null;

    @ApiProperty({ example: '', description: 'Имя направившего врача (Referring Physician\'s Name)', required: false })
    @IsOptional()
    @IsString({ message: 'referringPhysiciansName должно быть строкой' })
    readonly referringPhysiciansName?: string | null;

    @ApiProperty({ example: 5, description: 'Количество серий в исследовании', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'seriesCount должно быть числом' })
    readonly seriesCount?: number | null;

    @ApiProperty({ example: 5, description: 'Количество изображений в исследовании', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'imagesCount должно быть числом' })
    readonly imagesCount?: number | null;
    
    @ApiProperty({ example: Status.Completed, description: 'Статус обработки', enum: Object.values(Status), required: false })
    @IsOptional()
    @IsEnum(Status, { message: `status должен быть одним из значений: ${Object.values(Status).join(', ')}` })
    readonly status?: Status | null;
}
