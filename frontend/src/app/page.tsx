'use client';

import React, { useState, useEffect} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Calendar,
  Clock,
  Star,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Scissors,
  Waves,
  Heart,
  Sparkles,
} from 'lucide-react';

// Mock data for featured businesses
const FEATURED_BUSINESSES = [
  {
    id: 1,
    name: 'Elite Hair Salon',
    image: '/images/salon1.jpg',
    rating: 4.8,
    reviews: 128,
    location: 'Downtown',
    services: ['Haircut', 'Coloring', 'Styling'],
    price: '$$',
  },
  {
    id: 2,
    name: 'Zen Spa & Wellness',
    image: '/images/Spa.jpg',
    rating: 4.9,
    reviews: 256,
    location: 'Westside',
    services: ['Massage', 'Facial', 'Body Treatment'],
    price: '$$$',
  },
  {
    id: 3,
    name: 'Modern Nails',
    image: '/images/nails1.jpg',
    rating: 4.7,
    reviews: 89,
    location: 'Eastside',
    services: ['Manicure', 'Pedicure', 'Nail Art'],
    price: '$$',
  },
];

// Mock data for popular services
const POPULAR_SERVICES = [
  {
    id: 1,
    name: 'Haircut & Styling',
    icon: Scissors,
    description: 'Professional haircut and styling by expert stylists',
    price: '$45-85',
  },
  {
    id: 2,
    name: 'Swedish Massage',
    icon: Waves,
    description: 'Relaxing full-body massage for stress relief',
    price: '$80-120',
  },
  {
    id: 3,
    name: 'Facial Treatment',
    icon: Sparkles,
    description: 'Rejuvenating facial with premium products',
    price: '$65-95',
  },
  {
    id: 4,
    name: 'Manicure & Pedicure',
    icon: Heart,
    description: 'Complete nail care and beautification',
    price: '$35-75',
  },
];

export default function HomePage() {
  const [isClient, setIsClient] = useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle booking submission
    console.log('Booking submitted:', bookingData);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Book Your Next Appointment with Ease
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Find and book appointments with the best local businesses
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search for businesses or services"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Booking Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Booking</h2>
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Service</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={bookingData.service}
                  onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })}
                  required
                >
                  <option value="">Select a service</option>
                  <option value="haircut">Haircut & Styling</option>
                  <option value="massage">Massage</option>
                  <option value="facial">Facial Treatment</option>
                  <option value="nails">Manicure & Pedicure</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Book Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Featured Businesses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Businesses</h2>
          <Link
            href="/businesses"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            View all
            <ChevronRight className="ml-1 h-5 w-5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_BUSINESSES.map((business) => (
            <div
              key={business.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48">
                <Image
                  priority={true}
                  src={business.image}
                  alt={business.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
                  <span className="text-sm text-gray-500">{business.price}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-sm text-gray-600">
                    {business.rating} ({business.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {business.location}
                </div>
                <div className="flex flex-wrap gap-2">
                  {business.services.map((service, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {service}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/businesses/${business.id}`}
                  className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  Book Now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Services */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Popular Services</h2>
            <Link
              href="/services"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              View all
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {POPULAR_SERVICES.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{service.price}</span>
                  <Link
                    href={`/services/${service.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700"
                  >
                    Book
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find a Business</h3>
            <p className="text-gray-500">
              Search for local businesses and browse their services
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose a Time</h3>
            <p className="text-gray-500">
              Select your preferred date and time for your appointment
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
              {isClient && <Clock className="h-6 w-6" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Confirmed</h3>
            <p className="text-gray-500">
              Receive instant confirmation and reminders for your booking
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of businesses using BookEase to manage their appointments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/business/register"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register Your Business
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
