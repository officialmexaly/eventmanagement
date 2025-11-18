import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminPage from '../page'
import { useApp } from '../../components/AppContext'
import { useRouter } from 'next/navigation'

// Mock the AppContext
jest.mock('../../components/AppContext', () => ({
  useApp: jest.fn(),
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('AdminPage', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }

  const mockEvents = [
    {
      id: '1',
      title: 'Test Event 1',
      date: '2025-12-15',
      location: 'Test Location 1',
      description: 'Test Description 1',
      price: 10000,
      capacity: 100,
      category: 'conference',
      image: 'https://example.com/image1.jpg',
    },
    {
      id: '2',
      title: 'Test Event 2',
      date: '2025-11-20',
      location: 'Test Location 2',
      description: 'Test Description 2',
      price: 5000,
      capacity: 50,
      category: 'music',
      image: 'https://example.com/image2.jpg',
    },
  ]

  const mockTickets = [
    {
      id: 'ticket1',
      eventId: '1',
      userId: 'user1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      quantity: 2,
      totalPrice: 20000,
      purchaseDate: '2025-01-01',
      qrCode: 'QR123',
      status: 'active' as const,
    },
  ]

  const mockUser = {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@example.com',
  }

  const mockAppContext = {
    user: mockUser,
    isAdmin: true,
    events: mockEvents,
    tickets: mockTickets,
    reviews: [],
    favorites: [],
    notifications: [],
    setUser: jest.fn(),
    setIsAdmin: jest.fn(),
    setEvents: jest.fn(),
    addEvent: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
    setTickets: jest.fn(),
    addTicket: jest.fn(),
    setReviews: jest.fn(),
    addReview: jest.fn(),
    setFavorites: jest.fn(),
    toggleFavorite: jest.fn(),
    setNotifications: jest.fn(),
    addNotification: jest.fn(),
    markNotificationAsRead: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(useApp as jest.Mock).mockReturnValue(mockAppContext)
  })

  describe('Authentication and Access Control', () => {
    it('should redirect non-admin users', () => {
      ;(useApp as jest.Mock).mockReturnValue({
        ...mockAppContext,
        user: null,
        isAdmin: false,
      })

      const { container } = render(<AdminPage />)
      expect(container.firstChild).toBeNull()
    })

    it('should render admin page for authenticated admin users', () => {
      render(<AdminPage />)
      expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
      expect(screen.getByText('Admin User')).toBeInTheDocument()
    })
  })

  describe('Sidebar Navigation', () => {
    it('should render all navigation items', () => {
      render(<AdminPage />)

      expect(screen.getByRole('button', { name: /^Dashboard$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^Analytics$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^Events$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^Tickets$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^Users$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^Reviews$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^Settings$/i })).toBeInTheDocument()
    })

    it('should switch views when navigation items are clicked', async () => {
      render(<AdminPage />)

      // Click Analytics
      const analyticsButton = screen.getByRole('button', { name: /Analytics/i })
      fireEvent.click(analyticsButton)
      await waitFor(() => {
        expect(screen.getByText('Analytics & Reports')).toBeInTheDocument()
      })

      // Click Events
      const eventsButton = screen.getByRole('button', { name: /^Events$/i })
      fireEvent.click(eventsButton)
      await waitFor(() => {
        expect(screen.getByText('Manage Events')).toBeInTheDocument()
      })
    })

    it('should exit admin mode when exit button is clicked', () => {
      render(<AdminPage />)

      const exitButton = screen.getByRole('button', { name: /Exit Admin Mode/i })
      fireEvent.click(exitButton)

      expect(mockAppContext.setIsAdmin).toHaveBeenCalledWith(false)
    })
  })

  describe('Dashboard View', () => {
    it('should display analytics statistics', () => {
      render(<AdminPage />)

      expect(screen.getByText('Total Revenue')).toBeInTheDocument()
      expect(screen.getByText('Tickets Sold')).toBeInTheDocument()
      expect(screen.getByText('Active Events')).toBeInTheDocument()
    })

    it('should display recent events', () => {
      render(<AdminPage />)

      expect(screen.getByText('Test Event 1')).toBeInTheDocument()
      expect(screen.getByText('Test Event 2')).toBeInTheDocument()
    })

    it('should navigate to events view when clicking "View all"', async () => {
      render(<AdminPage />)

      const viewAllButton = screen.getByText('View all')
      fireEvent.click(viewAllButton)

      await waitFor(() => {
        expect(screen.getByText('Manage Events')).toBeInTheDocument()
      })
    })
  })

  describe('Events Management', () => {
    it('should display all events in events view', () => {
      render(<AdminPage />)

      // Navigate to events view
      const eventsButton = screen.getByRole('button', { name: /^Events$/i })
      fireEvent.click(eventsButton)

      expect(screen.getByText('Test Event 1')).toBeInTheDocument()
      expect(screen.getByText('Test Event 2')).toBeInTheDocument()
    })

    it('should open event modal when Add Event button is clicked', async () => {
      render(<AdminPage />)

      // Navigate to events view
      const eventsButton = screen.getByRole('button', { name: /^Events$/i })
      fireEvent.click(eventsButton)

      const addButton = screen.getByRole('button', { name: /Add Event/i })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('Create New Event')).toBeInTheDocument()
      })
    })

    it('should close event modal when cancel button is clicked', async () => {
      render(<AdminPage />)

      // Navigate to events view and open modal
      const eventsButton = screen.getByRole('button', { name: /^Events$/i })
      fireEvent.click(eventsButton)

      const addButton = screen.getByRole('button', { name: /Add Event/i })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('Create New Event')).toBeInTheDocument()
      })

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      fireEvent.click(cancelButton)

      await waitFor(() => {
        expect(screen.queryByText('Create New Event')).not.toBeInTheDocument()
      })
    })

    it('should call deleteEvent when delete button is clicked and confirmed', async () => {
      // Mock window.confirm
      global.confirm = jest.fn(() => true)

      render(<AdminPage />)

      // Navigate to events view
      const eventsButton = screen.getByRole('button', { name: /^Events$/i })
      fireEvent.click(eventsButton)

      // Find and click delete button for first event
      const deleteButtons = screen.getAllByRole('button', { name: /Delete/i })
      fireEvent.click(deleteButtons[0])

      expect(mockAppContext.deleteEvent).toHaveBeenCalledWith('1')
    })

    it('should not delete event when confirmation is cancelled', () => {
      // Mock window.confirm to return false
      global.confirm = jest.fn(() => false)

      render(<AdminPage />)

      // Navigate to events view
      const eventsButton = screen.getByRole('button', { name: /^Events$/i })
      fireEvent.click(eventsButton)

      // Find and click delete button
      const deleteButtons = screen.getAllByRole('button', { name: /Delete/i })
      fireEvent.click(deleteButtons[0])

      expect(mockAppContext.deleteEvent).not.toHaveBeenCalled()
    })
  })

  describe('Tickets View', () => {
    it('should display tickets table', () => {
      render(<AdminPage />)

      // Navigate to tickets view
      const ticketsButton = screen.getByRole('button', { name: /^Tickets$/i })
      fireEvent.click(ticketsButton)

      expect(screen.getByText('Ticket Management')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText(/₦20,000/)).toBeInTheDocument()
    })

    it('should display empty state when no tickets exist', () => {
      ;(useApp as jest.Mock).mockReturnValue({
        ...mockAppContext,
        tickets: [],
      })

      render(<AdminPage />)

      // Navigate to tickets view
      const ticketsButton = screen.getByRole('button', { name: /^Tickets$/i })
      fireEvent.click(ticketsButton)

      expect(screen.getByText('No tickets purchased yet')).toBeInTheDocument()
    })
  })

  describe('Analytics View', () => {
    it('should display event performance data', () => {
      render(<AdminPage />)

      // Navigate to analytics view
      const analyticsButton = screen.getByRole('button', { name: /Analytics/i })
      fireEvent.click(analyticsButton)

      expect(screen.getByText('Event Performance')).toBeInTheDocument()
      expect(screen.getByText('Test Event 1')).toBeInTheDocument()
      expect(screen.getByText('Test Event 2')).toBeInTheDocument()
    })
  })

  describe('Users View', () => {
    it('should display user management placeholder', () => {
      render(<AdminPage />)

      // Navigate to users view
      const usersButton = screen.getByRole('button', { name: /^Users$/i })
      fireEvent.click(usersButton)

      expect(screen.getByRole('heading', { name: /User Management/i, level: 1 })).toBeInTheDocument()
      expect(screen.getByText(/This section will allow you to manage registered users/i)).toBeInTheDocument()
    })
  })

  describe('Reviews View', () => {
    it('should display reviews placeholder', () => {
      render(<AdminPage />)

      // Navigate to reviews view
      const reviewsButton = screen.getByRole('button', { name: /^Reviews$/i })
      fireEvent.click(reviewsButton)

      expect(screen.getByRole('heading', { name: /Reviews & Ratings/i, level: 1 })).toBeInTheDocument()
      expect(screen.getByText(/This section will display all customer reviews/i)).toBeInTheDocument()
    })
  })

  describe('Settings View', () => {
    it('should display settings options', () => {
      render(<AdminPage />)

      // Navigate to settings view
      const settingsButton = screen.getByRole('button', { name: /^Settings$/i })
      fireEvent.click(settingsButton)

      expect(screen.getByText('General Settings')).toBeInTheDocument()
      expect(screen.getByText('Email Notifications')).toBeInTheDocument()
      expect(screen.getByText('Auto-approve Events')).toBeInTheDocument()
      expect(screen.getByText('Payment Settings')).toBeInTheDocument()
    })
  })
})
