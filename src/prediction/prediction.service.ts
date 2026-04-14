import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { UpdatePredictionDto } from './dto/update-prediction.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Prediction } from './entities/prediction.entity';
import { PredictionRunService } from 'src/prediction-run/prediction-run.service';
import { PredictionRun } from 'src/prediction-run/entities/prediction-run.entity';
import { FindOptions, Includeable } from 'sequelize';
import { InstanceImageService } from 'src/instance-image/instance-image.service';
import { buildOrder, buildResultData, buildWhere, FindAllServiceParams } from 'src/utils';
import { InstanceImage } from 'src/instance-image/entities/instance-image.entity';
import { Series } from 'src/series/entities/series.entity';

@Injectable()
export class PredictionService {
  constructor(
    @InjectModel(Prediction) private repository: typeof Prediction,
    @Inject(forwardRef(() => PredictionRunService)) private predictionRunService: PredictionRunService,
    @Inject(forwardRef(() => InstanceImageService)) private instanceImageService: InstanceImageService,
  ) {}

  private attributesModel = [];

  private includeRun: Includeable = {
    model: PredictionRun,
    as: 'run',
  }

  private includeImage: Includeable = {
    model: InstanceImage,
    as: 'image',
  }
    
  async create(dto: CreatePredictionDto) {
    try {
      await this.predictionRunService.findOneOrThrow(dto.runId);
      await this.instanceImageService.findOneOrThrow(dto.imageId);

      const prediction = await this.repository.create(dto);

      return prediction;
    } catch (error) {
        const msg = `Ошибка при создании предсказания. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.repository.findAll();
    } catch (error) {
        const msg = `Ошибка при получении всех предсказаний. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllByRunId(runId: number, params: FindAllServiceParams) {
    try {
      const { rows: studies, count } = await this.repository.findAndCountAll({
        where: {runId},
        limit: params.pageSize || undefined,
        offset: params.offset || undefined,
        include: [
          {
            model: InstanceImage,
            as: 'image',
            include: [
              {
                model: Series,
                as: 'series',
              },
            ],
          }
        ],
        order: [
          [{ model: InstanceImage, as: 'image' }, { model: Series, as: 'series' }, 'seriesNumber', 'ASC'],
          [{ model: InstanceImage, as: 'image' }, 'instanceNumber', 'ASC'],
        ],
      });

      return buildResultData<Prediction>({
        rows: studies,
        page: params.page,
        limit: params.pageSize,
        count,
      });
    } catch (error) {
        const msg = `Ошибка при получении всех предсказаний для запуска по id. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Prediction>, "where">) {
    const prediction = await this.repository.findByPk(id, options);
    if(!prediction) {
      throw new HttpException(`Предсказание не найдено.`, HttpStatus.NOT_FOUND);
    }
    return prediction;
  }

  async findOne(id: number) {
    try {
      const prediction = await this.findOneOrThrow(id, {
        include: [this.includeRun],
      });
      return prediction;
    } catch (error) {
        const msg = `Ошибка при получении предсказания по id. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, dto: UpdatePredictionDto) {
    try {
      await this.findOneOrThrow(id);
      const [_, updatedRows] = await this.repository.update(dto, {where: {id}, returning: true});
      return updatedRows[0];
    } catch (error) {
        const msg = `Ошибка при обновлении предсказания. ${error.message}`;
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
        const msg = `Ошибка при мягком удалении предсказания. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({where: {id}, force: true});
      return true;
    } catch (error) {
        const msg = `Ошибка при жестком удалении предсказания. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({where: {id}});
      return true;
    } catch (error) {
        const msg = `Ошибка при восстановлении предсказания после мягкого удаления. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
