'use client';
// src/components/BusinessForm.tsx
import React, { useState, useEffect } from 'react';
import { Building2, Upload, Clock, Plus, X, Copy, Calendar } from 'lucide-react';
import api from '@/lib/api';

interface TimeSlot {
  open: string;
  close: string;
}

interface WorkingHours {
  slots: TimeSlot[];
  isHoliday: boolean;
}

interface BusinessFormData {
  name: string;
  description: string;
  logo_url?: string;
  address: string;
  phone: string;
  email: string;
  timezone: string;
  working_hours: { [key: string]: WorkingHours };
  status: string;
}

interface BusinessFormProps {
  initialData?: Partial<BusinessFormData> | any;
  onSubmit: (data: BusinessFormData) => Promise<void>;
  onCancel?: () => void;
  submitButtonText?: string;
  loading?: boolean;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
];

const shortNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const uploadLogo = async (file: File | null): Promise<string> => {
  if (!file) return '';
  
  const formData = new FormData();
  formData.append('logo', file);
 
  const response = await api.post('/upload/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.logoUrl;
};

// Function to convert API format to form format
const convertApiToFormFormat = (apiWorkingHours: {
  [key: string]: unknown;
}): { [key: string]: WorkingHours } => {
  const formFormat: { [key: string]: WorkingHours } = {};

  DAYS_OF_WEEK.forEach((day) => {
    const dayHours = apiWorkingHours[day.key];
    if (
      dayHours &&
      typeof dayHours === 'object' &&
      !Array.isArray(dayHours) &&
      'slots' in (dayHours as object)
    ) {
      const wh = dayHours as WorkingHours;
      formFormat[day.key] = {
        slots:
          wh.slots?.length > 0
            ? wh.slots
            : [{ open: '09:00', close: '17:00' }],
        isHoliday: wh.isHoliday ?? false,
      };
    } else if (Array.isArray(dayHours) && dayHours.length > 0) {
      formFormat[day.key] = {
        slots: dayHours as TimeSlot[],
        isHoliday: false,
      };
    } else if (
      dayHours &&
      typeof dayHours === 'object' &&
      !Array.isArray(dayHours) &&
      'open' in (dayHours as object) &&
      'close' in (dayHours as object)
    ) {
      const o = dayHours as { open: string; close: string };
      formFormat[day.key] = {
        slots: [{ open: o.open, close: o.close }],
        isHoliday: false,
      };
    } else {
      formFormat[day.key] = {
        slots: [{ open: '09:00', close: '17:00' }],
        isHoliday: true,
      };
    }
  });

  return formFormat;
};

// Function to convert working hours JSON to display format
const displayWorkingHours = (workingHours: { [key: string]: WorkingHours }): string => {
  const dayGroups: { [key: string]: string[] } = {};
  
  Object.entries(workingHours).forEach(([day, hours]) => {
    if (hours.isHoliday || hours.slots.length === 0) return; // Skip holidays and closed days
    
    const timeRanges = hours.slots.map(slot => `${slot.open}-${slot.close}`).join(', ');
    
    if (!dayGroups[timeRanges]) {
      dayGroups[timeRanges] = [];
    }
    dayGroups[timeRanges].push(day);
  });

  const formattedGroups = Object.entries(dayGroups).map(([timeRanges, days]) => {
    if (days.length === 1) {
      const idx = DAYS_OF_WEEK.findIndex(d => d.key === days[0]);
      return `${shortNames[idx]}: ${timeRanges}`;
    }
    
    // Check if days are consecutive
    const dayIndices = days.map(day => DAYS_OF_WEEK.findIndex(d => d.key === day));
    const sortedIndices = dayIndices.sort((a, b) => a - b);
    let isConsecutive = true;
    for (let i = 1; i < sortedIndices.length; i++) {
      if (sortedIndices[i] !== sortedIndices[i-1] + 1) {
        isConsecutive = false;
        break;
      }
    }
    
    if (isConsecutive && days.length > 1) {
      const firstDay = shortNames[sortedIndices[0]];
      const lastDay = shortNames[sortedIndices[sortedIndices.length - 1]];
      return `${firstDay}-${lastDay}: ${timeRanges}`;
    } else {
      return days.map(day => shortNames[DAYS_OF_WEEK.findIndex(d => d.key === day)]).join(', ') + `: ${timeRanges}`;
    }
  });
  
  return formattedGroups.join(' | ');
};

// Function to reorder days based on first day of week
const reorderDays = (firstDay: string) => {
  const firstDayIndex = DAYS_OF_WEEK.findIndex(day => day.key === firstDay);
  if (firstDayIndex === -1) return DAYS_OF_WEEK;
  
  return [
    ...DAYS_OF_WEEK.slice(firstDayIndex),
    ...DAYS_OF_WEEK.slice(0, firstDayIndex)
  ];
};

export default function BusinessForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  submitButtonText = "Save Business",
  loading = false 
}: BusinessFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState('monday');
  
  const [formData, setFormData] = useState<BusinessFormData>({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    timezone: 'UTC',
    working_hours: DAYS_OF_WEEK.reduce((acc, day) => ({
      ...acc,
      [day.key]: { 
        slots: [{ open: '09:00', close: '17:00' }], 
        isHoliday: false 
      }
    }), {}),
    status: 'active',
  });

  // Initialize form data when initialData changes
  useEffect(() => {
    if (initialData) {
      const convertedWorkingHours = initialData.working_hours 
        ? convertApiToFormFormat(initialData.working_hours)
        : DAYS_OF_WEEK.reduce((acc, day) => ({
            ...acc,
            [day.key]: { 
              slots: [{ open: '09:00', close: '17:00' }], 
              isHoliday: false 
            }
          }), {});

      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        logo_url: initialData.logo_url || '',
        address: initialData.address || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        timezone: initialData.timezone || 'UTC',
        working_hours: convertedWorkingHours,
        status: initialData.status || 'active',
      });

      if (initialData.logo_url) {
        setLogoPreview(initialData.logo_url);
      }
    }
  }, [initialData]);

  // Get reordered days based on first day of week
  const orderedDays = reorderDays(firstDayOfWeek);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeSlotChange = (day: string, slotIndex: number, type: 'open' | 'close', value: string) => {
    setFormData(prev => ({
      ...prev,
      working_hours: {
        ...prev.working_hours,
        [day]: {
          ...prev.working_hours[day],
          slots: prev.working_hours[day].slots.map((slot, index) => 
            index === slotIndex ? { ...slot, [type]: value } : slot
          )
        }
      }
    }));
  };

  const addTimeSlot = (day: string) => {
    setFormData(prev => ({
      ...prev,
      working_hours: {
        ...prev.working_hours,
        [day]: {
          ...prev.working_hours[day],
          slots: [...prev.working_hours[day].slots, { open: '09:00', close: '17:00' }]
        }
      }
    }));
  };

  const removeTimeSlot = (day: string, slotIndex: number) => {
    setFormData(prev => ({
      ...prev,
      working_hours: {
        ...prev.working_hours,
        [day]: {
          ...prev.working_hours[day],
          slots: prev.working_hours[day].slots.filter((_, index) => index !== slotIndex)
        }
      }
    }));
  };

  const handleHolidayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      working_hours: {
        ...prev.working_hours,
        [day]: {
          ...prev.working_hours[day],
          isHoliday: !prev.working_hours[day].isHoliday,
          slots: !prev.working_hours[day].isHoliday ? [] : [{ open: '09:00', close: '17:00' }]
        }
      }
    }));
  };

  const copyWorkingHours = (fromDay: string) => {
    const sourceHours = formData.working_hours[fromDay];
    const currentIndex = orderedDays.findIndex(day => day.key === fromDay);
    
    if (currentIndex !== -1 && currentIndex < orderedDays.length - 1) {
      const nextDay = orderedDays[currentIndex + 1].key;
      setFormData(prev => ({
        ...prev,
        working_hours: {
          ...prev.working_hours,
          [nextDay]: { 
            slots: [...sourceHours.slots], 
            isHoliday: sourceHours.isHoliday 
          }
        }
      }));
    }
  };

  const copyToAllDays = (fromDay: string) => {
    const sourceHours = formData.working_hours[fromDay];
    const updatedHours = { ...formData.working_hours };
    
    Object.keys(updatedHours).forEach(day => {
      if (day !== fromDay) {
        updatedHours[day] = { 
          slots: [...sourceHours.slots], 
          isHoliday: sourceHours.isHoliday 
        };
      }
    });
    
    setFormData(prev => ({
      ...prev,
      working_hours: updatedHours
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Starting logo upload...');
      const logoUrl = await uploadLogo(logoFile);
      console.log('Logo uploaded, URL:', logoUrl);
      
      // Create the correct JSON format for working hours
      const workingHoursForAPI = Object.fromEntries(
        Object.entries(formData.working_hours).map(([day, hours]) => [
          day,
          {
            slots: hours.isHoliday ? [] : hours.slots,
            isHoliday: hours.isHoliday
          }
        ])
      );
      
      const requestData: BusinessFormData = {
        name: formData.name,
        description: formData.description,
        logo_url: logoUrl || formData.logo_url,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        timezone: formData.timezone,
        working_hours: workingHoursForAPI,
        status: formData.status
      };
      
      console.log('Submitting business data:', requestData);
      await onSubmit(requestData);
    } catch (error) {
      console.error('Error submitting business:', error);
      alert('Failed to submit business. Please try again.');
    }
  };

  // Preview the formatted working hours
  const previewWorkingHours = displayWorkingHours(formData.working_hours);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Logo Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Business Logo
        </label>
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 relative">
            {logoPreview || formData.logo_url ? (
              <img
                src={logoPreview || formData.logo_url}
                alt="Logo preview"
                className="h-24 w-24 rounded-lg object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload Logo</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </label>
            <p className="mt-1 text-sm text-gray-500">
              PNG, JPG up to 2MB
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 gap-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address *
          </label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Timezone
            </label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Working Hours</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <select
                value={firstDayOfWeek}
                onChange={(e) => setFirstDayOfWeek(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {DAYS_OF_WEEK.map(day => (
                  <option key={day.key} value={day.key}>{day.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Working Hours Preview */}
        {previewWorkingHours && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Working Hours Preview:</h3>
            <p className="text-sm text-blue-800 font-mono">{previewWorkingHours}</p>
          </div>
        )}

        <div className="space-y-4">
          {orderedDays.map((day) => (
            <div key={day.key} className={`p-4 rounded-lg border ${
              formData.working_hours[day.key].isHoliday ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">{day.label}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleHolidayToggle(day.key)}
                    className={`px-3 py-1 text-xs rounded-md ${
                      formData.working_hours[day.key].isHoliday
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {formData.working_hours[day.key].isHoliday ? 'Open' : 'Holiday'}
                  </button>
                  
                  {!formData.working_hours[day.key].isHoliday && (
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => copyWorkingHours(day.key)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="Copy to next day"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToAllDays(day.key)}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                        title="Copy to all days"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {formData.working_hours[day.key].isHoliday ? (
                <div className="flex items-center justify-center py-4">
                  <span className="text-red-600 font-medium">Holiday (Closed)</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.working_hours[day.key].slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="time"
                          value={slot.open}
                          onChange={(e) => handleTimeSlotChange(day.key, slotIndex, 'open', e.target.value)}
                          className="block border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={slot.close}
                          onChange={(e) => handleTimeSlotChange(day.key, slotIndex, 'close', e.target.value)}
                          className="block border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      {formData.working_hours[day.key].slots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(day.key, slotIndex)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="Remove time slot"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addTimeSlot(day.key)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add time slot</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-2">Format Information:</p>
          <p>• Working hours support multiple time slots per day (e.g., 08:00-12:00, 14:00-18:00)</p>
          <p>• Final JSON format: <code className="bg-white px-1 rounded">{`{"day": [{"open": "08:00", "close": "12:00"}, {"open": "14:00", "close": "18:00"}]}`}</code></p>
          <p>• Holiday days will be saved as empty arrays: <code className="bg-white px-1 rounded">{`{"day": []}`}</code></p>
          <p>• Display format automatically groups consecutive days with identical schedules</p>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>{loading ? 'Saving...' : submitButtonText}</span>
        </button>
      </div>
    </form>
  );
} 