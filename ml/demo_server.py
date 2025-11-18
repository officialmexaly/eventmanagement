"""
Demo inference server for EventHub Custom AI.

This is a lightweight demo that simulates the trained model responses
without requiring GPU or actual model training. Perfect for testing
the integration and UI.

For production, use inference_server.py with a trained model.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import random
import time

# Initialize FastAPI app
app = FastAPI(
    title="EventHub AI Demo API",
    description="Demo server simulating custom Llama 3 responses",
    version="1.0.0-demo"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    """Chat message structure."""
    role: str
    content: str


class GenerateRequest(BaseModel):
    """Request body for generation endpoint."""
    messages: List[Message]
    max_tokens: Optional[int] = 512
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 0.95


class GenerateResponse(BaseModel):
    """Response from generation endpoint."""
    response: str
    model: str
    tokens_used: Optional[int] = None


# Demo responses for different query types
DEMO_RESPONSES = {
    "tech_events": """I found several exciting tech events coming up in Lagos! 🎯

**1. Tech Conference 2025** (Dec 15, 2025)
📍 Lagos Convention Center
💰 ₦15,000
🎤 Featuring industry leaders discussing AI, Web3, and emerging technologies

**2. Lagos Developer Meetup** (Dec 20, 2025)
📍 Tech Hub, Victoria Island
💰 Free (Register online)
👨‍💻 Network with local developers and learn about latest trends

**3. StartUp Pitch Night** (Dec 28, 2025)
📍 Innovation Center Lagos
💰 ₦5,000
🚀 Watch innovative startups pitch their ideas to investors

Would you like more details about any of these events?""",

    "music_events": """Here are some amazing music events happening soon! 🎵

**1. Afrobeats Festival 2025** (Jan 5, 2026)
📍 Eko Atlantic
💰 ₦20,000 - ₦50,000
🎤 Featuring top Nigerian artists

**2. Jazz Night Lagos** (Dec 22, 2025)
📍 Terra Kulture
💰 ₦8,000
🎷 Smooth jazz in an intimate setting

**3. Lagos Music Concert** (Jan 10, 2026)
📍 National Stadium
💰 ₦15,000
🎸 Multi-genre celebration of African music

All events have tickets available! Let me know if you'd like to book.""",

    "booking": """Booking tickets on EventHub is super easy! Here's how:

**Step 1: Find Your Event**
Browse our events page or use the search function to find events by category, date, or location.

**Step 2: Select Tickets**
Click on the event you want to attend and choose your ticket type (Regular, VIP, etc.)

**Step 3: Review & Pay**
Review your order and proceed to payment. We accept:
- Debit/Credit cards
- Bank transfers
- Mobile money

**Step 4: Get Confirmation**
You'll receive a confirmation email with your e-ticket within minutes!

**Need Help?** Contact our support team 24/7 at support@eventhub.ng

Would you like me to help you find an event to book?""",

    "features": """EventHub is Nigeria's premier event management platform! Here are our key features:

✨ **Event Discovery**
- Browse thousands of events across Nigeria
- Filter by category, date, location, and price
- Personalized recommendations

🎫 **Easy Ticketing**
- Secure online booking
- Instant e-tickets
- QR code check-in

📊 **For Organizers**
- Create and manage events
- Real-time analytics
- Attendee management
- Secure payments

💬 **Community**
- Chat with other attendees
- Event-specific discussions
- Direct messaging

🤖 **AI Assistant** (that's me!)
- 24/7 event help
- Personalized recommendations
- Booking assistance

What would you like to know more about?""",

    "weekend": """Great question! Here's what's happening this weekend: 🎉

**Saturday Events:**

**1. Art Gallery Opening** (Dec 21)
📍 Nike Art Gallery, Lagos
💰 Free entry
🎨 Contemporary Nigerian art exhibition

**2. Food Festival Lagos** (Dec 21)
📍 Freedom Park
💰 ₦3,000
🍽️ Sample dishes from 50+ restaurants

**Sunday Events:**

**3. Sunday Jazz Brunch** (Dec 22)
📍 Radisson Blu, VI
💰 ₦12,000 (includes brunch)
🎵 Live jazz performance

**4. Family Fun Day** (Dec 22)
📍 Lekki Conservation Center
💰 ₦5,000 (adults), ₦2,000 (children)
👨‍👩‍👧 Games, activities, and entertainment

Perfect weekend plans! Want to book any of these?""",

    "support": """I'm here to help! Here are common questions I can answer:

**Booking & Tickets:**
- How to buy tickets
- Ticket refund policy
- Resending ticket confirmations
- Changing ticket details

**Events:**
- Finding events
- Event recommendations
- Event categories
- Venue information

**Account:**
- Creating an account
- Managing profile
- Password reset
- Notification settings

**Payments:**
- Payment methods
- Failed transactions
- Refund status
- Invoices

What do you need help with today? Just ask me anything!""",

    "default": """Hello! I'm your EventHub AI assistant, powered by custom Llama 3 fine-tuned specifically for EventHub! 🎯

I can help you with:

🎪 **Discover Events** - Find amazing events happening near you
🎫 **Book Tickets** - Easy, secure ticket booking
📅 **Plan Ahead** - Check upcoming events by date
💬 **Get Support** - Answers to all your questions

Try asking me things like:
- "Show me tech events in Lagos"
- "What's happening this weekend?"
- "How do I book tickets?"
- "Tell me about EventHub features"

What would you like to know?"""
}


