'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AppointmentSettingsPage() {
  const [settings, setSettings] = useState({
    bookingWindow: '30',
    minNotice: '2',
    maxBookingsPerDay: '20',
    bufferTime: '15',
    cancellationPolicy: '24',
    reminderTime: '24',
    autoConfirm: true,
    allowOnlineBooking: true,
    requireDeposit: false,
    depositAmount: '20',
    workingHours: {
      monday: { start: '09:00', end: '17:00', enabled: true },
      tuesday: { start: '09:00', end: '17:00', enabled: true },
      wednesday: { start: '09:00', end: '17:00', enabled: true },
      thursday: { start: '09:00', end: '17:00', enabled: true },
      friday: { start: '09:00', end: '17:00', enabled: true },
      saturday: { start: '10:00', end: '15:00', enabled: true },
      sunday: { start: '00:00', end: '00:00', enabled: false },
    },
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleWorkingHoursChange = (day: string, field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day as keyof typeof prev.workingHours],
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appointment Settings</h1>
        <p className="text-gray-500">Configure how appointments are managed in your business</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="booking">Booking Rules</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="hours">Working Hours</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic appointment configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Booking Window (days)</Label>
                    <Input
                      type="number"
                      value={settings.bookingWindow}
                      onChange={(e) => handleSettingChange('bookingWindow', e.target.value)}
                      placeholder="30"
                    />
                    <p className="text-sm text-gray-500">How far in advance clients can book</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Notice (hours)</Label>
                    <Input
                      type="number"
                      value={settings.minNotice}
                      onChange={(e) => handleSettingChange('minNotice', e.target.value)}
                      placeholder="2"
                    />
                    <p className="text-sm text-gray-500">Minimum time before appointment</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Maximum Bookings Per Day</Label>
                    <Input
                      type="number"
                      value={settings.maxBookingsPerDay}
                      onChange={(e) => handleSettingChange('maxBookingsPerDay', e.target.value)}
                      placeholder="20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Buffer Time (minutes)</Label>
                    <Input
                      type="number"
                      value={settings.bufferTime}
                      onChange={(e) => handleSettingChange('bufferTime', e.target.value)}
                      placeholder="15"
                    />
                    <p className="text-sm text-gray-500">Time between appointments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Online Booking</CardTitle>
                <CardDescription>Configure online booking settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Online Booking</Label>
                    <p className="text-sm text-gray-500">Enable clients to book appointments online</p>
                  </div>
                  <Switch
                    checked={settings.allowOnlineBooking}
                    onCheckedChange={(checked) => handleSettingChange('allowOnlineBooking', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Deposit</Label>
                    <p className="text-sm text-gray-500">Ask for a deposit when booking</p>
                  </div>
                  <Switch
                    checked={settings.requireDeposit}
                    onCheckedChange={(checked) => handleSettingChange('requireDeposit', checked)}
                  />
                </div>
                {settings.requireDeposit && (
                  <div className="space-y-2">
                    <Label>Deposit Amount ($)</Label>
                    <Input
                      type="number"
                      value={settings.depositAmount}
                      onChange={(e) => handleSettingChange('depositAmount', e.target.value)}
                      placeholder="20"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Booking Rules */}
        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle>Booking Rules</CardTitle>
              <CardDescription>Set rules for appointment bookings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Cancellation Policy (hours)</Label>
                  <Input
                    type="number"
                    value={settings.cancellationPolicy}
                    onChange={(e) => handleSettingChange('cancellationPolicy', e.target.value)}
                    placeholder="24"
                  />
                  <p className="text-sm text-gray-500">Minimum notice for cancellations</p>
                </div>
                <div className="space-y-2">
                  <Label>Auto-confirm Appointments</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.autoConfirm}
                      onCheckedChange={(checked) => handleSettingChange('autoConfirm', checked)}
                    />
                    <span className="text-sm text-gray-500">Automatically confirm new bookings</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure appointment reminders and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Reminder Time (hours before)</Label>
                <Input
                  type="number"
                  value={settings.reminderTime}
                  onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
                  placeholder="24"
                />
                <p className="text-sm text-gray-500">When to send appointment reminders</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Working Hours */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
              <CardDescription>Set your business operating hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(settings.workingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Switch
                      checked={hours.enabled}
                      onCheckedChange={(checked) => handleWorkingHoursChange(day, 'enabled', checked)}
                    />
                    <Label className="capitalize">{day}</Label>
                  </div>
                  {hours.enabled && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={hours.start}
                        onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={hours.end}
                        onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
} 