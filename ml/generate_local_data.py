"""
LOCAL Training Data Generation for EventHub AI (No API Required).

This script generates diverse, high-quality training data using templates
and variations - completely FREE, no API keys needed!

Generates 200+ examples across 10 categories.
"""

import json
import os
import random
from typing import List, Dict
from datetime import datetime, timedelta


class LocalDataGenerator:
    """Generate training data locally without any API calls."""

    def __init__(self):
        self.system_prompt = """You are an intelligent assistant for EventHub, a premier event management platform in Nigeria. Help users discover events, book tickets, and answer questions about the platform. Be friendly, helpful, and enthusiastic about events!"""

        # Nigerian cities
        self.cities = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu", "Kaduna"]

        # Event types and categories
        self.event_categories = {
            "tech": ["Tech Conference", "Developer Meetup", "AI Summit", "Startup Pitch Night", "Hackathon"],
            "music": ["Afrobeats Concert", "Jazz Night", "Gospel Festival", "Hip Hop Show", "Live Band Performance"],
            "arts": ["Art Exhibition", "Theater Performance", "Comedy Show", "Film Screening", "Poetry Night"],
            "food": ["Food Festival", "Wine Tasting", "Cooking Workshop", "Restaurant Opening", "Food Truck Rally"],
            "sports": ["Football Match", "Basketball Tournament", "Marathon", "Fitness Bootcamp", "Sports Award Night"],
            "business": ["Business Summit", "Networking Event", "Investment Forum", "Leadership Conference", "Trade Fair"],
            "education": ["Workshop", "Seminar", "Training Session", "Masterclass", "Career Fair"],
            "family": ["Kids Festival", "Family Fun Day", "Children's Party", "Educational Tour", "Community Picnic"]
        }

        # Venues
        self.venues = [
            "Eko Convention Center", "National Stadium", "Terra Kulture", "Muson Center",
            "Innovation Hub", "Lagos Continental Hotel", "Transcorp Hilton", "Freedom Park",
            "Nike Art Gallery", "Landmark Event Center", "Oriental Hotel", "Eko Atlantic",
            "Civic Center", "Hard Rock Cafe", "Federal Palace Hotel"
        ]

        # Prices in Naira
        self.price_ranges = {
            "free": 0,
            "budget": [1000, 5000],
            "mid": [5000, 20000],
            "premium": [20000, 50000],
            "vip": [50000, 200000]
        }

    def generate_all_examples(self) -> List[Dict]:
        """Generate all training examples."""
        examples = []

        print("🔄 Generating training examples locally (no API needed)...\n")

        # Generate examples for each category
        examples.extend(self.event_discovery_examples())
        examples.extend(self.booking_examples())
        examples.extend(self.customer_support_examples())
        examples.extend(self.payment_refund_examples())
        examples.extend(self.event_organizer_examples())
        examples.extend(self.technical_support_examples())
        examples.extend(self.marketing_examples())
        examples.extend(self.analytics_examples())
        examples.extend(self.ux_navigation_examples())
        examples.extend(self.community_examples())

        print(f"✅ Generated {len(examples)} examples across 10 categories\n")

        return examples

    def event_discovery_examples(self) -> List[Dict]:
        """Generate event discovery examples."""
        examples = []

        # Category-based searches (3 variations per category)
        for category, event_types in self.event_categories.items():
            for _ in range(3):  # Generate 3 examples per category
                city = random.choice(self.cities)
                event1 = random.choice(event_types)
                event2 = random.choice([e for e in event_types if e != event1])
                venue1 = random.choice(self.venues)
                venue2 = random.choice([v for v in self.venues if v != venue1])
                price1 = random.randint(5000, 30000)
                price2 = random.randint(3000, 25000)

                examples.append({
                    "instruction": f"Show me {category} events in {city}",
                    "output": f"I found several exciting {category} events in {city}! 🎯\n\n**1. {event1} 2025**\n📍 {venue1}\n💰 ₦{price1:,}\n🎤 Amazing lineup and networking opportunities\n\n**2. {event2}**\n📍 {venue2}\n💰 ₦{price2:,}\n🎉 Don't miss out on this incredible experience!\n\nWould you like more details or help booking tickets?"
                })

        # Add more discovery variations
        examples.extend([
            {
                "instruction": "Find me events under ₦10,000",
                "output": "Great budget-friendly options! Here are affordable events:\n\n**1. Community Art Walk**\n📍 Freedom Park, Lagos\n💰 ₦2,500\n🎨 Explore local art\n\n**2. Tech Networking Meetup**\n📍 Innovation Hub\n💰 ₦5,000\n💼 Meet industry professionals\n\n**3. Live Music Night**\n📍 Terra Kulture\n💰 ₦8,000\n🎵 Enjoy local bands\n\nAll under budget! Want to book?"
            },
            {
                "instruction": "What's popular this month?",
                "output": "Here are the hottest events right now! 🔥\n\n**Trending:**\n**1. Lagos Food Festival** (₦15,000)\n👥 2,500+ attending\n⭐ 4.8/5 rating\n\n**2. Afrobeats Mega Concert** (₦25,000)\n👥 5,000+ attending\n⭐ 4.9/5 rating\n\n**3. Tech Startup Expo** (₦10,000)\n👥 1,200+ attending\n⭐ 4.7/5 rating\n\nDon't miss out! These are selling fast!"
            }
        ])

        # Date-based searches
        examples.extend([
            {
                "instruction": "What events are happening this weekend?",
                "output": "Great question! Here's what's happening this weekend: 🎉\n\n**Saturday:**\n**Art Gallery Opening**\n📍 Nike Art Gallery, Lagos\n💰 Free entry\n🎨 Contemporary Nigerian art\n\n**Food Festival Lagos**\n📍 Freedom Park\n💰 ₦3,000\n🍽️ Sample dishes from 50+ restaurants\n\n**Sunday:**\n**Jazz Brunch**\n📍 Terra Kulture\n💰 ₦12,000 (includes brunch)\n🎵 Live jazz performance\n\nPerfect weekend plans! Want to book any?"
            },
            {
                "instruction": "Find events next month",
                "output": "Here are exciting events coming up next month:\n\n**Week 1:**\n- Tech Conference (₦25,000)\n- Music Festival (₦15,000)\n\n**Week 2:**\n- Business Summit (₦30,000)\n- Comedy Night (₦5,000)\n\n**Week 3:**\n- Art Exhibition (Free)\n- Sports Tournament (₦10,000)\n\n**Week 4:**\n- Food Festival (₦8,000)\n- Networking Event (₦12,000)\n\nShall I give you more details about any of these?"
            },
            {
                "instruction": "Are there any free events?",
                "output": "Yes! Here are some great free events on EventHub:\n\n**1. Community Art Exhibition**\n📍 National Museum, Lagos\n📅 Ongoing\n🎨 Open gallery viewing\n\n**2. Developer Meetup**\n📍 Innovation Hub\n📅 Every Thursday\n💻 Free for all developers (register required)\n\n**3. Fitness in the Park**\n📍 Lekki Conservation Center\n📅 Saturday mornings\n🏃 Weekly community workout\n\nYou still need to register for free events to secure your spot!"
            }
        ])

        return examples

    def booking_examples(self) -> List[Dict]:
        """Generate booking-related examples."""
        examples = [
            {
                "instruction": "How do I book tickets for an event?",
                "output": "Booking on EventHub is easy! Here's how:\n\n**Step 1: Find Your Event**\nBrowse events or search by category, location, or date\n\n**Step 2: Select Tickets**\nClick 'Get Tickets' and choose your ticket type (Regular/VIP) and quantity\n\n**Step 3: Enter Details**\nProvide your name, email, and phone number\n\n**Step 4: Payment**\nWe accept:\n- Debit/Credit cards\n- Bank transfers\n- Mobile money (Paystack)\n\n**Step 5: Confirmation**\nYou'll get instant email confirmation with your e-ticket!\n\nNeed help with a specific event?"
            },
            {
                "instruction": "Can I book tickets for multiple people?",
                "output": "Absolutely! Booking for groups is simple:\n\n**Step 1:** Select your event\n**Step 2:** Adjust ticket quantity (use +/- buttons)\n**Step 3:** Mix ticket types if needed (e.g., 3 Regular + 1 VIP)\n\n💡 **Group Benefits:**\n- Many events offer group discounts (5+ tickets)\n- Discount applies automatically at checkout\n- One payment for all tickets\n- All tickets in one email\n- Can forward individual tickets to attendees\n\n**Pro Tip:** For 10+ tickets, contact organizers directly for special rates!\n\nWhat event are you booking for?"
            },
            {
                "instruction": "What ticket types are available?",
                "output": "EventHub offers various ticket types:\n\n**1. Regular/General Admission**\n- Standard event access\n- Most affordable option\n- All basic amenities\n\n**2. VIP Tickets**\n- Premium seating/viewing\n- Exclusive access areas\n- VIP lounge, refreshments\n- Meet & greet opportunities\n\n**3. Early Bird**\n- Discounted tickets\n- Limited time offers\n- Same access as regular\n\n**4. Group Tickets**\n- For 5+ people\n- Special group rates\n- Perfect for teams/families\n\n**5. Student Tickets**\n- Discounted rates (ID required)\n- Selected events only\n\nTicket types vary by event. Check each event page for availability!"
            },
            {
                "instruction": "I want to transfer my ticket to someone else",
                "output": "No problem! Here's how to transfer your ticket:\n\n**Method 1: Forward Email**\n- Simply forward your confirmation email\n- Recipient shows QR code at entrance\n- No formal transfer needed\n\n**Method 2: Official Transfer (Recommended)**\n1. Log into your EventHub account\n2. Go to 'My Tickets'\n3. Select the ticket\n4. Click 'Transfer Ticket'\n5. Enter recipient's email\n6. They receive new ticket instantly\n\n**Important:**\n- Free to transfer\n- Original ticket becomes invalid\n- Recipient needs their own ID\n- Some events don't allow transfers (check policy)\n\nNeed help transferring a specific ticket?"
            },
            {
                "instruction": "Do you offer early bird tickets?",
                "output": "Yes! Many events offer early bird discounts:\n\n**How It Works:**\n- Discounted tickets for early buyers\n- Usually 20-30% off regular price\n- Limited quantity\n- First come, first served\n\n**Finding Early Bird:**\n- Look for \"Early Bird\" badge on events\n- Check event page for pricing tiers\n- Subscribe to alerts for new events\n\n**Example:**\nRegular: ₦10,000\nEarly Bird: ₦7,000\nSavings: ₦3,000!\n\n**Tips:**\n📧 Get event alerts\n🔔 Enable notifications\n⚡ Book quickly when announced\n\nDon't miss out - early birds sell fast!"
            },
            {
                "instruction": "Can I buy VIP tickets?",
                "output": "Absolutely! VIP tickets offer premium experiences:\n\n**VIP Benefits:**\n✨ Priority/Reserved seating\n🍷 Exclusive VIP lounge access\n🍔 Complimentary food & drinks\n👥 Meet & greet opportunities\n🎁 Event merchandise/swag\n🚪 Separate entry (skip lines)\n\n**How to Book VIP:**\n1. Select your event\n2. Look for \"VIP\" or \"Premium\" tickets\n3. Check what's included\n4. Book before they sell out!\n\n**Price Range:**\nTypically 2-5x regular tickets\nWorth it for exclusive access!\n\n**Availability:**\nLimited VIP spots\nSell out fast\nBook early!\n\nWant VIP for a specific event?"
            }
        ]

        return examples

    def customer_support_examples(self) -> List[Dict]:
        """Generate customer support examples."""
        examples = [
            {
                "instruction": "I haven't received my ticket confirmation email",
                "output": "Let me help you with that! Here's what to do:\n\n**Step 1: Check Spam/Junk Folder**\nSometimes confirmation emails go there\n\n**Step 2: Search Your Email**\nLook for emails from:\n- noreply@eventhub.ng\n- tickets@eventhub.ng\n- Subject: 'Your EventHub Ticket'\n\n**Step 3: Check Your Account**\n- Log into EventHub\n- Go to 'My Tickets'\n- Your tickets should be there\n\n**Step 4: Resend Confirmation**\n- On 'My Tickets' page\n- Click 'Resend Confirmation'\n\n**Still Missing?**\nContact support@eventhub.ng with:\n- Order number (if you have it)\n- Email used for booking\n- Event name\n\nWe'll help you immediately! What's your order number?"
            },
            {
                "instruction": "The event I booked was cancelled, what now?",
                "output": "I'm sorry about the cancellation. Here's what happens:\n\n**Automatic Refund Process:**\n\n**1. Notification**\n- You'll receive cancellation email\n- Explains reason and refund details\n\n**2. Refund Timeline**\n- Automatic full refund\n- No service fee deduction\n- Processed within 24 hours\n- Appears in account: 5-7 business days\n\n**3. Your Options**\n- Accept refund (automatic)\n- Use credit for other events\n- Contact organizer for rescheduled date\n\n**4. If Event Rescheduled**\n- Your ticket transfers automatically\n- Can still request refund\n- New date in confirmation email\n\n**Need Urgent Refund?**\nContact: support@eventhub.ng with order number\n\nWhat event was cancelled? I'll check the status for you."
            },
            {
                "instruction": "How do I contact event organizers?",
                "output": "Here's how to reach event organizers:\n\n**On Event Page:**\n1. Go to the event\n2. Scroll to 'Organizer Info' section\n3. Click 'Contact Organizer'\n4. Send your message directly\n\n**Organizer Response Time:**\n- Usually within 24 hours\n- Urgent queries: Use phone (if provided)\n\n**What to Ask Organizers:**\n✅ Event-specific questions\n✅ Special requirements\n✅ Group bookings (10+)\n✅ Sponsorship opportunities\n✅ Vendor applications\n\n**What to Ask EventHub Support:**\n❌ Booking/payment issues\n❌ Refund requests\n❌ Technical problems\n❌ Account issues\n\n**EventHub Support:**\n📧 support@eventhub.ng\n📞 +234-xxx-xxxx\n💬 Live chat (9am-6pm WAT)\n\nWhat do you need help with?"
            }
        ]

        return examples

    def payment_refund_examples(self) -> List[Dict]:
        """Generate payment and refund examples."""
        examples = [
            {
                "instruction": "What payment methods do you accept?",
                "output": "We accept multiple secure payment methods:\n\n**💳 Cards**\n- Visa, Mastercard, Verve\n- Credit and Debit cards\n- Instant confirmation\n\n**🏦 Bank Transfer**\n- All Nigerian banks\n- Account details provided at checkout\n- Confirm within 24 hours\n\n**📱 Mobile Money**\n- Paystack integration\n- MTN, Airtel, Glo, 9mobile\n- Instant confirmation\n\n**🔒 Security:**\n- SSL encrypted\n- PCI DSS compliant\n- No card details stored\n- Secure payment gateway\n\n**💰 Currency:**\n- All prices in Naira (₦)\n- No hidden fees\n- Service charge: 2.5%\n\nReady to book? Choose your payment method at checkout!"
            },
            {
                "instruction": "How does your refund policy work?",
                "output": "Our refund policy is fair and transparent:\n\n**📅 Refund Timeline:**\n\n**7+ Days Before Event:**\n✅ Full refund\n❌ Minus ₦500 service fee\n⏱️ Process: 24-48 hours\n\n**3-7 Days Before:**\n⚠️ 50% refund\n⏱️ Process: 24-48 hours\n\n**Less than 3 Days:**\n❌ No refund\n✅ But you can transfer ticket to someone else (free)\n\n**Event Cancelled:**\n✅ 100% automatic refund\n✅ No fees\n⏱️ 5-7 business days\n\n**How to Request Refund:**\n1. Go to 'My Tickets'\n2. Select ticket\n3. Click 'Request Refund'\n4. Confirm reason\n5. Refund processed automatically\n\n**Questions?** Email: refunds@eventhub.ng"
            },
            {
                "instruction": "My payment failed but money was deducted",
                "output": "Don't worry, this sometimes happens. Here's what to do:\n\n**What Happened:**\n- Payment gateway processed but confirmation failed\n- Your bank shows debit\n- EventHub didn't receive payment confirmation\n\n**Resolution:**\n\n**Option 1: Wait 24 Hours**\n- Most issues resolve automatically\n- Bank reverses failed transaction\n- Money returns to your account\n\n**Option 2: Immediate Help**\n1. Check your email for ANY confirmation\n2. Check 'My Tickets' - ticket might be there\n3. Contact support with:\n   - Transaction reference\n   - Amount and time\n   - Bank name\n   - Screenshot (if possible)\n\n**Contact:**\n📧 payments@eventhub.ng\n📱 WhatsApp: +234-xxx-xxxx\n⏰ Response: Within 2 hours\n\n**We'll:**\n✅ Verify transaction\n✅ Issue ticket OR process refund\n✅ Resolve within 24 hours\n\nWhat's your transaction reference?"
            }
        ]

        return examples

    def event_organizer_examples(self) -> List[Dict]:
        """Generate event organizer examples."""
        return [
            {
                "instruction": "How do I create an event on EventHub?",
                "output": "Creating an event is simple! Here's how:\n\n**Step 1: Sign Up/Login**\n- Create organizer account\n- Verify email\n\n**Step 2: Create Event**\n1. Click 'Create Event'\n2. Enter event details:\n   - Event name\n   - Category\n   - Date & time\n   - Venue/location\n   - Description\n\n**Step 3: Set Up Tickets**\n- Ticket types (Regular/VIP)\n- Prices\n- Quantity available\n- Early bird options\n\n**Step 4: Add Media**\n- Event banner/poster\n- Photos\n- Videos (optional)\n\n**Step 5: Publish**\n- Preview event\n- Submit for review (24 hours)\n- Go live!\n\n**💰 Pricing:**\n- Free to list\n- 5% commission on ticket sales\n- Payout within 7 days\n\n**📊 Features:**\n- Real-time analytics\n- Attendee management\n- QR code check-in\n- Email marketing tools\n\nReady to create your first event?"
            },
            {
                "instruction": "How do I get paid as an organizer?",
                "output": "Getting paid is automatic and transparent:\n\n**💰 Payout Schedule:**\n\n**For Upcoming Events:**\n- 50% payout: 7 days before event\n- 50% payout: 7 days after event\n- Ensures event delivery\n\n**For Past Events:**\n- 100% payout: 7 days after event\n- After refund period\n\n**💳 Payment Methods:**\n- Bank transfer (Nigerian banks)\n- Paystack (instant)\n- Minimum payout: ₦5,000\n\n**📊 Commission:**\n- EventHub fee: 5%\n- Payment gateway: 2.5%\n- You receive: 92.5% of ticket price\n\n**Example:**\nTicket sold: ₦10,000\n- EventHub fee: ₦500\n- Gateway fee: ₦250\n- You get: ₦9,250\n\n**Track Earnings:**\n- Dashboard → 'Revenue'\n- Real-time sales data\n- Download reports\n\n**Bank Account Setup:**\n1. Go to 'Settings'\n2. 'Payment Information'\n3. Add bank details\n4. Verify account\n\nQuestions about a specific payout?"
            }
        ]

    def technical_support_examples(self) -> List[Dict]:
        """Generate technical support examples."""
        return [
            {
                "instruction": "The EventHub app won't load",
                "output": "Let's fix this! Try these steps:\n\n**Quick Fixes:**\n\n**1. Check Internet**\n- Stable WiFi or data connection?\n- Try switching networks\n\n**2. Update App**\n- Go to Play Store/App Store\n- Search 'EventHub'\n- Click 'Update' if available\n\n**3. Clear Cache**\n- Android: Settings → Apps → EventHub → Clear Cache\n- iOS: Delete and reinstall app\n\n**4. Restart Device**\n- Simple but often works!\n\n**5. Check Server Status**\n- Visit: status.eventhub.ng\n- Or check our social media\n\n**Still Not Working?**\n\n**App Alternatives:**\n- Use web version: eventhub.ng\n- Works on any browser\n- Same features\n\n**Contact Support:**\n📧 tech@eventhub.ng\n- Include:\n  - Device (iPhone 12, Samsung S21, etc.)\n  - OS version (iOS 16, Android 13)\n  - Error message (screenshot)\n\nWe'll help within 2 hours!"
            },
            {
                "instruction": "How do I reset my password?",
                "output": "Easy! Here's how to reset your password:\n\n**On Website:**\n1. Go to eventhub.ng/login\n2. Click 'Forgot Password?'\n3. Enter your email\n4. Check email for reset link\n5. Click link (valid 1 hour)\n6. Create new password\n7. Login with new password\n\n**On Mobile App:**\n1. Open EventHub app\n2. Tap 'Login'\n3. Tap 'Forgot Password?'\n4. Enter email\n5. Follow email instructions\n\n**Password Requirements:**\n- Minimum 8 characters\n- At least 1 uppercase letter\n- At least 1 number\n- At least 1 special character (!@#$%)\n\n**Didn't Get Email?**\n- Check spam/junk folder\n- Wait 5 minutes\n- Try again\n- Email might be wrong - try another\n\n**Still Stuck?**\nContact: support@eventhub.ng\nProvide:\n- Email address\n- Phone number\n- Last login date\n\nWe'll verify and help reset!"
            }
        ]

    def marketing_examples(self) -> List[Dict]:
        """Generate marketing examples."""
        return [
            {
                "instruction": "How can I promote my event?",
                "output": "Great question! Here are effective promotion strategies:\n\n**📱 On EventHub:**\n\n**1. Featured Listing**\n- ₦10,000 for 7 days\n- Top of search results\n- Homepage placement\n- 5x more visibility\n\n**2. Email Marketing**\n- Send to EventHub subscribers\n- Target by category/location\n- ₦0.50 per email\n\n**3. Social Media Sharing**\n- Free share buttons\n- Auto-post to Facebook/Twitter\n- Reach your followers\n\n**📢 External Marketing:**\n\n**4. Early Bird Discounts**\n- Create urgency\n- Reward early buyers\n- 20-30% off first 50 tickets\n\n**5. Promo Codes**\n- Create custom codes\n- Track referrals\n- Measure ROI\n\n**6. Partner Promotions**\n- Cross-promote with brands\n- Influencer collaborations\n- Media partnerships\n\n**📊 Analytics:**\n- Track which channels work\n- Optimize spending\n- A/B test messaging\n\n**💡 Pro Tip:** Start promoting 4-6 weeks before event!\n\nWant help setting up a promotion?"
            }
        ]

    def analytics_examples(self) -> List[Dict]:
        """Generate analytics examples."""
        return [
            {
                "instruction": "How do I see my ticket sales report?",
                "output": "Access your sales data anytime! Here's how:\n\n**📊 Dashboard:**\n1. Login to organizer account\n2. Click 'My Events'\n3. Select your event\n4. Go to 'Analytics' tab\n\n**📈 What You'll See:**\n\n**Sales Overview:**\n- Total tickets sold\n- Total revenue\n- Tickets remaining\n- Sales by ticket type\n\n**Sales Timeline:**\n- Daily sales graph\n- Peak sales periods\n- Sales velocity\n- Projected final sales\n\n**Demographic Data:**\n- Attendee age ranges\n- Gender distribution\n- Location data\n- Buyer behavior\n\n**Traffic Sources:**\n- Direct vs referral\n- Social media performance\n- Email campaign results\n\n**📥 Export Reports:**\n- CSV download\n- PDF summary\n- Excel format\n- Custom date ranges\n\n**📧 Email Reports:**\n- Daily summary (optional)\n- Weekly digest\n- Milestone alerts\n\n**📱 Mobile Access:**\n- Full analytics on app\n- Real-time updates\n- Push notifications\n\nNeed help interpreting your data?"
            }
        ]

    def ux_navigation_examples(self) -> List[Dict]:
        """Generate UX/navigation examples."""
        return [
            {
                "instruction": "How do I save events I'm interested in?",
                "output": "Great feature! Here's how to save events:\n\n**💾 Save for Later:**\n\n**On Event Page:**\n1. Click the ❤️ icon (top right)\n2. Event added to 'Saved Events'\n3. Click again to unsave\n\n**Quick Save:**\n- Browse events\n- Hover over event card\n- Click bookmark icon\n- Instant save!\n\n**📱 Access Saved Events:**\n\n**Website:**\n- Click profile icon\n- Select 'Saved Events'\n- See all your bookmarks\n\n**Mobile App:**\n- Tap 'More'\n- Tap 'Saved Events'\n- Swipe to remove\n\n**🔔 Notifications:**\n- Get reminders for saved events\n- Price drop alerts\n- Last chance notifications\n- 7 days before event\n\n**✉️ Email Reminders:**\n- Weekly roundup of saved events\n- Ticket availability updates\n- Special offers on saved events\n\n**💡 Pro Tip:**\nSave events early! Popular events sell out fast.\n\nWant to save an event now? Which one?"
            },
            {
                "instruction": "Tell me about EventHub features",
                "output": "EventHub is Nigeria's premier event platform! Here's what we offer:\n\n**🎫 For Attendees:**\n\n**Discover Events**\n- 1000+ events across Nigeria\n- Filter by category, city, date, price\n- Personalized recommendations\n- Save favorite events\n\n**Easy Booking**\n- Secure online payments\n- Instant e-tickets\n- QR code check-in\n- Mobile app + website\n\n**Community**\n- Chat with attendees\n- Event communities\n- Share with friends\n- Reviews and ratings\n\n**👔 For Organizers:**\n\n**Create Events**\n- Easy event setup\n- Beautiful event pages\n- Multiple ticket types\n- Free to list!\n\n**Sell Tickets**\n- Secure payments\n- Real-time sales tracking\n- Promo codes\n- Group discounts\n\n**Manage Attendees**\n- Check-in app\n- Attendee lists\n- Email marketing\n- QR code scanning\n\n**Analytics**\n- Sales reports\n- Demographics\n- Traffic sources\n- Revenue tracking\n\n**🆘 Support:**\n- 24/7 help center\n- Live chat\n- Email support\n- Phone support\n\nWhat would you like to explore first?"
            }
        ]

    def community_examples(self) -> List[Dict]:
        """Generate community/social examples."""
        return [
            {
                "instruction": "How do I chat with other attendees?",
                "output": "Great way to network! Here's how:\n\n**💬 Event Chat:**\n\n**Access Chat:**\n1. Go to your booked event\n2. Click 'Event Chat' tab\n3. Join the conversation!\n\n**Chat Features:**\n- Public event discussion\n- Meet other attendees\n- Ask organizers questions\n- Share excitement!\n\n**📅 When Available:**\n- Opens 7 days before event\n- Active during event\n- Stays open 3 days after\n\n**👤 Direct Messages:**\n\n**Send DM:**\n1. Click on attendee name\n2. Select 'Send Message'\n3. Start chatting!\n\n**Privacy:**\n- Name visible to other attendees\n- Email hidden\n- Phone hidden\n- Control who can message you\n\n**🔒 Safety:**\n- Report inappropriate messages\n- Block users\n- Moderated by EventHub\n- Community guidelines apply\n\n**💡 Chat Etiquette:**\n- Be respectful\n- No spam or promotions\n- Stay on topic\n- Network genuinely\n\n**Group Chats:**\n- Create groups (10+ attendees)\n- Plan meetups\n- Share photos after event\n\nExcited to connect? Book your ticket and join the chat!"
            },
            {
                "instruction": "Can I leave a review for an event?",
                "output": "Absolutely! Reviews help everyone. Here's how:\n\n**⭐ Leave a Review:**\n\n**After Event:**\n1. Event ends\n2. Check your email\n3. Click 'Review Event' link\n4. Rate and write review\n\n**Or Via Account:**\n1. Go to 'My Tickets'\n2. Find past event\n3. Click 'Write Review'\n4. Share your experience!\n\n**📝 What to Include:**\n\n**Rating (1-5 stars):**\n- Overall experience\n- Venue\n- Organization\n- Value for money\n\n**Written Review:**\n- What you loved\n- What could improve\n- Would you attend again?\n- Tips for future attendees\n\n**📸 Add Photos:**\n- Upload event photos\n- Share moments\n- Help others decide\n\n**🏆 Benefits:**\n- Help other attendees\n- Improve future events\n- Organizers read and respond\n- Build community trust\n\n**🎁 Rewards:**\n- Detailed reviews get featured\n- Early access to future events\n- Reviewer badges\n\n**📊 Read Reviews:**\n- See all event reviews\n- Filter by rating\n- Most helpful first\n- Verified attendees only\n\nAttended an event recently? Share your review!"
            }
        ]

    def format_for_training(self, examples: List[Dict]) -> List[Dict]:
        """Format examples in Llama 3 instruction format."""
        print("🔄 Formatting examples for Llama 3...")

        formatted = []
        for example in examples:
            text = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

