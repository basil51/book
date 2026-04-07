// src/users/users.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from '@my-app/shared';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    // Get all staff members (admin only)
  @Get('staff')
  @Roles(UserRole.ADMIN)
  async findStaff(
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10
    ) {
      return this.usersService.findStaff({ search, page, limit });
    }

    @Patch(':id/status')
    @Roles(UserRole.ADMIN)
    async updateStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean }
    ) {
      return this.usersService.updateStatus(+id, body.isActive);
    }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  adminOnlyEndpoint() {
    return 'This is only for admins';
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Get('counts-by-role')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getUserCountsByRole() {
    return this.usersService.getUserCountsByRole();
  }
}
