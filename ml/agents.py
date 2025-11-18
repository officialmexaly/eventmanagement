"""
Multi-Agent Training Data Generation System for EventHub AI.

This system uses 10 specialized AI agents powered by Claude to generate
high-quality, diverse training data for the custom Llama 3 model.

Each agent is an expert in a specific EventHub domain and generates
contextual, realistic training examples.
"""

import os
import json
import asyncio
from typing import List, Dict, Optional
from anthropic import Anthropic
from datetime import datetime
import random

class BaseAgent:
    """Base class for all training data generation agents."""

    def __init__(self, name: str, expertise: str, anthropic_api_key: str):
        self.name = name
        self.expertise = expertise
        self.client = Anthropic(api_key=anthropic_api_key)
        self.model = "claude-3-5-sonnet-20241022"
        self.examples_generated = 0

    def get_system_prompt(self) -> str:
        """Get the system prompt for this agent."""
        return f"""You are {self.name}, an expert in {self.expertise} for EventHub, a premier event management platform in Nigeria.

Your role is to generate realistic, high-quality training examples for a custom AI model.

Generate examples that:
- Are specific to EventHub's features and Nigerian context
- Include realistic event names, venues, and prices (in Naira ₦)
- Cover various scenarios and edge cases
- Use natural, conversational language
- Provide helpful, accurate information
- Show enthusiasm for events and helping users

Generate diverse examples covering:
- Different types of events (concerts, conferences, sports, arts, food, etc.)
- Various user intents (discovery, booking, support, information)
- Different complexity levels (simple queries to complex scenarios)
- Edge cases and uncommon situations

Format: Return ONLY a JSON array of examples, each with "instruction" and "output" fields."""

    async def generate_examples(self, num_examples: int = 10) -> List[Dict]:
        """Generate training examples using Claude API."""
        print(f"🤖 {self.name}: Generating {num_examples} examples...")

        prompt = self._get_generation_prompt(num_examples)

        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=4096,
                temperature=0.8,
                system=self.get_system_prompt(),
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )

            # Parse response
            response_text = message.content[0].text

            # Extract JSON from response
            examples = self._parse_json_response(response_text)

            self.examples_generated += len(examples)
            print(f"   ✅ Generated {len(examples)} examples")

            return examples

        except Exception as e:
            print(f"   ❌ Error: {e}")
            return []

    def _get_generation_prompt(self, num_examples: int) -> str:
        """Get the prompt for generating examples."""
        return f"""Generate {num_examples} diverse training examples for {self.expertise}.

Each example should have:
1. "instruction": A realistic user question or request
2. "output": A helpful, accurate response from EventHub AI

Make examples varied, realistic, and cover different scenarios.

Return as JSON array: [{{"instruction": "...", "output": "..."}}, ...]"""

    def _parse_json_response(self, response: str) -> List[Dict]:
        """Parse JSON from Claude's response."""
        try:
            # Try to find JSON array in response
            start = response.find('[')
            end = response.rfind(']') + 1

            if start != -1 and end > start:
                json_str = response[start:end]
                examples = json.loads(json_str)
                return examples
            else:
                print(f"   ⚠️  Could not find JSON in response")
                return []

        except json.JSONDecodeError as e:
            print(f"   ⚠️  JSON parse error: {e}")
            return []


class EventDiscoveryAgent(BaseAgent):
    """Agent specialized in event discovery and search."""

    def __init__(self, anthropic_api_key: str):
        super().__init__(
            name="Event Discovery Agent",
            expertise="helping users discover and search for events",
            anthropic_api_key=anthropic_api_key
        )

    def _get_generation_prompt(self, num_examples: int) -> str:
        return f"""Generate {num_examples} examples for event discovery queries.

Include examples like:
- Searching by category (tech, music, sports, arts, food, etc.)
- Searching by location (Lagos, Abuja, Port Harcourt, etc.)
- Searching by date (this weekend, next month, December, etc.)
- Searching by price range (free events, under ₦5000, etc.)
- Popular event queries
- Specific event types (conferences, festivals, workshops, etc.)

Make responses include:
- 2-3 specific event examples with details
- Event names, dates, venues, prices
- Enthusiasm and helpful suggestions

Return as JSON: [{{"instruction": "...", "output": "..."}}, ...]"""


class BookingSpecialistAgent(BaseAgent):
    """Agent specialized in ticket booking and purchase process."""

    def __init__(self, anthropic_api_key: str):
        super().__init__(
            name="Booking Specialist Agent",
            expertise="ticket booking, purchase process, and reservations",
            anthropic_api_key=anthropic_api_key
        )

    def _get_generation_prompt(self, num_examples: int) -> str:
        return f"""Generate {num_examples} examples for booking and ticket purchase queries.

Include examples like:
- How to book tickets step-by-step
- Ticket types (Regular, VIP, Early Bird, etc.)
- Group bookings
- Payment methods
- Ticket delivery and confirmation
- Changing booking details
- Ticket transfer to others
- Booking deadlines

Make responses clear, step-by-step, and reassuring.

Return as JSON: [{{"instruction": "...", "output": "..."}}, ...]"""


class CustomerSupportAgent(BaseAgent):
    """Agent specialized in customer support and problem resolution."""

    def __init__(self, anthropic_api_key: str):
        super().__init__(
            name="Customer Support Agent",
            expertise="customer support, problem resolution, and user assistance",
            anthropic_api_key=anthropic_api_key
        )

    def _get_generation_prompt(self, num_examples: int) -> str:
        return f"""Generate {num_examples} examples for customer support scenarios.

Include examples like:
- Missing confirmation emails
- Login/account issues
- Ticket not showing up
- Event cancellations
- Technical problems
- General help requests
- Contact information requests
- Urgent issues before events

Make responses empathetic, helpful, and solution-focused.

Return as JSON: [{{"instruction": "...", "output": "..."}}, ...]"""


