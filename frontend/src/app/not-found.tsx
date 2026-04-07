'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  Search, 
  Calendar, 
  User, 
  ArrowRight, 
  MapPin,
  Mail,
  Building2,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const Clock = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Clock })), {
  ssr: false,
  loading: () => <div className="h-4 w-4 mr-2" /> // Same dimensions as your icon
})

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pd-4">

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
            <div className="text-6xl mb-4">🤔</div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Oops! The page you're looking for doesn't exist. But don't worry, 
            we've got plenty of other great pages for you to explore.
          </p>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link 
              href="/"
              className="group bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <Home className="h-8 w-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2">Home</h3>
              <p className="text-sm text-gray-600">Return to the main page</p>
            </Link>

            <Link 
              href="/book"
              className="group bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2">Book Appointment</h3>
              <p className="text-sm text-gray-600">Schedule your next visit</p>
            </Link>

            <Link 
              href="/services"
              className="group bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <Search className="h-8 w-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2">Find Services</h3>
              <p className="text-sm text-gray-600">Browse available services</p>
            </Link>

            <Link 
              href="/about"
              className="group bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <Building2 className="h-8 w-8 text-orange-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2">About Us</h3>
              <p className="text-sm text-gray-600">Learn more about our platform</p>
            </Link>
          </div>

          {/* Additional Navigation */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Need Help Finding Something?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-4">For Patients</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/login" className="flex items-center text-blue-600 hover:text-blue-800">
                      <User className="h-4 w-4 mr-2" />
                      Login to Your Account
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="flex items-center text-blue-600 hover:text-blue-800">
                      <User className="h-4 w-4 mr-2" />
                      Create New Account
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/businesses" className="flex items-center text-blue-600 hover:text-blue-800">
                      <MapPin className="h-4 w-4 mr-2" />
                      Find Nearby Clinics
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-4">For Healthcare Providers</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/register" className="flex items-center text-blue-600 hover:text-blue-800">
                      <Building2 className="h-4 w-4 mr-2" />
                      Register Your Practice
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin" className="flex items-center text-blue-600 hover:text-blue-800">
                      <Clock className="h-4 w-4 mr-2" />
                      Admin Dashboard
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="flex items-center text-blue-600 hover:text-blue-800">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Support
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Still can't find what you're looking for?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Support
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
} 