# 🚀 Train EventHub AI on Google Colab (Free GPU!)

Train your custom Llama 3 model for EventHub using Google Colab's **free T4 GPU**. No local GPU needed!

## 🎯 Quick Start

1. **Open the Notebook**
   - Upload `ml/EventHub_Llama3_Training.ipynb` to Google Colab
   - Or: Click this link → [Open in Colab](#) *(you'll need to upload the file)*

2. **Enable GPU Runtime** ⚡
   - Click `Runtime` → `Change runtime type`
   - Select **T4 GPU** (free tier)
   - Click **Save**

3. **Run All Cells**
   - Click `Runtime` → `Run all`
   - Enter your Hugging Face token when prompted
   - Wait 2-3 hours for training

4. **Download Your Model**
   - Find `eventhub-llama3-model.zip` in the Files panel
   - Right-click → Download
   - Extract and use with your EventHub app!

---

## 📋 Prerequisites

### 1. Google Account
You need a Google account to use Colab. It's free!

### 2. Hugging Face Account
1. Sign up at https://huggingface.co/
2. Request Llama 3 access: https://huggingface.co/meta-llama/Meta-Llama-3-8B
3. Wait for approval (usually instant to a few hours)
4. Get your token: https://huggingface.co/settings/tokens

### 3. EventHub Training Notebook
The file is already in your project: `ml/EventHub_Llama3_Training.ipynb`

---

## 🔧 Detailed Setup Steps

### Step 1: Upload Notebook to Colab

**Option A: Direct Upload**
1. Go to https://colab.research.google.com/
2. Click **File** → **Upload notebook**
3. Choose `ml/EventHub_Llama3_Training.ipynb`

**Option B: Via Google Drive**
1. Upload notebook to your Google Drive
2. Right-click the file
3. Select **Open with** → **Google Colaboratory**

### Step 2: Enable GPU Runtime

⚠️ **CRITICAL STEP** - Without GPU, training won't work!

1. In Colab, click **Runtime** → **Change runtime type**
2. Under **Hardware accelerator**, select **T4 GPU**
3. Click **Save**

To verify GPU is enabled:
- Run the first code cell
- You should see: `✅ GPU: Tesla T4`

### Step 3: Get Hugging Face Token

1. Go to https://huggingface.co/settings/tokens
2. Click **New token**
3. Name it: "EventHub Training"
4. Type: **Read**
5. Click **Generate token**
6. Copy the token (starts with `hf_...`)

**💡 Pro Tip:** Save token to Colab secrets for reuse:
1. Click 🔑 icon (Secrets) in left sidebar
2. Add new secret: `HF_TOKEN`
3. Paste your token
4. Enable "Notebook access"

### Step 4: Run the Training

1. Click **Runtime** → **Run all**
2. When prompted, paste your Hugging Face token
3. Training starts automatically!

**What happens:**
- ⏱️ **10 min:** Install dependencies
- ⏱️ **10 min:** Download Llama 3 model (~16 GB)
- ⏱️ **2-3 hours:** Training (3 epochs)
- ⏱️ **5 min:** Save and package model

**Total time: ~2.5-3.5 hours**

### Step 5: Monitor Training

You'll see real-time updates:
```
Epoch 1/3: 100% |████████████| 5/5 [45:23<00:00, 544.76s/it]
Epoch 2/3: 100% |████████████| 5/5 [44:58<00:00, 539.68s/it]
Epoch 3/3: 100% |████████████| 5/5 [45:12<00:00, 542.42s/it]
```

### Step 6: Download Your Model

**Method 1: Direct Download (Recommended)**
1. Click 📁 **Files** icon in left sidebar
2. Find `eventhub-llama3-model.zip` (3-4 GB)
3. Right-click → **Download**

**Method 2: Save to Google Drive**
1. Run the "Save to Drive" cell in the notebook
2. Download from Google Drive on any device
3. File location: `My Drive/eventhub-llama3-model.zip`

---

## 💻 Using Your Trained Model Locally

### Step 1: Extract the Model

```bash
# Navigate to your project
cd ~/eventmanagement

# Extract the downloaded zip
unzip ~/Downloads/eventhub-llama3-model.zip

# Move to correct location
mv eventhub-llama3-final ml/models/eventhub-llama3
```

### Step 2: Verify Model Files

```bash
ls -lh ml/models/eventhub-llama3/

# You should see:
# adapter_config.json
# adapter_model.bin
# tokenizer.json
# tokenizer_config.json
# special_tokens_map.json
```

### Step 3: Start Inference Server

```bash
# Install Python dependencies (if not already)
pip install -r ml/requirements.txt

# Start the inference server
python3 ml/inference_server.py
```

You should see:
```
🚀 Loading EventHub AI model...
✅ Model loaded successfully!
INFO: Uvicorn running on http://0.0.0.0:8000
```

### Step 4: Configure EventHub

```bash
# Create environment file
echo "CUSTOM_AI_URL=http://localhost:8000" > .env.local
```

### Step 5: Start EventHub

```bash
npm run dev
```

Visit http://localhost:3000 and look for the **green sparkles icon** (⚡)!

---

## 📊 What to Expect

### Training Progress

**Phase 1: Setup (0-20 min)**
- Installing dependencies
- Logging into Hugging Face
- Generating training data
- Downloading Llama 3 model

**Phase 2: Model Loading (20-30 min)**
- Loading model with 4-bit quantization
- Configuring LoRA
- Preparing datasets

**Phase 3: Training (30 min - 3.5 hours)**
- Epoch 1: ~45 minutes
- Epoch 2: ~45 minutes
- Epoch 3: ~45 minutes

**Phase 4: Saving (3.5-4 hours)**
- Saving fine-tuned weights
- Creating zip file

### GPU Usage

```
T4 GPU Specs:
- VRAM: 16 GB
- Memory Used: ~14 GB
- Memory Free: ~2 GB
- Utilization: 95-100%
```

### Expected Outputs

**Training Metrics:**
```
Epoch 1: loss=1.234, eval_loss=1.456
Epoch 2: loss=0.987, eval_loss=1.123
Epoch 3: loss=0.765, eval_loss=0.987
```

Loss should decrease over epochs!

**Model Size:**
```
Compressed: 3-4 GB (eventhub-llama3-model.zip)
Extracted: 3.5-4.5 GB (adapter files)
```

---

## 🐛 Troubleshooting

### Issue: "No GPU Available"

**Symptoms:**
```
❌ CUDA available: False
❌ No GPU found!
```

**Solution:**
1. Stop the notebook: `Runtime` → `Disconnect and delete runtime`
2. Change runtime: `Runtime` → `Change runtime type`
3. Select **T4 GPU**
4. Run the first cell again

### Issue: "Llama 3 Access Denied"

**Symptoms:**
```
HTTPError: 401 Client Error: Unauthorized
```

**Solution:**
1. Make sure you requested access: https://huggingface.co/meta-llama/Meta-Llama-3-8B
2. Wait for approval (check your email)
3. Generate a new token: https://huggingface.co/settings/tokens
4. Re-run the login cell with the new token

### Issue: "CUDA Out of Memory"

**Symptoms:**
```
RuntimeError: CUDA out of memory
```

**Solution:**
1. Restart runtime: `Runtime` → `Disconnect and delete runtime`
2. Change runtime type again (sometimes helps clear memory)
3. Try with smaller batch size (edit the training cell):
   ```python
   per_device_train_batch_size=2,  # Changed from 4
   gradient_accumulation_steps=8,  # Changed from 4
   ```

### Issue: "Colab Disconnected"

**Symptoms:**
Training stops, "Reconnect" button appears

**Solutions:**
- Keep the Colab tab active (don't close it)
- Disable browser sleep/power saving
- Run this in a cell to prevent disconnect:
  ```python
  import time
  while True:
      time.sleep(60)
      print(".", end="", flush=True)
  ```
- Use Colab Pro ($10/month) for longer runtimes

### Issue: "Download Failed"

**Symptoms:**
Zip file download interrupts or fails

**Solutions:**
1. Use the Google Drive method instead
2. Try again during off-peak hours
3. Split download using `split` command:
   ```bash
   !split -b 1000M eventhub-llama3-model.zip eventhub-part-
   ```
   Then download parts separately

### Issue: "Training Too Slow"

**Check GPU usage:**
```python
!nvidia-smi
```

**If GPU utilization < 80%:**
- Increase batch size: `per_device_train_batch_size=6`
- Reduce gradient accumulation: `gradient_accumulation_steps=2`

---

## ⚡ Tips for Faster Training

### 1. Use Colab Pro
- **Cost:** $10/month
- **Benefits:**
  - Longer runtimes (no 12-hour limit)
  - Better GPUs (P100, V100)
  - Faster model download
  - Background execution

### 2. Optimize Training Config

**In the training cell, adjust these:**

```python
# Faster but slightly lower quality
num_train_epochs=2,  # Instead of 3
per_device_train_batch_size=6,  # Instead of 4
gradient_accumulation_steps=2,  # Instead of 4

# Or: Higher quality but slower
num_train_epochs=5,  # More epochs
learning_rate=1e-4,  # Lower learning rate
```

### 3. Monitor and Adjust

Watch the loss values:
- **If loss not decreasing:** Increase learning rate
- **If loss unstable:** Decrease learning rate or batch size
- **If training too slow:** Increase batch size

### 4. Save Checkpoints

The notebook saves checkpoints after each epoch. If training interrupts, you can resume!

---

## 📈 Comparison: Colab vs Local Training

| Aspect | Google Colab (Free) | Google Colab Pro | Local GPU (RTX 4090) |
|--------|---------------------|------------------|---------------------|
| **Cost** | Free | $10/month | $1,600+ (one-time) |
| **GPU** | T4 (16GB) | P100/V100 | RTX 4090 (24GB) |
| **Training Time** | 2.5-3 hours | 1.5-2 hours | 1-1.5 hours |
| **Session Limit** | 12 hours | 24 hours | Unlimited |
| **Internet Required** | Yes | Yes | Only for download |
| **Best For** | First training | Regular retraining | Production |

---

## 🎓 Advanced: Customizing Training

### Add More Training Examples

Before running the training, modify the data generation cell:

```python
def event_discovery_examples(self) -> List[Dict]:
    return [
        # Add your examples here
        {
            "instruction": "Your custom question",
            "output": "Your custom response"
        },
        # ... existing examples
    ]
```

### Change Training Parameters

```python
training_args = TrainingArguments(
    # Experiment with these:
    num_train_epochs=5,          # More training
    learning_rate=1e-4,          # Lower = more stable
    per_device_train_batch_size=8,  # Bigger = faster (if enough VRAM)
    warmup_ratio=0.2,            # Longer warmup
    weight_decay=0.01,           # Regularization
)
```

### Use Different Model Sizes

```python
# Llama 3 70B (requires Colab Pro with A100)
model_name = "meta-llama/Meta-Llama-3-70B"

# Llama 3 8B (default, works on free tier)
model_name = "meta-llama/Meta-Llama-3-8B"
```

### Enable Weights & Biases Logging

```python
!pip install wandb
import wandb

wandb.login()

training_args = TrainingArguments(
    # ... other args
    report_to="wandb",
)
```

---

## 🎯 Checklist

Before starting training, make sure:

- [ ] Uploaded notebook to Colab
- [ ] Enabled T4 GPU runtime
- [ ] Have Hugging Face account
- [ ] Requested Llama 3 access
- [ ] Have HF token ready
- [ ] Understand the 2-3 hour training time
- [ ] Won't close Colab tab during training
- [ ] Have stable internet connection
- [ ] Have 4+ GB free space for download

---

## 📚 Resources

- **Notebook:** `ml/EventHub_Llama3_Training.ipynb`
- **Google Colab:** https://colab.research.google.com/
- **Hugging Face:** https://huggingface.co/
- **Llama 3:** https://huggingface.co/meta-llama/Meta-Llama-3-8B
- **EventHub Docs:** `CUSTOM_AI_README.md`

---

## 🎉 Success!

After training completes, you'll have:

✅ **Custom Llama 3 model** trained on EventHub data

✅ **3-4 GB model file** ready to download

✅ **Test results** showing model quality

✅ **Production-ready AI** for your app

✅ **Zero API costs** forever!

---

## 💡 What's Next?

1. **Deploy locally** (see steps above)
2. **Test with real users** in your EventHub app
3. **Collect feedback** on response quality
4. **Retrain periodically** with new examples
5. **Share your model** on Hugging Face Hub (optional)

---

**Questions?** Check the main docs in `CUSTOM_AI_README.md` or open an issue!

**Happy Training! 🚀**
