import { IsOptional, IsString, Min, IsEnum, IsDate, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { SortOrder } from 'src/common/enums';

export class FindAllQueryDto {
  @IsOptional()
  @IsString({ message: 'filterBy должно быть строкой' })
  readonly filterBy?: string;

  @IsOptional()
  @IsString({ message: 'filterValue должно быть строкой' })
  readonly filterValue?: string;

  @IsOptional()
  @IsString({ message: 'sortBy должно быть строкой' })
  readonly sortBy?: string;

  @IsOptional()
  @IsEnum(SortOrder, {message: `sortOrder должен быть одним из значений: ${Object.values(SortOrder).join(', ')}`})
  readonly sortOrder?: SortOrder;

  @IsOptional()
  @Type(() => Date)
  @IsDate({message: 'dateFrom должна быть корректной датой в формате YYYY-MM-DD'})
  readonly dateFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({message: 'dateTo должна быть корректной датой в формате YYYY-MM-DD'})
  readonly dateTo?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'pageSize должно быть целым числом' })
  @Min(1)
  readonly pageSize!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page должно быть целым числом' })
  @Min(1)
  readonly page!: number;
}