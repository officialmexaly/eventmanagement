# 🚀 Train EventHub AI on Google Colab - Ultra Quick Guide

Train your custom Llama 3 model using **free Google Colab GPU** in just 5 steps!

## 📋 What You Need

- Google account (free)
- Hugging Face account with Llama 3 access ([get it here](https://huggingface.co/meta-llama/Meta-Llama-3-8B))
- 2-3 hours for training
- 4 GB free space for download

## 🎯 5 Simple Steps

### Step 1: Open Notebook in Colab (2 minutes)

1. Go to https://colab.research.google.com/
2. Click **File** → **Upload notebook**
3. Upload `ml/EventHub_Llama3_Training.ipynb` from your project

### Step 2: Enable GPU (1 minute)

⚡ **CRITICAL:** Without this, training won't work!

1. Click **Runtime** → **Change runtime type**
2. Select **T4 GPU** from dropdown
3. Click **Save**

### Step 3: Run Training (2-3 hours)

1. Click **Runtime** → **Run all**
2. When prompted, enter your Hugging Face token
   - Get it from: https://huggingface.co/settings/tokens
3. Wait for training to complete (go grab coffee ☕)

**What happens automatically:**
- ✅ Installs dependencies (10 min)
- ✅ Downloads Llama 3 model (10 min)
- ✅ Generates training data (1 min)
- ✅ Trains for 3 epochs (2-3 hours)
- ✅ Saves and packages model (5 min)

### Step 4: Download Model (5 minutes)

**Method 1 (Recommended):**
1. Click 📁 **Files** icon in left sidebar
2. Find `eventhub-llama3-model.zip` (3-4 GB)
3. Right-click → **Download**

**Method 2 (Google Drive):**
1. Run the "Save to Drive" cell in notebook
2. Download from Google Drive later

### Step 5: Setup Model Locally (2 minutes)

```bash
# Move downloaded zip to your project folder
cd ~/eventmanagement

# Run setup script
bash ml/setup_colab_model.sh

# Start inference server
python3 ml/inference_server.py

# In another terminal, start EventHub
npm run dev
```

**That's it!** 🎉

---

## 📊 Training Progress

You'll see something like this:

```
Epoch 1/3: 100% |████████████| 5/5 [45:23<00:00]
Epoch 2/3: 100% |████████████| 5/5 [44:58<00:00]
Epoch 3/3: 100% |████████████| 5/5 [45:12<00:00]

✅ Training completed!
✅ Model saved!
```

**Total time: ~2.5-3.5 hours**

---

## 🎨 Using Your Model

After setup, look for the **green sparkles icon** (⚡) in your EventHub app!

Try asking:
- "Show me tech events in Lagos"
- "How do I book tickets?"
- "What's happening this weekend?"

---

## 🐛 Common Issues

### "No GPU Found"
**Fix:** Runtime → Change runtime type → Select T4 GPU

### "CUDA Setup Failed" or "bitsandbytes error"
**Fix:** The notebook now automatically handles CUDA 12.x compatibility. If you still see errors:
1. Click **Runtime** → **Restart runtime**
2. Re-run the dependency installation cell
3. The notebook will rebuild bitsandbytes for your CUDA version

### "Llama 3 Access Denied"
**Fix:** Request access at https://huggingface.co/meta-llama/Meta-Llama-3-8B

### "Colab Disconnected"
**Fix:** Keep the tab active, don't close it during training

---

## 📚 Need More Details?

- **Full Colab Guide:** `ml/COLAB_TRAINING_GUIDE.md`
- **Complete Docs:** `CUSTOM_AI_README.md`
- **ML Overview:** `ml/README.md`

---

## 💰 Cost Breakdown

| Item | Cost |
|------|------|
| Google Colab (Free Tier) | $0 |
| Training (2-3 hours) | $0 |
| Inference (Forever) | $0 |
| **Total** | **$0** 🎉 |

Compare to Claude API:
- **Claude:** ~$0.003 per 1K tokens
- **Your Model:** Free forever after training!

---

## ✅ Quick Checklist

Before starting:

- [ ] Have Google account
- [ ] Have Hugging Face account
- [ ] Requested Llama 3 access
- [ ] Have HF token ready
- [ ] Uploaded notebook to Colab
- [ ] Enabled T4 GPU runtime
- [ ] Have 2-3 hours available
- [ ] Have 4+ GB space for download

---

## 🎯 What You'll Get

After training:

✅ Custom Llama 3 model trained for EventHub

✅ Specialized in event discovery and booking

✅ Fast responses (1-5 seconds)

✅ Free inference forever

✅ Fully customizable

✅ Production-ready

---

## 🚀 Ready to Start?

1. **Open:** `ml/EventHub_Llama3_Training.ipynb` in Google Colab
2. **Enable:** T4 GPU runtime
3. **Run:** All cells
4. **Wait:** 2-3 hours
5. **Download:** Your trained model
6. **Deploy:** To your EventHub app

**Let's build your custom AI! 🎉**

---

**Questions?** See the full guide: `ml/COLAB_TRAINING_GUIDE.md`
