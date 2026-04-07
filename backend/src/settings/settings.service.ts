import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './entities/settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
  ) {}

  async getSettings(): Promise<Settings> {
    let settings = await this.settingsRepository.findOne({ where: { id: 1 } });
    
    if (!settings) {
      // Create default settings if none exist
      settings = this.settingsRepository.create({
        notifications: {
          emailEnabled: true,
          smsEnabled: true,
          pushEnabled: false,
          defaultReminderTime: 24,
        },
        appointments: {
          minBookingNotice: 2,
          maxFutureBooking: 60,
          defaultDuration: 60,
          allowRescheduling: true,
          allowCancellation: true,
          cancellationDeadline: 24,
        },
        payments: {
          currency: 'USD',
          allowedMethods: ['credit_card', 'debit_card', 'bank_transfer'],
          autoCapture: true,
          refundWindow: 30,
        },
        localization: {
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          language: 'en',
        },
      });
      await this.settingsRepository.save(settings);
    }
    
    return settings;
  }

  async updateSettings(settings: Partial<Settings>): Promise<Settings> {
    const existingSettings = await this.getSettings();
    const updatedSettings = this.settingsRepository.merge(existingSettings, settings);
    return this.settingsRepository.save(updatedSettings);
  }
} 