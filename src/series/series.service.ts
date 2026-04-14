import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Series } from './entities/series.entity';
import { StudyService } from 'src/study/study.service';
import { FindOptions, Includeable } from 'sequelize';
import { InstanceImage } from 'src/instance-image/entities/instance-image.entity';
import * as path from 'path';

@Injectable()
export class SeriesService {
  constructor(
    @InjectModel(Series) private repository: typeof Series,
    @Inject(forwardRef(() => StudyService)) private studyServise: StudyService,
  ) {}

  private attributesModel = [];

  private includeImages: Includeable = {
    model: InstanceImage,
    as: 'images',
    separate: true,
    order: [['instanceNumber', 'ASC']],
  };
    
  async create(dto: CreateSeriesDto) {
    try {
      const study = await this.studyServise.findOneOrThrow(dto.studyId);

      const series = await this.repository.create(dto);

      series.path = path.join(study.path, 'processed', `series_${series.id}`);
      await series.save();

      return series;
    } catch (error) {
        const msg = `Ошибка при создании серии. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.repository.findAll({
        order: [['seriesNumber', 'ASC']]
      });
    } catch (error) {
        const msg = `Ошибка при получении всех серий. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllImages(id: number) {
    try {
      const series = await this.findOneOrThrow(id, {
        include: [this.includeImages],
      });
      return series.images;
    } catch (error) {
        const msg = `Ошибка при получении всех изображений серии по id. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Series>, "where">) {
    const series = await this.repository.findByPk(id, options);

    if(!series) {
      throw new HttpException(`Серия не найдена.`, HttpStatus.NOT_FOUND);
    }

    return series;
  }

  async findOne(id: number) {
    try {
      const series = await this.findOneOrThrow(id);
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
      const [_, updatedRows] = await this.repository.update(dto, 
        {
          where: {id}, 
          returning: true
        }
      );
      return updatedRows[0];
    } catch (error) {
        const msg = `Ошибка при обновлении серии. ${error.message}`;
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
}
