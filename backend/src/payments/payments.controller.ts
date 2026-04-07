// src/payments/payments.controller.ts
import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import { CreateStripeIntentDto } from './dto/create-stripe-intent.dto';
import { CreatePaymentDto } from '@/payments/dto/create-payment.dto';
import { UpdatePaymentDto } from '@/payments/dto/update-payment.dto';   
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@my-app/shared';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
  ) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Payment successfully created' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Forbidden' 
  })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  /** Test / admin: create a Stripe PaymentIntent (requires STRIPE_SECRET_KEY on the server). */
  @Post('stripe/payment-intent')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create Stripe PaymentIntent (client secret for Elements)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'clientSecret for Stripe.js' })
  async createStripePaymentIntent(@Body() dto: CreateStripeIntentDto) {
    if (!this.stripeService.isConfigured()) {
      throw new BadRequestException(
        'Stripe is not configured (set STRIPE_SECRET_KEY)',
      );
    }
    const intent = await this.stripeService.createPaymentIntent({
      amountCents: dto.amountCents,
      currency: dto.currency,
    });
    if (!intent?.client_secret) {
      throw new BadRequestException('Could not create payment intent');
    }
    return { clientSecret: intent.client_secret, paymentIntentId: intent.id };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all payments with optional filters' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of payments' 
  })
  async findAll(
    @Query('businessId') businessId?: number,
    @Query('userId') userId?: number,
    @Query('bookingId') bookingId?: number,
    @Query('status') status?: string,
  ) {
    return this.paymentsService.findAll({
      businessId,
      userId,
      bookingId,
      status
    });
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get payment details by ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Payment details' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Payment not found' 
  })
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update payment status' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Payment updated' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Payment not found' 
  })
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Get('user/:userId')
  @Roles(UserRole.CLIENT, UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all payments for a specific user' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of user payments' 
  })
  async findUserPayments(@Param('userId') userId: string) {
    return this.paymentsService.findUserPayments(+userId);
  }

  @Get('business/:businessId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all payments for a specific business' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of business payments' 
  })
  async findBusinessPayments(@Param('businessId') businessId: string) {
    return this.paymentsService.findBusinessPayments(+businessId);
  }
}