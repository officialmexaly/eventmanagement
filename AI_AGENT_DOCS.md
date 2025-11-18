# EventHub AI Agent Documentation

## Overview

The EventHub AI Agent is a world-class conversational AI assistant powered by Claude 3.5 Sonnet. It provides intelligent event discovery, ticket availability checking, personalized recommendations, and admin analytics through natural language conversations.

## Features

### 🎯 Core Capabilities

1. **Event Search & Discovery**
   - Search events by keywords, categories, dates, and locations
   - Filter by multiple criteria simultaneously
   - Natural language queries like "Show me music events this week"

2. **Event Information**
   - Detailed event information including pricing, capacity, and availability
   - Real-time ticket availability checking
   - Event status (upcoming, today, past)

3. **Personalized Recommendations**
   - AI-powered event recommendations based on user preferences
   - Smart scoring algorithm considering category, availability, and date
   - Contextual suggestions based on conversation history

4. **Admin Analytics** (Admin Only)
   - Revenue analytics and reporting
   - Sales performance metrics
   - Popular events tracking
   - Event performance analysis with fill rates

5. **Natural Conversation**
   - Context-aware responses
   - Multi-turn conversations
   - Follow-up questions and clarifications
   - Helpful suggestions and alternatives

## Setup

### 1. Get API Key

