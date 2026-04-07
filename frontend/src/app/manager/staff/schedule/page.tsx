'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock,
  Calendar,
  User,
  Filter
} from 'lucide-react';

// Mock data for staff schedules
const mockStaff = [
  { id: 1, name: 'Sarah Wilson', role: 'Senior Stylist' },
  { id: 2, name: 'Mike Johnson', role: 'Junior Stylist' },
  { id: 3, name: 'Lisa Anderson', role: 'Beauty Therapist' },
];

const mockShifts = [
  {
    id: 1,
    staffId: 1,
    date: '2024-03-20',
    startTime: '09:00',
    endTime: '17:00',
    type: 'regular',
  },
  {
    id: 2,
    staffId: 2,
    date: '2024-03-20',
    startTime: '10:00',
    endTime: '18:00',
    type: 'regular',
  },
  {
    id: 3,
    staffId: 3,
    date: '2024-03-20',
    startTime: '11:00',
    endTime: '19:00',
    type: 'overtime',
  },
];

export default function StaffSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [view, setView] = useState('week');

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

  const getShiftsForDay = (date: Date, staffId: number) => {
    return mockShifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate.getDate() === date.getDate() && 
             shiftDate.getMonth() === date.getMonth() &&
             shiftDate.getFullYear() === date.getFullYear() &&
             (staffId === 0 || shift.staffId === staffId);
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Staff Schedule</h1>
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
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Staff Member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff Members</SelectItem>
              {mockStaff.map(staff => (
                <SelectItem key={staff.id} value={staff.id.toString()}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Shift
          </Button>
        </div>
      </div>

      {/* Schedule Grid */}
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
                  const staffId = selectedStaff === 'all' ? 0 : parseInt(selectedStaff);
                  const shifts = getShiftsForDay(day, staffId);
                  return (
                    <div key={dayIndex} className="border-r border-b p-1 min-h-[80px] relative">
                      {shifts.map((shift) => {
                        const staff = mockStaff.find(s => s.id === shift.staffId);
                        const startHour = parseInt(shift.startTime.split(':')[0]);
                        const endHour = parseInt(shift.endTime.split(':')[0]);
                        
                        if (hour >= startHour && hour < endHour) {
                          return (
                            <div
                              key={shift.id}
                              className={`p-2 rounded text-xs mb-1 ${
                                shift.type === 'regular' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              <div className="font-medium truncate">{staff?.name}</div>
                              <div className="text-gray-600 truncate">{staff?.role}</div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="h-3 w-3 mr-1" />
                                {shift.startTime} - {shift.endTime}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
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
          <span>Regular Shift</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-100 rounded mr-2"></div>
          <span>Overtime</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
          <span>Day Off</span>
        </div>
      </div>
    </div>
  );
} 