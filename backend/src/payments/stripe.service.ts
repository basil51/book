import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe | null = null;

  constructor(private readonly config: ConfigService) {
    const key =
      this.config.get<string>('STRIPE_SECRET_KEY') ?? process.env.STRIPE_SECRET_KEY;
    if (key) {
      this.stripe = new Stripe(key);
    } else {
      this.logger.warn('STRIPE_SECRET_KEY not set; Stripe API disabled');
    }
  }

  isConfigured(): boolean {
    return this.stripe !== null;
  }

  /** Returns null when Stripe is not configured (local dev without keys). */
  async createPaymentIntent(params: {
    amountCents: number;
    currency?: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.PaymentIntent | null> {
    if (!this.stripe) {
      return null;
    }
    return this.stripe.paymentIntents.create({
      amount: params.amountCents,
      currency: (params.currency ?? 'usd').toLowerCase(),
      metadata: params.metadata ?? {},
      automatic_payment_methods: { enabled: true },
    });
  }
}
