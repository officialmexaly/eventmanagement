# 🤖 Multi-Agent Training Data Generation System

Generate high-quality, diverse training data for your EventHub AI using **10 specialized Claude-powered agents**.

Each agent is an expert in a specific domain and generates realistic, contextual training examples.

---

## 🎯 The 10 Specialized Agents

### 1. **Event Discovery Agent** 🔍
**Expertise:** Helping users discover and search for events

**Generates examples for:**
- Searching by category (tech, music, sports, arts, etc.)
- Location-based searches (Lagos, Abuja, etc.)
- Date-based searches (this weekend, next month, etc.)
- Price range filtering
- Specific event types

**Sample output:**
```
Q: Show me tech conferences in Lagos
A: I found several exciting tech conferences in Lagos:

1. **Tech Summit Nigeria 2025** (Jan 15-17, 2026)
   📍 Eko Convention Center
   💰 ₦25,000 (Early bird: ₦20,000)
   🎤 3-day conference with AI, blockchain, and startup tracks
   ...
```

---

### 2. **Booking Specialist Agent** 🎫
**Expertise:** Ticket booking, purchase process, and reservations

**Generates examples for:**
- Step-by-step booking instructions
- Ticket types (Regular, VIP, Group, etc.)
- Payment methods
- Confirmation process
- Ticket transfers
- Booking modifications

---

### 3. **Customer Support Agent** 💬
**Expertise:** Customer support and problem resolution

**Generates examples for:**
- Missing confirmations
- Account issues
- Technical problems
- Event cancellations
- Urgent pre-event issues
- General help requests

---

### 4. **Payment & Refunds Agent** 💳
**Expertise:** Payment processing and refund policies

**Generates examples for:**
- Payment methods
- Failed transactions
- Refund policies and timelines
- Invoices and receipts
- Promotional codes
- Payment security

---

### 5. **Event Organizer Agent** 👔
**Expertise:** Helping event organizers

**Generates examples for:**
- Creating events
- Pricing strategies
- Attendee management
- Analytics and reporting
- Promotional tools
- Revenue and payouts

---

### 6. **Technical Support Agent** 🔧
**Expertise:** Technical issues and platform features

**Generates examples for:**
- App/website issues
- QR code scanning
- Browser compatibility
- Account security
- Feature explanations
- Troubleshooting

---

### 7. **Marketing Agent** 📢
**Expertise:** Event promotion and marketing

**Generates examples for:**
- Promotion strategies
- Social media integration
- Email marketing
- Discounts and codes
- Visibility optimization
- Success stories

---

### 8. **Analytics Agent** 📊
**Expertise:** Event analytics and reporting

**Generates examples for:**
- Sales reports
- Demographics
- Performance metrics
- Conversion rates
- Trend analysis
- Data exports

---

### 9. **User Experience Agent** 🎨
**Expertise:** Platform navigation and UX

**Generates examples for:**
- Platform tour
- Feature discovery
- Personalization
- Profile management
- Accessibility
- Mobile vs web

---

### 10. **Community Manager Agent** 👥
**Expertise:** Community features and social aspects

**Generates examples for:**
- Chat and messaging
- Meeting attendees
- Event communities
- Sharing events
- Group tickets
- Reviews and ratings

---

## 🚀 Quick Start

### Prerequisites

1. **Anthropic API Key** (required)
   - Get it from: https://console.anthropic.com/settings/keys
   - Set environment variable:
     ```bash
     export ANTHROPIC_API_KEY=your_key_here
     ```

2. **Python Dependencies**
   ```bash
   pip install anthropic
   ```

### Generate Training Data

```bash
# Generate 10 examples per agent (100 total)
python ml/generate_training_data.py --examples 10

# Generate 50 examples per agent (500 total)
python ml/generate_training_data.py --examples 50

# Custom output directory
python ml/generate_training_data.py --examples 20 --output ml/agent_data
```

---

## 📊 Generation Process

When you run the script, here's what happens:

```
🚀 Initializing 10 Specialized EventHub AI Agents
  1. ✅ Event Discovery Agent
  2. ✅ Booking Specialist Agent
  3. ✅ Customer Support Agent
  4. ✅ Payment & Refunds Agent
  5. ✅ Event Organizer Agent
  6. ✅ Technical Support Agent
  7. ✅ Marketing Agent
  8. ✅ Analytics Agent
  9. ✅ User Experience Agent
  10. ✅ Community Manager Agent

📊 Generating Training Data (10 examples per agent)

🤖 Event Discovery Agent: Generating 10 examples...
   ✅ Generated 10 examples
🤖 Booking Specialist Agent: Generating 10 examples...
   ✅ Generated 10 examples
...

✅ Data Generation Complete!
📊 Total examples generated: 100

💾 Saving training data...
   ✅ Training data: ml/data/eventhub_train.jsonl
   ✅ Validation data: ml/data/eventhub_val.jsonl
   ✅ Raw examples: ml/data/raw_examples.json
```

