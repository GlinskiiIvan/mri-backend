import { Test, TestingModule } from '@nestjs/testing';
import { PredictionRunService } from './prediction-run.service';

describe('PredictionRunService', () => {
  let service: PredictionRunService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PredictionRunService],
    }).compile();

    service = module.get<PredictionRunService>(PredictionRunService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
