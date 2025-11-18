"""
Prepare EventHub training data for Llama fine-tuning.

This script converts EventHub-specific data into instruction-following format
for fine-tuning Llama models.
"""

import json
import os
from datetime import datetime
from typing import List, Dict

class EventHubDataPrep:
    """Prepare EventHub data for model training."""

    def __init__(self, output_dir: str = "data"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def create_instruction_dataset(self) -> List[Dict]:
        """Create instruction-following dataset from EventHub data."""

        dataset = []

        # Event Discovery Instructions
        dataset.extend(self.event_discovery_examples())

        # Event Details Instructions
        dataset.extend(self.event_details_examples())

        # Booking Assistance Instructions
        dataset.extend(self.booking_assistance_examples())

        # Support Instructions
        dataset.extend(self.support_examples())

        # General EventHub Knowledge
        dataset.extend(self.general_knowledge_examples())

        return dataset

    def event_discovery_examples(self) -> List[Dict]:
        """Examples for event discovery and search."""
        return [
            {
                "instruction": "Show me upcoming tech events in Lagos",
                "input": "",
                "output": "I found several exciting tech events in Lagos:\n\n1. **Tech Conference 2025** (Dec 15, 2025)\n   - Location: Lagos Convention Center\n   - Price: ₦15,000\n   - Featuring industry leaders and breakthrough innovations\n\n2. **Startup Pitch Night** (Dec 5, 2025)\n   - Location: Yaba Tech Hub\n   - Price: ₦5,000\n   - Watch innovative startups pitch to investors\n\nWould you like more details about any of these events?"
            },
            {
                "instruction": "Find music festivals happening this month",
                "input": "",
                "output": "Here are the music festivals happening this month:\n\n1. **Music Festival** (Nov 25, 2025)\n   - Location: Eko Atlantic\n   - Price: ₦25,000\n   - Three-day festival with top artists from around the world\n   - Capacity: 2,000 attendees\n\nThis is a highly anticipated event! Tickets are selling fast. Would you like to check availability?"
            },
            {
                "instruction": "What events are available for under ₦10,000?",
                "input": "",
                "output": "Great question! Here are affordable events under ₦10,000:\n\n1. **Art Exhibition** - ₦5,000\n   Contemporary African art showcase at Nike Art Gallery\n\n2. **Startup Pitch Night** - ₦5,000\n   Network with founders and VCs at Yaba Tech Hub\n\n3. **Food Festival** - ₦8,000\n   Taste cuisines from around the world in Lekki\n\nAll of these offer excellent value and unforgettable experiences!"
            }
        ]

    def event_details_examples(self) -> List[Dict]:
        """Examples for event details and information."""
        return [
            {
                "instruction": "Tell me about the Tech Conference 2025",
                "input": "",
                "output": "**Tech Conference 2025** is our flagship technology event!\n\n📅 **Date:** December 15, 2025\n📍 **Location:** Lagos Convention Center\n💰 **Price:** ₦15,000 per ticket\n👥 **Capacity:** 500 attendees\n\n**About the Event:**\nAn annual technology conference featuring industry leaders and breakthrough innovations. Connect with tech pioneers, attend workshops, and discover the future of technology.\n\n**Current Availability:**\nThis event is very popular with limited seats remaining. I recommend booking soon!\n\nWould you like to check ticket availability or learn about similar events?"
            },
            {
                "instruction": "What's included in the Food Festival ticket?",
                "input": "",
                "output": "The **Food Festival** ticket (₦8,000) includes:\n\n✅ Access to all food stalls and vendors\n✅ Taste cuisines from around the world\n✅ Live cooking demonstrations by celebrity chefs\n✅ Entertainment and live music\n✅ Networking opportunities with food enthusiasts\n\n📍 Location: Lekki Phase 1\n📅 Date: December 10, 2025\n👥 Capacity: 1,000 attendees\n\nIt's a fantastic value for a full day of culinary experiences!"
            }
        ]

    def booking_assistance_examples(self) -> List[Dict]:
        """Examples for booking and ticket purchase assistance."""
        return [
            {
                "instruction": "How do I book tickets for an event?",
                "input": "",
                "output": "Booking tickets on EventHub is easy! Here's how:\n\n**Step 1:** Browse or search for your desired event\n**Step 2:** Click on the event to view full details\n**Step 3:** Check ticket availability\n**Step 4:** Select the number of tickets you need\n**Step 5:** Click 'Book Now' and complete payment\n**Step 6:** Receive your e-ticket with QR code via email\n\n💡 **Pro tip:** Log in before booking for a faster checkout experience and to track your tickets in your dashboard!\n\nNeed help finding a specific event?"
            },
            {
                "instruction": "Can I get 5 tickets for the Music Festival?",
                "input": "",
                "output": "Let me check availability for the Music Festival...\n\n✅ **Good news!** 5 tickets are available!\n\n**Booking Summary:**\n- Event: Music Festival\n- Date: November 25, 2025\n- Tickets: 5\n- Price per ticket: ₦25,000\n- **Total: ₦125,000**\n\n📍 Location: Eko Atlantic\n\nThis is a 3-day music festival with top international artists. With 1,500 tickets still available out of 2,000, you have a great selection!\n\nWould you like to proceed with the booking?"
            }
        ]

    def support_examples(self) -> List[Dict]:
        """Examples for customer support."""
        return [
            {
                "instruction": "I haven't received my ticket confirmation email",
                "input": "",
                "output": "I understand your concern. Let me help you with that!\n\n**Here's what to do:**\n\n1. **Check your spam/junk folder** - Sometimes confirmation emails end up there\n2. **Verify the email address** - Make sure you used the correct email during booking\n3. **Check your dashboard** - Log in to EventHub and go to 'My Tickets' to view all your bookings\n\nIf you still can't find it:\n- Contact our support team with your booking reference number\n- We can resend the confirmation email\n- You can also download your ticket directly from your dashboard\n\n📧 Support email: support@eventhub.com\n📞 Call us: [support number]\n\nDon't worry, your booking is safe in our system!"
            },
            {
                "instruction": "Can I cancel or refund my ticket?",
                "input": "",
                "output": "**Cancellation & Refund Policy:**\n\n✅ **Full Refund:** Up to 7 days before the event\n⚠️ **50% Refund:** 3-7 days before the event  \n❌ **No Refund:** Within 3 days of the event\n\n**How to request a refund:**\n1. Go to your Dashboard\n2. Find your ticket under 'My Tickets'\n3. Click 'Request Refund'\n4. Provide a reason (optional)\n5. Submit request\n\nRefunds are processed within 5-7 business days to your original payment method.\n\n💡 **Alternative:** Can't make it? Consider transferring your ticket to a friend instead of cancelling!\n\nNeed help with a specific booking?"
            }
        ]

    def general_knowledge_examples(self) -> List[Dict]:
        """General EventHub knowledge and FAQs."""
        return [
            {
                "instruction": "What is EventHub?",
                "input": "",
                "output": "**EventHub** is your premier event discovery and booking platform in Nigeria! 🎉\n\n**What we offer:**\n- 🔍 **Discover Events:** Browse conferences, concerts, festivals, workshops, and more\n- 🎫 **Easy Booking:** Secure online ticket purchase with instant confirmation\n- 💬 **Event Chat:** Connect with other attendees and organizers\n- 🤖 **AI Assistant:** Get personalized event recommendations\n- 📊 **Event Management:** Tools for organizers to manage their events\n\n**Event Categories:**\n- Tech & Business Conferences\n- Music Festivals & Concerts\n- Art Exhibitions\n- Food & Culinary Events\n- Sports & Fitness\n- Workshops & Learning\n\nWhether you're looking for professional networking, entertainment, or learning opportunities, EventHub has something for everyone!"
            },
            {
                "instruction": "How does EventHub's AI recommendation work?",
                "input": "",
                "output": "Our **AI-powered recommendation system** learns from your interests to suggest perfect events!\n\n**How it works:**\n1. 📝 **Your Preferences:** We analyze your browsing history, past bookings, and favorites\n2. 🎯 **Smart Matching:** Our AI matches you with events that fit your interests\n3. ⭐ **Quality Scoring:** Events are ranked based on relevance, availability, and popularity\n4. 🔄 **Continuous Learning:** The more you use EventHub, the better the recommendations!\n\n**Get better recommendations by:**\n- Marking events as favorites\n- Booking tickets for events you love\n- Rating events after attending\n- Updating your interest categories\n\nJust ask me 'Recommend events for me' and I'll provide personalized suggestions!"
            }
        ]

    def format_for_training(self, dataset: List[Dict]) -> List[Dict]:
        """Format dataset for Llama instruction fine-tuning."""
        formatted_data = []

        for example in dataset:
            # Llama-3 instruction format
            text = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are an intelligent assistant for EventHub, a premier event management platform in Nigeria. Help users discover events, book tickets, and answer questions about the platform. Be friendly, helpful, and enthusiastic about events!<|eot_id|><|start_header_id|>user<|end_header_id|>

{example['instruction']}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

{example['output']}<|eot_id|>"""

            formatted_data.append({
                "text": text,
                "instruction": example['instruction'],
                "output": example['output']
            })

        return formatted_data

    def save_dataset(self, dataset: List[Dict], filename: str = "eventhub_train.jsonl"):
        """Save dataset in JSONL format."""
        filepath = os.path.join(self.output_dir, filename)

        with open(filepath, 'w', encoding='utf-8') as f:
            for item in dataset:
                f.write(json.dumps(item, ensure_ascii=False) + '\n')

        print(f"✅ Saved {len(dataset)} examples to {filepath}")
        return filepath

    def generate_validation_split(self, dataset: List[Dict], val_ratio: float = 0.1):
        """Split dataset into train and validation sets."""
        import random
        random.seed(42)

        dataset_copy = dataset.copy()
        random.shuffle(dataset_copy)

        split_idx = int(len(dataset_copy) * (1 - val_ratio))
        train_data = dataset_copy[:split_idx]
        val_data = dataset_copy[split_idx:]

        self.save_dataset(train_data, "eventhub_train.jsonl")
        self.save_dataset(val_data, "eventhub_val.jsonl")

        print(f"\n📊 Dataset Split:")
        print(f"   Training: {len(train_data)} examples")
        print(f"   Validation: {len(val_data)} examples")

        return train_data, val_data

def main():
    """Generate EventHub training dataset."""
    print("🚀 Generating EventHub Training Data...\n")

    prep = EventHubDataPrep(output_dir="ml/data")

    # Create instruction dataset
    raw_dataset = prep.create_instruction_dataset()
    print(f"Created {len(raw_dataset)} instruction examples")

    # Format for Llama training
    formatted_dataset = prep.format_for_training(raw_dataset)

    # Split and save
    train_data, val_data = prep.generate_validation_split(formatted_dataset)

    print("\n✅ Training data preparation complete!")
    print(f"📁 Data saved in: ml/data/")

    # Print sample
    print("\n📝 Sample Training Example:")
    print("-" * 80)
    print(train_data[0]['text'][:500] + "...")
    print("-" * 80)

if __name__ == "__main__":
    main()