---

## 📁 Output Files

### 1. `eventhub_train.jsonl`
Formatted training examples in Llama 3 instruction format:

```
{"text": "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are an intelligent assistant for EventHub...<|eot_id|>..."}
```

### 2. `eventhub_val.jsonl`
Validation set (10% of data by default)

### 3. `raw_examples.json`
Unformatted examples for easy inspection:

```json
[
  {
    "instruction": "Show me tech events in Lagos",
    "output": "I found several exciting tech events..."
  }
]
```

---

## ⚙️ Configuration Options

### Command Line Arguments

```bash
python ml/generate_training_data.py \
  --examples 50 \        # Examples per agent
  --output ml/data \     # Output directory
  --val-ratio 0.1        # Validation set ratio (10%)
```

### Examples Per Agent

| `--examples` | Total Examples | Time (approx) |
|--------------|----------------|---------------|
| 10 | ~100 | 2-3 minutes |
| 25 | ~250 | 5-7 minutes |
| 50 | ~500 | 10-15 minutes |
| 100 | ~1000 | 20-30 minutes |

**Recommendation:** Start with 10-25 examples per agent, review quality, then generate more.

---

## 🎯 Using Generated Data

### Option 1: Local Training

```bash
# Generate data
python ml/generate_training_data.py --examples 50

# Train model
python ml/train_model.py

# Or use convenience script
bash ml/train.sh
```

### Option 2: Google Colab Training

1. Generate data locally:
   ```bash
   python ml/generate_training_data.py --examples 50
   ```

2. Upload `ml/data/*.jsonl` files to Colab

3. Run the training notebook (it will use your generated data)

---

## 📈 Quality vs Quantity

### Small Dataset (100-250 examples)
**Pros:**
- Fast generation (5-10 minutes)
- Easy to review and refine
- Good for testing

**Cons:**
- May lack diversity
- Might not cover all edge cases

**Best for:** Initial testing and iteration

### Medium Dataset (250-500 examples)
**Pros:**
- Good balance of quality and coverage
- Covers most common scenarios
- Still reviewable

**Cons:**
- Takes longer to generate (15-20 minutes)

**Best for:** Production training (recommended)

### Large Dataset (500-1000+ examples)
**Pros:**
- Excellent coverage
- Handles edge cases well
- More diverse responses

**Cons:**
- Slower generation (30+ minutes)
- Harder to review all examples
- Higher API costs

**Best for:** Maximum quality, professional deployment

---

## 💰 Cost Estimation

Agent system uses Claude 3.5 Sonnet:
- **Input:** $3 per million tokens
- **Output:** $15 per million tokens

**Approximate costs:**

| Examples per Agent | Total Examples | Est. Cost |
|-------------------|----------------|-----------|
| 10 | ~100 | ~$0.10 - $0.20 |
| 25 | ~250 | ~$0.25 - $0.50 |
| 50 | ~500 | ~$0.50 - $1.00 |
| 100 | ~1000 | ~$1.00 - $2.00 |

**Note:** Actual costs vary based on response lengths. These are conservative estimates.

**ROI:** After training, your model runs for free! No per-query costs.

---

## 🔍 Reviewing Generated Data

### Inspect Raw Examples

```bash
# View first 5 examples
cat ml/data/raw_examples.json | jq '.[:5]'

# Count total examples
cat ml/data/raw_examples.json | jq 'length'

# Find examples by keyword
cat ml/data/raw_examples.json | jq '.[] | select(.instruction | contains("booking"))'
```

### Check Quality

Look for:
- ✅ Realistic event names and details
- ✅ Accurate pricing in Naira (₦)
- ✅ Nigerian locations (Lagos, Abuja, etc.)
- ✅ Helpful, enthusiastic responses
- ✅ Diverse scenarios and edge cases
- ✅ Natural, conversational language

### Refine if Needed

If quality isn't perfect:
1. Review the agent prompts in `ml/agents.py`
2. Adjust temperature (currently 0.8)
3. Modify system prompts for specific agents
4. Regenerate data

---

## 🛠️ Advanced Customization

### Modify Agent Behavior

Edit `ml/agents.py`:

