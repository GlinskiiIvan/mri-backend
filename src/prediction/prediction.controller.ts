import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { UpdatePredictionDto } from './dto/update-prediction.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Prediction } from './entities/prediction.entity';

@ApiBearerAuth('token')
@ApiTags('Предсказание')
@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @ApiOperation({ summary: 'Создание предсказания' })
  @ApiResponse({ status: 200, type: Prediction })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreatePredictionDto) {
    return this.predictionService.create(dto);
  }

  @ApiOperation({ summary: 'Получение всех предсказаний' })
  @ApiResponse({ status: 200, type: [Prediction] })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.predictionService.findAll();
  }

  @ApiOperation({ summary: 'Получение предсказания по id' })
  @ApiResponse({ status: 200, type: Prediction })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.predictionService.findOne(+id);
  }

  @ApiOperation({ summary: 'Обновление предсказания' })
  @ApiResponse({ status: 200, type: Prediction })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePredictionDto) {
    return this.predictionService.update(+id, dto);
  }

  @ApiOperation({ summary: 'Восстановление предсказания после мягкого удаления' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.predictionService.restore(+id);
  }

  @ApiOperation({ summary: 'Мягкое удаление предсказания' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.predictionService.remove(+id);
  }

  @ApiOperation({ summary: 'Жесткое удаление предсказания' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.predictionService.forceRemove(+id);
  }
}
