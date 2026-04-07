'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Building2
} from 'lucide-react';
import axios from 'axios';

interface BusinessStats {
  totalBookings: number;
  totalRevenue: number;
  activeBusinesses: number;
  totalCustomers: number;
  bookingsTrend: number[];
  revenueTrend: number[];
  topBusinesses: {
    id: number;
    name: string;
    bookings: number;
    revenue: number;
  }[];
}

export default function BusinessReportsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BusinessStats>({
    totalBookings: 0,
    totalRevenue: 0,
    activeBusinesses: 0,
    totalCustomers: 0,
    bookingsTrend: [],
    revenueTrend: [],
    topBusinesses: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`/api/businesses/stats?timeRange=${timeRange}`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  const handleExport = async () => {
    try {
      const response = await axios.get(`/api/businesses/stats/export?timeRange=${timeRange}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `business-reports-${timeRange}-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting reports:', error);
      alert('Failed to export reports. Please try again.');
    }
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Reports</h1>
          <p className="text-gray-500">Analytics and performance metrics</p>
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
          <button 
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Bookings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <span className={`text-sm font-medium ${
              calculateTrend(stats.bookingsTrend) >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {calculateTrend(stats.bookingsTrend).toFixed(1)}%
              {calculateTrend(stats.bookingsTrend) >= 0 
                ? <ArrowUpRight className="h-4 w-4 inline ml-1" />
                : <ArrowDownRight className="h-4 w-4 inline ml-1" />
              }
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {stats.totalBookings.toLocaleString()}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Total Bookings</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-50 rounded-lg">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <span className={`text-sm font-medium ${
              calculateTrend(stats.revenueTrend) >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {calculateTrend(stats.revenueTrend).toFixed(1)}%
              {calculateTrend(stats.revenueTrend) >= 0 
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

        {/* Active Businesses */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {stats.activeBusinesses.toLocaleString()}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Active Businesses</p>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {stats.totalCustomers.toLocaleString()}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Total Customers</p>
        </div>
      </div>

      {/* Top Businesses Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Top Performing Businesses</h2>
          <p className="text-sm text-gray-500 mt-1">Based on bookings and revenue</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Bookings
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.topBusinesses.map((business, index) => (
                <tr key={business.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="w-8 text-gray-500 text-sm">#{index + 1}</span>
                      <span className="text-gray-900">{business.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                    {business.bookings.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                    {formatCurrency(business.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 