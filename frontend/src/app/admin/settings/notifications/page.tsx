'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Bell,
  Mail,
  MessageSquare,
  Save,
  AlertTriangle,
  Clock,
  Smartphone
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NotificationSettings {
  email: {
    enabled: boolean;
    fromName: string;
    fromEmail: string;
    replyToEmail: string;
    footerText: string;
    templates: {
      welcome: boolean;
      appointmentConfirmation: boolean;
      appointmentReminder: boolean;
      appointmentCancellation: boolean;
      appointmentRescheduled: boolean;
      paymentConfirmation: boolean;
      paymentFailed: boolean;
    };
  };
  sms: {
    enabled: boolean;
    senderId: string;
    templates: {
      appointmentConfirmation: boolean;
      appointmentReminder: boolean;
      appointmentCancellation: boolean;
      appointmentRescheduled: boolean;
    };
  };
  push: {
    enabled: boolean;
    webPushEnabled: boolean;
    mobilePushEnabled: boolean;
    templates: {
      appointmentConfirmation: boolean;
      appointmentReminder: boolean;
      appointmentCancellation: boolean;
      appointmentRescheduled: boolean;
      paymentConfirmation: boolean;
      paymentFailed: boolean;
    };
  };
  reminders: {
    defaultReminderTime: number; // hours before appointment
    maxReminders: number;
    reminderIntervals: number[]; // hours before appointment
  };
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      fromName: 'AppointPro',
      fromEmail: 'notifications@appointpro.com',
      replyToEmail: 'support@appointpro.com',
      footerText: 'This email was sent by AppointPro. Please do not reply to this email.',
      templates: {
        welcome: true,
        appointmentConfirmation: true,
        appointmentReminder: true,
        appointmentCancellation: true,
        appointmentRescheduled: true,
        paymentConfirmation: true,
        paymentFailed: true,
      },
    },
    sms: {
      enabled: true,
      senderId: 'AppointPro',
      templates: {
        appointmentConfirmation: true,
        appointmentReminder: true,
        appointmentCancellation: true,
        appointmentRescheduled: true,
      },
    },
    push: {
      enabled: true,
      webPushEnabled: true,
      mobilePushEnabled: true,
      templates: {
        appointmentConfirmation: true,
        appointmentReminder: true,
        appointmentCancellation: true,
        appointmentRescheduled: true,
        paymentConfirmation: true,
        paymentFailed: true,
      },
    },
    reminders: {
      defaultReminderTime: 24,
      maxReminders: 3,
      reminderIntervals: [24, 12, 2],
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await axios.get('/api/settings/notifications');
        // setSettings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notification settings:', error);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (section: keyof NotificationSettings, subsection: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: subsection === 'templates' 
          ? { ...(prev[section] as any).templates, [key]: value }
          : { ...(prev[section] as any)[subsection], [key]: value },
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Replace with actual API call
      // await axios.put('/api/settings/notifications', settings);
      console.log('Saving notification settings:', settings);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading notification settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
            <p className="text-gray-500">Configure notification preferences and templates</p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 gap-6">
        {/* Email Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Email Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Enable Email Notifications
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.email.enabled}
                  onChange={(e) => handleChange('email', '', 'enabled', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={settings.email.fromName}
                onChange={(e) => handleChange('email', '', 'fromName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={settings.email.fromEmail}
                onChange={(e) => handleChange('email', '', 'fromEmail', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reply-To Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={settings.email.replyToEmail}
                onChange={(e) => handleChange('email', '', 'replyToEmail', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Footer Text
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={settings.email.footerText}
                onChange={(e) => handleChange('email', '', 'footerText', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Templates
              </label>
              <div className="space-y-2">
                {Object.entries(settings.email.templates).map(([key, value]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={value}
                      onChange={(e) => handleChange('email', 'templates', key, e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {key.split(/(?=[A-Z])/).join(' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SMS Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">SMS Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Enable SMS Notifications
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.sms.enabled}
                  onChange={(e) => handleChange('sms', '', 'enabled', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sender ID
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={settings.sms.senderId}
                onChange={(e) => handleChange('sms', '', 'senderId', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMS Templates
              </label>
              <div className="space-y-2">
                {Object.entries(settings.sms.templates).map(([key, value]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={value}
                      onChange={(e) => handleChange('sms', 'templates', key, e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {key.split(/(?=[A-Z])/).join(' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Push Notification Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Push Notification Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Enable Push Notifications
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.push.enabled}
                  onChange={(e) => handleChange('push', '', 'enabled', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Enable Web Push Notifications
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.push.webPushEnabled}
                  onChange={(e) => handleChange('push', '', 'webPushEnabled', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Enable Mobile Push Notifications
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.push.mobilePushEnabled}
                  onChange={(e) => handleChange('push', '', 'mobilePushEnabled', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Push Notification Templates
              </label>
              <div className="space-y-2">
                {Object.entries(settings.push.templates).map(([key, value]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={value}
                      onChange={(e) => handleChange('push', 'templates', key, e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {key.split(/(?=[A-Z])/).join(' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reminder Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Reminder Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Reminder Time (hours before appointment)
              </label>
              <input
                type="number"
                min="1"
                max="72"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={settings.reminders.defaultReminderTime}
                onChange={(e) => handleChange('reminders', '', 'defaultReminderTime', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Number of Reminders
              </label>
              <input
                type="number"
                min="1"
                max="5"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={settings.reminders.maxReminders}
                onChange={(e) => handleChange('reminders', '', 'maxReminders', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Intervals (hours before appointment)
              </label>
              <div className="flex items-center space-x-2">
                {settings.reminders.reminderIntervals.map((interval, index) => (
                  <input
                    key={index}
                    type="number"
                    min="1"
                    max="72"
                    className="w-20 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={interval}
                    onChange={(e) => {
                      const newIntervals = [...settings.reminders.reminderIntervals];
                      newIntervals[index] = parseInt(e.target.value);
                      handleChange('reminders', '', 'reminderIntervals', newIntervals);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        {hasChanges && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-yellow-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span className="text-sm">You have unsaved changes</span>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 