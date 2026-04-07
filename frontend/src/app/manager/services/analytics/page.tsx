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
  DollarSign,
  Users,
  Star,
  Calendar,
  ArrowUp,
  ArrowDown,
  Filter,
  Clock,
  Tag,
  BarChart,
  TrendingDown,
  Heart,
  AlertCircle
} from 'lucide-react';

// Mock data for service analytics
const mockAnalytics = {
  overview: {
    totalServices: 15,
    activeServices: 12,
    totalBookings: 2500,
    totalRevenue: 250000,
    averageRating: 4.7,
    revenueGrowth: 15.5,
    bookingGrowth: 12.3,
    averageServicePrice: 100,
  },
  categories: [
    {
      name: 'Hair',
      services: 8,
      bookings: 1500,
      revenue: 150000,
      growth: 12.5,
      averageRating: 4.8,
    },
    {
      name: 'Nails',
      services: 4,
      bookings: 600,
      revenue: 60000,
      growth: 8.2,
      averageRating: 4.6,
    },
    {
      name: 'Skin',
      services: 3,
      bookings: 400,
      revenue: 40000,
      growth: 15.0,
      averageRating: 4.7,
    },
  ],
  topServices: [
    {
      name: 'Haircut & Color',
      category: 'Hair',
      bookings: 450,
      revenue: 54000,
      growth: 15.2,
      rating: 4.8,
      averageDuration: 120,
    },
    {
      name: 'Hair Treatment',
      category: 'Hair',
      bookings: 380,
      revenue: 32300,
      growth: 12.8,
      rating: 4.7,
      averageDuration: 90,
    },
    {
      name: 'Styling',
      category: 'Hair',
      bookings: 320,
      revenue: 16000,
      growth: 10.5,
      rating: 4.6,
      averageDuration: 60,
    },
  ],
  trends: {
    bookings: [
      { month: 'Jan', count: 180 },
      { month: 'Feb', count: 195 },
      { month: 'Mar', count: 210 },
      { month: 'Apr', count: 205 },
      { month: 'May', count: 220 },
      { month: 'Jun', count: 230 },
    ],
    revenue: [
      { month: 'Jan', amount: 18000 },
      { month: 'Feb', amount: 19500 },
      { month: 'Mar', amount: 21000 },
      { month: 'Apr', amount: 20500 },
      { month: 'May', amount: 22000 },
      { month: 'Jun', amount: 23000 },
    ],
    ratings: [
      { month: 'Jan', rating: 4.6 },
      { month: 'Feb', rating: 4.7 },
      { month: 'Mar', rating: 4.7 },
      { month: 'Apr', rating: 4.8 },
      { month: 'May', rating: 4.8 },
      { month: 'Jun', rating: 4.7 },
    ],
  },
  insights: [
    {
      type: 'growth',
      title: 'Hair Services Growth',
      description: 'Hair services showing strong growth of 12.5% this month',
      trend: 'up',
      value: '12.5%',
    },
    {
      type: 'popularity',
      title: 'New Service Popularity',
      description: 'New skin treatment service gaining traction',
      trend: 'up',
      value: '15.0%',
    },
    {
      type: 'rating',
      title: 'Service Ratings',
      description: 'Overall service ratings improved to 4.7',
      trend: 'up',
      value: '4.7',
    },
    {
      type: 'alert',
      title: 'Low Performing Service',
      description: 'Basic manicure service showing declining bookings',
      trend: 'down',
      value: '-8.2%',
    },
  ],
};

export default function ServiceAnalyticsPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Service Analytics</h1>
          <p className="text-gray-500">Track service performance and trends</p>
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
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Tag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.overview.totalServices}</div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {mockAnalytics.overview.activeServices} active
              </div>
              {getMetricChange(5.2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.overview.totalBookings}</div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                This month
              </div>
              {getMetricChange(mockAnalytics.overview.bookingGrowth)}
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
                Avg. ${mockAnalytics.overview.averageServicePrice} per service
              </div>
              {getMetricChange(mockAnalytics.overview.revenueGrowth)}
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
      </div>

      {/* Detailed Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="services">Top Services</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Categories</CardTitle>
                <CardDescription>Performance by service category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.categories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Tag className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-gray-500">
                            {category.services} services
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">${category.revenue.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">
                            {category.bookings} bookings
                          </div>
                        </div>
                        {getMetricChange(category.growth)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>Important trends and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.insights.map((insight, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          insight.type === 'alert' ? 'bg-red-100' :
                          insight.type === 'growth' ? 'bg-green-100' :
                          insight.type === 'popularity' ? 'bg-purple-100' :
                          'bg-blue-100'
                        }`}>
                          {insight.type === 'alert' ? <AlertCircle className="h-5 w-5 text-red-600" /> :
                           insight.type === 'growth' ? <TrendingUp className="h-5 w-5 text-green-600" /> :
                           insight.type === 'popularity' ? <Heart className="h-5 w-5 text-purple-600" /> :
                           <Star className="h-5 w-5 text-blue-600" />}
                        </div>
                        <div>
                          <div className="font-medium">{insight.title}</div>
                          <div className="text-sm text-gray-500">
                            {insight.description}
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${
                        insight.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {insight.value}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockAnalytics.categories.map((category) => (
              <Card key={category.name}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>Category performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Total Services</div>
                    <div className="text-2xl font-bold">{category.services}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Total Bookings</div>
                    <div className="text-2xl font-bold">{category.bookings}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Revenue</div>
                    <div className="text-2xl font-bold">${category.revenue.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Growth</div>
                    {getMetricChange(category.growth)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Average Rating</div>
                    <div className="text-2xl font-bold">{category.averageRating}</div>
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
              <CardTitle>Top Performing Services</CardTitle>
              <CardDescription>Most popular services by revenue and bookings</CardDescription>
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
                          {service.category} • {service.averageDuration} min
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">${service.revenue.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          {service.bookings} bookings
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{service.rating}</span>
                      </div>
                      {getMetricChange(service.growth)}
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
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>Monthly booking volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.trends.bookings.map((trend) => (
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

            <Card>
              <CardHeader>
                <CardTitle>Rating Trends</CardTitle>
                <CardDescription>Monthly average ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.trends.ratings.map((trend) => (
                    <div key={trend.month} className="flex items-center justify-between">
                      <div className="text-sm font-medium">{trend.month}</div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-2xl font-bold">{trend.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockAnalytics.insights.map((insight, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {insight.type === 'alert' ? <AlertCircle className="h-5 w-5 text-red-600" /> :
                     insight.type === 'growth' ? <TrendingUp className="h-5 w-5 text-green-600" /> :
                     insight.type === 'popularity' ? <Heart className="h-5 w-5 text-purple-600" /> :
                     <Star className="h-5 w-5 text-blue-600" />}
                    <span>{insight.title}</span>
                  </CardTitle>
                  <CardDescription>{insight.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${
                    insight.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {insight.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 