import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  private getUserData(user: User) {
    return {
      id: user.id,
      email: user.email,
      banned: user.banned,
      roles: user.roles,
    };
  }

  private async generateTokens(user: User) {
    const payload = this.getUserData(user);

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.ACCESS_SECRET,
        expiresIn: '1h',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.REFRESH_SECRET,
        expiresIn: '7d',
      }),
    };
  }

  private async updateRefreshToken(user: User) {
    const tokens = await this.generateTokens(user);
    const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 5);
    await this.usersService.update(user.id, {refreshToken: hashRefreshToken});

    return tokens;
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.usersService.findOneByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.usersService.create({
      ...userDto,
      password: hashPassword,
    });

    const tokens = await this.updateRefreshToken(user);

    const res = {
      user: this.getUserData(user),
      tokens,
    };
    this.logger.log(`Регистрация в системе: `, res);
    return res;
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(userDto.email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Некорректный емайл или пароль',
      });
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Некорректный емайл или пароль',
    });
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);

    const tokens = await this.updateRefreshToken(user);

    const res = {
      user: this.getUserData(user),
      tokens,
    };
    this.logger.log(`Вход в систему: `, res);
    return res;
  }

  async logout(userId: number) {
    const user = await this.usersService.findOne(userId);
    await this.usersService.update(userId, {refreshToken: null});

    this.logger.log(`Выход из системы: `, {id: user.id, email: user.email});
    return true;
  }

  async refresh(refreshToken: string) {
    console.log('refreshToken', refreshToken);
    
    if (!refreshToken) {
      throw new UnauthorizedException('Нет refresh токена');
    }

    let userData: any;

    try {
      userData = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('Неверный refresh токен');
    }

    const user = await this.usersService.findOne(userData.id);

    const refreshTokenEquals = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if(!user || !refreshTokenEquals) {
      throw new UnauthorizedException('Неверный refresh токен');
    }

    const tokens = await this.updateRefreshToken(user);

    const res = {
      user: this.getUserData(user),
      tokens,
    };
    this.logger.log(`Refresh запрос: `, res);
    return res;
  }
}
