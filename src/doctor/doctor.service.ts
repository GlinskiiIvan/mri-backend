import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Doctor } from './entities/doctor.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { FindOptions, Includeable } from 'sequelize';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor) private repository: typeof Doctor,
    private userService: UsersService,
  ) {}

  private attributesModel = [];

  private includePatients: Includeable = {
    model: Patient,
    as: 'patients',
  };

  async create(dto: CreateDoctorDto) {
    try {
      await this.userService.findOneOrThrow(dto.userId);
      const doctor = await this.repository.create({
        ...dto,
        birthDate: new Date(dto.birthDate),
      });
      return doctor;
    } catch (error) {
        const msg = `Ошибка при создании доктора. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.repository.findAll();
    } catch (error) {
        const msg = `Ошибка при получении всех докторов. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllPatients(id: number) {
    try {
      const doctor = await this.findOneOrThrow(id, {
        include: [this.includePatients]
      });
      return doctor.patients;
    } catch (error) {
        const msg = `Ошибка при получении всех пациентов доктора. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const doctor = await this.findOneOrThrow(id)
      return doctor;
    } catch (error) {
        const msg = `Ошибка при получении доктора по id. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Doctor>, "where">) {
    const doctor = await this.repository.findByPk(id, options);
    if (!doctor) {
      throw new HttpException('Доктор не найден', HttpStatus.NOT_FOUND);
    }
    return doctor;
  }

  async update(id: number, dto: UpdateDoctorDto) {
    try {
      await this.findOneOrThrow(id);

      const [_, updatedRows] = await this.repository.update({
          ...dto, 
          birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined
        }, {
          where: {id},
          returning: true,
      });

      return updatedRows[0];
    } catch (error) {
        const msg = `Ошибка при обновлении доктора. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.findOneOrThrow(id);
      await this.repository.destroy({where: {id}});
      return true;
    } catch (error) {
        const msg = `Ошибка при мягком удалении доктора. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({where: {id}, force: true});
      return true;
    } catch (error) {
        const msg = `Ошибка при жестком удалении доктора. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({where: {id}});
      return true;
    } catch (error) {
        const msg = `Ошибка при востановлении доктора после мягкого удаления. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
