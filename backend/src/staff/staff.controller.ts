import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StaffService, CreateStaffDto, UpdateStaffDto } from './staff.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@my-app/shared';

@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @Roles(UserRole.MANAGER, UserRole.OWNER, UserRole.ADMIN)
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  @Roles(UserRole.MANAGER, UserRole.OWNER, UserRole.ADMIN, UserRole.STAFF)
  findAll() {
    return this.staffService.findAll();
  }

  @Get('business/:businessId')
  @Roles(
    UserRole.MANAGER,
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.STAFF,
    UserRole.CLIENT,
  )
  findByBusiness(@Param('businessId') businessId: string) {
    return this.staffService.findByBusiness(+businessId);
  }

  @Get(':id')
  @Roles(
    UserRole.MANAGER,
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.STAFF,
    UserRole.CLIENT,
  )
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(+id);
  }

  @Get(':id/rating')
  @Roles(
    UserRole.MANAGER,
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.STAFF,
    UserRole.CLIENT,
  )
  getStaffRating(@Param('id') id: string) {
    return this.staffService.getStaffRating(+id);
  }

  @Get('business/:businessId/ratings')
  @Roles(UserRole.MANAGER, UserRole.OWNER, UserRole.ADMIN)
  getBusinessStaffRatings(@Param('businessId') businessId: string) {
    return this.staffService.getBusinessStaffRatings(+businessId);
  }

  @Patch(':id')
  @Roles(UserRole.MANAGER, UserRole.OWNER, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(+id, updateStaffDto);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER, UserRole.OWNER, UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.staffService.remove(+id);
  }
}
