import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private repository: typeof Role) {}

  async create(createRoleDto: CreateRoleDto) {
    const candidate = await this.repository.findOne({
      where: { description: createRoleDto.description },
    });
    if (candidate) {
      throw new HttpException(
        'Ошибка при создании роли. Роль с таким описанием уже существует.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.repository.create(createRoleDto);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Ошибка при создании роли. ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      return await this.repository.findAll();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Ошибка при получении всех ролей. ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number) {
    try {
      return await this.repository.findByPk(id);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Ошибка при получении роли. ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneByValue(value: string) {
    try {
      return await this.repository.findOne({ where: { value } });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Ошибка при получении роли. ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.repository.update(updateRoleDto, {
        where: { id },
        returning: true,
      });
      return role[1][0];
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Ошибка при обновлении роли. ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.repository.destroy({ where: { id } });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Ошибка при удалении роли. ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
