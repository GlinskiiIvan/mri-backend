import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { UpdatePredictionDto } from './dto/update-prediction.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Prediction } from './entities/prediction.entity';
import { PredictionRunService } from 'src/prediction-run/prediction-run.service';
import { PredictionRun } from 'src/prediction-run/entities/prediction-run.entity';

@Injectable()
export class PredictionService {
  constructor(
    @InjectModel(Prediction) private repository: typeof Prediction,
    private predictionRunService: PredictionRunService,
  ) {}

  private attributesModel = [];
  private includeRun= {
    model: PredictionRun,
    as: 'run',
  }
    
  async create(dto: CreatePredictionDto) {
    try {
      await this.predictionRunService.findOneOrThrow(dto.runId);

      const prediction = await this.repository.create({
        ...dto,
        startedAt: new Date(dto.startedAt),
      });

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

  async findOneOrThrow(id: number) {
    const prediction = await this.repository.findByPk(id, {
      include: [this.includeRun],
    })

    if(!prediction) {
      throw new HttpException(`Предсказание не найдено.`, HttpStatus.NOT_FOUND);
    }

    return prediction;
  }

  async findOne(id: number) {
    try {
      const prediction = await this.repository.findByPk(id, {
        include: [this.includeRun],
      })
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
      const [_, updatedRows] = await this.repository.update({
        ...dto,
        startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined,
        finishedAt: dto.finishedAt ? new Date(dto.finishedAt) : undefined,
      }, {where: {id}, returning: true});
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
