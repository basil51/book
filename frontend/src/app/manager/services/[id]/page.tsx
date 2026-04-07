'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Tag,
  Calendar,
  User,
  Edit,
  AlertCircle,
  TrendingDown,
  BarChart,
  Heart,
  Settings
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data for a single service
const mockService = {
  id: 1,
  name: 'Haircut & Color',
  category: 'Hair',
  duration: 120,
  price: 120,
  status: 'active',
  popularity: 4.8,
  totalBookings: 450,
  revenue: 54000,
  description: 'Complete hair transformation with cut and color service',
  longDescription: 'Our signature haircut and color service combines expert cutting techniques with premium color products to create your perfect look. Includes consultation, shampoo, cut, color application, and styling.',
  requirements: [
    'Initial consultation required',
    'Patch test for new clients',
    'Minimum 2 weeks between color services'
  ],
  staff: [
    {
      id: 1,
      name: 'Sarah Wilson',
      role: 'Senior Stylist',
      bookings: 280,
      rating: 4.9,
      availability: 'Mon-Fri, 9am-5pm'
    },
    {
      id: 2,
      name: 'Mike Johnson',
      role: 'Color Specialist',
      bookings: 170,
      rating: 4.8,
      availability: 'Tue-Sat, 10am-6pm'
    }
  ],
  bookings: [
    {
      id: 1,
      date: '2024-03-15',
      time: '10:00 AM',
      client: 'Emma Thompson',
      staff: 'Sarah Wilson',
      status: 'completed',
      price: 120,
      rating: 5
    },
    {
      id: 2,
      date: '2024-03-14',
      time: '2:30 PM',
      client: 'James Wilson',
      staff: 'Mike Johnson',
      status: 'completed',
      price: 120,
      rating: 4
    }
  ],
  analytics: {
    monthlyBookings: [
      { month: 'Jan', count: 35 },
      { month: 'Feb', count: 42 },
      { month: 'Mar', count: 45 },
      { month: 'Apr', count: 38 },
      { month: 'May', count: 40 },
      { month: 'Jun', count: 45 }
    ],
    revenue: [
      { month: 'Jan', amount: 4200 },
      { month: 'Feb', amount: 5040 },
      { month: 'Mar', amount: 5400 },
      { month: 'Apr', amount: 4560 },
      { month: 'May', amount: 4800 },
      { month: 'Jun', amount: 5400 }
    ],
    ratings: [
      { rating: 5, count: 280 },
      { rating: 4, count: 120 },
      { rating: 3, count: 35 },
      { rating: 2, count: 10 },
      { rating: 1, count: 5 }
    ]
  }
};

export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      featured: 'bg-purple-100 text-purple-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="p-6 space-y-6">
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
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">{mockService.name}</h1>
              {getStatusBadge(mockService.status)}
            </div>
            <p className="text-gray-500">{mockService.category} Service</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Service
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Manage Settings
          </Button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockService.totalBookings}</div>
            <div className="text-xs text-gray-500">
              Last 30 days: {mockService.analytics.monthlyBookings[mockService.analytics.monthlyBookings.length - 1].count}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockService.revenue.toLocaleString()}</div>
            <div className="text-xs text-gray-500">
              Avg. ${(mockService.revenue / mockService.totalBookings).toFixed(2)} per booking
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popularity</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockService.popularity}</div>
            <div className="text-xs text-gray-500">
              Based on {mockService.totalBookings} bookings
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(mockService.duration)}</div>
            <div className="text-xs text-gray-500">
              Average service time
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Description</h4>
                  <p className="text-gray-700">{mockService.longDescription}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Requirements</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {mockService.requirements.map((req, index) => (
                      <li key={index} className="text-gray-700">{req}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Price</h4>
                    <div className="text-2xl font-bold">${mockService.price}</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Duration</h4>
                    <div className="text-2xl font-bold">{formatDuration(mockService.duration)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockService.bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{booking.client}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${booking.price}</div>
                        <div className="text-sm text-gray-500">with {booking.staff}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Staff</CardTitle>
              <CardDescription>Staff members who can perform this service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockService.staff.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">{member.bookings} bookings</div>
                        <div className="text-sm text-gray-500">Rating: {member.rating}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.availability}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
              <CardDescription>Complete history of service bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockService.bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{booking.client}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">${booking.price}</div>
                        <div className="text-sm text-gray-500">with {booking.staff}</div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{booking.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Bookings</CardTitle>
                <CardDescription>Booking trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockService.analytics.monthlyBookings.map((month) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <div className="text-sm font-medium">{month.month}</div>
                      <div className="text-2xl font-bold">{month.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue from this service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockService.analytics.revenue.map((month) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <div className="text-sm font-medium">{month.month}</div>
                      <div className="text-2xl font-bold">${month.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Ratings</CardTitle>
                <CardDescription>Distribution of customer ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockService.analytics.ratings.map((rating) => (
                    <div key={rating.rating} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{rating.rating} stars</span>
                      </div>
                      <div className="text-2xl font-bold">{rating.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Service Settings</CardTitle>
              <CardDescription>Configure service parameters and availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Basic Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Service Name</label>
                      <div className="text-lg font-medium">{mockService.name}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Category</label>
                      <div className="text-lg font-medium">{mockService.category}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Duration</label>
                      <div className="text-lg font-medium">{formatDuration(mockService.duration)}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Price</label>
                      <div className="text-lg font-medium">${mockService.price}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Availability Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Minimum Notice</label>
                      <div className="text-lg font-medium">24 hours</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Maximum Bookings Per Day</label>
                      <div className="text-lg font-medium">8</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Buffer Time</label>
                      <div className="text-lg font-medium">15 minutes</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Online Booking</label>
                      <div className="text-lg font-medium">Enabled</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 