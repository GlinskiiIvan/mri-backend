import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateStudyDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { Patient } from 'src/patient/entities/patient.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Study } from './entities/study.entity';
import { PatientService } from 'src/patient/patient.service';
import { Series } from 'src/series/entities/series.entity';
import { FindOptions, Includeable } from 'sequelize';
import * as path from 'path';
import { PredictionRun } from 'src/prediction-run/entities/prediction-run.entity';
import { buildOrder, buildResultData, buildWhere, FindAllServiceParams } from 'src/utils';
import { PredictionRunService } from 'src/prediction-run/prediction-run.service';
import { InstanceImageService } from 'src/instance-image/instance-image.service';

@Injectable()
export class StudyService {
  constructor(
    @InjectModel(Study) private repository: typeof Study,
    @Inject(forwardRef(() => PatientService)) private patientServise: PatientService,
    @Inject(forwardRef(() => PredictionRunService)) private predictionRunService: PredictionRunService,
    @Inject(forwardRef(() => InstanceImageService)) private instanceImageService: InstanceImageService,
  ) {}

  private attributesModel = [];

  private includePatient: Includeable = {
    model: Patient,
    as: 'patient',
  }

  private includeSeries: Includeable = {
    model: Series,
    as: 'series',
    separate: true,
    order: [['seriesNumber', 'ASC']],
  }

  private includeRuns: Includeable = {
    model: PredictionRun,
    as: 'runs',
  };

  async create(dto: CreateStudyDto) {
    try {
      await this.patientServise.findOneOrThrow(dto.patientId);

      const study = await this.repository.create(dto);

      study.path = path.join('storage', `patient_${dto.patientId}`, `study_${study.id}`);
      await study.save();

      return study;      
    } catch (error) {
        const msg = `Ошибка при создании исследования. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(params: FindAllServiceParams) {
    try {
      const whereParams = buildWhere<Study>({
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        filterBy: params.filterBy,
        filterValue: params.filterValue,
      });
      const orderParams = buildOrder({
        sortBy: params.sortBy, 
        sortOrder: params.sortOrder
      });

      const { rows: studies, count } = await this.repository.findAndCountAll({
        where: whereParams,
        order: orderParams,
        limit: params.pageSize || undefined,
        offset: params.offset || undefined,
      });

      return buildResultData<Study>({
        rows: studies,
        page: params.page,
        limit: params.pageSize,
        count,
      });
    } catch (error) {
        const msg = `Ошибка при получении всех исследований. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

    async findAllByPatientId(patientId: number, params: FindAllServiceParams) {
    try {
      const whereParams = buildWhere<Study>({
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        filterBy: params.filterBy,
        filterValue: params.filterValue,
      });
      const orderParams = buildOrder({
        sortBy: params.sortBy, 
        sortOrder: params.sortOrder
      });

      const { rows: studies, count } = await this.repository.findAndCountAll({
        where: {patientId, ...whereParams},
        order: orderParams,
        limit: params.pageSize || undefined,
        offset: params.offset || undefined,
      });

      return buildResultData<Study>({
        rows: studies,
        page: params.page,
        limit: params.pageSize,
        count,
      });
    } catch (error) {
        const msg = `Ошибка при получении всех исследований. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllSeries(id: number) {
    try {
      const study = await this.findOneOrThrow(id, {
        include: [this.includeSeries]
      })
      return study.series;
    } catch (error) {
        const msg = `Ошибка при получении всех серий исследования по id. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllRuns(id: number, params: FindAllServiceParams) {
    try {
      const study = await this.findOneOrThrow(id);
      const runs = await this.predictionRunService.findAllByStudyId(id, params);

      return runs;
    } catch (error) {
        const msg = `Ошибка при получении всех запусков предсказаний исследования по id. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllImages(id: number, params: FindAllServiceParams) {
    try {
      const study = await this.findOneOrThrow(id);
      const images = await this.instanceImageService.findAllByStudyId(id, params);

      return images;
    } catch (error) {
        const msg = `Ошибка при получении всех изображений исследования по id. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Study>, "where">) {
    const study = await this.repository.findByPk(id, options);
    if(!study) {
      throw new HttpException(`Исследование не найдено.`, HttpStatus.NOT_FOUND);
    }
    return study;
  }

  async findOne(id: number) {
    try {
      const study = await this.findOneOrThrow(id, {
        include: [this.includePatient]
      });
      return study; 
    } catch (error) {
        const msg = `Ошибка при получении исследования по id. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, dto: UpdateStudyDto) {
    try {
      await this.findOneOrThrow(id);
      const [_, updatedRows] = await this.repository.update(
        {
          ...dto, 
          studyDateTime: dto.studyDateTime ? new Date(dto.studyDateTime) : undefined,
        }, {
          where: {id}, 
          returning: true
        }
      );
      return updatedRows[0]; 
    } catch (error) {
        const msg = `Ошибка при обновлении исследования. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({where: {id}});
      return true;
    } catch (error) {
        const msg = `Ошибка при восстановлении исследования после мягкого удаления. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.findOneOrThrow(id);
      await this.repository.destroy({where: {id}});
      return true;
    } catch (error) {
        const msg = `Ошибка при мягком удалении исследования. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({where: {id}, force: true});
      return true;
    } catch (error) {
        const msg = `Ошибка при жестком удалении исследования. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  } 
}
