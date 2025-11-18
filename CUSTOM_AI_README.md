# EventHub Custom AI - Llama 3 Fine-Tuning Guide

This guide explains how to train and deploy your own custom AI model for EventHub using Llama 3 and Hugging Face.

## 🎯 Overview

EventHub includes a custom-trained Llama 3 model specifically fine-tuned for event discovery, booking assistance, and customer support. This model is trained on EventHub-specific data and provides personalized responses about your events.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Data Preparation](#data-preparation)
- [Model Training](#model-training)
- [Running the Inference Server](#running-the-inference-server)
- [Integration with EventHub](#integration-with-eventhub)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Hardware Requirements

**Minimum (Training):**
- GPU: NVIDIA GPU with at least 16GB VRAM (e.g., RTX 4090, A5000)
- RAM: 32GB system RAM
- Storage: 50GB free space

**Recommended (Training):**
- GPU: NVIDIA A100 (40GB or 80GB)
- RAM: 64GB+ system RAM
- Storage: 100GB+ SSD

**Inference:**
- GPU: NVIDIA GPU with 12GB+ VRAM (e.g., RTX 3080, RTX 4070 Ti)
- RAM: 16GB system RAM

### Software Requirements

- Python 3.10+
- CUDA 11.8+ (for GPU acceleration)
- Node.js 18+ (for EventHub app)
- Git

### Hugging Face Account

You'll need a Hugging Face account and access to Llama 3:

1. Create account at https://huggingface.co/
2. Request access to Llama 3: https://huggingface.co/meta-llama/Meta-Llama-3-8B
3. Generate an access token: https://huggingface.co/settings/tokens

## 📦 Installation

### 1. Install Python Dependencies

```bash
cd ml
pip install -r requirements.txt
```

### 2. Login to Hugging Face

```bash
huggingface-cli login
```

Enter your access token when prompted.

### 3. Verify GPU Access (Optional but Recommended)

```python
import torch
print(f"CUDA available: {torch.cuda.is_available()}")
print(f"GPU: {torch.cuda.get_device_name(0)}")
```

## 📊 Data Preparation

### Step 1: Generate Training Data

The training data preparation script creates EventHub-specific instruction-following examples:

```bash
python ml/prepare_training_data.py
```

This generates:
- `ml/data/eventhub_train.jsonl` - Training dataset
- `ml/data/eventhub_val.jsonl` - Validation dataset

### Step 2: Customize Training Data (Optional)

Edit `ml/prepare_training_data.py` to add more examples specific to your events:

```python
def event_discovery_examples(self) -> List[Dict]:
    return [
        {
            "instruction": "Your custom question",
            "input": "",
            "output": "Your custom response"
        },
        # Add more examples...
    ]
```

### Data Format

The training data uses Llama 3's instruction format:

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

{system_message}<|eot_id|><|start_header_id|>user<|end_header_id|>

{user_message}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

{assistant_response}<|eot_id|>
```

## 🚀 Model Training

### Quick Start (Default Settings)

```bash
python ml/train_model.py
```

This will:
1. Load Llama 3 8B model with 4-bit quantization
2. Configure LoRA for efficient fine-tuning
3. Train on EventHub data for 3 epochs
4. Save the fine-tuned model to `ml/models/eventhub-llama3`

### Training Configuration

The training script uses these default parameters:

```python
TrainingArguments(
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    num_train_epochs=3,
    learning_rate=2e-4,
    fp16=True,
    warmup_ratio=0.1,
    lr_scheduler_type="cosine",
    optim="paged_adamw_8bit",
)
```

### Advanced: Custom Training

Edit `ml/train_model.py` to customize:

```python
trainer = EventHubModelTrainer(
    model_name="meta-llama/Meta-Llama-3-8B",  # Or Llama-3-70B
    output_dir="ml/models/eventhub-llama3",
    use_wandb=True,  # Enable Weights & Biases logging
)
```

### Training Time Estimates

| GPU | Training Time (3 epochs) |
|-----|-------------------------|
| RTX 4090 | ~4-6 hours |
| A100 40GB | ~2-3 hours |
| A100 80GB | ~1-2 hours |

### Monitor Training (Optional)

Enable Weights & Biases for real-time monitoring:

```python
trainer = EventHubModelTrainer(
    use_wandb=True
)
```

View training metrics at https://wandb.ai/

## 🌐 Running the Inference Server

### Start the Server

```bash
python ml/inference_server.py
```

The server will start on `http://localhost:8000`

### API Documentation

Once running, view interactive API docs at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Test the Server

```bash
# Health check
curl http://localhost:8000/health

# Test inference
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Show me tech events in Lagos"}
    ],
    "max_tokens": 200,
    "temperature": 0.7
  }'
```

### Production Deployment

For production, run with Gunicorn:

```bash
pip install gunicorn
gunicorn ml.inference_server:app \
  --workers 2 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

Or use Docker:

```dockerfile
FROM nvidia/cuda:11.8.0-runtime-ubuntu22.04

WORKDIR /app
COPY ml/ /app/ml/
RUN pip install -r ml/requirements.txt

EXPOSE 8000
CMD ["python", "ml/inference_server.py"]
```

## 🔗 Integration with EventHub

### 1. Configure Environment Variables

Create `.env.local`:

```bash
CUSTOM_AI_URL=http://localhost:8000
```

### 2. Start EventHub

```bash
npm run dev
```

### 3. Access Custom AI

The custom AI chat button (green/teal sparkles icon) will appear in the bottom right corner.

## 📚 API Documentation

### Endpoints

#### `POST /generate`

Generate a response from the model.

**Request:**
```json
{
  "messages": [
    {"role": "user", "content": "What events are happening this weekend?"}
  ],
  "max_tokens": 512,
  "temperature": 0.7,
  "top_p": 0.95
}
```

**Response:**
```json
{
  "response": "Here are the exciting events happening this weekend...",
  "model": "eventhub-llama3",
  "tokens_used": 156
}
```

#### `POST /chat`

Simplified chat endpoint.

**Request:**
```json
{
  "messages": [
    {"role": "user", "content": "How do I book tickets?"}
  ]
}
```

**Response:**
```json
{
  "response": "Booking tickets on EventHub is easy! Here's how..."
}
```

#### `GET /health`

Check server and model status.

**Response:**
```json
{
  "status": "healthy",
  "gpu_available": true,
  "gpu_name": "NVIDIA A100-SXM4-40GB"
}
```

## 🛠️ Troubleshooting

### Issue: CUDA Out of Memory

**Solution:** Reduce batch size or use smaller model

```python
# In train_model.py
TrainingArguments(
    per_device_train_batch_size=2,  # Reduce from 4
    gradient_accumulation_steps=8,  # Increase to compensate
)
```

### Issue: Model Takes Too Long to Load

**Solution:** Use 8-bit quantization instead of 4-bit

```python
# In inference_server.py
bnb_config = BitsAndBytesConfig(
    load_in_8bit=True,  # Instead of load_in_4bit
)
```

### Issue: Inference Server Not Responding

**Check:**
1. Server is running: `curl http://localhost:8000/health`
2. Model is loaded: Check server logs
3. Port is not blocked: `lsof -i :8000`

### Issue: Low Quality Responses

**Solutions:**
1. Add more training examples
2. Increase training epochs
3. Adjust temperature (lower = more focused, higher = more creative)

### Issue: Llama 3 Access Denied

**Solution:**
1. Request access at https://huggingface.co/meta-llama/Meta-Llama-3-8B
2. Wait for approval (usually instant to a few hours)
3. Login again: `huggingface-cli login`

## 📈 Performance Optimization

### Inference Speed

**Use Flash Attention 2:**
```bash
pip install flash-attn
```

```python
# In inference_server.py
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    torch_dtype=torch.float16,
    attn_implementation="flash_attention_2",
)
```

### Memory Optimization

**Use 4-bit Quantization:**
```python
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
)
```

### Batch Inference

For multiple requests, use batching:

```python
# Process multiple requests at once
results = text_generator(
    [prompt1, prompt2, prompt3],
    max_new_tokens=200,
    batch_size=3,
)
```

## 🎓 Advanced Topics

### Fine-tuning Llama 3 70B

For better quality, use the larger model:

```python
trainer = EventHubModelTrainer(
    model_name="meta-llama/Meta-Llama-3-70B",
    # Requires A100 80GB or multi-GPU setup
)
```

### Multi-GPU Training

```python
# Automatic multi-GPU with accelerate
accelerate launch ml/train_model.py
```

### Push Model to Hugging Face Hub

```python
# In train_model.py, uncomment:
trainer.push_to_hub("your-username/eventhub-llama3")
```

### Continuous Learning

Retrain periodically with new event data:

```bash
# Add new examples to prepare_training_data.py
# Re-run training
python ml/prepare_training_data.py
python ml/train_model.py
```

## 📊 Comparison: Custom AI vs Claude Agent

| Feature | Custom Llama 3 | Claude 3.5 Sonnet |
|---------|---------------|-------------------|
| **Training** | Fine-tuned on EventHub data | General purpose |
| **Cost** | Free (after training) | Pay per token |
| **Speed** | Fast (local GPU) | Network latency |
| **Customization** | Fully customizable | Prompt engineering only |
| **Quality** | EventHub-specific | Superior general intelligence |
| **Tools** | ❌ No | ✅ Yes (search, analytics, etc.) |

**Recommendation:** Use both! Custom AI for simple queries, Claude for complex tasks requiring tools.

## 🆘 Support

- **Issues:** https://github.com/yourusername/eventhub/issues
- **Discussions:** https://github.com/yourusername/eventhub/discussions
- **Hugging Face Forum:** https://discuss.huggingface.co/

## 📝 License

This implementation uses:
- Llama 3: [Meta Llama 3 License](https://llama.meta.com/llama3/license/)
- EventHub: MIT License

## 🙏 Acknowledgments

- Meta AI for Llama 3
- Hugging Face for transformers and PEFT
- Tim Dettmers for bitsandbytes and QLoRA

---

**Need help?** Check the [troubleshooting section](#troubleshooting) or open an issue!
