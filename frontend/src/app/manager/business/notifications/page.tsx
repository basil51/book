'use client';

import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Clock, AlertCircle } from 'lucide-react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  sms: boolean;
  type: 'appointment' | 'reminder' | 'system' | 'marketing';
}

const DEFAULT_SETTINGS: NotificationSetting[] = [
  {
    id: 'new_appointment',
    title: 'New Appointment',
    description: 'When a new appointment is booked',
    email: true,
    sms: true,
    type: 'appointment',
  },
  {
    id: 'appointment_reminder',
    title: 'Appointment Reminder',
    description: 'Reminder before appointment (24h)',
    email: true,
    sms: true,
    type: 'reminder',
  },
  {
    id: 'appointment_cancelled',
    title: 'Appointment Cancelled',
    description: 'When an appointment is cancelled',
    email: true,
    sms: true,
    type: 'appointment',
  },
  {
    id: 'appointment_rescheduled',
    title: 'Appointment Rescheduled',
    description: 'When an appointment is rescheduled',
    email: true,
    sms: true,
    type: 'appointment',
  },
  {
    id: 'low_stock',
    title: 'Low Stock Alert',
    description: 'When inventory items are running low',
    email: true,
    sms: false,
    type: 'system',
  },
  {
    id: 'system_updates',
    title: 'System Updates',
    description: 'Important system updates and maintenance',
    email: true,
    sms: false,
    type: 'system',
  },
  {
    id: 'marketing_promotions',
    title: 'Marketing Promotions',
    description: 'Special offers and promotions',
    email: true,
    sms: false,
    type: 'marketing',
  },
];

export default function NotificationsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [reminderTime, setReminderTime] = useState('24');
  const [emailTemplate, setEmailTemplate] = useState('default');

  const handleSettingChange = (id: string, channel: 'email' | 'sms', value: boolean) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, [channel]: value } : setting
      )
    );
  };

  const getSettingsByType = (type: NotificationSetting['type']) => {
    return settings.filter(setting => setting.type === type);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
        <p className="text-gray-500">Configure how and when you receive notifications</p>
      </div>

      {/* Notification Channels */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-blue-600" />
          Notification Channels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-500">admin@beautysalon.com</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm">
              Change Email Address
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="font-medium">SMS Notifications</h3>
                <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm">
              Change Phone Number
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Appointment Notifications</h2>
        <div className="space-y-4">
          {getSettingsByType('appointment').map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">{setting.title}</h3>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={setting.email}
                    onChange={(e) => handleSettingChange(setting.id, 'email', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Email</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={setting.sms}
                    onChange={(e) => handleSettingChange(setting.id, 'sms', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>SMS</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reminder Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          Reminder Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700">Reminder Time</span>
              <select
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="1">1 hour before</option>
                <option value="2">2 hours before</option>
                <option value="12">12 hours before</option>
                <option value="24">24 hours before</option>
                <option value="48">48 hours before</option>
              </select>
            </label>
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700">Email Template</span>
              <select
                value={emailTemplate}
                onChange={(e) => setEmailTemplate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="default">Default Template</option>
                <option value="custom">Custom Template</option>
                <option value="minimal">Minimal Template</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* System & Marketing Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">System & Marketing Notifications</h2>
        <div className="space-y-4">
          {getSettingsByType('system').concat(getSettingsByType('marketing')).map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">{setting.title}</h3>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={setting.email}
                    onChange={(e) => handleSettingChange(setting.id, 'email', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Email</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={setting.sms}
                    onChange={(e) => handleSettingChange(setting.id, 'sms', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>SMS</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-4 flex items-start space-x-2 text-sm text-gray-500">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <p>
            Marketing notifications are sent to your customers. System notifications are for
            business owners and staff only.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
} 