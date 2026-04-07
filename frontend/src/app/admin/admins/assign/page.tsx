'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserCheck, 
  ArrowLeft, 
  Search,
  Building2,
  Plus,
  X,
  Check
} from 'lucide-react';
import axios from 'axios';
import { UserRole, BusinessStatus } from '@my-app/shared';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface Business {
  id: number;
  name: string;
  status: BusinessStatus;
}

interface AssignmentForm {
  userId: number | null;
  businessIds: number[];
}

export default function AssignAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [businessSearch, setBusinessSearch] = useState('');
  const [formData, setFormData] = useState<AssignmentForm>({
    userId: null,
    businessIds: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Replace with actual API calls
        // const usersResponse = await axios.get('/api/users?role=staff');
        // const businessesResponse = await axios.get('/api/businesses');
        // setUsers(usersResponse.data);
        // setBusinesses(businessesResponse.data);

        // Mock data
        setUsers([
          { id: 1, name: 'John Smith', email: 'john@example.com', role: UserRole.STAFF },
          { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: UserRole.STAFF },
          { id: 3, name: 'Michael Brown', email: 'michael@example.com', role: UserRole.STAFF },
        ]);

        setBusinesses([
          { id: 1, name: 'Business A', status: BusinessStatus.ACTIVE },
          { id: 2, name: 'Business B', status: BusinessStatus.ACTIVE },
          { id: 3, name: 'Business C', status: BusinessStatus.ACTIVE },
          { id: 4, name: 'Business D', status: BusinessStatus.ACTIVE },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(businessSearch.toLowerCase())
  );

  const handleUserSelect = (userId: number) => {
    setFormData(prev => ({
      ...prev,
      userId,
    }));
  };

  const handleBusinessToggle = (businessId: number) => {
    setFormData(prev => ({
      ...prev,
      businessIds: prev.businessIds.includes(businessId)
        ? prev.businessIds.filter(id => id !== businessId)
        : [...prev.businessIds, businessId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userId || formData.businessIds.length === 0) {
      alert('Please select a user and at least one business');
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // await axios.post('/api/business-admins', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push('/manager/admins');
    } catch (error) {
      console.error('Error assigning admin:', error);
      alert('Failed to assign admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedUser = users.find(user => user.id === formData.userId);

  return (
    <div className="space-y-6">
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
            <h1 className="text-2xl font-bold text-gray-900">Assign Business Admin</h1>
            <p className="text-gray-500">Assign a user as admin to one or more businesses</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Selection */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select User</h2>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredUsers.map(user => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleUserSelect(user.id)}
                    className={`w-full flex items-center p-3 rounded-lg border ${
                      formData.userId === user.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-4 text-left">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Business Selection */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Businesses</h2>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={businessSearch}
                  onChange={(e) => setBusinessSearch(e.target.value)}
                />
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredBusinesses.map(business => (
                  <button
                    key={business.id}
                    type="button"
                    onClick={() => handleBusinessToggle(business.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                      formData.businessIds.includes(business.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{business.name}</div>
                        <div className="text-sm text-gray-500">
                          {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                        </div>
                      </div>
                    </div>
                    {formData.businessIds.includes(business.id) && (
                      <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Summary */}
        {selectedUser && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <UserCheck className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">{selectedUser.name}</div>
                  <div className="text-sm text-gray-500">
                    Will be assigned to {formData.businessIds.length} business(es)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.userId || formData.businessIds.length === 0}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 ${
              loading || !formData.userId || formData.businessIds.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>{loading ? 'Assigning...' : 'Assign Admin'}</span>
          </button>
        </div>
      </form>
    </div>
  );
} 