'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Shield,
  Clock,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Calendar,
  Smartphone,
  Zap,
  Globe,
} from 'lucide-react';

// Team members data
const TEAM_MEMBERS = [
  {
    name: 'Eng. Basel Jerjawy',
    role: 'CEO & Co-Founder',
    image: '/images/team/sarah.jpg',
    bio: 'Software Developer with 20+ years experience in software development.',
  },
  {
    name: 'Michael Chen',
    role: 'CTO & Co-Founder',
    image: '/images/team/michael.jpg',
    bio: 'Software engineer specializing in healthcare technology and patient management systems.',
  },
  {
    name: 'Dr. Emily Rodriguez',
    role: 'Head of Medical Relations',
    image: '/images/team/emily.jpg',
    bio: 'Board-certified physician with expertise in healthcare technology integration.',
  },
];

// Features data
const FEATURES = [
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Intelligent appointment scheduling that adapts to your practice\'s workflow and patient preferences.',
  },
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'Built with healthcare security standards in mind, ensuring patient data protection and privacy.',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Fully responsive design that works seamlessly on all devices - desktop, tablet, and mobile.',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Instant notifications and real-time updates keep everyone informed about appointment changes.',
  },
  {
    icon: Users,
    title: 'Multi-staff Support',
    description: 'Manage multiple providers, staff members, and locations from a single platform.',
  },
  {
    icon: Globe,
    title: '24/7 Availability',
    description: 'Patients can book appointments anytime, anywhere, reducing no-shows and improving satisfaction.',
  },
];

// Statistics data
const STATS = [
  { number: '500+', label: 'Clinics Trust Us' },
  { number: '50K+', label: 'Appointments Booked' },
  { number: '99.9%', label: 'Uptime' },
  { number: '4.9/5', label: 'Customer Rating' },
];

// Testimonials data
const TESTIMONIALS = [
  {
    name: 'Dr. James Wilson',
    role: 'Dental Practice Owner',
    practice: 'Wilson Family Dentistry',
    content: 'This platform has transformed how we manage appointments. Our patients love the convenience, and our staff is more efficient than ever.',
    rating: 5,
  },
  {
    name: 'Dr. Lisa Thompson',
    role: 'Medical Director',
    practice: 'Thompson Medical Group',
    content: 'The HIPAA compliance and ease of use made this an obvious choice for our practice. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Dr. Robert Kim',
    role: 'Orthodontist',
    practice: 'Kim Orthodontics',
    content: 'Switching to this system reduced our no-show rate by 40% and improved patient satisfaction significantly.',
    rating: 5,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Revolutionizing Healthcare Scheduling
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              We're on a mission to simplify appointment booking for medical and dental practices, 
              making healthcare more accessible for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 border border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We believe that managing appointments shouldn't be a burden for healthcare providers. 
              Our platform streamlines the entire booking process, allowing medical and dental practices 
              to focus on what matters most - patient care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Patient-First</h3>
              <p className="text-gray-600">
                Every feature is designed with the patient experience in mind, making healthcare more accessible and convenient.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Compliant</h3>
              <p className="text-gray-600">
                Built with healthcare security standards, ensuring patient data protection and HIPAA compliance.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Time-Saving</h3>
              <p className="text-gray-600">
                Automate routine tasks and reduce administrative burden, giving you more time for patient care.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for healthcare providers, our platform offers everything you need 
              to manage appointments efficiently and securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Healthcare Providers
            </h2>
            <p className="text-xl text-blue-100">
              Join hundreds of medical and dental practices that have transformed their appointment management.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team combines healthcare expertise with technology innovation to deliver 
              the best appointment booking solution for medical practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-200 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what healthcare providers are saying about our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-blue-600">{testimonial.role}</div>
                  <div className="text-sm text-gray-500">{testimonial.practice}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of healthcare providers who have already streamlined their appointment management 
            and improved patient satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 border border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 