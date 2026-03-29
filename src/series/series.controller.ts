import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Series } from './entities/series.entity';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiBearerAuth('token')
@ApiTags('Серия')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @ApiOperation({ summary: 'Создание серии' })
  @ApiResponse({ status: 200, type: Series })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createSeriesDto: CreateSeriesDto) {
    return this.seriesService.create(createSeriesDto);
  }

  @ApiOperation({ summary: 'Получение всех серий' })
  @ApiResponse({ status: 200, type: [Series] })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.seriesService.findAll();
  }

  @ApiOperation({ summary: 'Получение серии по id' })
  @ApiResponse({ status: 200, type: Series })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seriesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Обновление серии' })
  @ApiResponse({ status: 200, type: Series })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeriesDto: UpdateSeriesDto) {
    return this.seriesService.update(+id, updateSeriesDto);
  }

  @ApiOperation({ summary: 'Восстановление серии после мягкого удаления' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.seriesService.restore(+id);
  }

  @ApiOperation({ summary: 'Мягкое удаление серии' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seriesService.remove(+id);
  }

  @ApiOperation({ summary: 'Жесткое удаление серии' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.seriesService.forceRemove(+id);
  }
}
