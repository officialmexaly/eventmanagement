# 🤖 EventHub AI Agent - Quick Start Guide

## What is it?

A world-class AI assistant powered by Claude 3.5 Sonnet that helps users discover events, check availability, get recommendations, and provides admin analytics through natural conversations.

## ✨ Key Features

- 🔍 **Intelligent Event Search** - Natural language queries like "Show me music events this weekend"
- 🎯 **Personalized Recommendations** - AI-powered suggestions based on your interests
- ⚡ **Real-time Availability** - Instant ticket availability checking
- 📊 **Admin Analytics** - Revenue metrics, sales reports, and performance insights
- 💬 **Natural Conversations** - Multi-turn dialogues with context awareness
- 🎨 **Beautiful UI** - Sleek chat interface with streaming responses

## 🚀 Setup (2 minutes)

### 1. Get API Key
Visit https://console.anthropic.com/settings/keys and create a key

### 2. Configure
Create `.env.local`:
```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 3. Run
```bash
npm install
npm run dev
```

Done! Open http://localhost:3000 and click the chat button 💬

## 💡 Example Conversations

### Finding Events
```
You: "What tech events are happening next month?"
AI: "I found 3 tech events in December:
     1. Tech Conference 2025 (Dec 15) - ₦15,000
     2. Startup Pitch Night (Dec 5) - ₦5,000
     ..."
```

### Checking Availability
```
You: "Can I get 5 tickets for the Music Festival?"
AI: "Yes! 1,500 tickets available for Music Festival.
     5 tickets = ₦125,000 total. Ready to book?"
```

### Getting Recommendations
```
You: "Recommend something for art lovers"
AI: "Perfect! Here are my top picks for art enthusiasts:
     1. Art Exhibition (Dec 1) - Contemporary African art
     2. Gallery Opening (Dec 10) - Limited spots!
     ..."
```

### Admin Analytics
```
Admin: "Show me this month's performance"
AI: "Here's your performance summary:
     - Total Revenue: ₦450,000
     - Tickets Sold: 1,250
     - Top Event: Music Festival (₦125,000)
     ..."
```

## 🛠 Architecture

```
User Input → AIAgent.tsx → /api/agent → Claude 3.5 Sonnet
                ↓                ↓
           UI Updates ← Streaming Response ← Tool Execution
```

## 🎯 Available Tools

1. **search_events** - Find events by keywords, category, date
2. **get_event_details** - Get full event information
3. **check_availability** - Check ticket availability
4. **get_recommendations** - Get personalized suggestions
5. **get_analytics** - Admin-only analytics (revenue, sales, trends)

## 📱 UI Components

- **Floating Button** - Bottom-right corner on all pages
- **Chat Window** - Resizable, minimizable conversation interface
- **Streaming** - Real-time response display
- **Suggestions** - Quick-start question prompts

## 🔒 Security

- API key stored server-side only
- Admin tools require authentication
- Input validation on all parameters
- No sensitive data in responses

## 🧪 Testing

Run tests:
```bash
npm test -- AIAgent
```

35+ test cases covering:
- UI rendering and interactions
- Message sending and receiving
- Error handling
- Context integration
- Loading states

## 📚 Full Documentation

See [AI_AGENT_DOCS.md](./AI_AGENT_DOCS.md) for:
- Detailed architecture
- Tool specifications
- Customization guide
- Performance optimization
- Advanced features

## 🎨 Customization

### Change Colors
Edit `/app/components/AIAgent.tsx`:
```tsx
// Change from slate to purple
className="bg-slate-800" → className="bg-purple-800"
```

### Add New Tools
Edit `/app/api/agent/route.ts`:
```typescript
const tools = [
  ...existingTools,
  {
    name: 'your_tool',
    description: 'What it does',
    input_schema: { /* params */ }
  }
]
```

### Modify Personality
Edit the `SYSTEM_PROMPT` in `/app/api/agent/route.ts`

## ⚡ Performance

- **Streaming**: Real-time responses via SSE
- **Efficient**: Only necessary data sent to Claude
- **Fast**: Typical response time < 2 seconds
- **Scalable**: Handles concurrent conversations

## 🐛 Troubleshooting

**Agent not responding?**
- Check `.env.local` has correct ANTHROPIC_API_KEY
- Verify API key is active at console.anthropic.com
- Check browser console for errors

**Tools not working?**
- Ensure events data is available
- Check admin permissions for analytics
- Review API route logs

**UI issues?**
- Clear browser cache
- Check z-index conflicts
- Verify Tailwind CSS is working

## 🚀 What's Next?

Future enhancements:
- Voice input/output
- Multi-language support
- Direct booking integration
- Learning from user interactions
- Advanced predictive analytics

## 💬 Support

- 📖 [Full Documentation](./AI_AGENT_DOCS.md)
- 🧪 [Testing Guide](./TESTING.md)
- 🐛 GitHub Issues

---

**Built with ❤️ using Claude 3.5 Sonnet**

Made by the EventHub Team | Powered by Anthropic
