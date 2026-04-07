'use client';

import React, { useState } from 'react';
import { CreditCard, DollarSign, Settings, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  name: string;
  last4: string;
  isDefault: boolean;
  expiryDate?: string;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  type: 'appointment' | 'refund' | 'adjustment';
  description: string;
  paymentMethod: string;
}

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    name: 'Visa ending in 4242',
    last4: '4242',
    isDefault: true,
    expiryDate: '12/25',
  },
  {
    id: '2',
    type: 'bank',
    name: 'Bank Account ending in 1234',
    last4: '1234',
    isDefault: false,
  },
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: '2024-03-15',
    amount: 150.00,
    status: 'completed',
    type: 'appointment',
    description: 'Haircut and Styling - John Doe',
    paymentMethod: 'Visa ending in 4242',
  },
  {
    id: '2',
    date: '2024-03-14',
    amount: 75.00,
    status: 'completed',
    type: 'appointment',
    description: 'Manicure - Jane Smith',
    paymentMethod: 'Bank Account ending in 1234',
  },
  {
    id: '3',
    date: '2024-03-13',
    amount: -50.00,
    status: 'completed',
    type: 'refund',
    description: 'Refund for Cancelled Appointment',
    paymentMethod: 'Visa ending in 4242',
  },
];

export default function PaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState(DEFAULT_PAYMENT_METHODS);
  const [transactions] = useState(DEFAULT_TRANSACTIONS);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDeleteMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Settings</h1>
        <p className="text-gray-500">Manage your payment methods and view transaction history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                Payment Methods
              </h2>
              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                <Plus className="h-4 w-4" />
                <span>Add New</span>
              </button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{method.name}</p>
                          {method.expiryDate && (
                            <p className="text-sm text-gray-500">
                              Expires {method.expiryDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault ? (
                        <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-full">
                          Default
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(method.id)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMethod(method.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-blue-600" />
              Payment Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Terms
                </label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>Due on receipt</option>
                  <option>Net 15</option>
                  <option>Net 30</option>
                </select>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Require payment confirmation
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                Transaction History
              </h2>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="year">This year</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {transaction.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {transaction.paymentMethod}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        {transaction.amount < 0 ? '-' : ''}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note */}
            <div className="mt-4 flex items-start space-x-2 text-sm text-gray-500">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <p>
                Transactions are processed securely through our payment provider.
                Contact support if you notice any discrepancies.
              </p>
            </div>
          </div>
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