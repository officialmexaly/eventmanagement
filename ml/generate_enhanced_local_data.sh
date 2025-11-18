#!/bin/bash

# Enhanced local data generation (generates 200+ examples)

set -e

echo "========================================"
echo "🚀 EventHub Enhanced Data Generator"
echo "========================================"
echo ""
echo "Generating 200+ training examples..."
echo "100% FREE - No API keys needed!"
echo ""

# Run the enhanced generator
python3 ml/generate_local_data.py

echo ""
echo "✅ Generation complete!"
echo ""
echo "📁 Files created:"
ls -lh ml/data/*.jsonl ml/data/*.json
echo ""
echo "🔍 Quick review:"
echo ""
cat ml/data/raw_examples.json | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'Total examples: {len(data)}'); [print(f\"  - {ex['instruction'][:50]}...\") for ex in data[:5]]"
echo ""
echo "🎯 Ready to train!"
echo "  Local: python ml/train_model.py"
echo "  Colab: Upload ml/EventHub_Llama3_Training.ipynb"
echo ""
