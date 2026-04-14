import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePredictionRunDto } from './dto/create-prediction-run.dto';
import { UpdatePredictionRunDto } from './dto/update-prediction-run.dto';
import { InjectModel } from '@nestjs/sequelize';
import { PredictionRun } from './entities/prediction-run.entity';
import { SeriesService } from 'src/series/series.service';
import { Series } from 'src/series/entities/series.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { DoctorService } from 'src/doctor/doctor.service';
import { Prediction } from 'src/prediction/entities/prediction.entity';
import { FindOptions, Includeable } from 'sequelize';
import { StudyService } from 'src/study/study.service';
import { buildOrder, buildResultData, buildWhere, FindAllServiceParams } from 'src/utils';
import { PredictionService } from 'src/prediction/prediction.service';

@Injectable()
export class PredictionRunService {
  constructor(
    @InjectModel(PredictionRun) private repository: typeof PredictionRun,
    @Inject(forwardRef(() => StudyService)) private studyService: StudyService,
    @Inject(forwardRef(() => PredictionService)) private predictionService: PredictionService,
    private doctorServise: DoctorService,
  ) {}

  private attributesModel = [];

  private includePredictions: Includeable = {
    model: Prediction,
    as: 'predictions',
  };
    
  async create(dto: CreatePredictionRunDto) {
    try {
      await this.studyService.findOneOrThrow(dto.studyId);
      await this.doctorServise.findOneOrThrow(dto.createdById);

      const run = await this.repository.create(dto);
      return run;
    } catch (error) {
        const msg = `Ошибка при создании запуска предсказания. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.repository.findAll();
    } catch (error) {
        const msg = `Ошибка при получении всех запусков предсказания. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllByStudyId(studyId: number, params: FindAllServiceParams) {
    try {
      const whereParams = buildWhere<PredictionRun>({
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
        where: {studyId, ...whereParams},
        order: orderParams,
        limit: params.pageSize || undefined,
        offset: params.offset || undefined,
      });

      return buildResultData<PredictionRun>({
        rows: studies,
        page: params.page,
        limit: params.pageSize,
        count,
      });
    } catch (error) {
        const msg = `Ошибка при получении всех запусков предсказания. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllPredictions(id: number, params: FindAllServiceParams) {
    try {
      console.log('id', id);
      
      const run = await this.findOneOrThrow(id);
      const predictions = await this.predictionService.findAllByRunId(id, params);

      return predictions;
    } catch (error) {
        const msg = `Ошибка при получении всех предсказаний запуска предсказания по id. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<PredictionRun>, "where">) {
    const run = await this.repository.findByPk(id, options);
    if(!run) {
      throw new HttpException(`Запуск предсказания не найден.`, HttpStatus.NOT_FOUND);
    }
    return run;
  }

  async findOne(id: number) {
    try {
      const run = await this.findOneOrThrow(id);
      return run;
    } catch (error) {
        const msg = `Ошибка при получении запуска предсказания по id. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, dto: UpdatePredictionRunDto) {
    try {
      await this.findOneOrThrow(id);
      const [_, updatedRows] = await this.repository.update(
        dto, 
        {
          where: {id}, 
          returning: true
        }
      );
      return updatedRows[0];
    } catch (error) {
        const msg = `Ошибка при обновлении запуска предсказания. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({where: {id}});
      return true;
    } catch (error) {
        const msg = `Ошибка при восстановлении запуска предсказания после мягкого удаления. ${error.message}`;
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
        const msg = `Ошибка при мягком удалении запуска предсказания. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({where: {id}, force: true});
      return true;
    } catch (error) {
        const msg = `Ошибка при жестком удалении запуска предсказания. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
