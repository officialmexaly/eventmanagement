import { renderHook, act } from '@testing-library/react'
import { AppProvider, useApp } from '../AppContext'
import React from 'react'

describe('AppContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    jest.clearAllMocks()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppProvider>{children}</AppProvider>
  )

  describe('Initial State', () => {
    it('should initialize with null user and isAdmin false', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      expect(result.current.user).toBeNull()
      expect(result.current.isAdmin).toBe(false)
    })

    it('should load sample events on first render', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      expect(result.current.events.length).toBeGreaterThan(0)
      expect(result.current.events[0]).toHaveProperty('title')
      expect(result.current.events[0]).toHaveProperty('date')
      expect(result.current.events[0]).toHaveProperty('location')
    })

    it('should initialize with empty tickets, reviews, favorites, and notifications', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      expect(result.current.tickets).toEqual([])
      expect(result.current.reviews).toEqual([])
      expect(result.current.favorites).toEqual([])
      expect(result.current.notifications).toEqual([])
    })
  })

  describe('User Management', () => {
    it('should set user', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      const testUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      }

      act(() => {
        result.current.setUser(testUser)
      })

      expect(result.current.user).toEqual(testUser)
    })

    it('should set admin status', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      act(() => {
        result.current.setIsAdmin(true)
      })

      expect(result.current.isAdmin).toBe(true)
    })
  })

  describe('Event Management', () => {
    it('should add a new event', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      const newEvent = {
        id: 'new-event-1',
        title: 'New Test Event',
        date: '2025-12-01',
        location: 'Test Location',
        description: 'Test Description',
        price: 15000,
        capacity: 200,
        category: 'conference',
        image: 'https://example.com/test.jpg',
      }

      const initialCount = result.current.events.length

      act(() => {
        result.current.addEvent(newEvent)
      })

      expect(result.current.events.length).toBe(initialCount + 1)
      expect(result.current.events).toContainEqual(newEvent)
    })

    it('should update an existing event', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      const firstEvent = result.current.events[0]
      const updatedData = {
        title: 'Updated Title',
        price: 25000,
      }

      act(() => {
        result.current.updateEvent(firstEvent.id, updatedData)
      })

      const updatedEvent = result.current.events.find(e => e.id === firstEvent.id)
      expect(updatedEvent?.title).toBe('Updated Title')
      expect(updatedEvent?.price).toBe(25000)
      expect(updatedEvent?.location).toBe(firstEvent.location) // unchanged fields remain
    })

    it('should delete an event', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      const firstEvent = result.current.events[0]
      const initialCount = result.current.events.length

      act(() => {
        result.current.deleteEvent(firstEvent.id)
      })

      expect(result.current.events.length).toBe(initialCount - 1)
      expect(result.current.events.find(e => e.id === firstEvent.id)).toBeUndefined()
    })
  })

  describe('Ticket Management', () => {
    it('should add a ticket', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      const newTicket = {
        id: 'ticket-1',
        eventId: '1',
        userId: 'user-1',
        userName: 'Test User',
        userEmail: 'test@example.com',
        quantity: 2,
        totalPrice: 20000,
        purchaseDate: '2025-01-01',
        qrCode: 'QR123',
        status: 'active' as const,
      }

      act(() => {
        result.current.addTicket(newTicket)
      })

      expect(result.current.tickets.length).toBe(1)
      expect(result.current.tickets[0]).toEqual(newTicket)
    })
  })

  describe('Review Management', () => {
    it('should add a review', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      const newReview = {
        id: 'review-1',
        eventId: '1',
        userId: 'user-1',
        userName: 'Test User',
        rating: 5,
        comment: 'Great event!',
        date: '2025-01-01',
      }

      act(() => {
        result.current.addReview(newReview)
      })

      expect(result.current.reviews.length).toBe(1)
      expect(result.current.reviews[0]).toEqual(newReview)
    })
  })

  describe('Favorites Management', () => {
    it('should add event to favorites', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      const eventId = '1'

      act(() => {
        result.current.toggleFavorite(eventId)
      })

      expect(result.current.favorites).toContain(eventId)
    })

    it('should remove event from favorites', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      const eventId = '1'

      // Add to favorites
      act(() => {
        result.current.toggleFavorite(eventId)
      })

      expect(result.current.favorites).toContain(eventId)

      // Remove from favorites
      act(() => {
        result.current.toggleFavorite(eventId)
      })

      expect(result.current.favorites).not.toContain(eventId)
    })
  })

  describe('Notification Management', () => {
    it('should add a notification', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      const notification = {
        id: 'notif-1',
        userId: 'user-1',
        message: 'Test notification',
        type: 'info' as const,
        date: '2025-01-01',
        read: false,
      }

      act(() => {
        result.current.addNotification(notification)
      })

      expect(result.current.notifications.length).toBe(1)
      expect(result.current.notifications[0]).toEqual(notification)
    })

    it('should mark notification as read', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      const notification = {
        id: 'notif-1',
        userId: 'user-1',
        message: 'Test notification',
        type: 'info' as const,
        date: '2025-01-01',
        read: false,
      }

      act(() => {
        result.current.addNotification(notification)
      })

      expect(result.current.notifications[0].read).toBe(false)

      act(() => {
        result.current.markNotificationAsRead('notif-1')
      })

      expect(result.current.notifications[0].read).toBe(true)
    })
  })

  describe('LocalStorage Persistence', () => {
    it('should save data to localStorage on state change', () => {
      // Create a spy on localStorage.setItem
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

      const { result } = renderHook(() => useApp(), { wrapper })

      const newTicket = {
        id: 'ticket-1',
        eventId: '1',
        userId: 'user-1',
        userName: 'Test User',
        userEmail: 'test@example.com',
        quantity: 2,
        totalPrice: 20000,
        purchaseDate: '2025-01-01',
        qrCode: 'QR123',
        status: 'active' as const,
      }

      act(() => {
        result.current.addTicket(newTicket)
      })

      // Check if localStorage.setItem was called
      expect(setItemSpy).toHaveBeenCalled()

      setItemSpy.mockRestore()
    })
  })

  describe('Error Handling', () => {
    it('should throw error when useApp is used outside AppProvider', () => {
      // Suppress console.error for this test
      const originalError = console.error
      console.error = jest.fn()

      expect(() => {
        renderHook(() => useApp())
      }).toThrow('useApp must be used within an AppProvider')

      console.error = originalError
    })
  })
})