class PaymentRefundsAgent(BaseAgent):
    """Agent specialized in payments, refunds, and financial transactions."""

    def __init__(self, anthropic_api_key: str):
        super().__init__(
            name="Payment & Refunds Agent",
            expertise="payment processing, refunds, and financial transactions",
            anthropic_api_key=anthropic_api_key
        )

    def _get_generation_prompt(self, num_examples: int) -> str:
        return f"""Generate {num_examples} examples for payment and refund queries.

Include examples like:
- Payment methods accepted
- Failed payment troubleshooting
- Refund policies and timelines
- Partial refunds
- Payment security
- Invoices and receipts
- Currency and pricing questions
- Promotional codes/discounts

Make responses clear about policies and procedures.

Return as JSON: [{{"instruction": "...", "output": "..."}}, ...]"""


class EventOrganizerAgent(BaseAgent):
    """Agent specialized in helping event organizers."""

    def __init__(self, anthropic_api_key: str):
        super().__init__(
            name="Event Organizer Agent",
            expertise="helping event organizers create and manage events",
            anthropic_api_key=anthropic_api_key
        )

    def _get_generation_prompt(self, num_examples: int) -> str:
        return f"""Generate {num_examples} examples for event organizer queries.

Include examples like:
- How to create an event
- Ticket pricing strategies
- Managing attendees
- Event analytics and reporting
- Promotional tools
- Payout and revenue
- Event editing and updates
- Canceling or postponing events

Make responses informative and business-focused.

Return as JSON: [{{"instruction": "...", "output": "..."}}, ...]"""


class TechnicalSupportAgent(BaseAgent):
    """Agent specialized in technical issues and platform features."""

    def __init__(self, anthropic_api_key: str):
        super().__init__(
            name="Technical Support Agent",
            expertise="technical issues, platform features, and troubleshooting",
            anthropic_api_key=anthropic_api_key
        )

    def _get_generation_prompt(self, num_examples: int) -> str:
        return f"""Generate {num_examples} examples for technical support queries.

Include examples like:
- App/website not loading
- QR code scanning issues
- Mobile vs desktop features
- Browser compatibility
- Account security (passwords, 2FA)
- Notification settings
- Data privacy questions
- Platform features explanation

Make responses technical but accessible.

Return as JSON: [{{"instruction": "...", "output": "..."}}, ...]"""


class MarketingAgent(BaseAgent):
    """Agent specialized in event promotion and marketing."""

    def __init__(self, anthropic_api_key: str):
        super().__init__(
            name="Marketing Agent",
            expertise="event marketing, promotion, and audience engagement",
            anthropic_api_key=anthropic_api_key
        )

    def _get_generation_prompt(self, num_examples: int) -> str:
        return f"""Generate {num_examples} examples for marketing and promotion queries.

Include examples like:
- How to promote events
- Social media integration
- Email marketing features
- Promotional codes and discounts
- Early bird tickets
- Partner promotions
- Event visibility and SEO
- Success stories and tips

Make responses encouraging and strategy-focused.

Return as JSON: [{{"instruction": "...", "output": "..."}}, ...]"""


class AnalyticsAgent(BaseAgent):
    """Agent specialized in analytics and reporting."""

    def __init__(self, anthropic_api_key: str):
        super().__init__(
            name="Analytics Agent",
            expertise="event analytics, reporting, and insights",
            anthropic_api_key=anthropic_api_key
        )

    def _get_generation_prompt(self, num_examples: int) -> str:
        return f"""Generate {num_examples} examples for analytics and reporting queries.

Include examples like:
- Ticket sales reports
- Attendee demographics
- Revenue analytics
- Event performance metrics
- Conversion rates
- Popular events trends
- Real-time data
- Export and reporting features

Make responses data-focused and insightful.

Return as JSON: [{{"instruction": "...", "output": "..."}}, ...]"""


class UserExperienceAgent(BaseAgent):
    """Agent specialized in user experience and platform navigation."""

    def __init__(self, anthropic_api_key: str):
        super().__init__(
            name="User Experience Agent",
            expertise="platform navigation, user interface, and feature discovery",
            anthropic_api_key=anthropic_api_key
        )

    def _get_generation_prompt(self, num_examples: int) -> str:
        return f"""Generate {num_examples} examples for UX and navigation queries.

Include examples like:
- Platform tour and onboarding
- Finding specific features
- Personalization options
- Saved events and favorites
- Notification preferences
- Profile management
- Accessibility features
- Mobile app vs web differences

Make responses user-friendly and guiding.

Return as JSON: [{{"instruction": "...", "output": "..."}}, ...]"""


class CommunityAgent(BaseAgent):
    """Agent specialized in community features and social aspects."""

    def __init__(self, anthropic_api_key: str):
        super().__init__(
            name="Community Manager Agent",
            expertise="community features, social interactions, and event networking",
            anthropic_api_key=anthropic_api_key
        )

    def _get_generation_prompt(self, num_examples: int) -> str:
        return f"""Generate {num_examples} examples for community and social queries.

Include examples like:
- Chat features
- Meeting other attendees
- Event communities
- Following organizers
- Sharing events with friends
- Group tickets and attending together
- Post-event networking
- Reviews and ratings

Make responses community-focused and social.

Return as JSON: [{{"instruction": "...", "output": "..."}}, ...]"""