def get_demo_response(user_message: str) -> str:
    """Generate a demo response based on user message."""
    message_lower = user_message.lower()

    # Simulate thinking time
    time.sleep(random.uniform(0.5, 1.5))

    # Match patterns to responses
    if any(word in message_lower for word in ["tech", "technology", "conference", "developer", "coding"]):
        return DEMO_RESPONSES["tech_events"]
    elif any(word in message_lower for word in ["music", "concert", "festival", "afrobeat", "jazz"]):
        return DEMO_RESPONSES["music_events"]
    elif any(word in message_lower for word in ["book", "ticket", "purchase", "buy", "how to"]):
        return DEMO_RESPONSES["booking"]
    elif any(word in message_lower for word in ["feature", "about eventhub", "what is", "tell me about"]):
        return DEMO_RESPONSES["features"]
    elif any(word in message_lower for word in ["weekend", "saturday", "sunday", "this week"]):
        return DEMO_RESPONSES["weekend"]
    elif any(word in message_lower for word in ["help", "support", "question", "problem"]):
        return DEMO_RESPONSES["support"]
    else:
        return DEMO_RESPONSES["default"]


@app.on_event("startup")
async def startup():
    """Startup message."""
    print("=" * 80)
    print("🎭 EventHub AI Demo Server")
    print("=" * 80)
    print()
    print("⚡ Demo server is running!")
    print("   This simulates the custom Llama 3 model without requiring training")
    print()
    print("✅ Server ready at http://localhost:8000")
    print("📚 API docs at http://localhost:8000/docs")
    print()
    print("💡 To use the real trained model, run: python ml/inference_server.py")
    print("=" * 80)
    print()


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "online",
        "message": "EventHub AI Demo API is running!",
        "model_loaded": True,
        "mode": "demo",
        "note": "This is a demo server. For production, train the model and use inference_server.py"
    }


@app.get("/health")
async def health():
    """Detailed health check."""
    return {
        "status": "healthy",
        "mode": "demo",
        "gpu_available": False,
        "gpu_name": None,
        "model": "demo-responses",
        "note": "Demo server - no actual model loaded"
    }


@app.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest):
    """
    Generate a demo response.

    This simulates what the real trained model would return.
    """
    try:
        # Get the last user message
        user_messages = [msg for msg in request.messages if msg.role == "user"]
        if not user_messages:
            raise HTTPException(status_code=400, detail="No user message found")

        last_user_message = user_messages[-1].content

        # Generate demo response
        response = get_demo_response(last_user_message)

        return GenerateResponse(
            response=response,
            model="eventhub-llama3-demo",
            tokens_used=len(response.split()),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


@app.post("/chat")
async def chat(request: GenerateRequest):
    """
    Simplified chat endpoint that returns just the text response.
    """
    result = await generate(request)
    return {"response": result.response}


@app.get("/test")
async def test_inference():
    """Quick test endpoint."""
    test_request = GenerateRequest(
        messages=[
            Message(role="user", content="Show me tech events in Lagos")
        ],
        max_tokens=200,
        temperature=0.7,
    )

    return await generate(test_request)


if __name__ == "__main__":
    print()
    print("Starting EventHub AI Demo Server...")
    print()

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
    )
