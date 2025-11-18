# EventHub Custom AI - ML Directory

This directory contains everything needed to train and deploy your custom Llama 3 model for EventHub.

## 📁 Directory Structure

```
ml/
├── README.md                    # This file
├── QUICKSTART.md               # Quick start guide (start here!)
├── requirements.txt            # Python dependencies
├── config.py                   # Configuration settings
│
├── prepare_training_data.py   # Generate training dataset
├── train_model.py             # Fine-tune Llama 3 model
├── inference_server.py        # FastAPI inference server
│
├── train.sh                   # Training script (one command)
├── start_server.sh            # Start inference server
│
├── data/                      # Training data (generated)
│   ├── eventhub_train.jsonl
│   └── eventhub_val.jsonl
│
└── models/                    # Trained models (generated)
    └── eventhub-llama3/
        ├── adapter_config.json
        ├── adapter_model.bin
        └── ...
```

## 🚀 Quick Start

**New to this?** Start with [QUICKSTART.md](QUICKSTART.md)

**Already know what you're doing?**

```bash
# Train
bash ml/train.sh

# Serve
bash ml/start_server.sh
```

## 📄 File Descriptions

### Core Scripts

#### `prepare_training_data.py`

Generates EventHub-specific training data in Llama 3 instruction format.

**What it does:**
- Creates 20+ instruction-following examples
- Covers: event discovery, booking, support, general knowledge
- Outputs: `data/eventhub_train.jsonl`, `data/eventhub_val.jsonl`

**Run it:**
```bash
python3 ml/prepare_training_data.py
```

**Customize it:**
Add more examples for your specific events and use cases.

---

#### `train_model.py`

Fine-tunes Llama 3 on EventHub data using LoRA/QLoRA.

**What it does:**
- Downloads Llama 3 8B (~16GB)
- Applies 4-bit quantization (saves memory)
- Trains with LoRA (parameter-efficient)
- Saves model to `models/eventhub-llama3/`

**Run it:**
```bash
python3 ml/train_model.py
```

**Requirements:**
- GPU with 16GB+ VRAM
- Hugging Face account with Llama 3 access
- 2-6 hours training time

---

#### `inference_server.py`

FastAPI server for model inference.

**What it does:**
- Loads fine-tuned model
- Provides REST API endpoints
- Handles text generation
- Includes health checks

**Run it:**
```bash
python3 ml/inference_server.py
```

**Endpoints:**
- `GET /` - Health check
- `GET /health` - Detailed status
- `POST /generate` - Generate response
- `POST /chat` - Simplified chat
- `GET /docs` - API documentation

---

### Configuration

#### `config.py`

Centralized configuration for training and inference.

**What you can configure:**
- Model selection (8B or 70B)
- Training hyperparameters
- LoRA settings
- Inference parameters
- W&B logging
- And more...

**Example:**
```python
# Reduce batch size if OOM
TRAINING_CONFIG = {
    "per_device_train_batch_size": 2,
    "gradient_accumulation_steps": 8,
}
```

---

### Convenience Scripts

#### `train.sh`

One-command training pipeline.

**What it does:**
1. Checks prerequisites (Python, CUDA)
2. Installs dependencies
3. Verifies Hugging Face login
4. Prepares training data
5. Trains model
6. Shows next steps

**Run it:**
```bash
bash ml/train.sh
```

---

#### `start_server.sh`

One-command server startup.

**What it does:**
1. Checks if model exists
2. Verifies GPU availability
3. Sets environment variables
4. Starts inference server

**Run it:**
```bash
bash ml/start_server.sh
```

---

### Dependencies

#### `requirements.txt`

All Python packages needed for training and inference.

**Key packages:**
- `transformers` - Hugging Face models
- `torch` - PyTorch framework
- `accelerate` - Distributed training
- `peft` - LoRA implementation
- `bitsandbytes` - Quantization
- `fastapi` - API server
- `datasets` - Data loading

**Install:**
```bash
pip install -r ml/requirements.txt
```

---

## 🎯 Typical Workflow

### First Time Setup

```bash
# 1. Install dependencies
cd ml
pip install -r requirements.txt

# 2. Login to Hugging Face
huggingface-cli login

# 3. Prepare training data
python3 prepare_training_data.py

# 4. Train model (takes 2-6 hours)
python3 train_model.py

# 5. Start inference server
python3 inference_server.py
```

### Retraining with New Data

```bash
# 1. Edit prepare_training_data.py (add examples)

# 2. Regenerate data
python3 prepare_training_data.py

# 3. Retrain model
python3 train_model.py

# 4. Restart server
# Ctrl+C to stop, then:
python3 inference_server.py
```

### Daily Use

```bash
# Just start the server
bash ml/start_server.sh

# Or manually
python3 ml/inference_server.py
```

## 🔧 Customization Guide

### Add Training Examples

**File:** `prepare_training_data.py`

```python
def event_discovery_examples(self) -> List[Dict]:
    return [
        {
            "instruction": "Find jazz concerts",
            "output": "Here are upcoming jazz concerts..."
        },
        # Add yours here
    ]
```

### Change Model Size

**File:** `config.py`

