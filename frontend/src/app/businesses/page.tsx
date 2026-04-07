'use client';
//src/app/businesses/page.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import {
  Search,
  MapPin,
  Star,
  Clock,
  Phone,
  ChevronRight,
  Filter,
  Grid3X3,
  List,
  X
} from 'lucide-react';

interface TimeSlot {
  open: string;
  close: string;
}

interface Business {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string;
  rating: number;
  reviews: number;
  working_hours: { [key: string]: TimeSlot[] };
  services: Array<string | { id: number; name: string; description: string; duration_minutes: number; price: number; is_active: boolean; created_at: string }>;
  image:string;
  categories: Array<{
    id: number;
    name: string;
    description: string;
  }>;
}

interface Category {
  id: number;
  name: string;
  description: string;
  icon_url: string;
}

// Improved function to format working hours for display
const formatWorkingHours = (workingHours: { [key: string]: TimeSlot[] }): string => {
  if (!workingHours || Object.keys(workingHours).length === 0) {
    return 'Hours not available';
  }

  const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Get today's day
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const todayKey = daysOrder[(today + 6) % 7]; // Convert to our format (Monday = 0)
  
  // Check if open today
  const todayHours = workingHours[todayKey];
  if (todayHours && todayHours.length > 0) {
    const firstSlot = todayHours[0];
    return `Open today: ${firstSlot.open} - ${firstSlot.close}`;
  }
  
  // Find next open day
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (today + i - 1) % 7;
    const nextDayKey = daysOrder[nextDayIndex];
    const nextDayHours = workingHours[nextDayKey];
    
    if (nextDayHours && nextDayHours.length > 0) {
      const dayName = shortDays[nextDayIndex];
      const firstSlot = nextDayHours[0];
      return `Opens ${dayName}: ${firstSlot.open}`;
    }
  }
  
  return 'Closed';
};

// Get business status (Open/Closed/Opens Soon)
const getBusinessStatus = (workingHours: { [key: string]: TimeSlot[] }) => {
  if (!workingHours) return { status: 'Unknown', color: 'gray' };
  
  const now = new Date();
  const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
  const currentTime = now.getHours() * 100 + now.getMinutes(); // Convert to HHMM format
  
  const todayHours = workingHours[currentDay];
  if (!todayHours || todayHours.length === 0) {
    return { status: 'Closed', color: 'red' };
  }
  
  // Check if currently open
  for (const slot of todayHours) {
    const openTime = parseInt(slot.open.replace(':', ''));
    const closeTime = parseInt(slot.close.replace(':', ''));
    
    if (currentTime >= openTime && currentTime <= closeTime) {
      return { status: 'Open', color: 'green' };
    }
    
    // Check if opens soon (within 2 hours)
    if (openTime > currentTime && openTime - currentTime <= 200) {
      return { status: 'Opens Soon', color: 'amber' };
    }
  }
  
  return { status: 'Closed', color: 'red' };
};

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [businessesRes, categoriesRes] = await Promise.all([
          axios.get('/api/businesses'),
          axios.get('/api/categories')
        ]);
        
        setBusinesses(businessesRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || 
      business.categories.some(cat => cat.name === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviews - a.reviews;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 mx-auto animate-ping"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading businesses...</p>
          <p className="text-sm text-gray-500">Finding the best options for you</p>
        </div>
      </div>
    );
  }

  const BusinessCard = ({ business }: { business: Business }) => {
    const businessStatus = getBusinessStatus(business.working_hours);
    const Image_URL = process.env.NEXT_PUBLIC_API_URL+ business.image;
    return (
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={Image_URL} 
            alt={business.name}
            priority={true}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
              ${businessStatus.color === 'green' ? 'bg-green-100 text-green-800' : 
                businessStatus.color === 'amber' ? 'bg-amber-100 text-amber-800' : 
                'bg-red-100 text-red-800'}`}>
              {businessStatus.status}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
                {business.services.slice(0, 3).map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {typeof service === 'string' ? service : service.name}
                  </span>
                ))}
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
              <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
              <span className="text-sm font-bold text-gray-900">{business.rating}</span>
              <span className="text-xs text-gray-600 ml-1">({business.reviews})</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {business.description}
          </p>

          <div className="space-y-3 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
              <span className="truncate">{business.address}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
              <span>{formatWorkingHours(business.working_hours)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
              <span>{business.phone}</span>
            </div>
          </div>

          {business.services && business.services.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {business.services.slice(0, 3).map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {typeof service === 'string' ? service : service.name}
                  </span>
                ))}
                {business.services.length > 3 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                    +{business.services.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Link
              href={`/businesses/${business.id}`}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors duration-200 group"
            >
              View Details
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={`/book/${business.id}`}
              className="px-4 py-2.5 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-sm font-semibold rounded-xl transition-colors duration-200"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Find Your Perfect Business
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Discover and book appointments with top-rated businesses in your area
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 text-gray-900 bg-white/95 backdrop-blur-sm border-0 rounded-2xl placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 focus:bg-white transition-all duration-200 text-lg shadow-xl"
                  placeholder="Search businesses, services, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredBusinesses.length} businesses found
            </h2>
            <p className="text-gray-600 mt-1">
              {selectedCategory !== 'All Categories' && `in ${selectedCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Category
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="All Categories">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Sort By
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviews</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>

                {/* Categories Preview */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Popular Categories
                  </label>
                  <div className="space-y-2">
                    {categories.slice(0, 5).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category.name
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Grid/List */}
          <div className="flex-1">
            {sortedBusinesses.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-6"
              }>
                {sortedBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any businesses matching your criteria. Try adjusting your search or filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Categories');
                  }}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}