'use client';

import React, { useState } from 'react';
import { Clock, Calendar, AlertCircle } from 'lucide-react';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const DEFAULT_HOURS = {
  Monday: { open: '09:00', close: '18:00', isOpen: true },
  Tuesday: { open: '09:00', close: '18:00', isOpen: true },
  Wednesday: { open: '09:00', close: '18:00', isOpen: true },
  Thursday: { open: '09:00', close: '18:00', isOpen: true },
  Friday: { open: '09:00', close: '18:00', isOpen: true },
  Saturday: { open: '10:00', close: '16:00', isOpen: true },
  Sunday: { open: '10:00', close: '16:00', isOpen: false },
};

export default function WorkingHoursPage() {
  const [hours, setHours] = useState(DEFAULT_HOURS);
  const [specialDates, setSpecialDates] = useState([
    { date: '2024-12-25', name: 'Christmas Day', isOpen: false },
    { date: '2024-12-24', name: 'Christmas Eve', open: '09:00', close: '14:00', isOpen: true },
  ]);

  const handleHoursChange = (day: string, field: string, value: string | boolean) => {
    setHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleSpecialDateChange = (index: number, field: string, value: string | boolean) => {
    setSpecialDates(prev => {
      const newDates = [...prev];
      newDates[index] = {
        ...newDates[index],
        [field]: value,
      };
      return newDates;
    });
  };

  const addSpecialDate = () => {
    setSpecialDates(prev => [
      ...prev,
      { date: '', name: '', open: '09:00', close: '18:00', isOpen: true },
    ]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Working Hours</h1>
        <p className="text-gray-500">Set your business operating hours and special dates</p>
      </div>

      {/* Regular Hours */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          Regular Hours
        </h2>
        <div className="space-y-4">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="flex items-center space-x-4">
              <div className="w-32">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={hours[day as keyof typeof hours].isOpen}
                    onChange={(e) => handleHoursChange(day, 'isOpen', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">{day}</span>
                </label>
              </div>
              {hours[day as keyof typeof hours].isOpen ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={hours[day as keyof typeof hours].open}
                    onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={hours[day as keyof typeof hours].close}
                    onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <span className="text-gray-500">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Special Hours */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Special Hours
          </h2>
          <button
            onClick={addSpecialDate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Special Date
          </button>
        </div>

        <div className="space-y-4">
          {specialDates.map((date, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={date.date}
                    onChange={(e) => handleSpecialDateChange(index, 'date', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={date.name}
                    onChange={(e) => handleSpecialDateChange(index, 'name', e.target.value)}
                    placeholder="e.g., Christmas Day"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={date.isOpen}
                    onChange={(e) => handleSpecialDateChange(index, 'isOpen', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Open</span>
                </label>
                {date.isOpen && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={date.open}
                      onChange={(e) => handleSpecialDateChange(index, 'open', e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={date.close}
                      onChange={(e) => handleSpecialDateChange(index, 'close', e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-4 flex items-start space-x-2 text-sm text-gray-500">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <p>
            Special hours override regular hours for specific dates. Use this for holidays,
            special events, or temporary schedule changes.
          </p>
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