'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Star,
  DollarSign,
  Users,
  Calendar,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  Heart
} from 'lucide-react';
import dynamic from 'next/dynamic';

const Clock = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Clock })), {
  ssr: false,
  loading: () => <div className="h-4 w-4 mr-2" /> // Same dimensions as your icon
})

// Mock data - Replace with actual API call
const serviceCategories = [
  {
    id: 1,
    name: 'Healthcare',
    icon: '❤️',
    description: 'Medical services, consultations, and treatments',
    services: [
      {
        id: 101,
        name: 'General Checkup',
        description: 'Comprehensive health examination and consultation',
        duration: '60 min',
        price: '$150',
        rating: 4.8,
        reviews: 245,
        image: '/images/services/checkup.jpg',
        category: 'Healthcare',
        providers: 12,
      },
      {
        id: 102,
        name: 'Dental Cleaning',
        description: 'Professional dental cleaning and examination',
        duration: '45 min',
        price: '$120',
        rating: 4.7,
        reviews: 189,
        image: '/images/services/dental.jpg',
        category: 'Healthcare',
        providers: 8,
      },
    ],
  },
  {
    id: 2,
    name: 'Beauty & Wellness',
    icon: '💇‍♀️',
    description: 'Spa treatments, beauty services, and wellness programs',
    services: [
      {
        id: 201,
        name: 'Full Body Massage',
        description: 'Relaxing full body massage therapy session',
        duration: '90 min',
        price: '$180',
        rating: 4.9,
        reviews: 312,
        image: '/images/services/massage.jpg',
        category: 'Beauty & Wellness',
        providers: 15,
      },
      {
        id: 202,
        name: 'Facial Treatment',
        description: 'Professional facial treatment and skin care',
        duration: '60 min',
        price: '$95',
        rating: 4.6,
        reviews: 178,
        image: '/images/services/facial.jpg',
        category: 'Beauty & Wellness',
        providers: 10,
      },
    ],
  },
  {
    id: 3,
    name: 'Fitness',
    icon: '💪',
    description: 'Personal training, group classes, and fitness programs',
    services: [
      {
        id: 301,
        name: 'Personal Training',
        description: 'One-on-one fitness training session',
        duration: '60 min',
        price: '$80',
        rating: 4.9,
        reviews: 156,
        image: '/images/services/training.jpg',
        category: 'Fitness',
        providers: 20,
      },
      {
        id: 302,
        name: 'Yoga Class',
        description: 'Group yoga session for all levels',
        duration: '75 min',
        price: '$25',
        rating: 4.7,
        reviews: 203,
        image: '/images/services/yoga.jpg',
        category: 'Fitness',
        providers: 8,
      },
    ],
  },
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  // Flatten all services for search
  const allServices = serviceCategories.flatMap(category => category.services);

  const filteredServices = allServices.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center mb-4">Discover Our Services</h1>
          <p className="text-center text-blue-100 mb-8">
            Find and book the perfect service for your needs
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:text-sm"
                placeholder="Search services by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </button>
              </div>

              <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-4`}>
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="All Categories">All Categories</option>
                    {serviceCategories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="rating">Rating</option>
                    <option value="price">Price</option>
                    <option value="duration">Duration</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Categories List */}
            <div className="mt-6 bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {serviceCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/services/category/${category.id}`}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">{category.icon}</span>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {category.name}
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover rounded-t-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-500">{service.category}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-900">
                          {service.rating}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          ({service.reviews})
                        </span>
                      </div>
                    </div>

                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>{service.price}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{service.providers} providers</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Book Now</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <Link
                        href={`/services/${service.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/services/${service.id}/book`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No services found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 