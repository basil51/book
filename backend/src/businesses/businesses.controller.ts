// backend/src/businesses/businesses.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from 'src/entities/business.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@my-app/shared';
import {
  BusinessWithRatingDto,
  BusinessStatsDto,
  DashboardResponseDto,
  CalculateStatsDto,
} from './dto/business-response.dto';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getBusinessStats(@Query('timeRange') timeRange: string = '30d'): Promise<BusinessStatsDto> {
    return this.businessesService.getBusinessStats(timeRange);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getDashboardStats(@Query('timeRange') timeRange: string = '30d'): Promise<DashboardResponseDto> {
    return this.businessesService.getDashboardStats(timeRange);
  }

  @Get('stats/export')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async exportBusinessStats(@Query('timeRange') timeRange: string = '30d'): Promise<string[][]> {
    return this.businessesService.exportBusinessStats(timeRange);
  }

  // Settings routes
  @Get('settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getSettings(): Promise<Business | null> {
    return this.businessesService.getSettings();
  }

  @Put('settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateSettings(@Body() settings: Partial<Business>): Promise<Business | null> {
    return this.businessesService.updateSettings(settings);
  }

  // CRUD operations
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Fixed: Uncommented the guard
  @Roles(UserRole.ADMIN)
  async create(@Body() createBusinessDto: CreateBusinessDto): Promise<Business> {
    return this.businessesService.create(createBusinessDto);
  }

  @Get()
  async findAll(): Promise<BusinessWithRatingDto[]> {
    return this.businessesService.findAll();
  }

  /** Public: business detail for booking (no auth). `identifier` = numeric id or slug (e.g. elite-hair-salon). */
  @Get('public/:identifier')
  async findOnePublic(
    @Param('identifier') identifier: string,
  ): Promise<Business> {
    return this.businessesService.findOnePublic(identifier);
  }

  // Changed from name-based to ID-based lookup to avoid route conflicts
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Business> {
    return this.businessesService.findOne(id);
  }

  // Added separate route for name-based lookup if needed
  @Get('by-name/:name')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findByName(@Param('name') name: string): Promise<Business> {
    return this.businessesService.findByNameWithServices(name);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    return this.businessesService.update(id, updateBusinessDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Business> {
    return this.businessesService.remove(id);
  }

  // Removed the duplicate PUT route for settings (moved to top)
}