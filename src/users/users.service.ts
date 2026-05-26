import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/entities/role.entity';
import { UserRoleDto } from './dto/user-role.dto';
import { UserBanDto } from './dto/user-ban.dto';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { FindOptions, Includeable } from 'sequelize';
import { PredictionRun } from 'src/prediction-run/entities/prediction-run.entity';
import { buildOrder, buildResultData, buildWhere, FindAllServiceParams } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private repository: typeof User,
    private roleService: RolesService,
  ) {}

  private attributesModel = [];

  private includeRoles: Includeable = {
    model: Role,
    as: 'roles',
    attributes: ['id', 'value',],
    through: { attributes: [] },
  };

  private includeRuns: Includeable = {
    model: PredictionRun,
    as: 'runs',
  };

  async create(dto: CreateUserDto) {
    try {
      const user = await this.repository.create(dto);
      return user;
    } catch (error) {
        const msg = `Ошибка при создании пользователя. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    try {
      const [_, updatedRows] = await this.repository.update(dto, {
        where: {id},
        returning: true,
      });
      return updatedRows[0];
    } catch (error) {
        const msg = `Ошибка при обновлении пользователя. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({ where: {id} });
      return true;
    } catch (error) {
        const msg = `Ошибка при восстановлении пользователя после мягкого удаления. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(params: FindAllServiceParams) {
    try {
      const whereParams = buildWhere<User>({
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        filterBy: params.filterBy,
        filterValue: params.filterValue,
      });
      const orderParams = buildOrder({
        sortBy: params.sortBy, 
        sortOrder: params.sortOrder
      });

      const { rows: users, count } = await this.repository.findAndCountAll({
        where: whereParams,
        order: orderParams,
        limit: params.pageSize || undefined,
        offset: params.offset || undefined,
      });

      return buildResultData<User>({
        rows: users,
        page: params.page,
        limit: params.pageSize,
        count,
      });
    } catch (error) {
        const msg = `Ошибка при получении всех пользователей. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<User>, "where">) {
    const user = await this.repository.findByPk(id, options);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOne(id: number) {
    try {
      const user = await this.findOneOrThrow(id, {
        include: [this.includeRoles],
      });
      return user;
    } catch (error) {
        const msg = `Ошибка при получении пользователя по id. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.repository.findOne({
        where: { email },
        include: [this.includeRoles],
      });
      return user;
    } catch (error) {
        const msg = `Ошибка при получении пользователя по email. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllRoles(id: number) {
    try {
      const user = await this.findOneOrThrow(id, {
        include: [this.includeRoles],
      });
      return user.roles;
    } catch (error) {
        const msg = `Ошибка при получении всех ролей пользователя по id. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllRuns(id: number) {
    try {
      const user = await this.findOneOrThrow(id, {
        include: [this.includeRuns],
      });
      return user.runs;
    } catch (error) {
        const msg = `Ошибка при получении всех запусков предсказаний пользователя по id. ${error.message}`;
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
        const msg = `Ошибка при мягком удалении пользователя. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({ where: {id}, force: true });
      return true;
    } catch (error) {
        const msg = `Ошибка при жестком удалении пользователя. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async addRole(dto: UserRoleDto) {
    try {
      const user = await this.findOneOrThrow(dto.userId);
      const role = await this.roleService.findOneOrThrow(dto.roleId);
      await user.$add('roles', role.id);
      return true;
    } catch (error) {
        const msg = `Ошибка при добавлении роли пользователю. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async removeRole(dto: UserRoleDto) {
    try {
      const user = await this.findOneOrThrow(dto.userId);
      const role = await this.roleService.findOneOrThrow(dto.roleId);
      await user.$remove('roles', role.id);
      return true;
    } catch (error) {
        const msg = `Ошибка при удалении роли у пользователя. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async ban(dto: UserBanDto) {
    try {
      const user = await this.findOneOrThrow(dto.userId);

      user.banned = true;
      user.banReason = dto.banReason;
      await user.save();

      return true;
    } catch (error) {
        const msg = `Ошибка при бане пользователя. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async unban(id: number) {
    try {
      const user = await this.findOneOrThrow(id);

      user.banned = false;
      user.banReason = null;
      await user.save();

      return true;
    } catch (error) {
        const msg = `Ошибка при снятии бана с пользователя. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
