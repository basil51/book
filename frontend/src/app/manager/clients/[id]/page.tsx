'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Star,
  Clock,
  User,
  Edit,
  Plus,
  FileText,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Clock as ClockIcon,
  Heart,
  Tag
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data for a single client
const mockClient = {
  id: 1,
  name: 'Emma Thompson',
  email: 'emma.thompson@example.com',
  phone: '+1 (555) 123-4567',
  status: 'active',
  joinDate: '2023-06-15',
  totalAppointments: 12,
  lastVisit: '2024-03-15',
  totalSpent: 850,
  loyaltyPoints: 850,
  preferredStaff: 'Sarah Wilson',
  notes: 'Prefers morning appointments',
  allergies: ['Certain hair products'],
  preferences: ['Morning appointments', 'Natural products'],
  appointments: [
    {
      id: 1,
      date: '2024-03-15',
      time: '10:00 AM',
      service: 'Haircut & Color',
      staff: 'Sarah Wilson',
      status: 'completed',
      price: 120,
    },
    {
      id: 2,
      date: '2024-02-28',
      time: '11:30 AM',
      service: 'Hair Treatment',
      staff: 'Sarah Wilson',
      status: 'completed',
      price: 85,
    },
  ],
  purchases: [
    {
      id: 1,
      date: '2024-03-15',
      items: ['Shampoo', 'Conditioner'],
      total: 65,
    },
    {
      id: 2,
      date: '2024-02-28',
      items: ['Hair Mask'],
      total: 35,
    },
  ],
  loyaltyHistory: [
    {
      date: '2024-03-15',
      points: 120,
      type: 'appointment',
      description: 'Haircut & Color Service',
    },
    {
      date: '2024-02-28',
      points: 85,
      type: 'appointment',
      description: 'Hair Treatment',
    },
  ],
};

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      vip: 'bg-purple-100 text-purple-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.toUpperCase()}
      </span>
    );
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
              <h1 className="text-2xl font-bold text-gray-900">{mockClient.name}</h1>
              {getStatusBadge(mockClient.status)}
            </div>
            <p className="text-gray-500">Client since {new Date(mockClient.joinDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockClient.totalAppointments}</div>
            <div className="text-xs text-gray-500">
              Last visit: {new Date(mockClient.lastVisit).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockClient.totalSpent}</div>
            <div className="text-xs text-gray-500">
              Average: ${(mockClient.totalSpent / mockClient.totalAppointments).toFixed(2)} per visit
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockClient.loyaltyPoints}</div>
            <div className="text-xs text-gray-500">
              Available for redemption
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preferred Staff</CardTitle>
            <User className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockClient.preferredStaff}</div>
            <div className="text-xs text-gray-500">
              Most frequent stylist
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          <TabsTrigger value="notes">Notes & Preferences</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{mockClient.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{mockClient.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Joined: {new Date(mockClient.joinDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences & Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockClient.preferences.map((pref, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Allergies & Alerts</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockClient.allergies.map((allergy, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockClient.appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{appointment.service}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${appointment.price}</div>
                      <div className="text-sm text-gray-500">with {appointment.staff}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
              <CardDescription>Complete history of client appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockClient.appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{appointment.service}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">${appointment.price}</div>
                        <div className="text-sm text-gray-500">with {appointment.staff}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchases Tab */}
        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>Products and services purchased</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockClient.purchases.map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Tag className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {purchase.items.join(', ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(purchase.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${purchase.total}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loyalty Tab */}
        <TabsContent value="loyalty">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Points History</CardTitle>
              <CardDescription>Track points earned and redeemed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockClient.loyaltyHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Star className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">{entry.description}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${entry.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {entry.points > 0 ? '+' : ''}{entry.points} points
                      </div>
                      <div className="text-sm text-gray-500">
                        {entry.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Client Notes & Preferences</CardTitle>
              <CardDescription>Important information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">General Notes</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{mockClient.notes}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Preferences</h4>
                <div className="flex flex-wrap gap-2">
                  {mockClient.preferences.map((pref, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Allergies & Alerts</h4>
                <div className="flex flex-wrap gap-2">
                  {mockClient.allergies.map((allergy, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 