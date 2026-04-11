import { Body, Controller, Post, Response,Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from 'src/decorators/public.decorator';

@ApiBearerAuth('token')
@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      properties: {
        token: {
          type: 'string',
          description: 'JWT токен доступа',
        },
      },
    },
  })
  @Public()
  @Post('/registration')
  async registration(@Body() userDto: CreateUserDto, @Response() res) {
    const regData = await this.authService.registration(userDto);
    res.cookie('refreshToken', regData.tokens.refreshToken, {
      maxAge: 30*24*60*60*1000, 
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return res.json({
      user: regData.user,
      accessToken: regData.tokens.accessToken,
    });
  }

  @ApiOperation({ summary: 'Вход' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      properties: {
        token: {
          type: 'string',
          description: 'JWT токен доступа',
        },
      },
    },
  })
  @Public()
  @Post('/login')
  async login(@Body() userDto: CreateUserDto, @Response() res) {
    const loginData = await this.authService.login(userDto);
    res.cookie('refreshToken', loginData.tokens.refreshToken, {
      maxAge: 30*24*60*60*1000, 
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return res.json({
      user: loginData.user,
      accessToken: loginData.tokens.accessToken,
    });
  }

  @ApiOperation({ summary: 'Refresh' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      properties: {
        token: {
          type: 'string',
          description: 'JWT токен доступа',
        },
      },
    },
  })
  @Post('/refresh')
  async refresh(@Request() req, @Response() res) {
    const refreshData = await this.authService.refresh(req.cookies.refreshToken);
    res.cookie('refreshToken', refreshData.tokens.refreshToken, {
      maxAge: 30*24*60*60*1000, 
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return res.json({
      user: refreshData.user,
      accessToken: refreshData.tokens.accessToken,
    });
  }

  @ApiOperation({ summary: 'Выход' })
  @ApiResponse({status: 200, type: Boolean})
  @Post('/logout')
  async logout(@Request() req, @Response() res) {
    const logoutData = await this.authService.logout(req.user.id);
    res.clearCookie('refreshToken', {
      maxAge: 30*24*60*60*1000, 
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return res.json(logoutData);
  }
}
