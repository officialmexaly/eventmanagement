# 💬 EventHub Chat System

A comprehensive real-time messaging system for EventHub that enables users to communicate, discuss events, and get support.

## 🌟 Features

### Chat Types
1. **Direct Messages (DM)** - One-on-one conversations between users
2. **Event Chat Rooms** - Public discussions for event attendees
3. **Support Chat** - Direct line to admin support team

### Core Features
- ✅ Real-time messaging with instant updates
- ✅ Message history and persistence
- ✅ Unread message counters
- ✅ Read receipts (single/double check marks)
- ✅ Typing indicators (visual feedback)
- ✅ Search conversations
- ✅ Time-based message timestamps
- ✅ Minimize/maximize chat window
- ✅ Beautiful, modern UI

## 🏗️ Architecture

### Data Models

**Conversation**
```typescript
{
  id: string;
  type: 'direct' | 'event' | 'support';
  participants: string[];          // User IDs
  participantNames: string[];
  eventId?: string;                // For event chats
  eventTitle?: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
}
```

**ChatMessage**
```typescript
{
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
}
```

### State Management
- Integrated into AppContext for global access
- LocalStorage persistence
- Real-time updates across components

## 🎨 UI Components

### Main Chat Component (`Chat.tsx`)
- **Conversations List**: Shows all active chats with previews
- **Chat Window**: Active conversation view
- **Message Bubbles**: Styled sent/received messages
- **Input Box**: Type and send messages
- **Search Bar**: Filter conversations
- **New Chat Modal**: Create new conversations

### Visual Features
- Floating chat button with unread badge
- Smooth animations and transitions
- Responsive design (800px wide when open)
- Professional slate color scheme
- Icons for different chat types

## 🚀 Usage

### For Users

**Starting a Chat:**
1. Click the chat button (💬) in the bottom-right
2. Click the "+" button to create new conversation
3. Choose chat type:
   - Support Team for help
   - Event Discussion for event-specific chats

**Sending Messages:**
1. Select a conversation from the list
2. Type your message
3. Press Enter or click Send

**Managing Chats:**
- Minimize to save screen space
- Search conversations by name or content
- Unread counters show new messages
- Read receipts confirm message delivery

### For Developers

**Accessing Chat State:**
```typescript
const {
  conversations,
  messages,
  sendMessage,
  addConversation,
  markMessagesAsRead,
  getConversationMessages,
  getTotalUnreadCount
} = useApp();
```

**Creating a Conversation:**
```typescript
const newConversation: Conversation = {
  id: `event-${eventId}-${Date.now()}`,
  type: 'event',
  participants: [user.id],
  participantNames: [user.name],
  eventId: eventId,
  eventTitle: event.title,
  unreadCount: 0,
  createdAt: new Date().toISOString(),
};

addConversation(newConversation);
```

**Sending a Message:**
```typescript
const message: ChatMessage = {
  id: Date.now().toString(),
  conversationId: activeConversation.id,
  senderId: user.id,
  senderName: user.name,
  content: messageInput,
  timestamp: new Date().toISOString(),
  read: false,
  type: 'text',
};

sendMessage(message);
```

## 🔧 Configuration

### Prerequisites
- User must be logged in to access chat
- Chat button only appears for authenticated users
- Conversations persist in localStorage

### Customization

**Colors:**
Edit `Chat.tsx` to change the color scheme:
```tsx
// Current: slate
className="bg-slate-800"

// Change to blue
className="bg-blue-800"
```

**Position:**
Adjust floating button position:
```tsx
// Current
className="fixed bottom-24 right-6"

// Move to left
className="fixed bottom-24 left-6"
```

**Size:**
Modify chat window dimensions:
```tsx
// Current
w-[800px] h-[600px]

// Smaller
w-[600px] h-[500px]
```

## 💡 Features Explained

### Unread Counter
- Red badge shows total unread messages
- Updates automatically on new messages
- Clears when conversation is opened

### Read Receipts
- Single check (✓): Message sent
- Double check (✓✓): Message read
- Only shown for your own messages

