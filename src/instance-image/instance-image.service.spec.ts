import { Test, TestingModule } from '@nestjs/testing';
import { InstanceImageService } from './instance-image.service';

describe('InstanceImageService', () => {
  let service: InstanceImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstanceImageService],
    }).compile();

    service = module.get<InstanceImageService>(InstanceImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
