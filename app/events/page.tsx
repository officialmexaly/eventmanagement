"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '../components/AppContext';
import { Calendar, MapPin, Heart, Search, Filter, Tag, Clock, Users, TrendingUp } from 'lucide-react';

export default function EventsPage() {
  const { events, tickets, favorites, toggleFavorite, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Calculate event statistics
  const getEventStats = (event: any) => {
    const soldTickets = tickets.filter(t => t.eventId === event.id).reduce((sum, t) => sum + t.quantity, 0);
    const availableTickets = event.capacity - soldTickets;
    const selloutPercentage = ((soldTickets / event.capacity) * 100).toFixed(0);
    const eventDate = new Date(event.date);
    const today = new Date();
    const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      soldTickets,
      availableTickets,
      selloutPercentage: parseInt(selloutPercentage),
      daysUntil,
      isPast: eventDate < today,
      isToday: daysUntil === 0,
      isSoon: daysUntil > 0 && daysUntil <= 7,
    };
  };

  // Get unique categories from events
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(events.map(e => e.category))];
    return cats.map(cat => ({
      id: cat,
      name: cat === 'all' ? 'All Events' : cat.charAt(0).toUpperCase() + cat.slice(1),
      count: cat === 'all' ? events.length : events.filter(e => e.category === cat).length
    }));
  }, [events]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filterCategory === 'all' || event.category === filterCategory;

      const stats = getEventStats(event);
      const matchesStatus = filterStatus === 'all' ||
                          (filterStatus === 'upcoming' && !stats.isPast) ||
                          (filterStatus === 'past' && stats.isPast) ||
                          (filterStatus === 'available' && stats.availableTickets > 0) ||
                          (filterStatus === 'selling-fast' && stats.selloutPercentage > 70 && !stats.isPast);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popularity':
          const aTickets = tickets.filter(t => t.eventId === a.id).length;
          const bTickets = tickets.filter(t => t.eventId === b.id).length;
          return bTickets - aTickets;
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchQuery, filterCategory, filterStatus, sortBy, tickets]);

  const handleToggleFavorite = (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please sign in to save favorites');
      return;
    }
    toggleFavorite(eventId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Events</h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Find and book tickets to the best events happening around you
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by name, location, or description..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-700">Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterCategory === category.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Status and Sort Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="font-semibold text-gray-700">Status</span>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="available">Available Tickets</option>
                <option value="selling-fast">Selling Fast</option>
                <option value="past">Past Events</option>
              </select>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                <span className="font-semibold text-gray-700">Sort By</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="date">Date (Soonest First)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-800">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => {
              const stats = getEventStats(event);
              const isFavorite = favorites.includes(event.id);

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => handleToggleFavorite(event.id, e)}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                        }`}
                      />
                    </button>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full">
                        {event.category}
                      </span>
                    </div>

                    {/* Status Badges */}
                    {stats.selloutPercentage > 70 && !stats.isPast && (
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Selling Fast
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                        {stats.isSoon && (
                          <span className="ml-2 text-xs text-orange-600 font-semibold">
                            ({stats.daysUntil} day{stats.daysUntil !== 1 ? 's' : ''} left)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-purple-600" />
                        {stats.availableTickets} / {event.capacity} tickets available
                      </div>
                    </div>

                    {/* Availability Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{stats.availableTickets} left</span>
                        <span>{stats.selloutPercentage}% sold</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            stats.selloutPercentage > 70 ? 'bg-red-500' : 'bg-purple-600'
                          }`}
                          style={{ width: `${stats.selloutPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Starting from</p>
                        <p className="text-2xl font-bold text-purple-600">
                          ₦{event.price.toLocaleString()}
                        </p>
                      </div>
                      <button
                        className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                          stats.availableTickets > 0 && !stats.isPast
                            ? 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={stats.availableTickets === 0 || stats.isPast}
                      >
                        {stats.isPast ? 'Past Event' : stats.availableTickets === 0 ? 'Sold Out' : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Events Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('all');
                setFilterStatus('all');
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
