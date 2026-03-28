import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Patient } from './entities/patient.entity';
import { DoctorService } from 'src/doctor/doctor.service';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Study } from 'src/study/entities/study.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient) private repository: typeof Patient,
    private doctorService: DoctorService
  ) {}

  private attributesModel = [];
  private includeModels = [
    {
      model: Doctor,
      as: 'doctor',
      attributes: ['id', 'fullName'],
    }
  ];

  async create(dto: CreatePatientDto) {
    try {
      await this.doctorService.findOneOrThrow(dto.doctorId);

      const patient = await this.repository.create({
        ...dto,
        birthDate: new Date(dto.birthDate),
      });

      return patient;
    } catch (error) {
        const msg = `Ошибка при создании пациента. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {
    try {
      return await this.repository.findAll();
    } catch (error) {
        const msg = `Ошибка при получении всех пациентов. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST)
    }
  }

  async findOneOrThrow(id: number) {
    const patient = await this.repository.findByPk(id);

    if(!patient) {
      throw new HttpException(`Пациент не найден.`, HttpStatus.NOT_FOUND)
    }

    return patient;
  }

  async findOne(id: number) {
    try {
      const patient = await this.repository.findByPk(id, {
        include: this.includeModels,
      });

      return patient;
    } catch (error) {
        const msg = `Ошибка при получении пациента. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST)
    }
  }

  async findAllStudies(id: number) {
    try {
      const patient = await this.repository.findByPk(id, {
        include: [{model: Study, as: 'studies'}],
      });

      return patient.studies;
    } catch (error) {
        const msg = `Ошибка при получении всех исследований пациента. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST)
    }
  }

  async update(id: number, dto: UpdatePatientDto) {
    try {
      await this.findOneOrThrow(id);
      const [_, updatedRows] = await this.repository.update(
        {...dto, birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined},
        {where: {id}, returning: true}
      );
      return updatedRows[0];
    } catch (error) {
        const msg = `Ошибка при обновлении пациента. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST)
    }
  }

  async remove(id: number) {
    try {
      await this.findOneOrThrow(id);
      await this.repository.destroy({where: {id}});
      return true;
    } catch (error) {
        const msg = `Ошибка при мягком удалении пациента. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST)
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({where: {id}, force: true});
      return true;
    } catch (error) {
        const msg = `Ошибка при жестком удалении пациента. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST)
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({where: {id}});
      return true;
    } catch (error) {
        const msg = `Ошибка при востановлении пациента. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST)
    }
  }
}
