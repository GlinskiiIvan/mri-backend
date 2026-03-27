import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { FileTypesEnum } from 'src/enums/file-types.enum';

@Injectable()
export class FilesService {
  async create(file, type: FileTypesEnum): Promise<string> {
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

  async remove(fileName: string, type: FileTypesEnum) {
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

  async update(oldName: string, file, type: FileTypesEnum): Promise<string> {
    try {
      await this.remove(oldName, type);
      return await this.create(file, type);
    } catch (error) {
      throw new HttpException(
        'Ошибка обновлении файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
