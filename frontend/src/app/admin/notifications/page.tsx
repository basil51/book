'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell,
  Search,
  Filter,
  Mail,
  AlertTriangle,
  CheckCircle,
  Info,
  Trash2,
  Eye,
  Send,
  Settings,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { NotificationType, NotificationStatus } from '@my-app/shared';
import axios from 'axios';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  recipient: {
    id: number;
    name: string;
    email: string;
    type: 'USER' | 'BUSINESS';
  };
  createdAt: string;
  scheduledFor?: string;
}

export default function NotificationCenterPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.REMINDER:
        return <Bell className="h-5 w-5 text-blue-500" />;
      case NotificationType.ALERT:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case NotificationType.SYSTEM:
        return <Info className="h-5 w-5 text-purple-500" />;
      case NotificationType.MARKETING:
        return <Mail className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: NotificationStatus) => {
    switch (status) {
      case NotificationStatus.SENT:
        return 'bg-green-100 text-green-800';
      case NotificationStatus.SCHEDULED:
        return 'bg-blue-100 text-blue-800';
      case NotificationStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case NotificationStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await axios.delete(`/api/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Failed to delete notification. Please try again.');
    }
  };

  const handleResend = async (notificationId: number) => {
    try {
      const response = await axios.post(`/api/notifications/${notificationId}/resend`);
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId ? response.data : notification
      ));
    } catch (error) {
      console.error('Error resending notification:', error);
      alert('Failed to resend notification. Please try again.');
    }
  };

  const handleViewDetails = async (notificationId: number) => {
    try {
      const response = await axios.get(`/api/notifications/${notificationId}`);
      // TODO: Show notification details in a modal or navigate to details page
      console.log('Notification details:', response.data);
    } catch (error) {
      console.error('Error fetching notification details:', error);
      alert('Failed to fetch notification details. Please try again.');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.recipient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notification Center</h1>
          <p className="text-gray-500">Manage and track all system notifications</p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/manager/notifications/templates"
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Templates</span>
          </Link>
          <Link
            href="/manager/notifications/send"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Notification</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search notifications..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value={NotificationType.REMINDER}>Reminder</option>
            <option value={NotificationType.ALERT}>Alert</option>
            <option value={NotificationType.SYSTEM}>System</option>
            <option value={NotificationType.MARKETING}>Marketing</option>
          </select>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value={NotificationStatus.SENT}>Sent</option>
            <option value={NotificationStatus.SCHEDULED}>Scheduled</option>
            <option value={NotificationStatus.FAILED}>Failed</option>
            <option value={NotificationStatus.CANCELLED}>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title & Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading notifications...
                  </td>
                </tr>
              ) : filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No notifications found
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(notification.type)}
                        <span className="ml-2 text-sm text-gray-900">
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {notification.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {notification.recipient.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {notification.recipient.email}
                      </div>
                      <div className="text-xs text-gray-400">
                        {notification.recipient.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        getStatusColor(notification.status)
                      }`}>
                        {notification.status.charAt(0).toUpperCase() + notification.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        Created: {formatDate(notification.createdAt)}
                      </div>
                      {notification.scheduledFor && (
                        <div>
                          Scheduled: {formatDate(notification.scheduledFor)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                          onClick={() => handleViewDetails(notification.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {notification.status === NotificationStatus.FAILED && (
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="Resend"
                            onClick={() => handleResend(notification.id)}
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 