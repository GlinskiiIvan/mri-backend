import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePredictionRunDto } from './dto/create-prediction-run.dto';
import { UpdatePredictionRunDto } from './dto/update-prediction-run.dto';
import { InjectModel } from '@nestjs/sequelize';
import { PredictionRun } from './entities/prediction-run.entity';
import { SeriesService } from 'src/series/series.service';
import { Series } from 'src/series/entities/series.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';

@Injectable()
export class PredictionRunService {
  constructor(
    @InjectModel(PredictionRun) private repository: typeof PredictionRun,
    private seriesServise: SeriesService,
  ) {}

  private attributesModel = [];
  private includeSeries = {
    model: Series,
    as: 'series',
  }
  private includeCreatedBy = {
    model: Doctor,
    as: 'createdBy',
  }
    
  async create(dto: CreatePredictionRunDto) {
    try {
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

  async findOneOrThrow(id: number) {
    const run = await this.repository.findByPk(id, {
      include: [this.includeSeries, this.includeCreatedBy],
    })

    if(!run) {
      throw new HttpException(`Запуск предсказания не найден.`, HttpStatus.NOT_FOUND);
    }

    return run;
  }

  async findOne(id: number) {
    try {
      const run = await this.repository.findByPk(id, {
        include: [this.includeSeries, this.includeCreatedBy],
      })
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
      const [_, updatedRows] = await this.repository.update(dto, {where: {id}, returning: true});
      return updatedRows[0];
    } catch (error) {
        const msg = `Ошибка при обновлении запуска предсказания. ${error.message}`;
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
}
