'use client';
// src/app/admin/businesses/create/page.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ArrowLeft } from 'lucide-react';
import BusinessForm from '@/components/BusinessForm';
import api from '@/lib/api';

export default function CreateBusinessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      console.log('Creating business with data:', data);
      const response = await api.post('/businesses', data);
      console.log('Business created:', response.data);
      
      // Redirect to businesses list
      router.push('/admin/businesses');
    } catch (error) {
      console.error('Error creating business:', error);
      alert('Failed to create business. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Business</h1>
              <p className="text-gray-600">Add a new business to the system</p>
            </div>
          </div>
        </div>

        {/* Business Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <BusinessForm
            onSubmit={handleSubmit}
            submitButtonText="Create Business"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}