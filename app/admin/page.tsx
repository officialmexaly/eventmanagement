"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../components/AppContext';
import {
  LayoutDashboard,
  Calendar,
  BarChart,
  User,
  LogOut,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Ticket,
  TrendingUp,
  Activity,
  Clock,
  ChevronRight,
  X,
  Eye
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin, events, tickets, setIsAdmin, addEvent, updateEvent, deleteEvent } = useApp();
  const [activeView, setActiveView] = useState<'dashboard' | 'events' | 'analytics'>('dashboard');
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    price: '',
    capacity: '',
    category: 'conference',
    image: ''
  });

  // Redirect if not admin
  React.useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, router]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalTicketsSold = tickets.reduce((sum, t) => sum + t.quantity, 0);
    const totalRevenue = tickets.reduce((sum, t) => sum + t.totalPrice, 0);
    const activeEvents = events.filter(e => new Date(e.date) >= new Date()).length;

    const eventPerformance = events.map(event => {
      const eventTickets = tickets.filter(t => t.eventId === event.id);
      const soldCount = eventTickets.reduce((sum, t) => sum + t.quantity, 0);
      const revenue = eventTickets.reduce((sum, t) => sum + t.totalPrice, 0);
      const soldPercentage = ((soldCount / event.capacity) * 100).toFixed(1);

      return {
        ...event,
        soldCount,
        revenue,
        soldPercentage: parseFloat(soldPercentage)
      };
    });

    return {
      totalTicketsSold,
      totalRevenue,
      activeEvents,
      eventPerformance
    };
  }, [events, tickets]);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      date: '',
      location: '',
      description: '',
      price: '',
      capacity: '',
      category: 'conference',
      image: ''
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description,
      price: event.price.toString(),
      capacity: event.capacity.toString(),
      category: event.category,
      image: event.image
    });
    setShowEventModal(true);
  };

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();

    const eventData = {
      title: eventForm.title,
      date: eventForm.date,
      location: eventForm.location,
      description: eventForm.description,
      price: parseFloat(eventForm.price),
      capacity: parseInt(eventForm.capacity),
      category: eventForm.category,
      image: eventForm.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent({
        id: Date.now().toString(),
        ...eventData
      });
    }

    setShowEventModal(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
  };

  const getEventStatus = (date: string) => {
    const eventDate = new Date(date);
    const today = new Date();
    const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) return { label: 'Past', color: 'bg-gray-500' };
    if (daysUntil === 0) return { label: 'Today', color: 'bg-green-500' };
    if (daysUntil <= 7) return { label: 'This Week', color: 'bg-orange-500' };
    return { label: 'Upcoming', color: 'bg-blue-500' };
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">EventHub</span>
          </Link>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeView === 'dashboard'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveView('events')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeView === 'events'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Manage Events
            </button>

            <button
              onClick={() => setActiveView('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeView === 'analytics'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <BarChart className="w-5 h-5" />
              Analytics
            </button>

            <div className="pt-4 border-t border-gray-700 mt-4">
              <Link
                href="/"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-all"
              >
                <Eye className="w-5 h-5" />
                View as User
              </Link>
            </div>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-700">
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsAdmin(false)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with your events.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-1">Total Revenue</p>
                    <h3 className="text-4xl font-bold">₦{analytics.totalRevenue.toLocaleString()}</h3>
                  </div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-100 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  All time earnings
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-indigo-100 text-sm font-medium mb-1">Tickets Sold</p>
                    <h3 className="text-4xl font-bold">{analytics.totalTicketsSold}</h3>
                  </div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Ticket className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-indigo-100 text-sm">
                  <Activity className="w-4 h-4" />
                  Across all events
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-purple-100 text-sm font-medium mb-1">Active Events</p>
                    <h3 className="text-4xl font-bold">{analytics.activeEvents}</h3>
                  </div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-purple-100 text-sm">
                  <Clock className="w-4 h-4" />
                  Upcoming events
                </div>
              </div>
            </div>

            {/* Recent Events */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Recent Events</h2>
                <button
                  onClick={() => setActiveView('events')}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1"
                >
                  View all
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {analytics.eventPerformance.slice(0, 5).map(event => {
                  const status = getEventStatus(event.date);
                  return (
                    <div key={event.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">{event.title}</h4>
                            <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 ${status.color} text-white text-xs font-semibold rounded-full`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="font-medium text-green-600">₦{event.revenue.toLocaleString()}</span>
                          <span>{event.soldCount} / {event.capacity} sold</span>
                          <div className="flex-1 max-w-xs">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full transition-all"
                                style={{ width: `${event.soldPercentage}%` }}
                              />
                            </div>
                          </div>
                          <span className="font-medium">{event.soldPercentage}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Events Management View */}
        {activeView === 'events' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Events</h1>
                <p className="text-gray-600">Create, edit, and manage your events</p>
              </div>
              <button
                onClick={handleAddEvent}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Event
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => {
                const eventData = analytics.eventPerformance.find(e => e.id === event.id);
                const status = getEventStatus(event.date);

                return (
                  <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 ${status.color} text-white text-xs font-bold rounded-full`}>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Revenue</span>
                          <span className="font-semibold text-green-600">₦{eventData?.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Sold</span>
                          <span className="font-semibold text-gray-800">
                            {eventData?.soldCount} / {event.capacity}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${eventData?.soldPercentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics & Reports</h1>
              <p className="text-gray-600">Detailed insights into your event performance</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Event Performance</h2>
              <div className="space-y-4">
                {analytics.eventPerformance.map(event => (
                  <div key={event.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{event.title}</h3>
                        <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">₦{event.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{event.soldCount} tickets sold</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-600 mb-1">Capacity</p>
                        <p className="font-semibold text-gray-800">{event.capacity}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-600 mb-1">Sold</p>
                        <p className="font-semibold text-gray-800">{event.soldCount}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-600 mb-1">Fill Rate</p>
                        <p className="font-semibold text-gray-800">{event.soldPercentage}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="conference">Conference</option>
                    <option value="music">Music</option>
                    <option value="art">Art</option>
                    <option value="food">Food</option>
                    <option value="sports">Sports</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₦)</label>
                  <input
                    type="number"
                    value={eventForm.price}
                    onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                  <input
                    type="number"
                    value={eventForm.capacity}
                    onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={eventForm.image}
                  onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
