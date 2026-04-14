import { Test, TestingModule } from '@nestjs/testing';
import { PredictionRunController } from './prediction-run.controller';
import { PredictionRunService } from './prediction-run.service';

describe('PredictionRunController', () => {
  let controller: PredictionRunController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PredictionRunController],
      providers: [PredictionRunService],
    }).compile();

    controller = module.get<PredictionRunController>(PredictionRunController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
