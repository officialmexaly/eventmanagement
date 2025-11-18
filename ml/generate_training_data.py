"""
Training Data Generation Orchestrator for EventHub AI.

This script coordinates 10 specialized AI agents to generate comprehensive,
high-quality training data for the custom Llama 3 model.

Usage:
    python ml/generate_training_data.py --examples 50 --output ml/data
"""

import os
import json
import asyncio
import argparse
from typing import List, Dict
from datetime import datetime
import random

from agents import (
    EventDiscoveryAgent,
    BookingSpecialistAgent,
    CustomerSupportAgent,
    PaymentRefundsAgent,
    EventOrganizerAgent,
    TechnicalSupportAgent,
    MarketingAgent,
    AnalyticsAgent,
    UserExperienceAgent,
    CommunityAgent,
)


class TrainingDataOrchestrator:
    """Orchestrates multiple agents to generate training data."""

    def __init__(self, anthropic_api_key: str):
        self.api_key = anthropic_api_key
        self.agents = []
        self.all_examples = []
        self.system_prompt = """You are an intelligent assistant for EventHub, a premier event management platform in Nigeria. Help users discover events, book tickets, and answer questions about the platform. Be friendly, helpful, and enthusiastic about events!"""

    def initialize_agents(self):
        """Initialize all 10 specialized agents."""
        print("=" * 80)
        print("🚀 Initializing 10 Specialized EventHub AI Agents")
        print("=" * 80)
        print()

        self.agents = [
            EventDiscoveryAgent(self.api_key),
            BookingSpecialistAgent(self.api_key),
            CustomerSupportAgent(self.api_key),
            PaymentRefundsAgent(self.api_key),
            EventOrganizerAgent(self.api_key),
            TechnicalSupportAgent(self.api_key),
            MarketingAgent(self.api_key),
            AnalyticsAgent(self.api_key),
            UserExperienceAgent(self.api_key),
            CommunityAgent(self.api_key),
        ]

        for i, agent in enumerate(self.agents, 1):
            print(f"  {i}. ✅ {agent.name}")

        print()
        print(f"✅ All {len(self.agents)} agents initialized!")
        print()

    async def generate_all_data(self, examples_per_agent: int = 10):
        """Generate training data from all agents."""
        print("=" * 80)
        print(f"📊 Generating Training Data ({examples_per_agent} examples per agent)")
        print("=" * 80)
        print()

        tasks = [
            agent.generate_examples(examples_per_agent)
            for agent in self.agents
        ]

        results = await asyncio.gather(*tasks)

        # Combine all examples
        for agent_examples in results:
            self.all_examples.extend(agent_examples)

        print()
        print("=" * 80)
        print(f"✅ Data Generation Complete!")
        print("=" * 80)
        print()
        print(f"📊 Total examples generated: {len(self.all_examples)}")
        print(f"📊 Examples per agent: {len(self.all_examples) // len(self.agents)}")
        print()

        return self.all_examples

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

        print(f"✅ Formatted {len(formatted)} examples")
        print()
        return formatted

    def split_train_val(self, examples: List[Dict], val_ratio: float = 0.1):
        """Split data into training and validation sets."""
        random.shuffle(examples)
        split_idx = int(len(examples) * (1 - val_ratio))

        train_data = examples[:split_idx]
        val_data = examples[split_idx:]

        print(f"📊 Dataset Split:")
        print(f"   Training: {len(train_data)} examples ({(1-val_ratio)*100:.0f}%)")
        print(f"   Validation: {len(val_data)} examples ({val_ratio*100:.0f}%)")
        print()

        return train_data, val_data

    def save_data(self, train_data: List[Dict], val_data: List[Dict], output_dir: str):
        """Save training data to JSONL files."""
        os.makedirs(output_dir, exist_ok=True)

        train_path = os.path.join(output_dir, "eventhub_train.jsonl")
        val_path = os.path.join(output_dir, "eventhub_val.jsonl")

        print(f"💾 Saving training data...")

        # Save training data
        with open(train_path, 'w') as f:
            for example in train_data:
                f.write(json.dumps(example) + '\n')

        # Save validation data
        with open(val_path, 'w') as f:
            for example in val_data:
                f.write(json.dumps(example) + '\n')

        print(f"   ✅ Training data: {train_path}")
        print(f"   ✅ Validation data: {val_path}")
        print()

        # Also save raw examples (unformatted) for inspection
        raw_path = os.path.join(output_dir, "raw_examples.json")
        with open(raw_path, 'w') as f:
            json.dump(self.all_examples, f, indent=2)

        print(f"   ✅ Raw examples: {raw_path}")
        print()

    def print_sample_examples(self, num_samples: int = 3):
        """Print sample examples for inspection."""
        print("=" * 80)
        print(f"📝 Sample Training Examples")
        print("=" * 80)
        print()

        samples = random.sample(self.all_examples, min(num_samples, len(self.all_examples)))

        for i, example in enumerate(samples, 1):
            print(f"Example {i}:")
            print(f"  Q: {example['instruction']}")
            print(f"  A: {example['output'][:200]}...")
            print()

    def print_statistics(self):
        """Print statistics about generated data."""
        print("=" * 80)
        print("📊 Generation Statistics")
        print("=" * 80)
        print()

        total_examples = len(self.all_examples)
        total_instructions = sum(len(ex['instruction']) for ex in self.all_examples)
        total_outputs = sum(len(ex['output']) for ex in self.all_examples)

        print(f"Total examples: {total_examples}")
        print(f"Average instruction length: {total_instructions // total_examples} chars")
        print(f"Average output length: {total_outputs // total_examples} chars")
        print()

        print("Examples by agent:")
        for agent in self.agents:
            print(f"  {agent.name}: {agent.examples_generated} examples")

        print()


