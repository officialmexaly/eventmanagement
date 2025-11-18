# EventHub Custom AI - Quick Start Guide

Get your custom Llama 3 AI running in 15 minutes!

## 🚀 Quick Start (TL;DR)

```bash
# 1. Install dependencies
cd ml
pip install -r requirements.txt

# 2. Login to Hugging Face
huggingface-cli login

# 3. Prepare data and train (takes 2-6 hours depending on GPU)
bash ml/train.sh

# 4. Start inference server
bash ml/start_server.sh

# 5. Start EventHub (in a new terminal)
npm run dev
```

Visit http://localhost:3000 and click the green sparkles icon!

## 📋 Prerequisites Checklist

Before you start, make sure you have:

- [ ] **NVIDIA GPU** with 16GB+ VRAM (RTX 4090, A5000, A100, etc.)
- [ ] **Python 3.10+** installed
- [ ] **CUDA 11.8+** installed
- [ ] **50GB+** free disk space
- [ ] **Hugging Face account** with Llama 3 access

### Get Llama 3 Access

1. Go to https://huggingface.co/meta-llama/Meta-Llama-3-8B
2. Click "Request Access"
3. Wait for approval (usually instant)
4. Get your access token from https://huggingface.co/settings/tokens

## 🎯 Step-by-Step Guide

### Step 1: Install Python Dependencies (5 minutes)

```bash
cd ml
pip install -r requirements.txt
```

**Verify installation:**
```bash
python3 -c "import torch; print('GPU:', torch.cuda.get_device_name(0))"
```

### Step 2: Login to Hugging Face (1 minute)

```bash
huggingface-cli login
```

Paste your access token when prompted.

### Step 3: Prepare Training Data (2 minutes)

```bash
python3 ml/prepare_training_data.py
```

This creates ~20 EventHub-specific training examples.

**Output:**
```
✅ Saved 18 examples to ml/data/eventhub_train.jsonl
✅ Saved 2 examples to ml/data/eventhub_val.jsonl
```

### Step 4: Train the Model (2-6 hours)

```bash
python3 ml/train_model.py
```

**What happens:**
- Downloads Llama 3 8B (~16GB)
- Loads with 4-bit quantization (saves memory)
- Trains with LoRA (fast & efficient)
- Saves to `ml/models/eventhub-llama3`

**Training progress:**
```
Epoch 1/3: 100%|███████████| 5/5 [12:30<00:00, 150.12s/it]
Epoch 2/3: 100%|███████████| 5/5 [12:28<00:00, 149.76s/it]
Epoch 3/3: 100%|███████████| 5/5 [12:29<00:00, 149.88s/it]
✅ Training completed!
```

### Step 5: Start Inference Server (30 seconds)

```bash
python3 ml/inference_server.py
```

**You'll see:**
```
🚀 Loading EventHub AI model...
✅ Model loaded successfully!
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Test it:
```bash
curl http://localhost:8000/health
```

### Step 6: Configure EventHub (1 minute)

Create `.env.local`:

```bash
echo "CUSTOM_AI_URL=http://localhost:8000" > .env.local
```

### Step 7: Start EventHub (30 seconds)

```bash
npm run dev
```

Visit http://localhost:3000

### Step 8: Test Custom AI! 🎉

1. Look for the **green sparkles icon** (bottom right)
2. Click to open Custom AI chat
3. Ask: "Show me upcoming tech events"
4. Watch your custom AI respond!

## 🎨 Using the Custom AI

### Chat Interface

The Custom AI appears as a green/teal button with sparkles (⚡) in the bottom right corner.

**Features:**
- Real-time responses from your fine-tuned model
- Specialized EventHub knowledge
- Works offline (no API costs!)
- Fast responses (local GPU)

### Example Questions

Try asking:
- "What events are happening this weekend?"
- "Show me tech conferences in Lagos"
- "How do I book tickets for an event?"
- "Tell me about EventHub's features"

### Custom AI vs Claude Agent

You'll see **two AI buttons**:

| Icon | AI | Purpose |
|------|-----|---------|
| 💜 Purple | Claude 3.5 Sonnet | Complex queries, tools, analytics |
| 💚 Green Sparkles | Custom Llama 3 | Fast, EventHub-specific responses |

**Use Custom AI for:**
- Quick event information
- Booking help
- General EventHub questions

**Use Claude Agent for:**
- Searching events with filters
- Checking ticket availability
- Admin analytics
- Complex multi-step tasks

## 🐛 Troubleshooting

### "CUDA Out of Memory"

**Fix:** Reduce batch size in `ml/config.py`:

```python
TRAINING_CONFIG = {
    "per_device_train_batch_size": 2,  # Changed from 4
    "gradient_accumulation_steps": 8,  # Changed from 4
}
```

### "Model not found"

Make sure training completed successfully:

```bash
ls -lh ml/models/eventhub-llama3/
```

You should see files like `adapter_config.json`, `adapter_model.bin`

### "Inference server not responding"

1. Check if server is running: `curl http://localhost:8000/health`
2. Check server logs for errors
3. Restart the server: `Ctrl+C` then `python3 ml/inference_server.py`

