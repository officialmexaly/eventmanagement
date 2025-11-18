#!/bin/bash

# EventHub Custom AI Training Script
# This script prepares data and trains the Llama 3 model

set -e  # Exit on error

echo "========================================"
echo "🚀 EventHub Custom AI Training Pipeline"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "ml/requirements.txt" ]; then
    echo "❌ Error: Please run this script from the EventHub root directory"
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo "✅ Python version: $PYTHON_VERSION"

# Check CUDA availability
if python3 -c "import torch; print('CUDA' if torch.cuda.is_available() else 'CPU')" 2>/dev/null | grep -q "CUDA"; then
    GPU_NAME=$(python3 -c "import torch; print(torch.cuda.get_device_name(0))" 2>/dev/null)
    echo "✅ GPU Available: $GPU_NAME"
else
    echo "⚠️  No GPU detected. Training will be very slow!"
    read -p "Continue without GPU? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "========================================"
echo "📦 Step 1: Installing Dependencies"
echo "========================================"
echo ""

pip install -r ml/requirements.txt

echo ""
echo "========================================"
echo "🔑 Step 2: Hugging Face Login"
echo "========================================"
echo ""

# Check if already logged in
if huggingface-cli whoami &> /dev/null; then
    USERNAME=$(huggingface-cli whoami | head -n 1)
    echo "✅ Already logged in as: $USERNAME"
else
    echo "Please login to Hugging Face:"
    huggingface-cli login
fi

echo ""
echo "========================================"
echo "📊 Step 3: Preparing Training Data"
echo "========================================"
echo ""

python3 ml/prepare_training_data.py

if [ ! -f "ml/data/eventhub_train.jsonl" ]; then
    echo "❌ Error: Training data not generated"
    exit 1
fi

TRAIN_EXAMPLES=$(wc -l < ml/data/eventhub_train.jsonl)
VAL_EXAMPLES=$(wc -l < ml/data/eventhub_val.jsonl)
echo "✅ Training examples: $TRAIN_EXAMPLES"
echo "✅ Validation examples: $VAL_EXAMPLES"

echo ""
echo "========================================"
echo "🎯 Step 4: Training Model"
echo "========================================"
echo ""

# Ask for confirmation
read -p "Start training? This may take several hours. (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Training cancelled."
    exit 0
fi

# Start training
python3 ml/train_model.py

echo ""
echo "========================================"
echo "✅ Training Complete!"
echo "========================================"
echo ""
echo "📁 Model saved at: ml/models/eventhub-llama3"
echo ""
echo "Next steps:"
echo "  1. Test the model:"
echo "     python3 ml/inference_server.py"
echo ""
echo "  2. Start EventHub with custom AI:"
echo "     npm run dev"
echo ""
echo "  3. Look for the green sparkles icon in the app!"
echo ""
