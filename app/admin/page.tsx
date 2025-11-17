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
  Eye,
  Users,
  MessageSquare,
  Settings,
  FileText,
  Bell,
  CreditCard,
  Tag
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin, events, tickets, setIsAdmin, addEvent, updateEvent, deleteEvent } = useApp();
  const [activeView, setActiveView] = useState<'dashboard' | 'events' | 'analytics' | 'users' | 'tickets' | 'reviews' | 'settings'>('dashboard');
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
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-3 mb-10">
            <div className="w-11 h-11 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
              <Ticket className="w-6 h-6 text-slate-100" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">EventHub</span>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
          </Link>

          <nav className="space-y-1">
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Main Menu</p>
              <button
                onClick={() => setActiveView('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeView === 'dashboard'
                    ? 'bg-slate-700 text-white shadow-lg shadow-slate-800/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </button>

              <button
                onClick={() => setActiveView('analytics')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeView === 'analytics'
                    ? 'bg-slate-700 text-white shadow-lg shadow-slate-800/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BarChart className="w-5 h-5" />
                <span className="font-medium">Analytics</span>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Management</p>
              <button
                onClick={() => setActiveView('events')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeView === 'events'
                    ? 'bg-slate-700 text-white shadow-lg shadow-slate-800/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Events</span>
              </button>

              <button
                onClick={() => setActiveView('tickets')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeView === 'tickets'
                    ? 'bg-slate-700 text-white shadow-lg shadow-slate-800/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Ticket className="w-5 h-5" />
                <span className="font-medium">Tickets</span>
              </button>

              <button
                onClick={() => setActiveView('users')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeView === 'users'
                    ? 'bg-slate-700 text-white shadow-lg shadow-slate-800/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Users</span>
              </button>

              <button
                onClick={() => setActiveView('reviews')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeView === 'reviews'
                    ? 'bg-slate-700 text-white shadow-lg shadow-slate-800/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Reviews</span>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Settings</p>
              <button
                onClick={() => setActiveView('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeView === 'settings'
                    ? 'bg-slate-700 text-white shadow-lg shadow-slate-800/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>

              <Link
                href="/"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              >
                <Eye className="w-5 h-5" />
                <span className="font-medium">User View</span>
              </Link>
            </div>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-xl p-4 mb-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-slate-100" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsAdmin(false)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-sm font-medium text-slate-200 hover:text-white border border-slate-700"
          >
            <LogOut className="w-4 h-4" />
            Exit Admin Mode
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Overview</h1>
              <p className="text-slate-600">Welcome back! Here's what's happening with your events.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">Total Revenue</p>
                    <h3 className="text-4xl font-bold text-slate-800">₦{analytics.totalRevenue.toLocaleString()}</h3>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  All time earnings
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">Tickets Sold</p>
                    <h3 className="text-4xl font-bold text-slate-800">{analytics.totalTicketsSold}</h3>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                  <Activity className="w-4 h-4" />
                  Across all events
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">Active Events</p>
                    <h3 className="text-4xl font-bold text-slate-800">{analytics.activeEvents}</h3>
                  </div>
                  <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-violet-600" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-violet-600 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  Upcoming events
                </div>
              </div>
            </div>

            {/* Recent Events */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Recent Events</h2>
                <button
                  onClick={() => setActiveView('events')}
                  className="text-slate-600 hover:text-slate-800 font-medium text-sm flex items-center gap-1 transition-colors"
                >
                  View all
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {analytics.eventPerformance.slice(0, 5).map(event => {
                  const status = getEventStatus(event.date);
                  return (
                    <div key={event.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-slate-800">{event.title}</h4>
                            <p className="text-sm text-slate-600">{new Date(event.date).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 ${status.color} text-white text-xs font-semibold rounded-full`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="font-medium text-emerald-600">₦{event.revenue.toLocaleString()}</span>
                          <span>{event.soldCount} / {event.capacity} sold</span>
                          <div className="flex-1 max-w-xs">
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-slate-700 h-2 rounded-full transition-all"
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
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Manage Events</h1>
                <p className="text-slate-600">Create, edit, and manage your events</p>
              </div>
              <button
                onClick={handleAddEvent}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
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
                  <div key={event.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 ${status.color} text-white text-xs font-bold rounded-full shadow-lg`}>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1">{event.title}</h3>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{event.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Revenue</span>
                          <span className="font-semibold text-emerald-600">₦{eventData?.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Sold</span>
                          <span className="font-semibold text-slate-800">
                            {eventData?.soldCount} / {event.capacity}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-slate-700 h-2 rounded-full transition-all"
                            style={{ width: `${eventData?.soldPercentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
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
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Analytics & Reports</h1>
              <p className="text-slate-600">Detailed insights into your event performance</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Event Performance</h2>
              <div className="space-y-4">
                {analytics.eventPerformance.map(event => (
                  <div key={event.id} className="border-b border-slate-200 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">{event.title}</h3>
                        <p className="text-sm text-slate-600">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-600">₦{event.revenue.toLocaleString()}</p>
                        <p className="text-sm text-slate-600">{event.soldCount} tickets sold</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-slate-600 mb-1">Capacity</p>
                        <p className="font-semibold text-slate-800">{event.capacity}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-slate-600 mb-1">Sold</p>
                        <p className="font-semibold text-slate-800">{event.soldCount}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-slate-600 mb-1">Fill Rate</p>
                        <p className="font-semibold text-slate-800">{event.soldPercentage}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users View */}
        {activeView === 'users' && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">User Management</h1>
              <p className="text-slate-600">Manage users and their permissions</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">User Management</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                This section will allow you to manage registered users, view their activity, and control permissions.
              </p>
            </div>
          </div>
        )}

        {/* Tickets View */}
        {activeView === 'tickets' && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Ticket Management</h1>
              <p className="text-slate-600">View and manage all ticket purchases</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Ticket ID</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Event</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">User</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Quantity</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Total</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(ticket => (
                      <tr key={ticket.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 text-sm text-slate-600 font-mono">#{ticket.id.slice(0, 8)}</td>
                        <td className="py-4 px-4 text-sm text-slate-800 font-medium">
                          {events.find(e => e.id === ticket.eventId)?.title || 'Unknown Event'}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">{ticket.userName}</td>
                        <td className="py-4 px-4 text-sm text-slate-600">{ticket.quantity}</td>
                        <td className="py-4 px-4 text-sm font-semibold text-emerald-600">₦{ticket.totalPrice.toLocaleString()}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            ticket.status === 'active' ? 'bg-green-100 text-green-700' :
                            ticket.status === 'used' ? 'bg-slate-100 text-slate-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {ticket.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {tickets.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="text-slate-600">No tickets purchased yet</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reviews View */}
        {activeView === 'reviews' && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Reviews & Ratings</h1>
              <p className="text-slate-600">Monitor and respond to customer feedback</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Reviews & Ratings</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                This section will display all customer reviews and ratings for your events.
              </p>
            </div>
          </div>
        )}

        {/* Settings View */}
        {activeView === 'settings' && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Settings</h1>
              <p className="text-slate-600">Configure your admin preferences</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="font-medium text-slate-800">Email Notifications</p>
                      <p className="text-sm text-slate-600">Receive email alerts for new bookings</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-700"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="font-medium text-slate-800">Auto-approve Events</p>
                      <p className="text-sm text-slate-600">Automatically publish new events</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-700"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment Settings</h3>
                <p className="text-slate-600 text-sm mb-4">Configure payment gateway and currency options</p>
                <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                  Configure Payment Gateway
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event Title</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Price (₦)</label>
                  <input
                    type="number"
                    value={eventForm.price}
                    onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Capacity</label>
                  <input
                    type="number"
                    value={eventForm.capacity}
                    onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={eventForm.image}
                  onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all resize-none"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all"
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
