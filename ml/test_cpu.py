#!/usr/bin/env python3
"""
CPU Test for EventHub AI System

Tests the training data generation and basic model setup without requiring GPU.
This is useful for development and testing.
"""

import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_dependencies():
    """Test that all required dependencies are installed."""
    print("🔍 Testing dependencies...\n")

    required_packages = [
        ('torch', 'PyTorch'),
        ('transformers', 'Transformers'),
        ('datasets', 'Datasets'),
    ]

    missing = []
    for package, name in required_packages:
        try:
            __import__(package)
            print(f"✅ {name} installed")
        except ImportError:
            print(f"❌ {name} not installed")
            missing.append(package)

    if missing:
        print(f"\n⚠️ Missing packages: {', '.join(missing)}")
        print("Install with: pip install " + " ".join(missing))
        return False

    print("\n✅ All dependencies installed!\n")
    return True


def test_torch_cpu():
    """Test PyTorch CPU functionality."""
    print("🔍 Testing PyTorch on CPU...\n")

    import torch

    print(f"PyTorch version: {torch.__version__}")
    print(f"CUDA available: {torch.cuda.is_available()}")

    if torch.cuda.is_available():
        print(f"CUDA version: {torch.version.cuda}")
        print(f"GPU: {torch.cuda.get_device_name(0)}")
    else:
        print("Running on CPU (no GPU detected)")

    # Test basic tensor operations
    try:
        x = torch.randn(10, 10)
        y = torch.randn(10, 10)
        z = torch.matmul(x, y)
        print(f"\n✅ Basic tensor operations work!")
        print(f"   Test tensor shape: {z.shape}")
    except Exception as e:
        print(f"\n❌ Tensor operations failed: {e}")
        return False

    print()
    return True


def test_training_data_generation():
    """Test local training data generation."""
    print("🔍 Testing training data generation...\n")

    try:
        # Import the local generator
        from ml.generate_local_data import LocalDataGenerator

        print("Creating data generator...")
        generator = LocalDataGenerator()

        print("Generating examples...")
        examples = generator.generate_all_examples()

        print(f"\n✅ Generated {len(examples)} training examples!")

        # Show sample
        if examples:
            print("\n📝 Sample example:")
            print(f"   Instruction: {examples[0]['instruction'][:80]}...")
            print(f"   Output: {examples[0]['output'][:80]}...")

        print()
        return True

    except ImportError as e:
        print(f"❌ Could not import generator: {e}")
        return False
    except Exception as e:
        print(f"❌ Data generation failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_tokenizer():
    """Test tokenizer loading (CPU only)."""
    print("🔍 Testing tokenizer (CPU mode)...\n")

    try:
        from transformers import AutoTokenizer

        # Use a small model for testing
        model_name = "gpt2"  # Smaller model for quick testing

        print(f"Loading tokenizer: {model_name}...")
        tokenizer = AutoTokenizer.from_pretrained(model_name)

        # Test tokenization
        test_text = "Show me tech events in Lagos"
        tokens = tokenizer(test_text, return_tensors="pt")

        print(f"✅ Tokenizer loaded successfully!")
        print(f"   Test text: '{test_text}'")
        print(f"   Tokens: {tokens['input_ids'].shape[1]} tokens")

        print()
        return True

    except Exception as e:
        print(f"❌ Tokenizer test failed: {e}")
        print("   (This is normal if you don't have internet or HF access)")
        print()
        return False


def test_model_loading_cpu():
    """Test loading a small model on CPU."""
    print("🔍 Testing small model loading on CPU...\n")

    try:
        from transformers import AutoModelForCausalLM, AutoTokenizer
        import torch

        # Use tiny model for CPU testing
        model_name = "gpt2"

        print(f"Loading model: {model_name} (this may take a moment)...")
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float32,  # Use float32 for CPU
            device_map="cpu",
            low_cpu_mem_usage=True
        )

        print(f"✅ Model loaded successfully!")

        # Test inference
        print("\n🧪 Testing inference...")
        test_input = "EventHub is"
        inputs = tokenizer(test_input, return_tensors="pt")

        with torch.no_grad():
            outputs = model.generate(
                inputs.input_ids,
                max_new_tokens=10,
                do_sample=False
            )

        result = tokenizer.decode(outputs[0], skip_special_tokens=True)
        print(f"   Input: '{test_input}'")
        print(f"   Output: '{result}'")

        print("\n✅ Inference test passed!")
        print()
        return True

    except Exception as e:
        print(f"⚠️ Model loading skipped: {e}")
        print("   (This is normal if you don't have internet)")
        print()
        return False


def test_data_files():
    """Check if training data files exist."""
    print("🔍 Checking for training data files...\n")

    data_files = [
        'ml/data/eventhub_train.jsonl',
        'ml/data/eventhub_val.jsonl',
    ]

    found = []
    missing = []

    for file_path in data_files:
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            print(f"✅ {file_path} ({size:,} bytes)")
            found.append(file_path)
        else:
            print(f"❌ {file_path} (not found)")
            missing.append(file_path)

    if found:
        print(f"\n✅ Found {len(found)} data file(s)")

        # Try to read and parse
        try:
            import json
            with open(found[0], 'r') as f:
                first_line = f.readline()
                example = json.loads(first_line)
                print(f"   Sample keys: {list(example.keys())}")
        except Exception as e:
            print(f"   ⚠️ Could not parse file: {e}")

    if missing:
        print(f"\n⚠️ Missing {len(missing)} file(s)")
        print("   Run: python3 ml/generate_local_data.py")

    print()
    return len(found) > 0


def run_all_tests():
    """Run all CPU tests."""
    print("="*80)
    print("🎯 EventHub AI - CPU Test Suite")
    print("="*80)
    print()

    results = {
        "Dependencies": test_dependencies(),
        "PyTorch CPU": test_torch_cpu(),
        "Training Data Generation": test_training_data_generation(),
        "Data Files": test_data_files(),
        "Tokenizer": test_tokenizer(),
        "Model Loading (Optional)": test_model_loading_cpu(),
    }

    print("="*80)
    print("📊 Test Results Summary")
    print("="*80)
    print()

    passed = sum(1 for v in results.values() if v)
    total = len(results)

    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")

    print()
    print(f"Results: {passed}/{total} tests passed")

    if passed == total:
        print("\n🎉 All tests passed! System is ready for CPU-based operations.")
        return 0
    elif passed >= total - 2:  # Allow 2 optional tests to fail
        print("\n✅ Core tests passed! Optional tests may require internet/GPU.")
        return 0
    else:
        print("\n⚠️ Some tests failed. Check the output above for details.")
        return 1


if __name__ == "__main__":
    exit_code = run_all_tests()
    sys.exit(exit_code)
