'use client';

import React, { useState, useEffect } from 'react';
import { 
  XCircle,
  Search,
  Filter,
  Building2,
  User,
  ArrowLeft,
  Download,
  Eye,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PaymentStatus, PaymentMethod } from '@my-app/shared';

interface FailedTransaction {
  id: number;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  business: {
    id: number;
    name: string;
  };
  amount: number;
  method: PaymentMethod;
  date: string;
  reference: string;
  failureReason: string;
  retryCount: number;
}

export default function FailedPaymentsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<FailedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  useEffect(() => {
    const fetchFailedTransactions = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await axios.get('/api/payments/failed');
        // setTransactions(response.data);
        
        // Mock data
        setTransactions([
          {
            id: 1,
            customer: {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
            },
            business: {
              id: 1,
              name: 'Business A',
            },
            amount: 25.00,
            method: PaymentMethod.CARD,
            date: '2024-03-15T10:00:00Z',
            reference: 'TRX-001',
            failureReason: 'Insufficient funds',
            retryCount: 2,
          },
          {
            id: 2,
            customer: {
              id: 2,
              name: 'Jane Smith',
              email: 'jane@example.com',
            },
            business: {
              id: 2,
              name: 'Business B',
            },
            amount: 50.00,
            method: PaymentMethod.BANK_TRANSFER,
            date: '2024-03-15T14:00:00Z',
            reference: 'TRX-002',
            failureReason: 'Invalid account details',
            retryCount: 1,
          },
          // Add more mock transactions
        ]);
      } catch (error) {
        console.error('Error fetching failed transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFailedTransactions();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const handleRetry = async (transactionId: number) => {
    try {
      // TODO: Implement retry logic
      console.log('Retrying transaction:', transactionId);
    } catch (error) {
      console.error('Error retrying transaction:', error);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.failureReason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethod = methodFilter === 'all' || transaction.method === methodFilter;
    
    return matchesSearch && matchesMethod;
  });

  const totalFailedAmount = filteredTransactions.reduce((sum, transaction) => 
    sum + transaction.amount, 0
  );

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
            <h1 className="text-2xl font-bold text-gray-900">Failed Payments</h1>
            <p className="text-gray-500">Review and manage failed payment transactions</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Total Failed Amount</p>
            <h2 className="text-2xl font-bold text-gray-900">{formatCurrency(totalFailedAmount)}</h2>
          </div>
          <div>
            <p className="text-sm text-gray-500">Failed Transactions</p>
            <h2 className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</h2>
          </div>
          <div className="flex items-end justify-end">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search failed transactions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="all">All Methods</option>
            <option value={PaymentMethod.CARD}>Credit Card</option>
            <option value={PaymentMethod.CASH}>Cash</option>
            <option value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Failed Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Failure Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Loading failed transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No failed transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {transaction.reference}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {transaction.business.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {transaction.method.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        ).join(' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600">
                          {transaction.failureReason}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Retry attempts: {transaction.retryCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleRetry(transaction.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Retry Payment"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 