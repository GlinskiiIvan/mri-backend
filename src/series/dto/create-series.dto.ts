import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { Modality, Orientation, Protocol } from "src/common/enums";

export class CreateSeriesDto {
    @ApiProperty({ example: 1, description: 'Уникальный ID исследования' })
    @IsNumber({}, { message: 'studyId должен быть числом' })
    readonly studyId: number;

    @ApiProperty({ example: 'SE000007', description: 'Номер серии' })
    @IsString({ message: 'seriesNumber должна быть строкой' })
    readonly seriesNumber: string;

    @ApiProperty({ example: Modality.MR, description: 'Модальность серии', enum: Object.values(Modality), })
    @IsEnum(Modality, { message: `modality должна быть одним из значений: ${Object.values(Modality).join(', ')}` })
    readonly modality: Modality;

    @ApiProperty({ example: Protocol.PD, description: 'Протокол серии', enum: Object.values(Protocol), required: false, })
    @IsOptional()
    @IsEnum(Protocol, { message: `protocol должен быть одним из значений: ${Object.values(Protocol).join(', ')}` })
    readonly protocol?: Protocol;

    @ApiProperty({ example: Orientation.Sagittal, description: 'Ориентация серии', enum: Object.values(Orientation), required: false, })
    @IsOptional()
    @IsEnum(Orientation, { message: `orientation должна быть одним из значений: ${Object.values(Orientation).join(', ')}` })
    readonly orientation?: Orientation;

    @ApiProperty({ example: 13, description: 'Количество снимков в серии', })
    @IsNumber({}, { message: 'imagesCount должно быть числом' })
    readonly imagesCount: number;

    @ApiProperty({
        example: {
        studyInstanceUID: "1.2.840.113619.2.55.3.604688433.1234.1678901234.567",
        seriesCount: 3,
        imagesCount: 120,
        modality: "MR",
        bodyPartExamined: "KNEE",
        manufacturer: "Siemens",
        },
        description: 'Сырые метаданные серии (например, данные из DICOM: UID исследования, количество снимков, модальность, область исследования и оборудование)',
    })
    @IsObject({ message: 'rawMetadata должно быть объектом' })
    readonly rawMetadata: JSON;

    @ApiProperty({ example: 'Представим, что это описание всего исследования.', description: 'Описание', required: false, })
    @IsOptional()
    @IsString({ message: 'description должно быть строкой' })
    readonly description?: string;
}
