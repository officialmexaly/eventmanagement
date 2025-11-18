#!/bin/bash

# Setup script for model trained on Google Colab
# This extracts and configures the model for use with EventHub

set -e

echo "========================================"
echo "🎯 EventHub Colab Model Setup"
echo "========================================"
echo ""

# Check if zip file exists
if [ ! -f "eventhub-llama3-model.zip" ]; then
    echo "❌ Error: eventhub-llama3-model.zip not found!"
    echo ""
    echo "Please:"
    echo "  1. Download the model from Google Colab"
    echo "  2. Place it in the current directory"
    echo "  3. Run this script again"
    echo ""
    exit 1
fi

echo "✅ Found model zip file"
echo ""

# Get file size
SIZE=$(du -h eventhub-llama3-model.zip | cut -f1)
echo "📦 File size: $SIZE"
echo ""

# Create models directory
echo "📁 Creating models directory..."
mkdir -p ml/models
echo ""

# Extract
echo "📦 Extracting model... (this may take a few minutes)"
unzip -q eventhub-llama3-model.zip

# Move to correct location
echo "📂 Moving to ml/models/eventhub-llama3..."
if [ -d "ml/models/eventhub-llama3" ]; then
    echo "⚠️  Directory already exists. Backing up..."
    mv ml/models/eventhub-llama3 ml/models/eventhub-llama3.backup.$(date +%s)
fi

mv eventhub-llama3-final ml/models/eventhub-llama3
echo ""

# Verify files
echo "🔍 Verifying model files..."
REQUIRED_FILES=(
    "ml/models/eventhub-llama3/adapter_config.json"
    "ml/models/eventhub-llama3/adapter_model.bin"
)

ALL_GOOD=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (missing!)"
        ALL_GOOD=false
    fi
done
echo ""

if [ "$ALL_GOOD" = false ]; then
    echo "❌ Some required files are missing!"
    echo "Please check your model download and try again."
    exit 1
fi

# List all model files
echo "📋 Model contents:"
ls -lh ml/models/eventhub-llama3/
echo ""

# Check Python dependencies
echo "🔍 Checking Python dependencies..."
if python3 -c "import torch, transformers, peft" 2>/dev/null; then
    echo "  ✅ All Python packages installed"
else
    echo "  ⚠️  Some packages missing"
    echo ""
    echo "📦 Installing required packages..."
    pip install -q torch transformers accelerate peft bitsandbytes
    echo "  ✅ Packages installed"
fi
echo ""

# Create/update .env.local
echo "⚙️  Configuring environment..."
if [ ! -f ".env.local" ]; then
    echo "CUSTOM_AI_URL=http://localhost:8000" > .env.local
    echo "  ✅ Created .env.local"
else
    if ! grep -q "CUSTOM_AI_URL" .env.local; then
        echo "CUSTOM_AI_URL=http://localhost:8000" >> .env.local
        echo "  ✅ Updated .env.local"
    else
        echo "  ✅ .env.local already configured"
    fi
fi
echo ""

# Success message
echo "========================================"
echo "✅ Model Setup Complete!"
echo "========================================"
echo ""
echo "📁 Model location: ml/models/eventhub-llama3"
echo ""
echo "🚀 Next steps:"
echo ""
echo "  1. Start the inference server:"
echo "     python3 ml/inference_server.py"
echo ""
echo "  2. In another terminal, start EventHub:"
echo "     npm run dev"
echo ""
echo "  3. Open http://localhost:3000"
echo ""
echo "  4. Look for the green sparkles icon (⚡)!"
echo ""
echo "========================================"
echo ""

# Ask if user wants to start server
read -p "Start inference server now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting inference server..."
    echo ""
    python3 ml/inference_server.py
fi
