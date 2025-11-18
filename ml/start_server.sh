#!/bin/bash

# EventHub Custom AI Inference Server Startup Script

set -e  # Exit on error

echo "========================================"
echo "🌐 EventHub Custom AI Inference Server"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "ml/inference_server.py" ]; then
    echo "❌ Error: Please run this script from the EventHub root directory"
    exit 1
fi

# Check if model exists
if [ ! -d "ml/models/eventhub-llama3" ]; then
    echo "❌ Error: Model not found at ml/models/eventhub-llama3"
    echo ""
    echo "Please train the model first:"
    echo "  bash ml/train.sh"
    exit 1
fi

# Check CUDA availability
if python3 -c "import torch; print('CUDA' if torch.cuda.is_available() else 'CPU')" 2>/dev/null | grep -q "CUDA"; then
    GPU_NAME=$(python3 -c "import torch; print(torch.cuda.get_device_name(0))" 2>/dev/null)
    echo "✅ GPU Available: $GPU_NAME"
else
    echo "⚠️  No GPU detected. Inference will be slower."
fi

echo ""
echo "🔧 Configuration:"
echo "  Model: ml/models/eventhub-llama3"
echo "  Host: 0.0.0.0"
echo "  Port: 8000"
echo ""
echo "📝 API Documentation will be available at:"
echo "  http://localhost:8000/docs"
echo ""
echo "🚀 Starting server..."
echo ""

# Set environment variable for model path
export MODEL_PATH=ml/models/eventhub-llama3

# Start the server
python3 ml/inference_server.py