```python
class EventDiscoveryAgent(BaseAgent):
    def _get_generation_prompt(self, num_examples: int) -> str:
        return f"""Generate {num_examples} examples...

        # Add your custom instructions here
        Focus on:
        - Premium events (₦50,000+)
        - Corporate conferences
        - Detailed venue information

        ...
        """
```

### Change Model Temperature

In `ml/agents.py`, adjust the `BaseAgent`:

```python
message = self.client.messages.create(
    model=self.model,
    max_tokens=4096,
    temperature=0.8,  # Lower = more focused, Higher = more creative
    ...
)
```

### Add Custom Agents

Create a new agent class:

```python
class CustomAgent(BaseAgent):
    def __init__(self, anthropic_api_key: str):
        super().__init__(
            name="My Custom Agent",
            expertise="your specific domain",
            anthropic_api_key=anthropic_api_key
        )

    def _get_generation_prompt(self, num_examples: int) -> str:
        return f"""Your custom prompt..."""
```

Then add to orchestrator in `ml/generate_training_data.py`.

---

## 🐛 Troubleshooting

### "ANTHROPIC_API_KEY not found"

**Solution:**
```bash
export ANTHROPIC_API_KEY=your_key_here

# Or add to .env file
echo "ANTHROPIC_API_KEY=your_key_here" >> .env
```

### "Could not find JSON in response"

**Cause:** Claude sometimes returns text before/after JSON

**Solution:** The script handles this automatically. If it persists:
1. Check agent prompts are clear
2. Try regenerating that agent's data
3. Review raw response in error message

### "Rate limit exceeded"

**Cause:** Too many requests too quickly

**Solution:**
1. Reduce `--examples` count
2. Add delays between agents (edit script)
3. Upgrade Anthropic API tier

### Low Quality Examples

**Solutions:**
1. Review and adjust agent prompts
2. Lower temperature for more focused responses
3. Add more specific instructions
4. Generate more examples (averaging helps)

---

## 📚 Integration with Training Pipeline

The agent-generated data is **100% compatible** with existing training scripts:

```bash
# Generate data with agents
python ml/generate_training_data.py --examples 50

# Train locally
python ml/train_model.py

# Or train on Colab
# (upload ml/EventHub_Llama3_Training.ipynb)
```

The data format is identical to manual examples!

---

## 🎯 Best Practices

### 1. Start Small
- Generate 10 examples per agent first
- Review quality
- Adjust prompts if needed
- Scale up to 50-100

### 2. Review Before Training
- Always inspect `raw_examples.json`
- Look for consistency
- Check for errors or unrealistic content
- Verify Nigerian context (locations, currency, culture)

### 3. Iterate
- Generate → Review → Adjust → Regenerate
- Fine-tune agent prompts based on output
- Mix with manual examples if needed

### 4. Diversify
- Use all 10 agents
- Each brings unique perspective
- Balanced training data = better model

### 5. Save API Costs
- Generate once, train multiple times
- Reuse good datasets
- Only regenerate when updating model significantly

---

## 🎉 Benefits Over Manual Examples

| Aspect | Manual Examples | Agent-Generated |
|--------|----------------|-----------------|
| **Speed** | Slow (hours for 100) | Fast (minutes for 100) |
| **Scale** | Hard to write 100+ | Easy to generate 1000+ |
| **Diversity** | Limited by one writer | 10 different perspectives |
| **Consistency** | May vary | Consistently formatted |
| **Quality** | Depends on writer | Powered by Claude 3.5 |
| **Coverage** | May miss edge cases | Comprehensive scenarios |
| **Cost** | Free (but time-intensive) | Small API cost (~$1-2) |

---

## 🚀 Next Steps

1. **Set API Key:**
   ```bash
   export ANTHROPIC_API_KEY=your_key_here
   ```

2. **Generate Data:**
   ```bash
   python ml/generate_training_data.py --examples 25
   ```

3. **Review:**
   ```bash
   cat ml/data/raw_examples.json | jq '.[:5]'
   ```

4. **Train:**
   ```bash
   # Local GPU
   python ml/train_model.py

   # Or Google Colab
   # Upload ml/EventHub_Llama3_Training.ipynb
   ```

5. **Deploy:**
   ```bash
   python ml/inference_server.py
   npm run dev
   ```

---

## 📖 Resources

- **Agent Code:** `ml/agents.py`
- **Orchestrator:** `ml/generate_training_data.py`
- **Training:** `ml/train_model.py` or Colab notebook
- **Deployment:** `ml/inference_server.py`

---

**Ready to generate world-class training data? Let's go! 🚀**

```bash
python ml/generate_training_data.py --examples 50
```
