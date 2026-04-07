'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard,
  Search,
  Filter,
  Building2,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Download,
  Eye,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { PaymentStatus, PaymentMethod } from '@my-app/shared';
import axios from 'axios';

interface Transaction {
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
  status: PaymentStatus;
  method: PaymentMethod;
  date: string;
  reference: string;
}

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/payments');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleExport = async () => {
    try {
      const response = await axios.get('/api/payments/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payments-export-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting payments:', error);
      alert('Failed to export payments. Please try again.');
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      const response = await axios.get(`/api/payments/${id}`);
      // TODO: Show payment details in a modal or navigate to details page
      console.log('Payment details:', response.data);
    } catch (error) {
      console.error('Error fetching payment details:', error);
      alert('Failed to fetch payment details. Please try again.');
    }
  };

  const handleRetryPayment = async (id: number) => {
    try {
      const response = await axios.post(`/api/payments/${id}/retry`);
      setTransactions(prev => prev.map(transaction => 
        transaction.id === id ? response.data : transaction
      ));
    } catch (error) {
      console.error('Error retrying payment:', error);
      alert('Failed to retry payment. Please try again.');
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case PaymentStatus.FAILED:
        return <XCircle className="h-5 w-5 text-red-500" />;
      case PaymentStatus.PENDING:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case PaymentStatus.REFUNDED:
        return <RefreshCw className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case PaymentStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case PaymentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case PaymentStatus.REFUNDED:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || transaction.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalAmount = filteredTransactions.reduce((sum, transaction) => 
    transaction.status === PaymentStatus.COMPLETED ? sum + transaction.amount : sum, 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500">Manage and track all payment transactions</p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/manager/payments/failed"
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <XCircle className="h-4 w-4" />
            <span>Failed Payments</span>
          </Link>
          <Link
            href="/manager/payments/reports"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Revenue Reports</span>
          </Link>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Processed Amount</p>
            <h2 className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</h2>
          </div>
          <button 
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value={PaymentStatus.PENDING}>Pending</option>
            <option value={PaymentStatus.COMPLETED}>Completed</option>
            <option value={PaymentStatus.FAILED}>Failed</option>
            <option value={PaymentStatus.REFUNDED}>Refunded</option>
          </select>
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

      {/* Transactions Table */}
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
                  Status
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
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No transactions found
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
                        {getStatusIcon(transaction.status)}
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          getStatusColor(transaction.status)
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                        onClick={() => handleViewDetails(transaction.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {transaction.status === PaymentStatus.FAILED && (
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="Retry Payment"
                          onClick={() => handleRetryPayment(transaction.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      )}
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