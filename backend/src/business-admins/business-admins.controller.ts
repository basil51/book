// src/business-admins/business-admins.controller.ts
import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BusinessAdminsService } from './business-admins.service';
import { CreateBusinessAdminDto } from './dto/create-business-admin.dto';
import { UpdateBusinessAdminDto } from './dto/update-business-admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@my-app/shared';    
import { User } from 'src/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Business Admins')
@ApiBearerAuth()
@Controller('business-admins')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusinessAdminsController {
  constructor(private readonly businessAdminsService: BusinessAdminsService) {}

  /*
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyBusiness(@CurrentUser() user: User) {
    return this.businessAdminsService.findMyBusiness(user);
  }
    */

  @Post()
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new business admin' })
  @ApiResponse({ status: 201, description: 'Business admin successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createBusinessAdminDto: CreateBusinessAdminDto) {
    return this.businessAdminsService.create(createBusinessAdminDto);
  }

  @Get()
    @Roles(UserRole.MANAGER, UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all business admins (filterable)' })
    @ApiResponse({ status: 200, description: 'List of business admins' })
  async findAll(
    @Query('businessId') businessId?: number,
    @Query('userId') userId?: number,
  ) {
    return this.businessAdminsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a specific business admin' })
  @ApiResponse({ status: 200, description: 'Business admin details' })
  @ApiResponse({ status: 404, description: 'Business admin not found' })
  async findOne(@Param('id') id: string) {
    return this.businessAdminsService.findOne({ id: +id });
  }


  @Patch(':id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a business admin' })
  @ApiResponse({ status: 200, description: 'Business admin updated' })
  @ApiResponse({ status: 404, description: 'Business admin not found' })
  async update(
    @Param('id') id: string,
    @Body() updateBusinessAdminDto: UpdateBusinessAdminDto,
  ) {
    return this.businessAdminsService.update(+id, updateBusinessAdminDto);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a business admin' })
  @ApiResponse({ status: 204, description: 'Business admin removed' })
  @ApiResponse({ status: 404, description: 'Business admin not found' })
  async remove(@Param('id') id: string) {
    return this.businessAdminsService.remove(+id);
  }

  @Get('business/:businessId')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all admins for a specific business' })
  @ApiResponse({ status: 200, description: 'List of business admins' })
  async findAdminsByBusiness(@Param('businessId') businessId: string) {
    return this.businessAdminsService.findAdminsByBusiness(+businessId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Put()
  updateMyBusiness(
    @CurrentUser() user: User,
    @Body() updateBusinessDto: CreateBusinessAdminDto,
  ) {
    return this.businessAdminsService.updateMyBusiness(user, updateBusinessDto);
  }
}