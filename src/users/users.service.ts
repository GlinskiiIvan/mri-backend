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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private repository: typeof User,
    private roleService: RolesService,
  ) {}

  private attributesModel = ['id', 'email', 'banned', 'banReason'];
  private includeModels = [
    {
      model: Role,
      as: 'roles',
      attributes: ['id', 'value', 'description'],
      through: { attributes: [] },
    },
    {
      model: Doctor,
      as: 'doctor',
      attributes: ['id', 'fullName'],
    },
  ];

  async create(dto: CreateUserDto) {
    try {
      const user = await this.repository.create(dto);
      // const role = await this.roleService.findOneByValue('user');
      // await user.$set('roles', [role.id]);
      // user.roles = [role];
      await user.$set('roles', []);
      user.roles = [];
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Ошибка при создании пользователя. ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    try {
      const user = await this.repository.update(dto, {
        where: { id },
        returning: true,
      });
      return user[1][0];
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Ошибка при обновлении пользователя. ${error.message}`,
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
        `Ошибка при удалении пользователя. ${error.message}`,
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
        `Ошибка при получении всех пользователей. ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number) {
    try {
      return await this.repository.findByPk(id, {
        attributes: this.attributesModel,
        include: this.includeModels,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Ошибка при получении пользователя. ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.repository.findOne({
        where: { email },
        include: this.includeModels,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Ошибка при получении пользователя. ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneOrThrow(id: number) {
    const user = await this.repository.findByPk(id);

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async addRole(dto: UserRoleDto) {
    try {
      const user = await this.repository.findByPk(dto.userId);
      const role = await this.roleService.findOne(dto.roleId);
      if (user && role) {
        await user.$add('roles', role.id);
        return true;
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Ошибка при добавлении роли пользователю. ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeRole(dto: UserRoleDto) {
    try {
      const user = await this.repository.findByPk(dto.userId);
      const role = await this.roleService.findOne(dto.roleId);
      if (user && role) {
        await user.$remove('roles', role.id);
        return true;
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Ошибка при удалении роли у пользователя. ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async ban(dto: UserBanDto) {
    try {
      const user = await this.repository.findByPk(dto.userId);
      if (!user) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }

      user.banned = true;
      user.banReason = dto.banReason;
      await user.save();

      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Ошибка при бане пользователя. ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