1. Visit [Anthropic Console](https://console.anthropic.com/settings/keys)
2. Create a new API key
3. Copy the key (starts with `sk-ant-`)

### 2. Configure Environment

Create a `.env.local` file in the project root:

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

**Important:** Never commit your `.env.local` file to version control.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

The AI agent will be available on all pages via the floating chat button in the bottom-right corner.

## Architecture

### Component Structure

```
EventHub AI Agent
├── API Route (/app/api/agent/route.ts)
│   ├── Claude API Integration
│   ├── Tool Execution Engine
│   └── Streaming Response Handler
│
├── UI Component (/app/components/AIAgent.tsx)
│   ├── Chat Interface
│   ├── Message History
│   └── User Input Handler
│
└── Context Integration
    ├── Event Data Access
    ├── User State Management
    └── Admin Permission Checks
```

### Tools Available to the Agent

#### 1. `search_events`
Search for events based on criteria.

**Parameters:**
- `query` (required): Search keywords
- `category` (optional): Filter by category
- `date_from` (optional): Start date filter
- `date_to` (optional): End date filter

**Example Usage:**
```
User: "Find tech conferences in December"
Agent: Uses search_events with query="tech conferences" and date filters
```

#### 2. `get_event_details`
Get comprehensive information about a specific event.

**Parameters:**
- `event_id` (required): Unique event identifier

**Returns:**
- Full event details
- Current availability
- Event status (past/upcoming)

#### 3. `check_availability`
Check if tickets are available for booking.

**Parameters:**
- `event_id` (required): Event to check
- `quantity` (required): Number of tickets needed

**Returns:**
- Available ticket count
- Booking feasibility
- Total price calculation

#### 4. `get_recommendations`
Get personalized event recommendations.

**Parameters:**
- `preferences` (required): Array of user interests/categories
- `limit` (optional): Maximum recommendations (default: 5)

**Algorithm:**
- Scores events based on category match (+10 points)
- Boosts upcoming events (+5 points)
- Boosts available events (+3 points)
- Returns top-scored events

#### 5. `get_analytics` (Admin Only)
Retrieve analytics and business insights.

**Parameters:**
- `metric` (required): Type of analytics
  - `revenue`: Total revenue calculations
  - `sales`: Ticket sales statistics
  - `popular_events`: Top 5 events by sales
  - `performance`: Event-by-event performance data
- `time_period` (optional): Time range for analysis

**Security:** Automatically checks `isAdmin` flag before execution.

## Usage Examples

### Basic Event Search

```
User: "What events are happening this weekend?"
Agent: [Uses search_events with date filters]
       "Here are the events happening this weekend:
        1. Music Festival - Saturday, ₦25,000
        2. Art Exhibition - Sunday, ₦5,000
        ..."
```

### Checking Availability

```
User: "Are there 4 tickets available for the Tech Conference?"
Agent: [Uses check_availability]
       "Yes! There are 150 tickets available for Tech Conference 2025.
        4 tickets would cost ₦60,000 total (₦15,000 each).
        Would you like to proceed with booking?"
```

### Getting Recommendations

```
User: "I'm interested in music and art events"
Agent: [Uses get_recommendations with preferences: ["music", "art"]]
       "Based on your interests, I recommend:
        1. Music Festival (Nov 25) - Top rated! ₦25,000
        2. Art Exhibition (Dec 1) - Limited seats, ₦5,000
        ..."
```

### Admin Analytics

```
Admin: "Show me revenue analytics"
Agent: [Checks admin status, uses get_analytics]
       "Here's your revenue breakdown:
        - Total Revenue: ₦450,000
        - Top performing event: Music Festival (₦125,000)
        ..."
```

## Customization

### Modifying System Prompt

Edit the `SYSTEM_PROMPT` in `/app/api/agent/route.ts` to customize:
- Agent personality
- Response style
- Domain knowledge
- Behavioral guidelines

### Adding New Tools

1. Define tool schema in the `tools` array
2. Implement tool function in `executeTool`
3. Update documentation

Example:

```typescript
{
  name: 'send_notification',
  description: 'Send a notification to a user',
  input_schema: {
    type: 'object',
    properties: {
      user_id: { type: 'string' },
      message: { type: 'string' }
    },
    required: ['user_id', 'message']
  }
}
```

### Styling the Chat UI

The chat component uses Tailwind CSS. Customize in `/app/components/AIAgent.tsx`:
- Colors: Update color classes (slate, emerald, etc.)
- Size: Modify `w-96` and `h-[600px]` classes
- Position: Change `bottom-6 right-6` positioning

## Performance

### Optimization Strategies

1. **Streaming Responses**
   - Uses Server-Sent Events (SSE) for real-time streaming
   - Displays responses as they're generated
   - Better user experience with immediate feedback

2. **Efficient Tool Execution**
   - Tools execute on the server side
   - No unnecessary data transfer
   - Results cached in conversation context

3. **Smart Context Management**
   - Only sends necessary event data to Claude
   - Conversation history trimmed if needed
   - Admin flag passed securely

### Rate Limiting

Consider implementing rate limiting for production:

```typescript
// Example: Redis-based rate limiting
const rateLimit = await checkRateLimit(userId);
if (!rateLimit.allowed) {
  return NextResponse.json(
    { error: 'Too many requests' },
    { status: 429 }
  );
}
```

## Security

### Best Practices

1. **API Key Protection**
   - Store in environment variables only
   - Never expose in client-side code
   - Rotate keys regularly

2. **Input Validation**
   - All user inputs validated before processing
   - Tool parameters type-checked
   - SQL injection prevention (when using DB)

3. **Admin Authorization**
   - Analytics tools check `isAdmin` flag
   - Server-side validation
   - Session-based authentication recommended for production

4. **Error Handling**
   - Graceful error messages
   - No sensitive data in error responses
   - Logging for debugging

## Testing

Run agent tests:

```bash
npm test -- app/api/agent
```

Test conversation scenarios:

```typescript
describe('AI Agent', () => {
  it('should search events correctly', async () => {
    const response = await fetch('/api/agent', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Show me music events' }],
        events: mockEvents,
        isAdmin: false
      })
    });
    // Assert response
  });
});
```

## Monitoring

### Metrics to Track

1. **Usage Metrics**
   - Conversations per day
   - Average conversation length
   - Tool usage frequency

2. **Performance Metrics**
   - Response time
   - Token usage
   - Error rates

3. **Quality Metrics**
   - User satisfaction
   - Conversation completion rate
   - Tool success rate

### Logging Example

```typescript
console.log({
  timestamp: new Date().toISOString(),
  event: 'tool_executed',
  tool_name: 'search_events',
  user_id: userId,
  success: true,
  duration_ms: 150
});
```

## Troubleshooting

### Common Issues

**1. Agent Not Responding**
- Check ANTHROPIC_API_KEY is set correctly
- Verify API key is valid and has credit
- Check browser console for errors

**2. Tools Not Executing**
- Verify event data is passed to API
- Check tool function implementation
- Review Claude's console for errors

**3. Streaming Issues**
- Ensure SSE is supported by browser
- Check network tab for connection issues
- Verify API route returns proper headers

**4. Admin Tools Not Working**
- Confirm isAdmin flag is true
- Check user session/authentication
- Review admin permission logic

## Future Enhancements

### Planned Features

1. **Voice Integration**
   - Speech-to-text input
   - Text-to-speech responses
   - Voice commands

2. **Multi-language Support**
   - Automatic language detection
   - Translation capabilities
   - Localized responses

3. **Advanced Analytics**
   - Predictive analytics
   - Trend forecasting
   - Customer insights

4. **Booking Integration**
   - Direct ticket booking through chat
   - Payment processing
   - Confirmation handling

5. **Learning & Personalization**
   - User preference tracking
   - Conversation history
   - Improved recommendations over time

## Support

For issues or questions:
- Check this documentation
- Review GitHub issues
- Contact development team

## License

This AI agent implementation is part of the EventHub application and follows the same license terms.

---

**Powered by Claude 3.5 Sonnet** | Built with Next.js & Anthropic SDK
