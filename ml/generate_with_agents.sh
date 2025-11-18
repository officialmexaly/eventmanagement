#!/bin/bash

# Convenient wrapper script for generating training data with AI agents

set -e

echo "========================================"
echo "🤖 EventHub Multi-Agent Data Generation"
echo "========================================"
echo ""

# Check if API key is set
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ ANTHROPIC_API_KEY not set!"
    echo ""
    echo "You need an Anthropic API key to use the agent system."
    echo ""
    echo "Get your API key from: https://console.anthropic.com/settings/keys"
    echo ""
    echo "Then set it:"
    echo "  export ANTHROPIC_API_KEY=your_key_here"
    echo ""
    echo "Or add to .env file:"
    echo "  echo 'ANTHROPIC_API_KEY=your_key_here' >> .env"
    echo ""
    exit 1
fi

echo "✅ API key found"
echo ""

# Parse arguments or use defaults
EXAMPLES=${1:-25}
OUTPUT=${2:-ml/data}

echo "Configuration:"
echo "  Examples per agent: $EXAMPLES"
echo "  Total agents: 10"
echo "  Expected total: ~$((EXAMPLES * 10)) examples"
echo "  Output directory: $OUTPUT"
echo ""

# Ask for confirmation
read -p "Generate training data? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "🚀 Starting agent-based data generation..."
echo ""

# Run the generation script
python3 ml/generate_training_data.py --examples $EXAMPLES --output $OUTPUT

# Check if successful
if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "✅ Data Generation Successful!"
    echo "========================================"
    echo ""
    echo "📁 Files created:"
    ls -lh $OUTPUT/*.jsonl $OUTPUT/*.json 2>/dev/null || true
    echo ""
    echo "🎯 Next steps:"
    echo ""
    echo "  1. Review generated examples:"
    echo "     cat $OUTPUT/raw_examples.json | jq '.[:5]'"
    echo ""
    echo "  2. Train model locally:"
    echo "     python3 ml/train_model.py"
    echo ""
    echo "  3. Or train on Google Colab:"
    echo "     Upload ml/EventHub_Llama3_Training.ipynb"
    echo ""
    echo "  4. Or test with demo server first:"
    echo "     python3 ml/demo_server.py"
    echo ""
else
    echo ""
    echo "❌ Data generation failed!"
    echo "   Check the error messages above."
    echo ""
    exit 1
fi
