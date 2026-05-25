import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { InstanceImageService } from 'src/instance-image/instance-image.service';
import { SeriesService } from 'src/series/series.service';
import { StudyService } from 'src/study/study.service';
import * as unzip from 'unzipper';
import { UploadStudyDto } from './dto/upload-study.dto';
import { Study } from 'src/study/entities/study.entity';
import * as path from 'path';
import { spawn } from 'child_process';
import { Status } from 'src/common/enums';
import { dicomDateToISO, getProrocolName, getPythonPath, getSliceOrientation, getSliceOrientationFromSeriesDescription } from 'src/utils';
import { Series } from 'src/series/entities/series.entity';

@Injectable()
export class IngestionService {
    constructor(
        private fileService: FilesService,
        private studyService: StudyService,
        private seriesService: SeriesService,
        private instanceImageService: InstanceImageService,
    ) {}

    async extractArchive(study: Study, dicomZip: Express.Multer.File): Promise<string> {
        try {
            const outputDir = path.join(study.path, 'original');
            const dicomZipPath = await this.fileService.save(dicomZip, outputDir);
            
            await unzip.Open.file(dicomZipPath)
                .then(d => d.extract({path: outputDir, concurrency: 5}));

            await this.fileService.remove(dicomZipPath);
            
            return outputDir;
        } catch (error) {
            const msg = `Ошибка при распаковки архива. ${error.message}`;
            console.log(msg);
            throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
        }
    }

    async parseSeries(studyDir: string): Promise<Record<string, string[]>> {
        try {
            const pythonPath = getPythonPath();

            return new Promise((resolve, reject) => {
                const python = spawn(pythonPath, [
                    path.resolve(process.cwd(), 'scripts/parse_series.py'),
                    'parse_series',
                    studyDir,
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
                        console.error('Python error:', stderr);
                        return reject(stderr);
                    }

                    try {
                        const parsed = JSON.parse(stdout);
                        resolve(parsed);
                    } catch (e) {
                        console.error('Ошибка парсинга JSON:', stdout);
                        reject(e);
                    }
                });
            });
        } catch (error) {
            const msg = `Ошибка при получении списка серий. ${error.message}`;
            console.log(msg);
            throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
        }
    }

    async processInstanceImage(seriesId: number, dicomPath: string, outputDir: string) {
        try {
            const pythonPath = getPythonPath();

            return new Promise((resolve, reject) => {
                const python = spawn(pythonPath, [
                    path.resolve(process.cwd(), 'scripts/convert_image.py'),
                    'convert_dicom_to_png',
                    dicomPath,
                    outputDir,
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
                        console.error('Python error:', stderr);
                        return reject(stderr);
                    }

                    try {
                        const parsed = JSON.parse(stdout);
                        const imageName = parsed['imageName'];
                        const rawMetadata = parsed['rawMetadata'];

                        this.instanceImageService.create({
                            seriesId,
                            imageName,
                            instanceNumber: rawMetadata['Instance Number'],
                            rawMetadata,
                        });

                        resolve(rawMetadata);
                    } catch (e) {
                        console.error('Ошибка парсинга JSON:', stdout);
                        reject(e);
                    }
                });
            });
        } catch (error) {
            const msg = `Ошибка при обработке изображений. ${error.message}`;
            console.log(msg);
            throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
        }
    }

    async processSeries(studyId: number, seriesList: Record<string, string[]>) {
        let series: Series | null = null;

        try {
            let lastImageData;
            const allSeries = Object.keys(seriesList);
            for (const seriesImages of allSeries) {
                series = await this.seriesService.create({studyId});
                await this.seriesService.update(series.id, {status: Status.Processing})

                const paths = seriesList[seriesImages];
                const results = [];
                
                for (const imagePath of paths) {
                    results.push(await this.processInstanceImage(series.id, imagePath, series.path));
                }

                lastImageData = results[results.length - 1];
                
                const orientation = lastImageData['Image Orientation (Patient)'];
                await this.seriesService.update(series.id, {
                    status: Status.Completed,
                    seriesNumber: lastImageData['Series Number'] || null,
                    modality: lastImageData['Modality'] || null,
                    orientation: orientation ? getSliceOrientation(orientation) : getSliceOrientationFromSeriesDescription(lastImageData['Series Description']) || null,
                    protocol: getProrocolName(lastImageData['Series Description']) || null,
                    imagesCount: paths.length,
                    description: lastImageData['Series Description'] || null,
                    rawMetadata: lastImageData,
                });
            }
            return lastImageData;
        } catch (error) {
            if(series) {
                await this.seriesService.update(series.id, {status: Status.Failed});
            }
            const msg = `Ошибка при обработке серии. ${error.message}`;
            console.log(msg);
            throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
        }
    }

    async processStudy(dto: UploadStudyDto, dicomZip: Express.Multer.File) {
        let study: Study | null = null;

        try {
            study = await this.studyService.create({
                patientId: dto.patientId,
                note: dto.note,
            });
            await this.studyService.update(study.id, {status: Status.Processing});

            const studyDir = await this.extractArchive(study, dicomZip);
            const seriesList = await this.parseSeries(studyDir);
            const lastImageData = await this.processSeries(study.id, seriesList);
            const allSeries = Object.keys(seriesList);
            const imagesCount = allSeries.reduce((acc, uid) => acc + seriesList[uid].length, 0);
            
            await this.studyService.update(study.id, {
                status: Status.Completed,
                studyInstanceUID: lastImageData['Study Instance UID'] || null,
                studyId: lastImageData['Study ID'] || null,
                specificCharacterSet: lastImageData['Specific Character Set'] || null,
                studyDateTime: dicomDateToISO(lastImageData['Study Date'], lastImageData['Study Time']),
                modality: lastImageData['Modality'] || null,
                institutionName: lastImageData['Institution Name'] || null,
                stationName: lastImageData['Station Name'] || null,
                manufacturer: lastImageData['Manufacturer'] || null,
                manufacturersModelName: lastImageData[`Manufacturer's Model Name`] || null,
                referringPhysiciansName: lastImageData[`Referring Physician's Name`] || null,
                description: lastImageData['Study Description'] || null,
                seriesCount: allSeries.length,
                imagesCount,
            });
        } catch (error) {
            if(study) {
                await this.studyService.update(study.id, {status: Status.Failed});
            }
            const msg = `Ошибка при обработке исследования. ${error.message}`;
            console.log(msg);
            throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
        }
    }
}
