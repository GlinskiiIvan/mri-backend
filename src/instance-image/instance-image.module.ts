import { forwardRef, Module } from '@nestjs/common';
import { InstanceImageService } from './instance-image.service';
import { InstanceImageController } from './instance-image.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { InstanceImage } from './entities/instance-image.entity';
import { SeriesModule } from 'src/series/series.module';

@Module({
  controllers: [InstanceImageController],
  providers: [InstanceImageService],
  imports: [
    SequelizeModule.forFeature([InstanceImage]), 
    forwardRef(() => SeriesModule),
  ],
  exports: [InstanceImageService],
})
export class InstanceImageModule {}
