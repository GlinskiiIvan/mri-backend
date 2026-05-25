import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PredictionRunDto } from './dto/prediction-run.dto';
import { FilesService } from 'src/files/files.service';
import { StudyService } from 'src/study/study.service';
import { SeriesService } from 'src/series/series.service';
import { InstanceImageService } from 'src/instance-image/instance-image.service';
import { PredictionRunService } from 'src/prediction-run/prediction-run.service';
import { ResultClass, Status } from 'src/common/enums';
import * as path from 'path';
import { spawn } from 'child_process';
import { PredictionService } from 'src/prediction/prediction.service';
import { PredictionRun } from 'src/prediction-run/entities/prediction-run.entity';
import { getPythonPath } from 'src/utils';

@Injectable()
export class InferenceService {
  constructor(
    private fileService: FilesService,
    private studyService: StudyService,
    private seriesService: SeriesService,
    private predictionRunService: PredictionRunService,
    private predictionService: PredictionService,
  ) {}

  async predict(studyId: number, createdById: number, dto: PredictionRunDto) {
    let run: PredictionRun | null = null;

    try {
        const study = await this.studyService.findOne(studyId);
        const series = await this.studyService.findAllSeries(studyId);

        run = await this.predictionRunService.create({
          studyId: study.id,
          createdById: createdById,
          model: dto.model,
          version: dto.version,
        });

        await this.predictionRunService.update(run.id, {status: Status.Processing});

        for (const element of series) {
          const images = await this.seriesService.findAllImages(element.id);
          for (const img of images) {
            const prediction = await this.predictionService.create({
              runId: run.id,
              imageId: img.id,
            });
            await this.predictionService.update(prediction.id, {status: Status.Processing});

            const pythonPath = getPythonPath();

            const predictionResult = await new Promise((resolve, reject) => {
                const python = spawn(pythonPath, [
                    path.resolve(process.cwd(), 'scripts/predict.py'),
                    'YOLO-bbox',
                    dto.version,
                    img.imagePath,
                ]);

                let stdout = '';
                let stderr = '';

                python.stdout.on('data', (data) => {
                    stdout += data.toString();
                });

                python.stderr.on('data', (data) => {
                    stderr += data.toString();
                });

                python.on('close', (code) => {
                    if (code !== 0) {
                        this.predictionService.update(prediction.id, {status: Status.Failed});
                        console.error('Python error:', stderr);
                        return reject(stderr);
                    }

                    try {
                        const parsed = JSON.parse(stdout);
                        resolve(parsed);
                    } catch (e) {
                        this.predictionService.update(prediction.id, {status: Status.Failed});
                        console.error('Ошибка парсинга JSON:', stdout);
                        reject(e);
                    }
                });
            });
            
            const results = predictionResult['predictions'];
            
            const isTear = results.some(r => r.class === ResultClass.Tear);
            const confidences = results.map(r => r.confidence);

            const resultClass = (results.length === 0) ? null : isTear ? ResultClass.Tear : ResultClass.Normal;
            const minConfidence = (results.length === 0) ? 0 : Math.min(...confidences);
            const maxConfidence = (results.length === 0) ? 0 : Math.max(...confidences);

            await this.predictionService.update(prediction.id, {
              status: Status.Completed,
              rawOutput: results,
              resultClass,
              minConfidence,
              maxConfidence,
              executionTime: predictionResult['executionTime'],
            });
          }
        }

        await this.predictionRunService.update(run.id, {status: Status.Completed});
    } catch (error) {
        if(run) {
          await this.predictionRunService.update(run.id, {status: Status.Failed});
        }
        const msg = `Ошибка при выполнении предсказания исследовния. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
