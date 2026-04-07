'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp,
  Users,
  Clock,
  Star,
  DollarSign,
  Calendar,
  ArrowUp,
  ArrowDown,
  Filter
} from 'lucide-react';

// Mock data for staff performance
const mockStaff = [
  {
    id: 1,
    name: 'Sarah Wilson',
    role: 'Senior Stylist',
    metrics: {
      totalAppointments: 156,
      completedAppointments: 150,
      cancellationRate: 3.8,
      averageRating: 4.8,
      totalRevenue: 7020,
      revenueGrowth: 12.5,
      averageSessionTime: 45,
      clientRetention: 85,
    },
    recentReviews: [
      { id: 1, rating: 5, comment: 'Excellent service!', date: '2024-03-19' },
      { id: 2, rating: 4, comment: 'Very professional', date: '2024-03-18' },
    ],
  },
  {
    id: 2,
    name: 'Mike Johnson',
    role: 'Junior Stylist',
    metrics: {
      totalAppointments: 89,
      completedAppointments: 85,
      cancellationRate: 4.5,
      averageRating: 4.5,
      totalRevenue: 3560,
      revenueGrowth: 8.2,
      averageSessionTime: 40,
      clientRetention: 78,
    },
    recentReviews: [
      { id: 3, rating: 5, comment: 'Great attention to detail', date: '2024-03-19' },
      { id: 4, rating: 4, comment: 'Good service', date: '2024-03-17' },
    ],
  },
];

export default function StaffPerformancePage() {
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  const selectedStaffData = selectedStaff === 'all' 
    ? mockStaff 
    : mockStaff.filter(staff => staff.id.toString() === selectedStaff);

  const getMetricChange = (value: number) => {
    const isPositive = value >= 0;
    return (
      <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
        {Math.abs(value)}%
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Performance</h1>
          <p className="text-gray-500">Track and analyze staff performance metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 90 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
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
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {selectedStaffData.map(staff => (
          <React.Fragment key={staff.id}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{staff.metrics.totalAppointments}</div>
                <div className="text-xs text-gray-500">
                  {staff.metrics.completedAppointments} completed
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{staff.metrics.averageRating}</div>
                <div className="text-xs text-gray-500">
                  Based on {staff.recentReviews.length} recent reviews
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${staff.metrics.totalRevenue}</div>
                {getMetricChange(staff.metrics.revenueGrowth)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Client Retention</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{staff.metrics.clientRetention}%</div>
                <div className="text-xs text-gray-500">
                  Returning clients
                </div>
              </CardContent>
            </Card>
          </React.Fragment>
        ))}
      </div>

      {/* Detailed Performance */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {selectedStaffData.map(staff => (
            <Card key={staff.id}>
              <CardHeader>
                <CardTitle>{staff.name}</CardTitle>
                <CardDescription>{staff.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Cancellation Rate</div>
                    <div className="text-2xl font-bold">{staff.metrics.cancellationRate}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Average Session Time</div>
                    <div className="text-2xl font-bold">{staff.metrics.averageSessionTime} min</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Revenue Growth</div>
                    <div className="flex items-center">
                      <div className="text-2xl font-bold">{staff.metrics.revenueGrowth}%</div>
                      {getMetricChange(staff.metrics.revenueGrowth)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Client Retention</div>
                    <div className="text-2xl font-bold">{staff.metrics.clientRetention}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {selectedStaffData.map(staff => (
            <Card key={staff.id}>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>Latest client feedback for {staff.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staff.recentReviews.map(review => (
                    <div key={review.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 font-medium">{review.rating}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{review.comment}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
} 