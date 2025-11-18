# 🆓 FREE Local Training Data Generation (No API Required!)

Generate training data for your EventHub AI **completely FREE** - no API keys, no subscriptions, no costs!

---

## 🎯 Quick Start (2 Commands)

```bash
# 1. Generate training data (FREE!)
python3 ml/generate_local_data.py

# 2. Train your model
# - Local GPU: python ml/train_model.py
# - Google Colab: Upload ml/EventHub_Llama3_Training.ipynb
```

**That's it!** You get 50+ training examples in seconds.

---

## ✨ What You Get

```
✅ 50+ training examples
✅ 100% FREE (no API required)
✅ 10 different categories
✅ Nigerian context (Lagos, Naira, etc.)
✅ Realistic event scenarios
✅ Ready to train immediately
```

---

## 📊 Generated Examples

The system creates examples across 10 categories:

### 1. **Event Discovery** (24+ examples)
```
Q: "Show me tech events in Lagos"
A: "I found several exciting tech events in Lagos!  🎯

**1. Tech Conference 2025**
📍 Eko Convention Center
💰 ₦15,000
..."
```

### 2. **Booking & Tickets** (7+ examples)
```
Q: "How do I book tickets?"
A: "Booking on EventHub is easy! Here's how:..."
```

### 3. **Customer Support** (3 examples)
```
Q: "I haven't received my confirmation email"
A: "Let me help you with that!..."
```

### 4. **Payments & Refunds** (3 examples)
```
Q: "What payment methods do you accept?"
A: "We accept multiple secure payment methods..."
```

### 5. **Event Organizers** (2 examples)
```
Q: "How do I create an event?"
A: "Creating an event is simple!..."
```

### 6. **Technical Support** (2 examples)
```
Q: "The app won't load"
A: "Let's fix this! Try these steps..."
```

### 7. **Marketing** (1 example)
```
Q: "How can I promote my event?"
A: "Great question! Here are effective strategies..."
```

### 8. **Analytics** (1 example)
```
Q: "How do I see my sales report?"
A: "Access your sales data anytime!..."
```

### 9. **User Experience** (2 examples)
```
Q: "How do I save events?"
A: "Great feature! Here's how..."
```

### 10. **Community** (2 examples)
```
Q: "How do I chat with attendees?"
A: "Great way to network!..."
```

---

## 🆚 Comparison: Local vs API Agents

| Feature | Local Generator | Claude API Agents |
|---------|----------------|-------------------|
| **Cost** | FREE | $1-2 for 500 examples |
| **Setup** | None | Need API key |
| **Speed** | Instant | 10-15 minutes |
| **Examples** | 50+ | 500+ |
| **Quality** | Good templates | AI-generated |
| **Customization** | Edit templates | Edit prompts |
| **Best For** | Getting started | Production quality |

---

## 📁 Output Files

After running, you'll have:

```
ml/data/
├── eventhub_train.jsonl      # 45 training examples (90%)
├── eventhub_val.jsonl         # 6 validation examples (10%)
└── raw_examples.json          # Raw JSON for easy review
```

---

## 🔍 Review Your Data

```bash
# View all examples
cat ml/data/raw_examples.json | python3 -m json.tool

# Count total examples
cat ml/data/raw_examples.json | python3 -c "import json, sys; print(len(json.load(sys.stdin)))"

# View first 3 examples
cat ml/data/raw_examples.json | python3 -c "import json, sys; [print(f\"Q: {ex['instruction']}\nA: {ex['output'][:100]}...\n\") for ex in json.load(sys.stdin)[:3]]"
```

---

## 🚀 Training Options

### Option 1: Google Colab (Recommended - Free GPU!)

```bash
# 1. Generate data
python3 ml/generate_local_data.py

# 2. Upload to Google Colab:
#    - ml/EventHub_Llama3_Training.ipynb
#    - ml/data/*.jsonl files

# 3. Enable T4 GPU and run all cells
```

**Training time:** 2-3 hours on free T4 GPU

### Option 2: Local GPU Training

```bash
# 1. Generate data
python3 ml/generate_local_data.py

# 2. Train model (requires NVIDIA GPU 16GB+)
python3 ml/train_model.py
```

**Training time:** 1-2 hours on RTX 4090/A100

---

## 🎨 Customization

Want more examples or different scenarios? Edit `ml/generate_local_data.py`:

### Add More Event Types

```python
self.event_categories = {
    "tech": ["Your events here", "..."],
    "music": ["Your events here", "..."],
    # Add more categories
}
```

