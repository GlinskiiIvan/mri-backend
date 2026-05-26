import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { FindOptions, Includeable } from 'sequelize';
import { buildOrder, buildResultData, buildWhere, FindAllServiceParams } from 'src/utils';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private repository: typeof Role
  ) {}

  private includeUsers: Includeable = {
    model: User,
    as: 'users',
  }

  async create(dto: CreateRoleDto) {
    const candidate = await this.repository.findOne({
      where: { description: dto.description },
    });
    
    if (candidate) {
      throw new HttpException('Ошибка при создании роли. Роль с таким описанием уже существует.', HttpStatus.BAD_REQUEST,);
    }

    try {
      return await this.repository.create(dto);
    } catch (error) {
        const msg = `Ошибка при создании роли. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(params: FindAllServiceParams) {
    try {
      const whereParams = buildWhere<Role>({
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        filterBy: params.filterBy,
        filterValue: params.filterValue,
      });
      const orderParams = buildOrder({
        sortBy: params.sortBy, 
        sortOrder: params.sortOrder
      });

      const { rows: roles, count } = await this.repository.findAndCountAll({
        where: whereParams,
        order: orderParams,
        limit: params.pageSize || undefined,
        offset: params.offset || undefined,
      });

      return buildResultData<Role>({
        rows: roles,
        page: params.page,
        limit: params.pageSize,
        count,
      });
    } catch (error) {
      const msg = `Ошибка при получении всех ролей. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Role>, "where">) {
    const role = await this.repository.findByPk(id, options);
    if(!role) {
      throw new HttpException('Роль не найдена.', HttpStatus.NOT_FOUND);
    }
    return role;
  }

  async findOne(id: number) {
    try {
      return await this.findOneOrThrow(id);
    } catch (error) {
        const msg = `Ошибка при получении роли по id. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByValue(value: string) {
    try {
      return await this.repository.findOne({ where: {value} });
    } catch (error) {
        const msg = `Ошибка при получении роли по значению. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllUsers(id: number) {
    try {
      const role = await this.findOneOrThrow(id, {
        include: [this.includeUsers],
      });
      return role.users;
    } catch (error) {
        const msg = `Ошибка при получении всех пользователей роли. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      await this.findOneOrThrow(id);
      const [_, updatedRows] = await this.repository.update(updateRoleDto, {
        where: {id}, 
        returning: true,
      });
      return updatedRows[0];
    } catch (error) {
        const msg = `Ошибка при обновлении роли. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({ where: {id} });
      return true;
    } catch (error) {
        const msg = `Ошибка при восстановлении после мягкого удаления роли. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.findOneOrThrow(id);
      await this.repository.destroy({ where: {id} });
      return true;
    } catch (error) {
        const msg = `Ошибка при мягком удалении роли. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({ where: {id}, force: true });
      return true;
    } catch (error) {
        const msg = `Ошибка при жестком удалении роли. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
