import { Module } from '@nestjs/common';
import { InstanceImageService } from './instance-image.service';
import { InstanceImageController } from './instance-image.controller';

@Module({
  controllers: [InstanceImageController],
  providers: [InstanceImageService],
})
export class InstanceImageModule {}