async def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(
        description="Generate training data for EventHub AI using 10 specialized agents"
    )
    parser.add_argument(
        "--examples",
        type=int,
        default=10,
        help="Number of examples per agent (default: 10, total will be 10x this)"
    )
    parser.add_argument(
        "--output",
        type=str,
        default="ml/data",
        help="Output directory for training data (default: ml/data)"
    )
    parser.add_argument(
        "--val-ratio",
        type=float,
        default=0.1,
        help="Validation set ratio (default: 0.1)"
    )

    args = parser.parse_args()

    # Get API key
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("❌ Error: ANTHROPIC_API_KEY not found in environment variables")
        print("   Please set it: export ANTHROPIC_API_KEY=your_key_here")
        return

    print()
    print("=" * 80)
    print("🎯 EventHub AI Training Data Generation System")
    print("=" * 80)
    print()
    print(f"Configuration:")
    print(f"  Examples per agent: {args.examples}")
    print(f"  Total agents: 10")
    print(f"  Expected total examples: ~{args.examples * 10}")
    print(f"  Validation ratio: {args.val_ratio * 100}%")
    print(f"  Output directory: {args.output}")
    print()

    # Initialize orchestrator
    orchestrator = TrainingDataOrchestrator(api_key)

    # Initialize agents
    orchestrator.initialize_agents()

    # Generate data
    start_time = datetime.now()
    examples = await orchestrator.generate_all_data(args.examples)
    end_time = datetime.now()

    if not examples:
        print("❌ No examples generated. Please check your API key and try again.")
        return

    # Print statistics
    orchestrator.print_statistics()

    # Format for training
    formatted_examples = orchestrator.format_for_training(examples)

    # Split train/val
    train_data, val_data = orchestrator.split_train_val(
        formatted_examples,
        val_ratio=args.val_ratio
    )

    # Save data
    orchestrator.save_data(train_data, val_data, args.output)

    # Print samples
    orchestrator.print_sample_examples(num_samples=3)

    # Final summary
    duration = (end_time - start_time).total_seconds()
    print("=" * 80)
    print("🎉 Training Data Generation Complete!")
    print("=" * 80)
    print()
    print(f"⏱️  Time taken: {duration:.1f} seconds")
    print(f"📊 Total examples: {len(examples)}")
    print(f"📁 Training examples: {len(train_data)}")
    print(f"📁 Validation examples: {len(val_data)}")
    print()
    print("🚀 Next steps:")
    print(f"   1. Review examples in: {args.output}/raw_examples.json")
    print(f"   2. Train model: python ml/train_model.py")
    print(f"   3. Or upload to Colab: ml/EventHub_Llama3_Training.ipynb")
    print()


if __name__ == "__main__":
    asyncio.run(main())
