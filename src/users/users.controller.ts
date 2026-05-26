import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UserRoleDto } from './dto/user-role.dto';
import { UserBanDto } from './dto/user-ban.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from 'src/roles/entities/role.entity';
import { PredictionRun } from 'src/prediction-run/entities/prediction-run.entity';
import { FindAllQueryDto } from 'src/utils/dto/findAllQuery.dto';
import { buildFindAllParams } from 'src/utils';

@ApiBearerAuth('token')
@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @ApiOperation({ summary: 'Выдача роли пользователю' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post('/role/add')
  addRole(@Body() userRoleDto: UserRoleDto) {
    return this.usersService.addRole(userRoleDto);
  }

  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    const params = buildFindAllParams(query);
    return this.usersService.findAll(params);
  }

  @ApiOperation({ summary: 'Получение пользователя по id' })
  @ApiResponse({ status: 200, type: User })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получение всех ролей пользователя по id' })
  @ApiResponse({ status: 200, type: [Role] })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get(':id/roles')
  findAllRoles(@Param('id') id: string) {
    return this.usersService.findAllRoles(+id);
  }

  @ApiOperation({ summary: 'Получение всех запусков предсказаний пользователя по id' })
  @ApiResponse({ status: 200, type: [PredictionRun] })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get(':id/runs')
  findAllRuns(@Param('id') id: string) {
    return this.usersService.findAllRuns(+id);
  }

  @ApiOperation({ summary: 'Бан пользователя' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch('/ban')
  ban(@Body() userBanDto: UserBanDto) {
    return this.usersService.ban(userBanDto);
  }

  @ApiOperation({ summary: 'Обновление пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(+id, dto);
  }

  @ApiOperation({ summary: 'Снятие бана с пользователя' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch(':id/unban')
  unban(@Param('id') id: string) {
    return this.usersService.unban(+id);
  }

  @ApiOperation({ summary: 'Восстановление пользователя после мягкого удаления' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.usersService.restore(+id);
  }

  @ApiOperation({ summary: 'Удаление роли у пользователя' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete('/role/remove')
  removeRole(@Body() userRoleDto: UserRoleDto) {
    return this.usersService.removeRole(userRoleDto);
  }

  @ApiOperation({ summary: 'Мягкое удаление пользователя' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @ApiOperation({ summary: 'Жесткое удаление пользователя' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.usersService.forceRemove(+id);
  }
}
