#!/usr/bin/env python3
"""
Simple CPU Test for EventHub AI System (No Dependencies Required)

Tests the core functionality that doesn't require torch/transformers.
"""

import json
import os
import sys


def test_project_structure():
    """Verify project structure is correct."""
    print("🔍 Testing project structure...\n")

    required_files = [
        'ml/generate_local_data.py',
        'ml/inference_server.py',
        'ml/README.md',
        'COLAB_QUICKSTART.md',
        'ml/EventHub_Llama3_Training.ipynb',
    ]

    required_dirs = [
        'ml',
        'ml/data',
        'app',
    ]

    all_good = True

    print("📁 Checking directories...")
    for dir_path in required_dirs:
        if os.path.isdir(dir_path):
            print(f"   ✅ {dir_path}/")
        else:
            print(f"   ❌ {dir_path}/ (missing)")
            all_good = False

    print("\n📄 Checking files...")
    for file_path in required_files:
        if os.path.isfile(file_path):
            size = os.path.getsize(file_path)
            print(f"   ✅ {file_path} ({size:,} bytes)")
        else:
            print(f"   ❌ {file_path} (missing)")
            all_good = False

    print()
    return all_good


def test_local_data_generator():
    """Test the local training data generator."""
    print("🔍 Testing local data generator...\n")

    try:
        # Import and run generator
        sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from ml.generate_local_data import LocalDataGenerator

        print("   Creating generator...")
        generator = LocalDataGenerator()

        print("   Generating examples...")
        examples = generator.generate_all_examples()

        if not examples:
            print("   ❌ No examples generated")
            return False

        print(f"   ✅ Generated {len(examples)} examples\n")

        # Verify example structure
        sample = examples[0]
        required_keys = ['instruction', 'output']

        print("   Checking example structure...")
        for key in required_keys:
            if key in sample:
                print(f"      ✅ Has '{key}' field")
            else:
                print(f"      ❌ Missing '{key}' field")
                return False

        print(f"\n   📝 Sample example:")
        print(f"      Instruction: {sample['instruction'][:60]}...")
        print(f"      Output: {sample['output'][:60]}...")

        print()
        return True

    except Exception as e:
        print(f"   ❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_training_data_files():
    """Check training data files."""
    print("🔍 Testing training data files...\n")

    data_files = {
        'Training': 'ml/data/eventhub_train.jsonl',
        'Validation': 'ml/data/eventhub_val.jsonl',
        'Raw Examples': 'ml/data/raw_examples.json',
    }

    all_exist = True

    for name, file_path in data_files.items():
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            print(f"   ✅ {name}: {file_path}")
            print(f"      Size: {size:,} bytes")

            # Try to read first line/entry
            try:
                with open(file_path, 'r') as f:
                    if file_path.endswith('.jsonl'):
                        first_line = f.readline()
                        if first_line.strip():
                            data = json.loads(first_line)
                            print(f"      Keys: {list(data.keys())}")
                    else:
                        data = json.load(f)
                        if isinstance(data, list):
                            print(f"      Entries: {len(data)}")
            except Exception as e:
                print(f"      ⚠️ Could not read: {e}")

        else:
            print(f"   ❌ {name}: {file_path} (not found)")
            all_exist = False

        print()

    if not all_exist:
        print("   💡 Tip: Run 'python3 ml/generate_local_data.py' to create files\n")

    return all_exist


def test_notebook_structure():
    """Test Colab notebook structure."""
    print("🔍 Testing Colab notebook...\n")

    notebook_path = 'ml/EventHub_Llama3_Training.ipynb'

    if not os.path.exists(notebook_path):
        print(f"   ❌ Notebook not found: {notebook_path}\n")
        return False

    try:
        with open(notebook_path, 'r') as f:
            notebook = json.load(f)

        if 'cells' not in notebook:
            print("   ❌ Invalid notebook structure (no cells)\n")
            return False

        cells = notebook['cells']
        print(f"   ✅ Notebook loaded successfully")
        print(f"   📊 Total cells: {len(cells)}")

        # Count cell types
        code_cells = sum(1 for cell in cells if cell.get('cell_type') == 'code')
        markdown_cells = sum(1 for cell in cells if cell.get('cell_type') == 'markdown')

        print(f"   📝 Code cells: {code_cells}")
        print(f"   📄 Markdown cells: {markdown_cells}")

        # Check for key content
        all_content = ' '.join(
            ''.join(cell.get('source', []))
            for cell in cells
        )

        key_terms = [
            'bitsandbytes',
            'CUDA',
            'Llama',
            'EventHub',
            'training',
        ]

        print("\n   Checking for key content...")
        for term in key_terms:
            if term in all_content:
                print(f"      ✅ Contains '{term}'")
            else:
                print(f"      ⚠️ Missing '{term}'")

        print()
        return True

    except Exception as e:
        print(f"   ❌ Error reading notebook: {e}\n")
        return False


def test_documentation():
    """Check documentation files."""
    print("🔍 Testing documentation...\n")

    docs = {
        'Quick Start': 'COLAB_QUICKSTART.md',
        'Training Guide': 'ml/COLAB_TRAINING_GUIDE.md',
        'ML README': 'ml/README.md',
        'Free Training': 'FREE_LOCAL_TRAINING.md',
    }

    all_good = True

    for name, file_path in docs.items():
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            lines = sum(1 for _ in open(file_path))
            print(f"   ✅ {name}: {file_path}")
            print(f"      {size:,} bytes, {lines:,} lines")
        else:
            print(f"   ❌ {name}: {file_path} (missing)")
            all_good = False

    print()
    return all_good


def run_all_tests():
    """Run all tests."""
    print("=" * 80)
    print("🎯 EventHub AI - Simple CPU Test Suite")
    print("=" * 80)
    print("\nTesting core functionality without ML dependencies...\n")
    print("=" * 80)
    print()

    tests = [
        ("Project Structure", test_project_structure),
        ("Local Data Generator", test_local_data_generator),
        ("Training Data Files", test_training_data_files),
        ("Colab Notebook", test_notebook_structure),
        ("Documentation", test_documentation),
    ]

    results = {}

    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"   ❌ Test crashed: {e}\n")
            results[test_name] = False

    # Summary
    print("=" * 80)
    print("📊 Test Results Summary")
    print("=" * 80)
    print()

    passed = sum(1 for v in results.values() if v)
    total = len(results)

    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status} - {test_name}")

    print()
    print(f"Results: {passed}/{total} tests passed")
    print()

    if passed == total:
        print("🎉 All tests passed!")
        print("✅ System is ready for training data generation")
        print("✅ Colab notebook is properly configured")
        print("✅ Documentation is complete")
        print()
        print("Next steps:")
        print("1. Upload ml/EventHub_Llama3_Training.ipynb to Google Colab")
        print("2. Enable T4 GPU runtime")
        print("3. Run all cells to train your model!")
        return 0
    else:
        print(f"⚠️ {total - passed} test(s) failed")
        print("Check the output above for details")
        return 1


if __name__ == "__main__":
    exit_code = run_all_tests()
    sys.exit(exit_code)
