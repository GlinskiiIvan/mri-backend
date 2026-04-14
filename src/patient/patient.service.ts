import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Patient } from './entities/patient.entity';
import { DoctorService } from 'src/doctor/doctor.service';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Study } from 'src/study/entities/study.entity';
import { FindOptions, Includeable, Op } from 'sequelize';
import { buildOrder, buildResultData, buildWhere, FindAllServiceParams } from 'src/utils';
import { StudyService } from 'src/study/study.service';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient) private repository: typeof Patient,
    @Inject(forwardRef(() => StudyService)) private studyService: StudyService,
    private doctorService: DoctorService,
  ) {}

  private attributesModel = [];

  private includeDoctor: Includeable = {
    model: Doctor,
    as: 'doctor',
    attributes: ['id', 'fullName'],
  };

  private includeStudies: Includeable = {
    model: Study, 
    as: 'studies'
  };

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

  async findAll(params: FindAllServiceParams) {
    try {
      const whereParams = buildWhere<Patient>({
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        filterBy: params.filterBy,
        filterValue: params.filterValue,
      });
      const orderParams = buildOrder({
        sortBy: params.sortBy, 
        sortOrder: params.sortOrder
      });
      
      const { rows: patients, count } = await this.repository.findAndCountAll({
        where: whereParams,
        order: orderParams,
        limit: params.pageSize || undefined,
        offset: params.offset || undefined,
      });
      
      return buildResultData<Patient>({
        rows: patients,
        page: params.page,
        limit: params.pageSize,
        count,
      });
    } catch (error) {
        const msg = `Ошибка при получении всех пациентов. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST)
    }
  }

  async findAllStudies(id: number, params: FindAllServiceParams) {
    try {
      const patient = await this.findOneOrThrow(id);
      const studies = await this.studyService.findAllByPatientId(id, params);
      
      return studies;
    } catch (error) {
        const msg = `Ошибка при получении всех исследований пациента. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST)
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Patient>, "where">) {
    const patient = await this.repository.findByPk(id, options);
    if(!patient) {
      throw new HttpException(`Пациент не найден.`, HttpStatus.NOT_FOUND)
    }
    return patient;
  }

  async findOne(id: number) {
    try {
      const patient = await this.findOneOrThrow(id);
      return patient;
    } catch (error) {
        const msg = `Ошибка при получении пациента. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST)
    }
  }

  async update(id: number, dto: UpdatePatientDto) {
    try {
      await this.findOneOrThrow(id);
      const [_, updatedRows] = await this.repository.update(
        {
          ...dto, 
          birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined
        },
        {
          where: {id}, 
          returning: true
        }
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
