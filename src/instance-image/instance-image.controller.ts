import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InstanceImageService } from './instance-image.service';
import { CreateInstanceImageDto } from './dto/create-instance-image.dto';
import { UpdateInstanceImageDto } from './dto/update-instance-image.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { InstanceImage } from './entities/instance-image.entity';
import { Prediction } from 'src/prediction/entities/prediction.entity';

@ApiBearerAuth('token')
@ApiTags('Инстанс изображения')
@Controller('instance-image')
export class InstanceImageController {
  constructor(private readonly instanceImageService: InstanceImageService) {}

  @ApiOperation({ summary: 'Создание инстанса изображения' })
  @ApiResponse({ status: 200, type: InstanceImage })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createInstanceImageDto: CreateInstanceImageDto) {
    return this.instanceImageService.create(createInstanceImageDto);
  }

  @ApiOperation({ summary: 'Получение всех инстансов изображений' })
  @ApiResponse({ status: 200, type: [InstanceImage] })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.instanceImageService.findAll();
  }

  @ApiOperation({ summary: 'Получение инстанса изображения по id' })
  @ApiResponse({ status: 200, type: InstanceImage })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instanceImageService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получение всех предсказаний инстанса изображения' })
  @ApiResponse({ status: 200, type: [Prediction] })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Get(':id')
  findAllPredictions(@Param('id') id: string) {
    return this.instanceImageService.findAllPredictions(+id);
  }

  @ApiOperation({ summary: 'Обновление инстанса изображения' })
  @ApiResponse({ status: 200, type: InstanceImage })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInstanceImageDto: UpdateInstanceImageDto) {
    return this.instanceImageService.update(+id, updateInstanceImageDto);
  }

  @ApiOperation({ summary: 'Восстановление инстанса изображения после мягкого удаления' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.instanceImageService.restore(+id);
  }

  @ApiOperation({ summary: 'Мягкое удаление инстанса изображения' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instanceImageService.remove(+id);
  }

  @ApiOperation({ summary: 'Жесткое удаление инстанса изображения' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.instanceImageService.forceRemove(+id);
  }
}