### Add More Cities

```python
self.cities = ["Lagos", "Abuja", "Your city", "..."]
```

### Add More Venues

```python
self.venues = ["Eko Convention Center", "Your venue", "..."]
```

### Add Custom Examples

```python
def event_discovery_examples(self) -> List[Dict]:
    examples = []

    # Add your custom example
    examples.append({
        "instruction": "Your custom question",
        "output": "Your custom response"
    })

    # ... existing code
```

Then regenerate:
```bash
python3 ml/generate_local_data.py
```

---

## 📈 Scaling Up

### Want More Examples?

**Option 1: Run Multiple Times**
```bash
# Generate set 1
python3 ml/generate_local_data.py

# Manually add variations and run again
# Combine the outputs
```

**Option 2: Add Template Variations**

Edit the generator to create more variations of each template.

**Option 3: Use API Agents** (costs $1-2)

If you later get an API key:
```bash
export ANTHROPIC_API_KEY=your_key
bash ml/generate_with_agents.sh 50  # 500 examples
```

---

## 💡 Pro Tips

### 1. **Start with Free Local**
- Generate 50+ examples locally (free)
- Train and test your model
- See if quality is good enough

### 2. **Scale Up if Needed**
- If model quality isn't perfect
- Get API key and generate 500+ examples
- Or manually add more templates

### 3. **Mix Both Approaches**
- Use local generator for common scenarios
- Use API agents for edge cases and variety
- Best of both worlds!

### 4. **Iterative Improvement**
- Train with 50 examples
- Test model
- Add more examples where it struggles
- Retrain

---

## 🎯 Expected Results

### With 50 Local Examples:
- ✅ Handles common queries well
- ✅ Good Nigerian context
- ✅ Basic booking/support
- ⚠️ May struggle with edge cases
- ⚠️ Limited variety

**Best for:** Testing, proof of concept, learning

### With 500 API Examples:
- ✅ Excellent coverage
- ✅ Handles edge cases
- ✅ More natural responses
- ✅ Better generalization
- ✅ Production quality

**Best for:** Production deployment, professional use

---

## ✅ Advantages of Local Generation

### 1. **Zero Cost**
- No API fees
- No subscriptions
- Completely free

### 2. **Instant**
- Generates in seconds
- No waiting
- No rate limits

### 3. **No Setup**
- No API keys needed
- No accounts to create
- Just run the script

### 4. **Full Control**
- Edit templates easily
- Customize everything
- No external dependencies

### 5. **Privacy**
- All local
- No data sent anywhere
- Completely offline

---

## 📚 Next Steps

### 1. Generate Your Data
```bash
python3 ml/generate_local_data.py
```

### 2. Review the Examples
```bash
cat ml/data/raw_examples.json | head -100
```

### 3. Train on Google Colab
- Free T4 GPU
- 2-3 hours training
- No local GPU needed

### 4. Deploy Your Model
```bash
python3 ml/inference_server.py
npm run dev
```

### 5. Test the Custom AI
Look for the green sparkles icon (⚡) in your app!

---

## 🆘 Troubleshooting

### "Not enough examples"

**Solution:**
- Edit `ml/generate_local_data.py`
- Add more template variations
- Or get an API key for 500+ examples

### "Want more variety"

**Solution:**
- Run generator multiple times with different random seeds
- Manually add specific scenarios
- Or use API agents system

### "Model quality not great"

**Solution:**
- More examples help (aim for 100-200+)
- Mix local + manual examples
- Or use API agents for 500+ examples

---

## 🎉 Summary

### You Now Have:

✅ **FREE training data generator**
- No API, no cost, no setup

✅ **50+ quality examples**
- Across 10 categories
- Nigerian context
- Ready to train

✅ **Multiple training options**
- Google Colab (free GPU)
- Local GPU
- Easy integration

✅ **Full customization**
- Edit templates
- Add examples
- Control everything

---

## 🚀 Ready to Start?

```bash
# Generate FREE training data
python3 ml/generate_local_data.py

# Train on Google Colab
# Upload ml/EventHub_Llama3_Training.ipynb

# Deploy your AI!
python3 ml/inference_server.py
```

**Welcome to FREE AI training! 🎉**

---

## 📖 More Resources

- **For more examples:** Use API agents (`MULTI_AGENT_SYSTEM.md`)
- **For Colab training:** See `COLAB_QUICKSTART.md`
- **For full docs:** See `CUSTOM_AI_README.md`

---

**Questions? Issues?** Just edit the generator and customize it for your needs!
