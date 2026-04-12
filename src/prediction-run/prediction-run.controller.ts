import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PredictionRunService } from './prediction-run.service';
import { CreatePredictionRunDto } from './dto/create-prediction-run.dto';
import { UpdatePredictionRunDto } from './dto/update-prediction-run.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { PredictionRun } from './entities/prediction-run.entity';
import { Prediction } from 'src/prediction/entities/prediction.entity';
import { FindAllQueryDto } from 'src/utils/dto/findAllQuery.dto';
import { buildFindAllParams } from 'src/utils';

@ApiBearerAuth('token')
@ApiTags('Запуск предсказания')
@Controller('prediction-run')
export class PredictionRunController {
  constructor(private readonly predictionRunService: PredictionRunService) {}

  @ApiOperation({ summary: 'Создание запуска предсказания' })
  @ApiResponse({ status: 200, type: PredictionRun })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreatePredictionRunDto) {
    return this.predictionRunService.create(dto);
  }

  @ApiOperation({ summary: 'Получение всех запусков предсказаний' })
  @ApiResponse({ status: 200, type: [PredictionRun] })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.predictionRunService.findAll();
  }

  @ApiOperation({ summary: 'Получение запуска предсказания по id' })
  @ApiResponse({ status: 200, type: PredictionRun })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.predictionRunService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получение всех предсказаний запуска предсказания по id' })
  @ApiResponse({ status: 200, type: [Prediction] })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Get(':id/predictions')
  findAllPredictions(@Param('id') id: string, @Query() query: FindAllQueryDto) {
    const params = buildFindAllParams(query);
    return this.predictionRunService.findAllPredictions(+id, params);
  }

  @ApiOperation({ summary: 'Обновление запуска предсказания' })
  @ApiResponse({ status: 200, type: PredictionRun })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePredictionRunDto) {
    return this.predictionRunService.update(+id, dto);
  }

  @ApiOperation({ summary: 'Восстановление запуска предсказания после мягкого удаления' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.predictionRunService.restore(+id);
  }

  @ApiOperation({ summary: 'Мягкое удаление запуска предсказания' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.predictionRunService.remove(+id);
  }

  @ApiOperation({ summary: 'Жесткое удаление запуска предсказания' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.predictionRunService.forceRemove(+id);
  }
}
