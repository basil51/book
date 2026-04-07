'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  CreditCard,
  DollarSign,
  Save,
  AlertTriangle,
  Lock,
  Percent,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PaymentSettings {
  general: {
    currency: string;
    autoCapture: boolean;
    refundWindow: number; // days
    minimumAmount: number;
    maximumAmount: number;
  };
  methods: {
    creditCard: {
      enabled: boolean;
      supportedCards: string[];
      processingFee: number;
    };
    debitCard: {
      enabled: boolean;
      supportedCards: string[];
      processingFee: number;
    };
    bankTransfer: {
      enabled: boolean;
      processingFee: number;
      processingTime: number; // hours
    };
  };
  security: {
    requireCVV: boolean;
    require3DS: boolean;
    maxAttempts: number;
    fraudDetection: boolean;
    ipVerification: boolean;
  };
  notifications: {
    paymentSuccess: boolean;
    paymentFailed: boolean;
    refundProcessed: boolean;
    paymentDisputed: boolean;
  };
}

export default function PaymentSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<PaymentSettings>({
    general: {
      currency: 'USD',
      autoCapture: true,
      refundWindow: 30,
      minimumAmount: 1,
      maximumAmount: 10000,
    },
    methods: {
      creditCard: {
        enabled: true,
        supportedCards: ['visa', 'mastercard', 'amex', 'discover'],
        processingFee: 2.9,
      },
      debitCard: {
        enabled: true,
        supportedCards: ['visa', 'mastercard'],
        processingFee: 1.9,
      },
      bankTransfer: {
        enabled: true,
        processingFee: 1.0,
        processingTime: 24,
      },
    },
    security: {
      requireCVV: true,
      require3DS: true,
      maxAttempts: 3,
      fraudDetection: true,
      ipVerification: true,
    },
    notifications: {
      paymentSuccess: true,
      paymentFailed: true,
      refundProcessed: true,
      paymentDisputed: true,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await axios.get('/api/settings/payments');
        // setSettings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment settings:', error);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (section: keyof PaymentSettings, subsection: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [key]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Replace with actual API call
      // await axios.put('/api/settings/payments', settings);
      console.log('Saving payment settings:', settings);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving payment settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading payment settings...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Payment Settings</h1>
            <p className="text-gray-500">Configure payment methods and processing</p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 gap-6">
        {/* General Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={settings.general.currency}
                onChange={(e) => handleChange('general', '', 'currency', e.target.value)}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Auto-capture Payments
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.general.autoCapture}
                  onChange={(e) => handleChange('general', '', 'autoCapture', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refund Window (days)
              </label>
              <input
                type="number"
                min="0"
                max="90"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={settings.general.refundWindow}
                onChange={(e) => handleChange('general', '', 'refundWindow', parseInt(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Amount
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settings.general.minimumAmount}
                  onChange={(e) => handleChange('general', '', 'minimumAmount', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Amount
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settings.general.maximumAmount}
                  onChange={(e) => handleChange('general', '', 'maximumAmount', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
          </div>
          <div className="space-y-6">
            {/* Credit Card */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Accept Credit Cards
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.methods.creditCard.enabled}
                    onChange={(e) => handleChange('methods', 'creditCard', 'enabled', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supported Cards
                </label>
                <div className="space-y-2">
                  {['visa', 'mastercard', 'amex', 'discover'].map(card => (
                    <label key={card} className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={settings.methods.creditCard.supportedCards.includes(card)}
                        onChange={(e) => {
                          const newCards = e.target.checked
                            ? [...settings.methods.creditCard.supportedCards, card]
                            : settings.methods.creditCard.supportedCards.filter(c => c !== card);
                          handleChange('methods', 'creditCard', 'supportedCards', newCards);
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {card}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Processing Fee (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settings.methods.creditCard.processingFee}
                  onChange={(e) => handleChange('methods', 'creditCard', 'processingFee', parseFloat(e.target.value))}
                />
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Debit Card */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Accept Debit Cards
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.methods.debitCard.enabled}
                    onChange={(e) => handleChange('methods', 'debitCard', 'enabled', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supported Cards
                </label>
                <div className="space-y-2">
                  {['visa', 'mastercard'].map(card => (
                    <label key={card} className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={settings.methods.debitCard.supportedCards.includes(card)}
                        onChange={(e) => {
                          const newCards = e.target.checked
                            ? [...settings.methods.debitCard.supportedCards, card]
                            : settings.methods.debitCard.supportedCards.filter(c => c !== card);
                          handleChange('methods', 'debitCard', 'supportedCards', newCards);
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {card}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Processing Fee (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settings.methods.debitCard.processingFee}
                  onChange={(e) => handleChange('methods', 'debitCard', 'processingFee', parseFloat(e.target.value))}
                />
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Bank Transfer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Accept Bank Transfers
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.methods.bankTransfer.enabled}
                    onChange={(e) => handleChange('methods', 'bankTransfer', 'enabled', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Processing Fee (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settings.methods.bankTransfer.processingFee}
                  onChange={(e) => handleChange('methods', 'bankTransfer', 'processingFee', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Processing Time (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settings.methods.bankTransfer.processingTime}
                  onChange={(e) => handleChange('methods', 'bankTransfer', 'processingTime', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Require CVV
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.security.requireCVV}
                  onChange={(e) => handleChange('security', '', 'requireCVV', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Require 3D Secure
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.security.require3DS}
                  onChange={(e) => handleChange('security', '', 'require3DS', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Payment Attempts
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={settings.security.maxAttempts}
                onChange={(e) => handleChange('security', '', 'maxAttempts', parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Enable Fraud Detection
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.security.fraudDetection}
                  onChange={(e) => handleChange('security', '', 'fraudDetection', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                IP Address Verification
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.security.ipVerification}
                  onChange={(e) => handleChange('security', '', 'ipVerification', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Payment Success Notifications
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications.paymentSuccess}
                  onChange={(e) => handleChange('notifications', '', 'paymentSuccess', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Payment Failed Notifications
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications.paymentFailed}
                  onChange={(e) => handleChange('notifications', '', 'paymentFailed', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Refund Processed Notifications
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications.refundProcessed}
                  onChange={(e) => handleChange('notifications', '', 'refundProcessed', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Payment Disputed Notifications
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications.paymentDisputed}
                  onChange={(e) => handleChange('notifications', '', 'paymentDisputed', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
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