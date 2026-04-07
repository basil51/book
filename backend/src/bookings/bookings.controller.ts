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
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { CreatePublicBookingDto } from './dto/create-public-booking.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BookingStatus, UserRole } from '@my-app/shared';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('availability')
  async getAvailability(
    @Query('businessSlug') businessSlug: string,
    @Query('date') date: string,
    @Query('serviceId') serviceId?: string,
  ) {
    if (!businessSlug?.trim()) {
      throw new BadRequestException('businessSlug is required');
    }
    if (!date?.trim()) {
      throw new BadRequestException('date is required');
    }
    const sid =
      serviceId !== undefined && serviceId !== ''
        ? parseInt(serviceId, 10)
        : undefined;
    if (serviceId !== undefined && serviceId !== '' && Number.isNaN(sid!)) {
      throw new BadRequestException('Invalid serviceId');
    }
    return this.bookingsService.getAvailability(businessSlug, date, sid);
  }

  @Get('recent')
  async getRecentBookings() {
    return this.bookingsService.findRecentBookings();
  }

  @Post('public')
  async createPublic(@Body() dto: CreatePublicBookingDto) {
    return this.bookingsService.createPublic(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyBookings(@CurrentUser() user: User) {
    return this.bookingsService.findForClient(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get('business')
  getBusinessBookings(@CurrentUser() user: User) {
    return this.bookingsService.findForAdmin(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('status') status?: BookingStatus,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.bookingsService.findAll({
      search,
      status,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.create(createBookingDto, user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patchBooking(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookingDto,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.updateWithPermissions(id, dto, user);
  }
}
