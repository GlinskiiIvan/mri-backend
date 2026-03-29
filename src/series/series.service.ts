import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Series } from './entities/series.entity';
import { StudyService } from 'src/study/study.service';
import { Study } from 'src/study/entities/study.entity';
import { Status } from 'src/common/enums';
import { PredictionRun } from 'src/prediction-run/entities/prediction-run.entity';

@Injectable()
export class SeriesService {
  constructor(
    @InjectModel(Series) private repository: typeof Series,
    private studyServise: StudyService,
  ) {}

  private attributesModel = [];
  private includeStudy = {
    model: Study,
    as: 'study',
  }
  private includeRuns = {
    model: PredictionRun,
    as: 'runs',
  }
    
  async create(dto: CreateSeriesDto) {
    try {
      const study = await this.studyServise.findOneOrThrow(dto.studyId);

      const series = await this.repository.create({
        ...dto,
        status: Status.Pending
      });

      series.path = `/patient_${study.patientId}/study_${study.id}/series_${series.id}`;
      series.save();

      return series;
    } catch (error) {
        const msg = `Ошибка при создании серии. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.repository.findAll();
    } catch (error) {
        const msg = `Ошибка при получении всех серий. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllRuns(id: number) {
    try {
      const series = await this.repository.findByPk(id, {
        include: [this.includeRuns],
      })
      return series.runs;
    } catch (error) {
        const msg = `Ошибка при получении серии по id. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number) {
    const series = await this.repository.findByPk(id);

    if(!series) {
      throw new HttpException(`Серия не найдена.`, HttpStatus.NOT_FOUND);
    }

    return series;
  }

  async findOne(id: number) {
    try {
      const series = await this.repository.findByPk(id, {
        include: [this.includeStudy],
      })
      return series;
    } catch (error) {
        const msg = `Ошибка при получении серии по id. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, dto: UpdateSeriesDto) {
    try {
      await this.findOneOrThrow(id);
      const [_, updatedRows] = await this.repository.update(dto, {where: {id}, returning: true});
      return updatedRows[0];
    } catch (error) {
        const msg = `Ошибка при обновлении серии. ${error.message}`;
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
        const msg = `Ошибка при мягком удалении серии. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({where: {id}, force: true});
      return true;
    } catch (error) {
        const msg = `Ошибка при жестком удалении серии. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({where: {id}});
      return true;
    } catch (error) {
        const msg = `Ошибка при восстановлении серии после мягкого удаления. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
