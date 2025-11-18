import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Define tools that the agent can use
const tools: Anthropic.Tool[] = [
  {
    name: 'search_events',
    description: 'Search for events based on criteria like category, date range, location, or keywords. Returns a list of matching events with details.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query or keywords to find events',
        },
        category: {
          type: 'string',
          enum: ['conference', 'music', 'art', 'food', 'sports', 'workshop', 'all'],
          description: 'Filter by event category',
        },
        date_from: {
          type: 'string',
          description: 'Start date for filtering events (YYYY-MM-DD format)',
        },
        date_to: {
          type: 'string',
          description: 'End date for filtering events (YYYY-MM-DD format)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_event_details',
    description: 'Get detailed information about a specific event including availability, pricing, and description.',
    input_schema: {
      type: 'object',
      properties: {
        event_id: {
          type: 'string',
          description: 'The unique identifier of the event',
        },
      },
      required: ['event_id'],
    },
  },
  {
    name: 'check_availability',
    description: 'Check ticket availability for a specific event',
    input_schema: {
      type: 'object',
      properties: {
        event_id: {
          type: 'string',
          description: 'The unique identifier of the event',
        },
        quantity: {
          type: 'number',
          description: 'Number of tickets to check availability for',
        },
      },
      required: ['event_id', 'quantity'],
    },
  },
  {
    name: 'get_recommendations',
    description: 'Get personalized event recommendations based on user preferences and past attendance',
    input_schema: {
      type: 'object',
      properties: {
        preferences: {
          type: 'array',
          items: { type: 'string' },
          description: 'User preferences (categories, interests)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of recommendations to return',
        },
      },
      required: ['preferences'],
    },
  },
  {
    name: 'get_analytics',
    description: 'Get analytics and insights about events, sales, and trends. Admin only.',
    input_schema: {
      type: 'object',
      properties: {
        metric: {
          type: 'string',
          enum: ['revenue', 'sales', 'popular_events', 'trends', 'performance'],
          description: 'The type of analytics to retrieve',
        },
        time_period: {
          type: 'string',
          description: 'Time period for analytics (e.g., "7d", "30d", "all")',
        },
      },
      required: ['metric'],
    },
  },
];

