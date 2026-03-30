import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Doctor } from './entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';

@ApiBearerAuth('token')
@ApiTags('Доктор')
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @ApiOperation({ summary: 'Создание доктора' })
  @ApiResponse({ status: 200, type: Doctor })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreateDoctorDto) {
    return this.doctorService.create(dto);
  }

  @ApiOperation({ summary: 'Получение всех докторов' })
  @ApiResponse({ status: 200, type: [Doctor] })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.doctorService.findAll();
  }

  @ApiOperation({ summary: 'Получение доктора по id' })
  @ApiResponse({ status: 200, type: Doctor })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получение всех пациентов доктора по id' })
  @ApiResponse({ status: 200, type: [Patient] })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get(':id/patients')
  findAllPatients(@Param('id') id: string) {
    return this.doctorService.findAllPatients(+id);
  }

  @ApiOperation({ summary: 'Обновление доктора по id' })
  @ApiResponse({ status: 200, type: Doctor })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDoctorDto) {
    return this.doctorService.update(+id, dto);
  }

  @ApiOperation({ summary: 'Востановление доктора по id после мягкого удаления' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.doctorService.restore(+id);
  }
  
  @ApiOperation({ summary: 'Мягкое удаление доктора по id' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorService.remove(+id);
  }

  @ApiOperation({ summary: 'Жесткое удаление доктора по id' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.doctorService.forceRemove(+id);
  }
}
