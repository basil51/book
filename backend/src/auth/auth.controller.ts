import { Controller, Post, Body, NotFoundException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { HttpCode, HttpStatus } from '@nestjs/common';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, 
    private readonly jwtService: JwtService, 
    private readonly usersService: UsersService) {}
  
    @Post('activate')
    async activate(@Body() body: { token: string; password: string }) {
      const payload = this.jwtService.verify(body.token);
      const user = await this.usersService.findOne(payload.sub);
      if (!user) throw new NotFoundException('User not found');
      const hashedPassword = await bcrypt.hash(body.password, 10);
      return this.usersService.update(user.id, { password: hashedPassword });
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    @ApiBody({ type: RegisterDto })
    async register(@Body() registerDto: RegisterDto) {
      return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'User successfully logged in' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiBody({ type: LoginDto })
    async login(@Body() loginDto: LoginDto) {
      return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@CurrentUser() user) {
      return user; // cleaner!
    }
}