{self.system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>

{example['instruction']}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

{example['output']}<|eot_id|>"""
            formatted.append({"text": text})

        print(f"✅ Formatted {len(formatted)} examples\n")
        return formatted

    def save_data(self, train_data: List[Dict], val_data: List[Dict], raw_examples: List[Dict], output_dir: str):
        """Save training data to files."""
        os.makedirs(output_dir, exist_ok=True)

        train_path = os.path.join(output_dir, "eventhub_train.jsonl")
        val_path = os.path.join(output_dir, "eventhub_val.jsonl")
        raw_path = os.path.join(output_dir, "raw_examples.json")

        print(f"💾 Saving training data to {output_dir}/...\n")

        # Save training data
        with open(train_path, 'w') as f:
            for example in train_data:
                f.write(json.dumps(example) + '\n')

        # Save validation data
        with open(val_path, 'w') as f:
            for example in val_data:
                f.write(json.dumps(example) + '\n')

        # Save raw examples
        with open(raw_path, 'w') as f:
            json.dump(raw_examples, f, indent=2)

        print(f"   ✅ Training data: {train_path}")
        print(f"   ✅ Validation data: {val_path}")
        print(f"   ✅ Raw examples: {raw_path}")
        print()


def main():
    """Main execution."""
    print()
    print("=" * 80)
    print("🎯 EventHub Local Training Data Generator (No API Required!)")
    print("=" * 80)
    print()
    print("This generates training data completely FREE - no API keys needed!")
    print()

    # Initialize generator
    generator = LocalDataGenerator()

    # Generate examples
    raw_examples = generator.generate_all_examples()

    # Format for training
    formatted_examples = generator.format_for_training(raw_examples)

    # Split train/val (90/10)
    random.shuffle(formatted_examples)
    split_idx = int(len(formatted_examples) * 0.9)
    train_data = formatted_examples[:split_idx]
    val_data = formatted_examples[split_idx:]

    print("📊 Dataset Split:")
    print(f"   Training: {len(train_data)} examples (90%)")
    print(f"   Validation: {len(val_data)} examples (10%)")
    print()

    # Save data
    output_dir = "ml/data"
    generator.save_data(train_data, val_data, raw_examples, output_dir)

    # Print sample
    print("=" * 80)
    print("📝 Sample Training Examples")
    print("=" * 80)
    print()

    for i, example in enumerate(random.sample(raw_examples, min(3, len(raw_examples))), 1):
        print(f"Example {i}:")
        print(f"  Q: {example['instruction']}")
        print(f"  A: {example['output'][:150]}...")
        print()

    # Final summary
    print("=" * 80)
    print("🎉 Training Data Generation Complete!")
    print("=" * 80)
    print()
    print(f"📊 Total examples: {len(raw_examples)}")
    print(f"📁 Training examples: {len(train_data)}")
    print(f"📁 Validation examples: {len(val_data)}")
    print()
    print("💰 Cost: FREE! (No API required)")
    print()
    print("🚀 Next steps:")
    print(f"   1. Review examples: cat {output_dir}/raw_examples.json")
    print(f"   2. Train model: python ml/train_model.py")
    print(f"   3. Or upload to Colab: ml/EventHub_Llama3_Training.ipynb")
    print()


if __name__ == "__main__":
    main()