```python
# Use larger model (requires more GPU memory)
BASE_MODEL = "meta-llama/Meta-Llama-3-70B"
```

### Adjust Training

**File:** `config.py`

```python
TRAINING_CONFIG = {
    "num_train_epochs": 5,  # More epochs
    "learning_rate": 1e-4,  # Lower learning rate
    # ... other params
}
```

### Modify Response Style

**File:** `config.py`

```python
SYSTEM_PROMPT = """You are a helpful EventHub assistant.
Be professional and concise."""
```

## 📊 Expected Results

### Training

```
🚀 EventHub Llama 3 Fine-Tuning Pipeline
===============================================================================
✅ GPU Available: NVIDIA RTX 4090
   Memory: 24.00 GB

🔄 Loading model and tokenizer...
✅ Model and tokenizer loaded successfully!

🔧 Configuring LoRA...
✅ LoRA configured!
   Trainable params: 85,164,032 (0.52%)
   Total params: 8,030,261,248

📂 Loading training data from ml/data...
✅ Dataset loaded!
   Training examples: 18
   Validation examples: 2

🚀 Starting fine-tuning...

Epoch 1/3: 100%|███████████| 5/5 [12:30<00:00]
Epoch 2/3: 100%|███████████| 5/5 [12:28<00:00]
Epoch 3/3: 100%|███████████| 5/5 [12:29<00:00]

✅ Training completed!
💾 Saving model to ml/models/eventhub-llama3...
✅ Model saved successfully!
```

### Inference

```
🌐 EventHub Custom AI Inference Server
===============================================================================
🚀 Loading EventHub AI model...
✅ Model loaded successfully!

INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### API Response

```bash
$ curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Show me tech events"}]}'

{
  "response": "I found several exciting tech events for you:\n\n1. **Tech Conference 2025** (Dec 15, 2025)\n   - Location: Lagos Convention Center\n   - Price: ₦15,000\n   - Featuring industry leaders and breakthrough innovations..."
}
```

## 🐛 Common Issues

### Issue: "CUDA out of memory"

**Solution:** Reduce batch size in `config.py`

```python
TRAINING_CONFIG = {
    "per_device_train_batch_size": 2,  # Smaller
    "gradient_accumulation_steps": 8,  # Larger to compensate
}
```

### Issue: "Model not found"

**Solution:** Make sure training completed successfully

```bash
ls -lh ml/models/eventhub-llama3/
```

### Issue: "Access denied to Llama 3"

**Solution:**
1. Request access: https://huggingface.co/meta-llama/Meta-Llama-3-8B
2. Wait for approval
3. Login: `huggingface-cli login`

### Issue: "Server won't start"

**Solution:**
```bash
# Check if port is in use
lsof -i :8000

# Kill process if needed
kill -9 <PID>

# Restart server
python3 ml/inference_server.py
```

## 📚 Documentation

- **Quick Start:** [QUICKSTART.md](QUICKSTART.md) - Start here!
- **Full Guide:** [../CUSTOM_AI_README.md](../CUSTOM_AI_README.md) - Comprehensive documentation
- **Configuration:** [config.py](config.py) - All settings explained

## 🔗 External Resources

- [Llama 3 Model Card](https://huggingface.co/meta-llama/Meta-Llama-3-8B)
- [Hugging Face Transformers](https://huggingface.co/docs/transformers/)
- [PEFT Documentation](https://huggingface.co/docs/peft/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## 💡 Tips

### Speed Up Training

1. **Use flash attention:**
   ```bash
   pip install flash-attn
   ```
   Set in `config.py`: `USE_FLASH_ATTENTION = True`

2. **Use multiple GPUs:**
   ```bash
   accelerate launch ml/train_model.py
   ```

3. **Reduce sequence length:**
   ```python
   MAX_SEQ_LENGTH = 1024  # Instead of 2048
   ```

### Improve Quality

1. **Add more training examples**
2. **Train for more epochs**
3. **Use the 70B model** (if you have enough GPU memory)
4. **Fine-tune on your actual event data**

### Save Costs

1. **Train locally** instead of cloud (one-time cost)
2. **Use the smallest model** that meets your needs (8B)
3. **Share your model** on Hugging Face Hub for backups

## 🎓 Learning Resources

### Understand LoRA

LoRA (Low-Rank Adaptation) is a technique that:
- Only trains 0.5% of the model parameters
- Reduces GPU memory requirements by 3-4x
- Trains 2-3x faster than full fine-tuning
- Achieves comparable results

### Understand Quantization

Quantization reduces model size:
- **4-bit:** 4x smaller, minimal quality loss
- **8-bit:** 2x smaller, negligible quality loss
- Allows training large models on consumer GPUs

## 🤝 Contributing

To improve the EventHub custom AI:

1. Add more diverse training examples
2. Test different hyperparameters
3. Share your findings
4. Report issues

## 📄 License

- Llama 3: [Meta Llama 3 License](https://llama.meta.com/llama3/license/)
- EventHub: MIT License

---

**Ready to get started?** → [QUICKSTART.md](QUICKSTART.md)

**Need detailed docs?** → [CUSTOM_AI_README.md](../CUSTOM_AI_README.md)

**Questions?** → Open an issue on GitHub
