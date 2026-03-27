import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Patient } from './entities/patient.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiBearerAuth('token')
@ApiTags('Пациент')
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiOperation({ summary: 'Создание пациента' })
  @ApiResponse({ status: 200, type: Patient })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreatePatientDto) {
    return this.patientService.create(dto);
  }

  @ApiOperation({ summary: 'Получение всех пациентов' })
  @ApiResponse({ status: 200, type: [Patient] })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  @ApiOperation({ summary: 'Получение пациента по id' })
  @ApiResponse({ status: 200, type: Patient })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(+id);
  }

  @ApiOperation({ summary: 'Обновление пациента' })
  @ApiResponse({ status: 200, type: Patient })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.patientService.update(+id, dto);
  }

  @ApiOperation({ summary: 'Мягкое удаление пациента по id' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientService.remove(+id);
  }

  @ApiOperation({ summary: 'Жесткое удаление пациента по id' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.patientService.forceRemove(+id);
  }

  @ApiOperation({ summary: 'Восстановление пациента по id после мягкого удаления' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin', 'doctor')
  @UseGuards(RolesGuard)
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.patientService.restore(+id);
  }
}
