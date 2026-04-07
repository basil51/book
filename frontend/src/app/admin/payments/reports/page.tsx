'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3,
  ArrowLeft,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Building2,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PaymentMethod } from '@my-app/shared';

interface RevenueStats {
  totalRevenue: number;
  revenueGrowth: number;
  averageTransactionValue: number;
  transactionCount: number;
  revenueTrend: number[];
  topBusinesses: {
    id: number;
    name: string;
    revenue: number;
    trend: number;
  }[];
  paymentMethods: {
    method: PaymentMethod;
    count: number;
    revenue: number;
  }[];
  monthlyRevenue: {
    month: string;
    revenue: number;
    transactions: number;
  }[];
}

export default function RevenueReportsPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<RevenueStats>({
    totalRevenue: 0,
    revenueGrowth: 0,
    averageTransactionValue: 0,
    transactionCount: 0,
    revenueTrend: [],
    topBusinesses: [],
    paymentMethods: [],
    monthlyRevenue: [],
  });

  useEffect(() => {
    const fetchRevenueStats = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await axios.get(`/api/payments/revenue?timeRange=${timeRange}`);
        // setStats(response.data);

        // Mock data
        setStats({
          totalRevenue: 45678.90,
          revenueGrowth: 12.5,
          averageTransactionValue: 85.50,
          transactionCount: 534,
          revenueTrend: [4500, 5200, 4800, 5100, 5600, 6000, 5800],
          topBusinesses: [
            { id: 1, name: 'Business A', revenue: 7890, trend: 12.5 },
            { id: 2, name: 'Business B', revenue: 6540, trend: -5.2 },
            { id: 3, name: 'Business C', revenue: 5670, trend: 8.7 },
            { id: 4, name: 'Business D', revenue: 4980, trend: 3.2 },
            { id: 5, name: 'Business E', revenue: 4320, trend: -2.1 },
          ],
          paymentMethods: [
            { method: PaymentMethod.CARD, count: 245, revenue: 20890 },
            { method: PaymentMethod.CASH, count: 156, revenue: 12450 },
            { method: PaymentMethod.BANK_TRANSFER, count: 133, revenue: 12338.90 },
          ],
          monthlyRevenue: [
            { month: 'Jan 2024', revenue: 42500, transactions: 500 },
            { month: 'Feb 2024', revenue: 38900, transactions: 456 },
            { month: 'Mar 2024', revenue: 45678.90, transactions: 534 },
          ],
        });
      } catch (error) {
        console.error('Error fetching revenue stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueStats();
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateTrend = (values: number[]) => {
    if (values.length < 2) return 0;
    const last = values[values.length - 1];
    const previous = values[values.length - 2];
    return ((last - previous) / previous) * 100;
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Revenue Reports</h1>
            <p className="text-gray-500">Track and analyze revenue performance</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <span className={`text-sm font-medium ${
              stats.revenueGrowth >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {stats.revenueGrowth.toFixed(1)}%
              {stats.revenueGrowth >= 0 
                ? <ArrowUpRight className="h-4 w-4 inline ml-1" />
                : <ArrowDownRight className="h-4 w-4 inline ml-1" />
              }
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {formatCurrency(stats.totalRevenue)}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Total Revenue</p>
        </div>

        {/* Average Transaction Value */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-50 rounded-lg">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {formatCurrency(stats.averageTransactionValue)}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Average Transaction</p>
        </div>

        {/* Transaction Count */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-50 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {stats.transactionCount.toLocaleString()}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Total Transactions</p>
        </div>

        {/* Monthly Growth */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-orange-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {calculateTrend(stats.revenueTrend).toFixed(1)}%
          </h3>
          <p className="text-gray-500 text-sm mt-1">Monthly Growth</p>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Revenue</h2>
          <p className="text-sm text-gray-500 mt-1">Revenue and transaction trends</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {stats.monthlyRevenue.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{month.month}</span>
                </div>
                <div className="flex items-center space-x-8">
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(month.revenue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transactions</p>
                    <p className="text-sm font-medium text-gray-900">
                      {month.transactions.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{
                        width: `${(month.revenue / Math.max(...stats.monthlyRevenue.map(m => m.revenue))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
            <p className="text-sm text-gray-500 mt-1">Distribution by payment type</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.paymentMethods.map(method => (
                <div key={method.method} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">
                      {method.method.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      ).join(' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-8">
                    <div>
                      <p className="text-sm text-gray-500">Revenue</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(method.revenue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Count</p>
                      <p className="text-sm font-medium text-gray-900">
                        {method.count.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{
                          width: `${(method.revenue / stats.totalRevenue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Businesses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Revenue Generators</h2>
            <p className="text-sm text-gray-500 mt-1">Businesses with highest revenue</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.topBusinesses.map((business, index) => (
                <div key={business.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 text-gray-500 text-sm">#{index + 1}</span>
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{business.name}</span>
                  </div>
                  <div className="flex items-center space-x-8">
                    <div>
                      <p className="text-sm text-gray-500">Revenue</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(business.revenue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Growth</p>
                      <span className={`text-sm font-medium ${
                        business.trend >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {business.trend >= 0 ? '+' : ''}{business.trend.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{
                          width: `${(business.revenue / Math.max(...stats.topBusinesses.map(b => b.revenue))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 