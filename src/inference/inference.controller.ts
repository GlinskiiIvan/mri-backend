import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { InferenceService } from './inference.service';
import { PredictionRunDto } from './dto/prediction-run.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiBearerAuth('token')
@ApiTags('Выход данных')
@Controller('inference')
export class InferenceController {
  constructor(private readonly inferenceService: InferenceService) {}

  @ApiOperation({ summary: 'Запуск предсказания исследования' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Post('predict/:studyId')
  predict(@Param('studyId') studyId: string, @Body() dto: PredictionRunDto, @Request() req) {
    return this.inferenceService.predict(+studyId, +req.user.id, dto);
  }
}
