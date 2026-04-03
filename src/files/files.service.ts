import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { FileTypesEnum } from 'src/enums/file-types.enum';

@Injectable()
export class FilesService {
  async createStatic(file, type: FileTypesEnum): Promise<string> {
    try {
      const fileExt = file.originalname.split('.').at(-1);
      const fileName = uuid.v4() + `.${fileExt}`;
      const filePath = path.resolve(__dirname, '..', '..', 'static', type);

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      fs.writeFileSync(path.join(filePath, fileName), file.buffer);

      return fileName;
    } catch (error) {
      throw new HttpException(
        'Ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async save(file: Express.Multer.File, filePath: string): Promise<string> {
    try {
      const resultPath = path.resolve(__dirname, '..', '..', filePath);
      const fileName = path.basename(file.originalname);
      const fullPath = path.join(resultPath, fileName);
      
      await fs.promises.mkdir(resultPath, { recursive: true });
      await fs.promises.writeFile(fullPath, file.buffer);

      return fullPath;
    } catch (error) {
      throw new HttpException(
        'Ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeStatic(fileName: string, type: FileTypesEnum) {
    try {
      const file = path.resolve(
        __dirname,
        '..',
        '..',
        'static',
        type,
        fileName,
      );
      if (fs.existsSync(file)) {
        fs.rmSync(file);
      }
      return fileName;
    } catch (error) {
      throw new HttpException(
        'Ошибка удалении файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(path: string) {
    try {
      if (fs.existsSync(path)) {
        fs.rmSync(path);
      }
      return path;
    } catch (error) {
      throw new HttpException(
        'Ошибка удалении файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateStatic(oldName: string, file, type: FileTypesEnum): Promise<string> {
    try {
      await this.removeStatic(oldName, type);
      return await this.createStatic(file, type);
    } catch (error) {
      throw new HttpException(
        'Ошибка обновлении файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
