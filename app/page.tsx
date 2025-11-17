"use client";

import React from 'react';
import Link from 'next/link';
import { useApp } from './components/AppContext';
import { Calendar, Users, Star, TrendingUp, ArrowRight, Ticket, Shield, Clock, Heart, MapPin, Tag, Search } from 'lucide-react';

export default function HomePage() {
  const { events } = useApp();

  // Get featured events (first 3)
  const featuredEvents = events.slice(0, 3);

  // Calculate stats
  const totalEvents = events.length;
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const categories = [...new Set(events.map(e => e.category))].length;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                Discover Amazing Events Near You
              </h1>
              <p className="text-xl text-purple-100 mb-8">
                From concerts to conferences, find and book tickets to the best events happening in your city. Create unforgettable memories with EventHub.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:shadow-xl transition-all"
                >
                  Browse Events
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 bg-purple-500 bg-opacity-20 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold hover:bg-opacity-30 transition-all"
                >
                  How It Works
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-3xl transform rotate-3 opacity-50"></div>
                <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20">
                  <div className="grid grid-cols-2 gap-4">
                    {featuredEvents.slice(0, 4).map((event, index) => (
                      <div key={event.id} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                        <div className="text-sm text-purple-100 mb-1">{event.category}</div>
                        <div className="font-semibold text-white mb-2 line-clamp-1">{event.title}</div>
                        <div className="text-xs text-purple-100">{event.location}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{totalEvents}+</div>
              <div className="text-gray-600 font-medium">Active Events</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{totalCapacity.toLocaleString()}+</div>
              <div className="text-gray-600 font-medium">Total Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{categories}+</div>
              <div className="text-gray-600 font-medium">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">99%</div>
              <div className="text-gray-600 font-medium">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Events</h2>
            <p className="text-xl text-gray-600">Don't miss out on these amazing upcoming events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-purple-600">
                    {event.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.location.split(',')[0]}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-purple-600">
                      ₦{event.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {event.capacity} seats
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/events"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              View All Events
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600">Find events that match your interests</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Conference', icon: Users, color: 'purple' },
              { name: 'Music', icon: Star, color: 'indigo' },
              { name: 'Art', icon: Heart, color: 'pink' },
              { name: 'Food', icon: Tag, color: 'orange' },
              { name: 'Sports', icon: TrendingUp, color: 'green' },
              { name: 'Workshop', icon: Calendar, color: 'blue' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/events?category=${category.name.toLowerCase()}`}
                className={`bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 text-center group`}
              >
                <div className={`w-12 h-12 bg-${category.color}-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <category.icon className={`w-6 h-6 text-${category.color}-600`} />
                </div>
                <div className="font-semibold text-gray-800">{category.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose EventHub?</h2>
            <p className="text-xl text-gray-600">The best platform for discovering and booking events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Book tickets in seconds with our streamlined checkout process
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Your transactions are protected with bank-level security
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our dedicated team is here to help you anytime you need
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Best Events</h3>
              <p className="text-gray-600">
                Curated selection of the highest quality events in your area
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Discover Your Next Event?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of event-goers who trust EventHub for their event booking needs. Start exploring today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/events"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:shadow-xl transition-all"
            >
              <Search className="mr-2 w-5 h-5" />
              Explore Events
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-500 bg-opacity-20 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold hover:bg-opacity-30 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
