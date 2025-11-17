"use client";

import React from 'react';
import Link from 'next/link';
import { Search, Ticket, Calendar, QrCode, Plus, Users, BarChart, Settings, ArrowRight, CheckCircle } from 'lucide-react';

export default function HowItWorksPage() {
  const attendeeSteps = [
    {
      icon: Search,
      title: 'Discover Events',
      description: 'Browse through our curated selection of events across various categories. Use filters to find exactly what you\'re looking for.',
      color: 'purple',
    },
    {
      icon: Ticket,
      title: 'Book Your Tickets',
      description: 'Select the number of tickets you need and complete the secure checkout process in just a few clicks.',
      color: 'indigo',
    },
    {
      icon: Calendar,
      title: 'Get Confirmation',
      description: 'Receive instant confirmation with your tickets and QR codes sent directly to your email and dashboard.',
      color: 'blue',
    },
    {
      icon: QrCode,
      title: 'Attend the Event',
      description: 'Show your QR code at the venue for quick entry. All your tickets are accessible from your dashboard anytime.',
      color: 'green',
    },
  ];

  const organizerSteps = [
    {
      icon: Plus,
      title: 'Create Your Event',
      description: 'Fill in event details, upload images, set pricing and capacity. Our intuitive interface makes it easy.',
      color: 'purple',
    },
    {
      icon: Settings,
      title: 'Customize & Publish',
      description: 'Configure your event settings, add descriptions, and publish when you\'re ready. Full control at your fingertips.',
      color: 'indigo',
    },
    {
      icon: Users,
      title: 'Manage Attendees',
      description: 'Track ticket sales in real-time, view attendee lists, and manage bookings from your admin dashboard.',
      color: 'blue',
    },
    {
      icon: BarChart,
      title: 'Analyze Results',
      description: 'Access detailed analytics on sales, revenue, and attendee demographics to improve future events.',
      color: 'green',
    },
  ];

  const features = [
    {
      title: 'Instant Booking',
      description: 'Book tickets in seconds with our streamlined checkout process',
      icon: CheckCircle,
    },
    {
      title: 'Secure Payments',
      description: 'Bank-level encryption protects all your transactions',
      icon: CheckCircle,
    },
    {
      title: 'Mobile Tickets',
      description: 'Access your tickets anytime, anywhere from any device',
      icon: CheckCircle,
    },
    {
      title: 'Real-time Updates',
      description: 'Get instant notifications about your events and bookings',
      icon: CheckCircle,
    },
    {
      title: 'Easy Refunds',
      description: 'Simple refund process if plans change',
      icon: CheckCircle,
    },
    {
      title: '24/7 Support',
      description: 'Our team is always here to help you',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">How EventHub Works</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Whether you're looking to attend amazing events or host your own,
              EventHub makes it simple and seamless.
            </p>
          </div>
        </div>
      </section>

      {/* For Attendees */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">For Event Attendees</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover and book tickets to amazing events in just 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection Lines (hidden on mobile) */}
            <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-green-600 opacity-20"></div>

            {attendeeSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-${step.color}-100 rounded-xl flex items-center justify-center mb-6 mx-auto`}>
                    <step.icon className={`w-8 h-8 text-${step.color}-600`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/events"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all"
            >
              Start Exploring Events
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* For Organizers */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">For Event Organizers</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create and manage successful events with our powerful tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection Lines (hidden on mobile) */}
            <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-green-600 opacity-20"></div>

            {organizerSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-${step.color}-100 rounded-xl flex items-center justify-center mb-6 mx-auto`}>
                    <step.icon className={`w-8 h-8 text-${step.color}-600`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/admin"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all"
            >
              Create Your First Event
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose EventHub?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for a seamless event experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Payment Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Secure & Simple Payments</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your transactions are protected with industry-leading security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Bank-Level Security</h3>
              <p className="text-gray-600">
                All payments are encrypted with 256-bit SSL technology, the same used by major banks.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Multiple Payment Options</h3>
              <p className="text-gray-600">
                Pay with credit cards, debit cards, or mobile money. Choose what works best for you.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Instant Confirmation</h3>
              <p className="text-gray-600">
                Receive your tickets immediately after payment. No waiting, no hassle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-12 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Our support team is here to help you every step of the way
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:shadow-xl transition-all"
              >
                Contact Support
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center px-8 py-4 bg-purple-500 bg-opacity-20 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold hover:bg-opacity-30 transition-all"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
