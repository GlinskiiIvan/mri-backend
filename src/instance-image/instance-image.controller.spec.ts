import { Test, TestingModule } from '@nestjs/testing';
import { InstanceImageController } from './instance-image.controller';
import { InstanceImageService } from './instance-image.service';

describe('InstanceImageController', () => {
  let controller: InstanceImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstanceImageController],
      providers: [InstanceImageService],
    }).compile();

    controller = module.get<InstanceImageController>(InstanceImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
