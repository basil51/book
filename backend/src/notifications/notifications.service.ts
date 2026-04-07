import { Resend } from 'resend';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/** Minimal Twilio REST surface used here (REST client is CommonJS). */
interface TwilioRestClient {
  messages: {
    create: (opts: {
      from: string;
      to: string;
      body: string;
    }) => Promise<{ sid: string }>;
  };
}

type TwilioFactory = (sid: string, token: string) => TwilioRestClient;

// Twilio ships as CommonJS; default ESM interop breaks under Jest/ts-jest.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const twilioImport = require('twilio') as TwilioFactory;

@Injectable()
export class NotificationsService {
  private readonly resend: Resend | null;
  private readonly twilio: TwilioRestClient | null;
  private readonly twilioWhatsAppFrom: string;
  private readonly resendFrom: string;
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly config: ConfigService) {
    const resendKey =
      this.config.get<string>('RESEND_API_KEY') ?? process.env.RESEND_API_KEY;
    this.resend = resendKey ? new Resend(resendKey) : null;
    if (!this.resend) {
      this.logger.warn('RESEND_API_KEY not set; email sending disabled');
    }

    this.resendFrom =
      this.config.get<string>('RESEND_FROM_EMAIL') ??
      process.env.RESEND_FROM_EMAIL ??
      'onboarding@resend.dev';

    const sid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    const token = this.config.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioWhatsAppFrom =
      this.config.get<string>('TWILIO_WHATSAPP_FROM') ??
      'whatsapp:+14155238886';

    this.twilio = sid && token ? twilioImport(sid, token) : null;
    if (!this.twilio) {
      this.logger.warn(
        'TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN not set; WhatsApp disabled',
      );
    }
  }

  async sendWhatsApp(to: string, body: string) {
    if (!this.twilio) {
      this.logger.warn('Skipping WhatsApp; Twilio not configured');
      return null;
    }
    try {
      const msg = await this.twilio.messages.create({
        from: this.twilioWhatsAppFrom,
        to: `whatsapp:${to}`,
        body,
      });
      this.logger.log(`WhatsApp sent: ${msg.sid}`);
      return msg;
    } catch (err) {
      this.logger.error('Failed to send WhatsApp', err);
      throw err;
    }
  }

  async sendEmail(opts: { to: string; subject: string; html: string }) {
    if (!this.resend) {
      this.logger.warn('Skipping email; RESEND_API_KEY not set');
      return null;
    }

    return this.resend.emails.send({
      from: this.resendFrom,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
  }

  async sendBookingConfirmation(to: string, subject: string, html: string) {
    return this.sendEmail({ to, subject, html });
  }

  async sendBookingConfirmationToBusiness(
    businessEmail: string,
    params: {
      businessName: string;
      customerName: string;
      customerEmail: string;
      serviceName: string;
      whenLocal: string;
    },
  ) {
    return this.sendEmail({
      to: businessEmail,
      subject: `New booking — ${params.businessName}`,
      html: `
        <p>A new appointment was booked.</p>
        <ul>
          <li><strong>Service:</strong> ${params.serviceName}</li>
          <li><strong>When:</strong> ${params.whenLocal}</li>
          <li><strong>Customer:</strong> ${params.customerName} (${params.customerEmail})</li>
        </ul>
      `,
    });
  }
}
