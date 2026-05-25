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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from './entities/role.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { User } from 'src/users/entities/user.entity';
import { FindAllQueryDto } from 'src/utils/dto/findAllQuery.dto';
import { buildFindAllParams } from 'src/utils';

@ApiBearerAuth('token')
@ApiTags('Роли')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Создание роли' })
  @ApiResponse({ status: 200, type: Role })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Получение всех ролей' })
  @ApiResponse({ status: 200, type: [Role] })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    const params = buildFindAllParams(query);
    return this.rolesService.findAll(params);
  }

  @ApiOperation({ summary: 'Получение роли по id' })
  @ApiResponse({ status: 200, type: Role })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получение всех пользователей роли по id' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get(':id/users')
  findAllUsers(@Param('id') id: string) {
    return this.rolesService.findAllUsers(+id);
  }

  @ApiOperation({ summary: 'Обновление роли' })
  @ApiResponse({ status: 200, type: Role })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @ApiOperation({ summary: 'Восстановление роли после мягкого удаления' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.rolesService.restore(+id);
  }

  @ApiOperation({ summary: 'Мягкое удаление роли' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  @ApiOperation({ summary: 'Жесткое удаление роли' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.rolesService.forceRemove(+id);
  }
}