// System prompt for the EventHub AI Agent
const SYSTEM_PROMPT = `You are an intelligent AI assistant for EventHub, a professional event management platform. Your role is to help users discover events, book tickets, and get information about upcoming activities.

**Your Capabilities:**
- Search and filter events by category, date, location, and keywords
- Provide detailed event information including pricing, capacity, and availability
- Offer personalized event recommendations based on user preferences
- Check ticket availability in real-time
- Provide analytics insights for administrators
- Answer questions about the platform and booking process

**Your Personality:**
- Professional yet friendly and approachable
- Enthusiastic about helping users find the perfect events
- Clear and concise in your communication
- Proactive in suggesting relevant events
- Helpful in explaining the booking process

**Guidelines:**
- Always use tools when you need event data - never make up event information
- Be transparent about ticket availability and pricing
- If an event is sold out, suggest similar alternatives
- For analytics requests, verify the user has admin permissions
- If you're unsure, ask clarifying questions rather than guessing
- Format event information clearly with dates, prices, and key details
- Use Nigerian Naira (₦) for all pricing information

**Event Categories:**
- Conference: Business, tech, and professional events
- Music: Concerts, festivals, and live performances
- Art: Exhibitions, galleries, and cultural events
- Food: Culinary experiences and food festivals
- Sports: Athletic events and competitions
- Workshop: Learning and skill-building sessions

Remember: Your goal is to make event discovery and booking seamless and enjoyable for users!`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, events, isAdmin = false } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4096,
            temperature: 0.7,
            system: SYSTEM_PROMPT,
            messages: messages,
            tools: tools,
            stream: true,
          });

          let currentToolUse: any = null;
          let toolInput = '';

          for await (const event of response) {
            if (event.type === 'content_block_start') {
              if (event.content_block.type === 'tool_use') {
                currentToolUse = event.content_block;
                toolInput = '';
              }
            } else if (event.type === 'content_block_delta') {
              if (event.delta.type === 'text_delta') {
                const chunk = {
                  type: 'text',
                  text: event.delta.text,
                };
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
                );
              } else if (event.delta.type === 'input_json_delta') {
                toolInput += event.delta.partial_json;
              }
            } else if (event.type === 'content_block_stop') {
              if (currentToolUse) {
                // Execute the tool
                const toolResult = await executeTool(
                  currentToolUse.name,
                  JSON.parse(toolInput),
                  events,
                  isAdmin
                );

                const chunk = {
                  type: 'tool_result',
                  tool_name: currentToolUse.name,
                  result: toolResult,
                };
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
                );

                currentToolUse = null;
                toolInput = '';
              }
            } else if (event.type === 'message_stop') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            }
          }

          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const errorChunk = {
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(errorChunk)}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Agent API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Execute tool functions
async function executeToolany>(
  toolName: string,
  input: any,
  events: any[],
  isAdmin: boolean
): Promise<any> {
  switch (toolName) {
    case 'search_events':
      return searchEvents(input, events);

    case 'get_event_details':
      return getEventDetails(input, events);

    case 'check_availability':
      return checkAvailability(input, events);

    case 'get_recommendations':
      return getRecommendations(input, events);

    case 'get_analytics':
      if (!isAdmin) {
        return { error: 'Analytics access requires admin permissions' };
      }
      return getAnalytics(input, events);

    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

function searchEvents(input: any, events: any[]) {
  const { query, category, date_from, date_to } = input;
  let filtered = events;

  // Filter by category
  if (category && category !== 'all') {
    filtered = filtered.filter((e) => e.category === category);
  }

  // Filter by date range
  if (date_from) {
    filtered = filtered.filter((e) => new Date(e.date) >= new Date(date_from));
  }
  if (date_to) {
    filtered = filtered.filter((e) => new Date(e.date) <= new Date(date_to));
  }

  // Filter by search query
  if (query && query !== 'all') {
    const queryLower = query.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(queryLower) ||
        e.description.toLowerCase().includes(queryLower) ||
        e.location.toLowerCase().includes(queryLower)
    );
  }

  return {
    events: filtered.slice(0, 10),
    total_found: filtered.length,
  };
}

function getEventDetails(input: any, events: any[]) {
  const event = events.find((e) => e.id === input.event_id);

  if (!event) {
    return { error: 'Event not found' };
  }

  return {
    ...event,
    availability: event.capacity - (event.sold || 0),
    status: new Date(event.date) < new Date() ? 'past' : 'upcoming',
  };
}

function checkAvailability(input: any, events: any[]) {
  const event = events.find((e) => e.id === input.event_id);

  if (!event) {
    return { error: 'Event not found' };
  }

  const available = event.capacity - (event.sold || 0);
  const canBook = available >= input.quantity;

  return {
    event_id: event.id,
    event_title: event.title,
    requested_quantity: input.quantity,
    available_tickets: available,
    can_book: canBook,
    total_price: canBook ? event.price * input.quantity : null,
  };
}

function getRecommendations(input: any, events: any[]) {
  const { preferences, limit = 5 } = input;
  let scored = events.map((event) => {
    let score = 0;

    // Score based on preferences
    if (preferences.includes(event.category)) {
      score += 10;
    }

    // Boost upcoming events
    if (new Date(event.date) >= new Date()) {
      score += 5;
    }

    // Boost events with availability
    const available = event.capacity - (event.sold || 0);
    if (available > 0) {
      score += 3;
    }

    return { ...event, score };
  });

  // Sort by score and filter upcoming events
  scored = scored
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return {
    recommendations: scored,
    total: scored.length,
  };
}

function getAnalytics(input: any, events: any[]) {
  const { metric, time_period = 'all' } = input;

  switch (metric) {
    case 'revenue':
      const totalRevenue = events.reduce(
        (sum, e) => sum + (e.sold || 0) * e.price,
        0
      );
      return { total_revenue: totalRevenue, currency: 'NGN' };

    case 'sales':
      const totalSales = events.reduce((sum, e) => sum + (e.sold || 0), 0);
      return { total_tickets_sold: totalSales };

    case 'popular_events':
      const popular = events
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 5)
        .map((e) => ({
          id: e.id,
          title: e.title,
          tickets_sold: e.sold || 0,
          revenue: (e.sold || 0) * e.price,
        }));
      return { popular_events: popular };

    case 'performance':
      const performance = events.map((e) => ({
        id: e.id,
        title: e.title,
        capacity: e.capacity,
        sold: e.sold || 0,
        fill_rate: ((e.sold || 0) / e.capacity) * 100,
        revenue: (e.sold || 0) * e.price,
      }));
      return { event_performance: performance };

    default:
      return { error: 'Unknown metric' };
  }
}