### "Custom AI button shows offline"

This means the inference server isn't running. Start it:

```bash
python3 ml/inference_server.py
```

Or use the convenient script:

```bash
bash ml/start_server.sh
```

## 🔧 Customization

### Add More Training Examples

Edit `ml/prepare_training_data.py`:

```python
def event_discovery_examples(self) -> List[Dict]:
    return [
        {
            "instruction": "Your question here",
            "output": "Your response here"
        },
        # Add more...
    ]
```

Then retrain:

```bash
python3 ml/prepare_training_data.py
python3 ml/train_model.py
```

### Adjust Response Style

Edit the system prompt in `ml/config.py`:

```python
SYSTEM_PROMPT = """You are a friendly EventHub assistant.
Be casual and use emojis! 😊"""
```

### Change Temperature

In `ml/inference_server.py` or via API:

```python
# Lower = more focused, higher = more creative
temperature=0.7  # Default
temperature=0.3  # More focused
temperature=1.0  # More creative
```

## 📊 Performance

### Training Time

| GPU | Time (3 epochs) | Cost |
|-----|----------------|------|
| RTX 4090 | 4-6 hours | $0 (local) |
| A100 40GB | 2-3 hours | ~$3 (cloud) |
| A100 80GB | 1-2 hours | ~$3 (cloud) |

### Inference Speed

| GPU | Tokens/sec | Response Time |
|-----|-----------|---------------|
| RTX 4090 | 40-60 | 3-5 seconds |
| A100 | 80-120 | 1-2 seconds |

## 🎓 Next Steps

### 1. Production Deployment

Use Docker:

```dockerfile
FROM nvidia/cuda:11.8.0-runtime-ubuntu22.04
WORKDIR /app
COPY ml/ /app/ml/
RUN pip install -r ml/requirements.txt
EXPOSE 8000
CMD ["python", "ml/inference_server.py"]
```

### 2. Share Your Model

Push to Hugging Face Hub:

```python
# In ml/train_model.py
trainer.push_to_hub("your-username/eventhub-llama3")
```

### 3. Monitor with W&B

Enable in `ml/config.py`:

```python
USE_WANDB = True
```

### 4. Fine-tune on Real Data

As users interact with your EventHub:
1. Collect real questions and good responses
2. Add to training data
3. Retrain periodically

## 📚 Resources

- **Full Documentation:** [CUSTOM_AI_README.md](../CUSTOM_AI_README.md)
- **Llama 3 Guide:** https://llama.meta.com/llama3/
- **Hugging Face:** https://huggingface.co/docs/transformers/
- **LoRA Paper:** https://arxiv.org/abs/2106.09685

## ✅ Checklist

After following this guide, you should have:

- [ ] Llama 3 model fine-tuned on EventHub data
- [ ] Inference server running on port 8000
- [ ] EventHub app with custom AI integration
- [ ] Green sparkles chat button working
- [ ] Fast, offline AI responses

## 🆘 Need Help?

- Check [CUSTOM_AI_README.md](../CUSTOM_AI_README.md) for detailed docs
- Search [Hugging Face forums](https://discuss.huggingface.co/)
- Open an issue on GitHub

---

**Congratulations!** 🎉 You now have your own custom AI assistant for EventHub!
