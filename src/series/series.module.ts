import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Series } from './entities/series.entity';
import { StudyModule } from 'src/study/study.module';

@Module({
  controllers: [SeriesController],
  providers: [SeriesService],
  imports: [SequelizeModule.forFeature([Series]), StudyModule],
  exports: [SeriesService],
})
export class SeriesModule {}
