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
  Users,
  TrendingUp,
  DollarSign,
  Star,
  Calendar,
  ArrowUp,
  ArrowDown,
  Filter,
  UserPlus,
  UserMinus,
  Clock,
  Heart,
  Tag
} from 'lucide-react';

// Mock data for client analytics
const mockAnalytics = {
  overview: {
    totalClients: 1250,
    activeClients: 980,
    newClients: 45,
    churnedClients: 12,
    averageRating: 4.7,
    totalRevenue: 125000,
    revenueGrowth: 15.5,
    averageSpend: 95,
    clientRetention: 88,
  },
  trends: {
    newClients: [
      { month: 'Jan', count: 35 },
      { month: 'Feb', count: 42 },
      { month: 'Mar', count: 45 },
      { month: 'Apr', count: 38 },
      { month: 'May', count: 40 },
      { month: 'Jun', count: 45 },
    ],
    revenue: [
      { month: 'Jan', amount: 18500 },
      { month: 'Feb', amount: 19200 },
      { month: 'Mar', amount: 20100 },
      { month: 'Apr', amount: 19800 },
      { month: 'May', amount: 20500 },
      { month: 'Jun', amount: 21000 },
    ],
    retention: [
      { month: 'Jan', rate: 85 },
      { month: 'Feb', rate: 86 },
      { month: 'Mar', rate: 87 },
      { month: 'Apr', rate: 88 },
      { month: 'May', rate: 88 },
      { month: 'Jun', rate: 88 },
    ],
  },
  segments: [
    {
      name: 'VIP Clients',
      count: 150,
      revenue: 45000,
      growth: 12.5,
      averageSpend: 300,
    },
    {
      name: 'Regular Clients',
      count: 680,
      revenue: 65000,
      growth: 8.2,
      averageSpend: 95,
    },
    {
      name: 'New Clients',
      count: 150,
      revenue: 15000,
      growth: 25.0,
      averageSpend: 100,
    },
  ],
  topServices: [
    {
      name: 'Haircut & Color',
      clients: 450,
      revenue: 45000,
      growth: 15.2,
    },
    {
      name: 'Hair Treatment',
      clients: 380,
      revenue: 28500,
      growth: 12.8,
    },
    {
      name: 'Styling',
      clients: 320,
      revenue: 16000,
      growth: 10.5,
    },
  ],
};

export default function ClientAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

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
          <h1 className="text-2xl font-bold text-gray-900">Client Analytics</h1>
          <p className="text-gray-500">Track client metrics and business performance</p>
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
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.overview.totalClients}</div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {mockAnalytics.overview.activeClients} active
              </div>
              {getMetricChange(5.2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Clients</CardTitle>
            <UserPlus className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.overview.newClients}</div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                This month
              </div>
              {getMetricChange(12.5)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.overview.averageRating}</div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Based on all reviews
              </div>
              {getMetricChange(2.1)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockAnalytics.overview.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Avg. ${mockAnalytics.overview.averageSpend} per client
              </div>
              {getMetricChange(mockAnalytics.overview.revenueGrowth)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="segments">Client Segments</TabsTrigger>
          <TabsTrigger value="services">Top Services</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Retention</CardTitle>
                <CardDescription>Track client loyalty and retention rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Retention Rate</div>
                    <div className="text-2xl font-bold">{mockAnalytics.overview.clientRetention}%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Churned Clients</div>
                    <div className="text-2xl font-bold text-red-600">{mockAnalytics.overview.churnedClients}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Active Clients</div>
                    <div className="text-2xl font-bold text-green-600">{mockAnalytics.overview.activeClients}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Growth</CardTitle>
                <CardDescription>New client acquisition and growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">New Clients (MTD)</div>
                    <div className="text-2xl font-bold text-green-600">{mockAnalytics.overview.newClients}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Growth Rate</div>
                    <div className="text-2xl font-bold">5.2%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Conversion Rate</div>
                    <div className="text-2xl font-bold">68%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Client Segments Tab */}
        <TabsContent value="segments">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockAnalytics.segments.map((segment) => (
              <Card key={segment.name}>
                <CardHeader>
                  <CardTitle>{segment.name}</CardTitle>
                  <CardDescription>Client segment analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Total Clients</div>
                    <div className="text-2xl font-bold">{segment.count}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Revenue</div>
                    <div className="text-2xl font-bold">${segment.revenue.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Growth</div>
                    {getMetricChange(segment.growth)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Avg. Spend</div>
                    <div className="text-2xl font-bold">${segment.averageSpend}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Top Services Tab */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Top Services</CardTitle>
              <CardDescription>Most popular services by revenue and client count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.topServices.map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Tag className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-500">
                          {service.clients} clients
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">${service.revenue.toLocaleString()}</div>
                        {getMetricChange(service.growth)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>New Client Trends</CardTitle>
                <CardDescription>Monthly new client acquisition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.trends.newClients.map((trend) => (
                    <div key={trend.month} className="flex items-center justify-between">
                      <div className="text-sm font-medium">{trend.month}</div>
                      <div className="text-2xl font-bold">{trend.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.trends.revenue.map((trend) => (
                    <div key={trend.month} className="flex items-center justify-between">
                      <div className="text-sm font-medium">{trend.month}</div>
                      <div className="text-2xl font-bold">${trend.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 