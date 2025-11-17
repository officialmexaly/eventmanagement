"use client";

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../../components/AppContext';
import { Calendar, MapPin, Users, Heart, Share2, Star, MessageCircle, ArrowLeft, Clock, Tag, Ticket, Check, X } from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;
  const { events, tickets, reviews, favorites, user, addTicket, addReview, toggleFavorite, addNotification } = useApp();

  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Find the event
  const event = events.find(e => e.id === eventId);

  // Calculate event statistics
  const eventStats = useMemo(() => {
    if (!event) return null;

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
    };
  }, [event, tickets]);

  // Get event reviews
  const eventReviews = reviews.filter(r => r.eventId === eventId);
  const averageRating = eventReviews.length > 0
    ? (eventReviews.reduce((sum, r) => sum + r.rating, 0) / eventReviews.length).toFixed(1)
    : '0.0';

  const isFavorite = favorites.includes(eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <Link
            href="/events"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const handleBookTicket = () => {
    if (!user) {
      alert('Please sign in to book tickets');
      return;
    }
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (!user || !eventStats) return;

    if (ticketQuantity > eventStats.availableTickets) {
      alert('Not enough tickets available');
      return;
    }

    const newTicket = {
      id: Date.now().toString(),
      eventId: event.id,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      quantity: ticketQuantity,
      totalPrice: event.price * ticketQuantity,
      purchaseDate: new Date().toISOString(),
      qrCode: `QR-${Date.now()}`,
      status: 'active' as const,
    };

    addTicket(newTicket);

    addNotification({
      id: Date.now().toString(),
      userId: user.id,
      message: `Successfully booked ${ticketQuantity} ticket(s) for ${event.title}`,
      type: 'success',
      date: new Date().toISOString(),
      read: false,
    });

    setShowBookingModal(false);
    setTicketQuantity(1);
    alert('Booking successful! Check your dashboard for ticket details.');
    router.push('/dashboard');
  };

  const handleSubmitReview = () => {
    if (!user) {
      alert('Please sign in to leave a review');
      return;
    }

    if (!reviewForm.comment.trim()) {
      alert('Please write a comment');
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      eventId: event.id,
      userId: user.id,
      userName: user.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toISOString(),
    };

    addReview(newReview);
    setShowReviewModal(false);
    setReviewForm({ rating: 5, comment: '' });
    alert('Thank you for your review!');
  };

  const handleToggleFavorite = () => {
    if (!user) {
      alert('Please sign in to save favorites');
      return;
    }
    toggleFavorite(eventId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/events"
            className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-gray-900 text-sm font-semibold rounded-full">
                  {event.category}
                </span>
              </div>
              {eventStats && eventStats.selloutPercentage > 70 && !eventStats.isPast && (
                <div className="absolute top-4 right-4">
                  <span className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Selling Fast
                  </span>
                </div>
              )}
            </div>

            {/* Event Title and Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">{event.title}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-semibold text-gray-800">{averageRating}</span>
                      <span className="text-gray-600 ml-1">({eventReviews.length} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleToggleFavorite}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                      }`}
                    />
                  </button>
                  <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-800">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="font-semibold text-gray-800">
                      {eventStats?.availableTickets} / {event.capacity} available
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Tag className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold text-gray-800">₦{event.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Availability Progress */}
              {eventStats && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{eventStats.availableTickets} tickets left</span>
                    <span>{eventStats.selloutPercentage}% sold</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        eventStats.selloutPercentage > 70 ? 'bg-red-500' : 'bg-purple-600'
                      }`}
                      style={{ width: `${eventStats.selloutPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
                <p className="text-gray-600 leading-relaxed">{event.description}</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Reviews ({eventReviews.length})</h2>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Write Review
                </button>
              </div>

              {eventReviews.length > 0 ? (
                <div className="space-y-4">
                  {eventReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{review.userName}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Price per ticket</p>
                <p className="text-4xl font-bold text-purple-600">₦{event.price.toLocaleString()}</p>
              </div>

              {eventStats && !eventStats.isPast && eventStats.availableTickets > 0 && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Tickets
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                        className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center font-semibold"
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold text-gray-800">{ticketQuantity}</span>
                      <button
                        onClick={() => setTicketQuantity(Math.min(eventStats.availableTickets, ticketQuantity + 1))}
                        className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center font-semibold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between text-lg font-semibold text-gray-800">
                      <span>Total</span>
                      <span className="text-2xl text-purple-600">
                        ₦{(event.price * ticketQuantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleBookTicket}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Book Tickets
                  </button>
                </>
              )}

              {eventStats?.isPast && (
                <div className="text-center py-4">
                  <p className="text-gray-600 font-semibold">This event has ended</p>
                </div>
              )}

              {eventStats && !eventStats.isPast && eventStats.availableTickets === 0 && (
                <div className="text-center py-4">
                  <p className="text-red-600 font-semibold">Sold Out</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Why book with us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Instant confirmation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Secure payment</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">24/7 customer support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Easy ticket management</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Booking</h2>
              <p className="text-gray-600">You're about to book tickets for</p>
              <p className="font-semibold text-gray-800 mt-1">{event.title}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tickets</span>
                <span className="font-semibold text-gray-800">{ticketQuantity}x</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price per ticket</span>
                <span className="font-semibold text-gray-800">₦{event.price.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-300 mt-2 pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-purple-600">
                    ₦{(event.price * ticketQuantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Write a Review</h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="p-2 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= reviewForm.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Share your experience with this event..."
              />
            </div>

            <button
              onClick={handleSubmitReview}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
