import { Module } from '@nestjs/common';
import { InferenceService } from './inference.service';
import { InferenceController } from './inference.controller';
import { FilesModule } from 'src/files/files.module';
import { StudyModule } from 'src/study/study.module';
import { SeriesModule } from 'src/series/series.module';
import { InstanceImageModule } from 'src/instance-image/instance-image.module';
import { PredictionRunModule } from 'src/prediction-run/prediction-run.module';
import { PredictionModule } from 'src/prediction/prediction.module';

@Module({
  controllers: [InferenceController],
  providers: [InferenceService],
  imports: [FilesModule, StudyModule, SeriesModule, PredictionRunModule, PredictionModule],
  exports: [InferenceService],
})
export class InferenceModule {}
