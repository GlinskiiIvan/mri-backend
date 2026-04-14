import { forwardRef, Module } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Prediction } from './entities/prediction.entity';
import { PredictionRunModule } from 'src/prediction-run/prediction-run.module';
import { InstanceImageModule } from 'src/instance-image/instance-image.module';

@Module({
  controllers: [PredictionController],
  providers: [PredictionService],
  imports: [
    SequelizeModule.forFeature([Prediction]),
    forwardRef(() => PredictionRunModule),
    forwardRef(() => InstanceImageModule),
  ],
  exports: [PredictionService],
})
export class PredictionModule {}
