'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    title: 'Haircut & Styling',
    client: 'John Doe',
    staff: 'Sarah Wilson',
    start: '2024-03-20T10:00:00',
    end: '2024-03-20T11:00:00',
    status: 'confirmed',
  },
  {
    id: 2,
    title: 'Manicure & Pedicure',
    client: 'Emma Smith',
    staff: 'Mike Johnson',
    start: '2024-03-20T14:30:00',
    end: '2024-03-20T15:30:00',
    status: 'pending',
  },
  // Add more mock appointments as needed
];

export default function CalendarPage() {
  const [view, setView] = useState('week');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInWeek = (date: Date) => {
    const days = [];
    const current = new Date(date);
    current.setDate(current.getDate() - current.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const weekDays = getDaysInWeek(selectedDate);
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  const formatTime = (hour: number) => {
    return `${hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const getAppointmentsForTimeSlot = (day: Date, hour: number) => {
    return mockAppointments.filter(apt => {
      const aptDate = new Date(apt.start);
      return aptDate.getDate() === day.getDate() && 
             aptDate.getMonth() === day.getMonth() &&
             aptDate.getFullYear() === day.getFullYear() &&
             aptDate.getHours() === hour;
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 7);
              setSelectedDate(newDate);
            }}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() + 7);
              setSelectedDate(newDate);
            }}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
              {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={view} onValueChange={setView}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Appointment</DialogTitle>
              </DialogHeader>
              {/* Add appointment form here */}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b">
            <div className="border-r p-2 text-center text-sm font-medium text-gray-500">Time</div>
            {weekDays.map((day, index) => (
              <div key={index} className="border-r p-2 text-center">
                <div className="text-sm font-medium text-gray-900">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-sm text-gray-500">
                  {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-8">
            {timeSlots.map((hour) => (
              <React.Fragment key={hour}>
                <div className="border-r border-b p-2 text-sm text-gray-500 text-center">
                  {formatTime(hour)}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const appointments = getAppointmentsForTimeSlot(day, hour);
                  return (
                    <div key={dayIndex} className="border-r border-b p-1 min-h-[80px] relative">
                      {appointments.map((apt) => (
                        <div
                          key={apt.id}
                          className={`p-2 rounded text-xs mb-1 cursor-pointer ${
                            apt.status === 'confirmed' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <div className="font-medium truncate">{apt.title}</div>
                          <div className="text-gray-600 truncate">{apt.client}</div>
                          <div className="text-gray-600 truncate">{apt.staff}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
          <span>Confirmed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-100 rounded mr-2"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-100 rounded mr-2"></div>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
} 