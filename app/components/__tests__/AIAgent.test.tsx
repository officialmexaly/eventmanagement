import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AIAgent from '../AIAgent'
import { useApp } from '../AppContext'

// Mock the AppContext
jest.mock('../AppContext', () => ({
  useApp: jest.fn(),
}))

// Mock fetch
global.fetch = jest.fn()

describe('AIAgent Component', () => {
  const mockEvents = [
    {
      id: '1',
      title: 'Tech Conference 2025',
      date: '2025-12-15',
      location: 'Lagos',
      description: 'Annual tech conference',
      price: 15000,
      capacity: 500,
      category: 'conference',
      image: 'https://example.com/image1.jpg',
      sold: 100,
    },
    {
      id: '2',
      title: 'Music Festival',
      date: '2025-11-25',
      location: 'Eko Atlantic',
      description: 'Three-day music festival',
      price: 25000,
      capacity: 2000,
      category: 'music',
      image: 'https://example.com/image2.jpg',
      sold: 500,
    },
  ]

  const mockAppContext = {
    events: mockEvents,
    isAdmin: false,
    user: null,
    tickets: [],
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
    ;(useApp as jest.Mock).mockReturnValue(mockAppContext)
    ;(global.fetch as jest.Mock).mockClear()
  })

  describe('UI Rendering', () => {
    it('should render floating button when closed', () => {
      render(<AIAgent />)

      const button = screen.getByLabelText('Open AI Assistant')
      expect(button).toBeInTheDocument()
    })

    it('should open chat window when button is clicked', async () => {
      render(<AIAgent />)

      const button = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('EventHub AI Assistant')).toBeInTheDocument()
      })
    })

    it('should display initial greeting message', async () => {
      render(<AIAgent />)

      const button = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText(/Hello! 👋 I'm your EventHub AI assistant/)).toBeInTheDocument()
      })
    })

    it('should show suggested questions', async () => {
      render(<AIAgent />)

      const button = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Try asking:')).toBeInTheDocument()
        expect(screen.getByText('What events are happening this week?')).toBeInTheDocument()
        expect(screen.getByText('Show me music events')).toBeInTheDocument()
      })
    })

    it('should close when close button is clicked', async () => {
      render(<AIAgent />)

      const openButton = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(openButton)

      await waitFor(() => {
        expect(screen.getByText('EventHub AI Assistant')).toBeInTheDocument()
      })

      const closeButton = screen.getByLabelText('Close')
      fireEvent.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('EventHub AI Assistant')).not.toBeInTheDocument()
      })
    })

    it('should minimize and maximize', async () => {
      render(<AIAgent />)

      const openButton = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(openButton)

      const minimizeButton = screen.getByLabelText('Minimize')
      fireEvent.click(minimizeButton)

      await waitFor(() => {
        const maximizeButton = screen.getByLabelText('Maximize')
        expect(maximizeButton).toBeInTheDocument()
      })
    })
  })

  describe('User Interaction', () => {
    it('should allow typing in input field', async () => {
      render(<AIAgent />)

      const openButton = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(openButton)

      const input = screen.getByPlaceholderText('Ask about events...')
      await userEvent.type(input, 'Show me tech events')

      expect(input).toHaveValue('Show me tech events')
    })

    it('should fill input when suggested question is clicked', async () => {
      render(<AIAgent />)

      const openButton = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(openButton)

      const suggestion = screen.getByText('Show me music events')
      fireEvent.click(suggestion)

      const input = screen.getByPlaceholderText('Ask about events...')
      expect(input).toHaveValue('Show me music events')
    })

    it('should send message when send button is clicked', async () => {
      const mockReadableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"type":"text","text":"Hello"}\n\n'))
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
          controller.close()
        },
      })

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        body: mockReadableStream,
      })

      render(<AIAgent />)

      const openButton = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(openButton)

      const input = screen.getByPlaceholderText('Ask about events...')
      await userEvent.type(input, 'Show me events')

      const sendButton = screen.getByLabelText('Send message')
      fireEvent.click(sendButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/agent', expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }))
      })
    })

    it('should send message on Enter key press', async () => {
      const mockReadableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"type":"text","text":"Response"}\n\n'))
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
          controller.close()
        },
      })

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        body: mockReadableStream,
      })

      render(<AIAgent />)

      const openButton = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(openButton)

      const input = screen.getByPlaceholderText('Ask about events...')
      await userEvent.type(input, 'Test message{Enter}')

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })

    it('should not send empty messages', async () => {
      render(<AIAgent />)

      const openButton = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(openButton)

      const sendButton = screen.getByLabelText('Send message')
      fireEvent.click(sendButton)

      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should display user message immediately', async () => {
      const mockReadableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"type":"text","text":"AI Response"}\n\n'))
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
          controller.close()
        },
      })

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        body: mockReadableStream,
      })

      render(<AIAgent />)

      const openButton = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(openButton)

      const input = screen.getByPlaceholderText('Ask about events...')
      await userEvent.type(input, 'My message')

      const sendButton = screen.getByLabelText('Send message')
      fireEvent.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText('My message')).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('should show loading indicator while waiting for response', async () => {
      let controllerRef: ReadableStreamDefaultController | undefined

      const mockReadableStream = new ReadableStream({
        start(controller) {
          controllerRef = controller
        },
      })

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        body: mockReadableStream,
      })

      render(<AIAgent />)

      const openButton = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(openButton)

      const input = screen.getByPlaceholderText('Ask about events...')
      await userEvent.type(input, 'Test')

      const sendButton = screen.getByLabelText('Send message')
      fireEvent.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText('Thinking...')).toBeInTheDocument()
      })

      // Cleanup
      controllerRef?.close()
    })

    it('should disable input while loading', async () => {
      let controllerRef: ReadableStreamDefaultController | undefined

      const mockReadableStream = new ReadableStream({
        start(controller) {
          controllerRef = controller
        },
      })

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        body: mockReadableStream,
      })

      render(<AIAgent />)

      const openButton = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(openButton)

      const input = screen.getByPlaceholderText('Ask about events...')
      await userEvent.type(input, 'Test')

      const sendButton = screen.getByLabelText('Send message')
      fireEvent.click(sendButton)

      await waitFor(() => {
        expect(input).toBeDisabled()
      })

      // Cleanup
      controllerRef?.close()
    })
  })

  describe('Error Handling', () => {
    it('should display error message on failed request', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      render(<AIAgent />)

      const openButton = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(openButton)

      const input = screen.getByPlaceholderText('Ask about events...')
      await userEvent.type(input, 'Test')

      const sendButton = screen.getByLabelText('Send message')
      fireEvent.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/I'm sorry, I encountered an error/)).toBeInTheDocument()
      })
    })

    it('should handle non-OK response', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      })

      render(<AIAgent />)

      const openButton = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(openButton)

      const input = screen.getByPlaceholderText('Ask about events...')
      await userEvent.type(input, 'Test')

      const sendButton = screen.getByLabelText('Send message')
      fireEvent.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/I'm sorry, I encountered an error/)).toBeInTheDocument()
      })
    })
  })

  describe('Context Integration', () => {
    it('should pass event data to API', async () => {
      const mockReadableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"type":"text","text":"Response"}\n\n'))
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
          controller.close()
        },
      })

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        body: mockReadableStream,
      })

      render(<AIAgent />)

      const openButton = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(openButton)

      const input = screen.getByPlaceholderText('Ask about events...')
      await userEvent.type(input, 'Show events')

      const sendButton = screen.getByLabelText('Send message')
      fireEvent.click(sendButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/agent', expect.objectContaining({
          body: expect.stringContaining('"events"'),
        }))
      })
    })

    it('should pass admin status to API', async () => {
      ;(useApp as jest.Mock).mockReturnValue({
        ...mockAppContext,
        isAdmin: true,
      })

      const mockReadableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"type":"text","text":"Response"}\n\n'))
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
          controller.close()
        },
      })

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        body: mockReadableStream,
      })

      render(<AIAgent />)

      const openButton = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(openButton)

      const input = screen.getByPlaceholderText('Ask about events...')
      await userEvent.type(input, 'Show analytics')

      const sendButton = screen.getByLabelText('Send message')
      fireEvent.click(sendButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/agent', expect.objectContaining({
          body: expect.stringContaining('"isAdmin":true'),
        }))
      })
    })

    it('should display event count in footer', async () => {
      render(<AIAgent />)

      const openButton = screen.getByLabelText('Open AI Assistant')
      fireEvent.click(openButton)

      await waitFor(() => {
        expect(screen.getByText(/2 events available/)).toBeInTheDocument()
      })
    })
  })
})
