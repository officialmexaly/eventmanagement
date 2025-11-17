"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../components/AppContext';
import { Ticket, Heart, Bell, Download, QrCode, Calendar, Clock, MapPin, Star, User } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, tickets, events, favorites, notifications, setNotifications } = useApp();
  const [activeTab, setActiveTab] = useState<'tickets' | 'favorites' | 'notifications'>('tickets');

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // Get user tickets with event details
  const userTickets = useMemo(() => {
    if (!user) return [];
    return tickets
      .filter(t => t.userId === user.id)
      .map(ticket => {
        const event = events.find(e => e.id === ticket.eventId);
        return { ...ticket, event };
      })
      .filter(t => t.event);
  }, [tickets, events, user]);

  // Get favorite events
  const favoriteEvents = useMemo(() => {
    return events.filter(e => favorites.includes(e.id));
  }, [events, favorites]);

  // Get user notifications
  const userNotifications = useMemo(() => {
    if (!user) return [];
    return notifications.filter(n => n.userId === user.id);
  }, [notifications, user]);

  const downloadTicket = (ticket: any) => {
    // In production, generate PDF or image
    const ticketData = `
      EventHub Ticket
      ---------------
      Event: ${ticket.event?.title}
      Date: ${new Date(ticket.event?.date).toLocaleDateString()}
      Location: ${ticket.event?.location}
      Quantity: ${ticket.quantity}
      Total: ₦${ticket.totalPrice.toLocaleString()}
      QR Code: ${ticket.qrCode}
      Status: ${ticket.status}
    `;
    const blob = new Blob([ticketData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${ticket.id}.txt`;
    a.click();
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n =>
      n.userId === user?.id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
              <p className="text-purple-100">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
                <p className="text-3xl font-bold text-gray-800">{userTickets.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Favorites</p>
                <p className="text-3xl font-bold text-gray-800">{favoriteEvents.length}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Notifications</p>
                <p className="text-3xl font-bold text-gray-800">
                  {userNotifications.filter(n => !n.read).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('tickets')}
                className={`flex-1 px-6 py-4 font-semibold transition-all ${
                  activeTab === 'tickets'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Ticket className="w-5 h-5" />
                  My Tickets
                </div>
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 px-6 py-4 font-semibold transition-all ${
                  activeTab === 'favorites'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Favorites
                </div>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 px-6 py-4 font-semibold transition-all ${
                  activeTab === 'notifications'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                  {userNotifications.filter(n => !n.read).length > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {userNotifications.filter(n => !n.read).length}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div>
                {userTickets.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Ticket className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Tickets Yet</h3>
                    <p className="text-gray-600 mb-6">You haven't purchased any tickets</p>
                    <Link
                      href="/events"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Browse Events
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                              {ticket.event?.title}
                            </h3>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-purple-600" />
                                {new Date(ticket.event?.date).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-purple-600" />
                                {ticket.event?.location}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4 text-purple-600" />
                                Purchased: {new Date(ticket.purchaseDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              ticket.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : ticket.status === 'used'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {ticket.status.toUpperCase()}
                          </span>
                        </div>

                        {/* QR Code Section */}
                        <div className="bg-white p-6 rounded-xl text-center mb-4 border-2 border-dashed border-gray-300">
                          <QrCode className="w-24 h-24 mx-auto mb-3 text-gray-800" />
                          <p className="font-mono text-sm text-gray-700 font-semibold">
                            {ticket.qrCode}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Show this QR code at the venue
                          </p>
                        </div>

                        {/* Ticket Details */}
                        <div className="bg-white/50 rounded-lg p-4 mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Quantity</span>
                            <span className="font-semibold text-gray-800">{ticket.quantity}x</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Paid</span>
                            <span className="font-bold text-purple-600">
                              ₦{ticket.totalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => downloadTicket(ticket)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                          <Download className="w-4 h-4" />
                          Download Ticket
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                {favoriteEvents.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-10 h-10 text-pink-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Favorites Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Save events you're interested in to easily find them later
                    </p>
                    <Link
                      href="/events"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Discover Events
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteEvents.map((event) => (
                      <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
                      >
                        <div className="relative h-48">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4">
                            <Heart className="w-6 h-6 fill-red-500 text-red-500" />
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                            {event.title}
                          </h3>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-purple-600" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-purple-600" />
                              {event.location}
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">From</span>
                              <span className="text-xl font-bold text-purple-600">
                                ₦{event.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                {userNotifications.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Notifications</h3>
                    <p className="text-gray-600">You're all caught up!</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">
                        All Notifications ({userNotifications.length})
                      </h3>
                      {userNotifications.some(n => !n.read) && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      {userNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`rounded-xl p-6 transition-all ${
                            !notification.read
                              ? 'bg-purple-50 border-2 border-purple-200'
                              : 'bg-white border-2 border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                notification.type === 'success'
                                  ? 'bg-green-100'
                                  : notification.type === 'warning'
                                  ? 'bg-yellow-100'
                                  : 'bg-blue-100'
                              }`}
                            >
                              <Bell
                                className={`w-5 h-5 ${
                                  notification.type === 'success'
                                    ? 'text-green-600'
                                    : notification.type === 'warning'
                                    ? 'text-yellow-600'
                                    : 'text-blue-600'
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-800 font-medium mb-1">
                                {notification.message}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(notification.date).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
