'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3,
  Calendar,
  ArrowLeft,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Clock,
  Building2,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarClock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BookingStatus } from '@my-app/shared';

interface AppointmentStats {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  averageAppointmentDuration: number;
  appointmentTrend: number[];
  topBusinesses: {
    id: number;
    name: string;
    appointments: number;
    trend: number;
  }[];
  topServices: {
    id: number;
    name: string;
    appointments: number;
    revenue: number;
  }[];
  statusDistribution: {
    status: BookingStatus;
    count: number;
  }[];
  timeSlotDistribution: {
    hour: number;
    count: number;
  }[];
}

export default function AppointmentAnalyticsPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AppointmentStats>({
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    averageAppointmentDuration: 0,
    appointmentTrend: [],
    topBusinesses: [],
    topServices: [],
    statusDistribution: [],
    timeSlotDistribution: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await axios.get(`/api/appointments/analytics?timeRange=${timeRange}`);
        // setStats(response.data);

        // Mock data
        setStats({
          totalAppointments: 1234,
          completedAppointments: 987,
          cancelledAppointments: 56,
          averageAppointmentDuration: 45,
          appointmentTrend: [65, 72, 68, 74, 80, 85, 78],
          topBusinesses: [
            { id: 1, name: 'Business A', appointments: 156, trend: 12.5 },
            { id: 2, name: 'Business B', appointments: 142, trend: -5.2 },
            { id: 3, name: 'Business C', appointments: 128, trend: 8.7 },
            { id: 4, name: 'Business D', appointments: 115, trend: 3.2 },
            { id: 5, name: 'Business E', appointments: 98, trend: -2.1 },
          ],
          topServices: [
            { id: 1, name: 'Haircut', appointments: 245, revenue: 6125 },
            { id: 2, name: 'Massage', appointments: 198, revenue: 9900 },
            { id: 3, name: 'Manicure', appointments: 156, revenue: 3900 },
            { id: 4, name: 'Facial', appointments: 134, revenue: 8040 },
            { id: 5, name: 'Pedicure', appointments: 112, revenue: 2800 },
          ],
          statusDistribution: [
            { status: BookingStatus.COMPLETED, count: 987 },
            { status: BookingStatus.CONFIRMED, count: 156 },
            { status: BookingStatus.PENDING, count: 35 },
            { status: BookingStatus.CANCELLED, count: 56 },
          ],
          timeSlotDistribution: [
            { hour: 9, count: 145 },
            { hour: 10, count: 189 },
            { hour: 11, count: 234 },
            { hour: 12, count: 167 },
            { hour: 13, count: 145 },
            { hour: 14, count: 198 },
            { hour: 15, count: 212 },
            { hour: 16, count: 178 },
            { hour: 17, count: 156 },
          ],
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case BookingStatus.CANCELLED:
        return <XCircle className="h-5 w-5 text-red-500" />;
      case BookingStatus.PENDING:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case BookingStatus.COMPLETED:
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Appointment Analytics</h1>
            <p className="text-gray-500">Track and analyze appointment performance</p>
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
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <span className={`text-sm font-medium ${
              calculateTrend(stats.appointmentTrend) >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {calculateTrend(stats.appointmentTrend).toFixed(1)}%
              {calculateTrend(stats.appointmentTrend) >= 0 
                ? <TrendingUp className="h-4 w-4 inline ml-1" />
                : <TrendingDown className="h-4 w-4 inline ml-1" />
              }
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {stats.totalAppointments.toLocaleString()}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Total Appointments</p>
        </div>

        {/* Completed Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {stats.completedAppointments.toLocaleString()}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Completed Appointments</p>
        </div>

        {/* Cancelled Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-red-50 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {stats.cancelledAppointments.toLocaleString()}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Cancelled Appointments</p>
        </div>

        {/* Average Duration */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">
            {stats.averageAppointmentDuration} min
          </h3>
          <p className="text-gray-500 text-sm mt-1">Average Duration</p>
        </div>
      </div>

      {/* Top Businesses */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Top Performing Businesses</h2>
          <p className="text-sm text-gray-500 mt-1">Based on number of appointments</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointments
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
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
                    {business.appointments.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`inline-flex items-center ${
                      business.trend >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {business.trend >= 0 ? '+' : ''}{business.trend.toFixed(1)}%
                      {business.trend >= 0 
                        ? <TrendingUp className="h-4 w-4 ml-1" />
                        : <TrendingDown className="h-4 w-4 ml-1" />
                      }
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Services */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Popular Services</h2>
          <p className="text-sm text-gray-500 mt-1">Most booked services and revenue</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointments
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.topServices.map((service, index) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="w-8 text-gray-500 text-sm">#{index + 1}</span>
                      <span className="text-gray-900">{service.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                    {service.appointments.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                    {formatCurrency(service.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Status Distribution</h2>
            <p className="text-sm text-gray-500 mt-1">Appointment status breakdown</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.statusDistribution.map(item => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className="text-gray-900">{item.status}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">{item.count.toLocaleString()}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.status === BookingStatus.COMPLETED
                            ? 'bg-blue-500'
                            : item.status === BookingStatus.CONFIRMED
                            ? 'bg-green-500'
                            : item.status === BookingStatus.PENDING
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{
                          width: `${(item.count / stats.totalAppointments) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Popular Time Slots</h2>
            <p className="text-sm text-gray-500 mt-1">Most booked hours of the day</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.timeSlotDistribution.map(slot => (
                <div key={slot.hour} className="flex items-center justify-between">
                  <span className="text-gray-900">
                    {slot.hour}:00 {slot.hour < 12 ? 'AM' : 'PM'}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">{slot.count.toLocaleString()}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{
                          width: `${(slot.count / Math.max(...stats.timeSlotDistribution.map(s => s.count))) * 100}%`,
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