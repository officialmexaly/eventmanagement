"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  price: number;
  capacity: number;
  category: string;
  image: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  quantity: number;
  totalPrice: number;
  purchaseDate: string;
  qrCode: string;
  status: 'active' | 'used' | 'cancelled';
}

export interface Review {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  date: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AppContextType {
  user: User | null;
  isAdmin: boolean;
  events: Event[];
  tickets: Ticket[];
  reviews: Review[];
  favorites: string[];
  notifications: Notification[];
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  setTickets: (tickets: Ticket[]) => void;
  addTicket: (ticket: Ticket) => void;
  setReviews: (reviews: Review[]) => void;
  addReview: (review: Review) => void;
  setFavorites: (favorites: string[]) => void;
  toggleFavorite: (eventId: string) => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'event-mgmt-data';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setEvents(data.events || []);
      setTickets(data.tickets || []);
      setReviews(data.reviews || []);
      setFavorites(data.favorites || []);
      setNotifications(data.notifications || []);
    } else {
      // Initialize with sample data
      const sampleEvents: Event[] = [
        {
          id: '1',
          title: 'Tech Conference 2025',
          date: '2025-12-15',
          location: 'Lagos Convention Center',
          description: 'Annual technology conference featuring industry leaders and breakthrough innovations. Connect with tech pioneers, attend workshops, and discover the future of technology.',
          price: 15000,
          capacity: 500,
          category: 'conference',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
        },
        {
          id: '2',
          title: 'Music Festival',
          date: '2025-11-25',
          location: 'Eko Atlantic',
          description: 'Three-day music festival with top artists from around the world. Experience unforgettable performances, meet your favorite artists, and create lasting memories.',
          price: 25000,
          capacity: 2000,
          category: 'music',
          image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800'
        },
        {
          id: '3',
          title: 'Art Exhibition',
          date: '2025-12-01',
          location: 'Nike Art Gallery',
          description: 'Contemporary African art showcase featuring renowned artists. Explore unique perspectives, meet the creators, and take home exclusive pieces.',
          price: 5000,
          capacity: 200,
          category: 'art',
          image: 'https://images.unsplash.com/photo-1531243625752-64a9ec4f4b83?w=800'
        },
        {
          id: '4',
          title: 'Business Summit',
          date: '2025-11-30',
          location: 'Victoria Island',
          description: 'Network with business leaders and entrepreneurs. Learn strategies for growth and innovation.',
          price: 20000,
          capacity: 300,
          category: 'conference',
          image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800'
        },
        {
          id: '5',
          title: 'Food Festival',
          date: '2025-12-10',
          location: 'Lekki Phase 1',
          description: 'Taste cuisines from around the world. Meet celebrity chefs and enjoy live cooking demonstrations.',
          price: 8000,
          capacity: 1000,
          category: 'food',
          image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'
        },
        {
          id: '6',
          title: 'Startup Pitch Night',
          date: '2025-12-05',
          location: 'Yaba Tech Hub',
          description: 'Watch innovative startups pitch to investors. Network with founders and VCs.',
          price: 5000,
          capacity: 150,
          category: 'conference',
          image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800'
        }
      ];
      setEvents(sampleEvents);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      events,
      tickets,
      reviews,
      favorites,
      notifications
    }));
  }, [events, tickets, reviews, favorites, notifications]);

  // Event management functions
  const addEvent = (event: Event) => {
    setEvents([...events, event]);
  };

  const updateEvent = (id: string, updatedEvent: Partial<Event>) => {
    setEvents(events.map(e => e.id === id ? { ...e, ...updatedEvent } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  // Ticket management
  const addTicket = (ticket: Ticket) => {
    setTickets([...tickets, ticket]);
  };

  // Review management
  const addReview = (review: Review) => {
    setReviews([...reviews, review]);
  };

  // Favorites management
  const toggleFavorite = (eventId: string) => {
    if (favorites.includes(eventId)) {
      setFavorites(favorites.filter(id => id !== eventId));
    } else {
      setFavorites([...favorites, eventId]);
    }
  };

  // Notification management
  const addNotification = (notification: Notification) => {
    setNotifications([notification, ...notifications]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const value: AppContextType = {
    user,
    isAdmin,
    events,
    tickets,
    reviews,
    favorites,
    notifications,
    setUser,
    setIsAdmin,
    setEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    setTickets,
    addTicket,
    setReviews,
    addReview,
    setFavorites,
    toggleFavorite,
    setNotifications,
    addNotification,
    markNotificationAsRead,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