### Time Stamps
- "Just now" for < 1 minute
- "Xm ago" for < 1 hour
- "Xh ago" for < 24 hours
- "Xd ago" for < 7 days
- Full date for older messages

### Conversation Types

**Event Chat:**
- Icon: 📅 Calendar
- Purpose: Discuss specific events
- Participants: All attendees

**Support Chat:**
- Icon: ❓ Help Circle
- Purpose: Get assistance
- Participants: User + Support Team

**Direct Message:**
- Icon: 👤 User
- Purpose: One-on-one conversations
- Participants: Two users

## 🎯 User Experience

### Chat Flow
1. User logs in
2. Chat button appears
3. Click to open chat window
4. View existing conversations or create new
5. Select conversation to view messages
6. Send messages in real-time
7. Receive notifications for new messages

### Empty States
- **No Conversations**: Prompt to start first chat
- **No Selected**: Prompt to select or create
- **No Messages**: Ready to send first message

## 🔐 Security & Privacy

### Current Implementation
- Client-side state management
- LocalStorage persistence
- User ID-based access control

### Production Recommendations
1. **Backend Integration**
   - WebSocket server for real-time updates
   - Database storage for messages
   - API authentication

2. **Security Enhancements**
   - Message encryption
   - User blocking/reporting
   - Content moderation
   - Rate limiting

3. **Privacy Features**
   - Message deletion
   - Conversation archiving
   - Online status control

## 🚀 Future Enhancements

### Phase 1 (Planned)
- [ ] Image and file sharing
- [ ] Message reactions (emoji)
- [ ] Voice messages
- [ ] Group chats (multiple users)

### Phase 2 (Future)
- [ ] Video calls
- [ ] Screen sharing
- [ ] Message editing
- [ ] Message forwarding
- [ ] Chat themes
- [ ] Push notifications

### Phase 3 (Advanced)
- [ ] End-to-end encryption
- [ ] Message translation
- [ ] AI-powered chatbots
- [ ] Voice/video calls
- [ ] Calendar integration

## 🧪 Testing

### Manual Testing
1. Log in with different users
2. Create conversations
3. Send messages back and forth
4. Test unread counters
5. Verify message persistence
6. Check read receipts
7. Test search functionality

### Automated Testing
```bash
npm test -- Chat
```

## 📱 Responsive Design

- Desktop: Full 800px width
- Tablet: Adapts to screen width
- Mobile: Full-screen overlay (future)

## 🎨 Design System

**Colors:**
- Primary: Slate-800 (#1e293b)
- Secondary: Slate-100 (#f1f5f9)
- Accent: Red-500 (unread badges)
- Text: Slate-800 (dark), White (on dark bg)

**Typography:**
- Headers: font-semibold
- Body: font-normal
- Timestamps: text-xs opacity-70

**Spacing:**
- Chat window: p-4
- Messages: space-y-4
- Bubbles: px-4 py-2

## 💻 Code Structure

```
app/
├── components/
│   ├── Chat.tsx              # Main chat component
│   ├── AppContext.tsx        # State management (updated)
│   └── LayoutWrapper.tsx     # Integration (updated)
└── CHAT_SYSTEM_README.md     # This file
```

## 🐛 Troubleshooting

**Chat button not showing:**
- Ensure user is logged in
- Check LayoutWrapper integration

**Messages not persisting:**
- Verify localStorage is enabled
- Check browser console for errors

**Unread counter not updating:**
- Ensure conversation is in state
- Check message read status

## 🤝 Contributing

To add features:
1. Update types in `AppContext.tsx`
2. Add state management functions
3. Update UI in `Chat.tsx`
4. Test thoroughly
5. Update this README

## 📚 Related Documentation

- [App Context Documentation](./app/components/AppContext.tsx)
- [Layout Wrapper](./app/components/LayoutWrapper.tsx)
- [Testing Guide](./TESTING.md)

---

**Built with ❤️ for EventHub** | Modern, Sleek, Professional

Need help? Start a support chat in the app!
