'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Building2,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BookingStatus } from '@my-app/shared';

interface Appointment {
  id: number;
  customer: {
    name: string;
    email: string;
  };
  business: {
    name: string;
  };
  service: {
    name: string;
    duration: number;
  };
  date: string;
  time: string;
  status: BookingStatus;
}

export default function CalendarViewPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await axios.get('/api/appointments');
        // setAppointments(response.data);
        
        // Mock data
        setAppointments([
          {
            id: 1,
            customer: {
              name: 'John Doe',
              email: 'john@example.com',
            },
            business: {
              name: 'Business A',
            },
            service: {
              name: 'Haircut',
              duration: 30,
            },
            date: '2024-03-15',
            time: '10:00',
            status: BookingStatus.CONFIRMED,
          },
          // Add more mock appointments
        ]);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case BookingStatus.CANCELLED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case BookingStatus.PENDING:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case BookingStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startPadding = firstDay.getDay();
    
    // Add padding days from previous month
    for (let i = 0; i < startPadding; i++) {
      const paddingDate = new Date(year, month, -startPadding + i + 1);
      days.push({
        date: paddingDate,
        isPadding: true,
      });
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isPadding: false,
      });
    }
    
    // Add padding days for next month to complete the grid
    const endPadding = 42 - days.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= endPadding; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isPadding: true,
      });
    }
    
    return days;
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(appointment => appointment.date === dateString);
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
            <h1 className="text-2xl font-bold text-gray-900">Calendar View</h1>
            <p className="text-gray-500">View and manage appointments in calendar format</p>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-px bg-gray-50 border-b border-gray-200">
          {weekDays.map(day => (
            <div key={day} className="px-2 py-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map(({ date, isPadding }, index) => {
            const dayAppointments = getAppointmentsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`min-h-[150px] bg-white ${
                  isPadding ? 'bg-gray-50' : ''
                }`}
              >
                <div className={`px-3 py-2 ${
                  isToday ? 'bg-blue-50' : ''
                }`}>
                  <span className={`text-sm font-medium ${
                    isPadding ? 'text-gray-400' : 'text-gray-900'
                  } ${isToday ? 'text-blue-600' : ''}`}>
                    {date.getDate()}
                  </span>
                </div>
                <div className="px-1 py-1 space-y-1">
                  {dayAppointments.map(appointment => (
                    <div
                      key={appointment.id}
                      className="px-2 py-1 mx-1 rounded-md bg-blue-50 border border-blue-100 cursor-pointer hover:bg-blue-100"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-blue-700">
                          {formatTime(appointment.time)}
                        </span>
                        {getStatusIcon(appointment.status)}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {appointment.service.name}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        <span className="truncate">{appointment.customer.name}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate">{appointment.business.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 