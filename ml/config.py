"""
Configuration file for EventHub Custom AI training and inference.

Modify these settings to customize your model training and deployment.
"""

# =============================================================================
# MODEL CONFIGURATION
# =============================================================================

# Base model to fine-tune
# Options: "meta-llama/Meta-Llama-3-8B", "meta-llama/Meta-Llama-3-70B"
BASE_MODEL = "meta-llama/Meta-Llama-3-8B"

# Output directory for trained model
MODEL_OUTPUT_DIR = "ml/models/eventhub-llama3"

# =============================================================================
# TRAINING CONFIGURATION
# =============================================================================

# Training hyperparameters
TRAINING_CONFIG = {
    # Batch size per device (reduce if OOM)
    "per_device_train_batch_size": 4,
    "per_device_eval_batch_size": 4,

    # Gradient accumulation (effective batch size = batch_size * grad_accum)
    "gradient_accumulation_steps": 4,

    # Training epochs
    "num_train_epochs": 3,

    # Learning rate
    "learning_rate": 2e-4,

    # Mixed precision training
    "fp16": True,

    # Warmup ratio
    "warmup_ratio": 0.1,

    # Learning rate scheduler
    "lr_scheduler_type": "cosine",

    # Optimizer
    "optim": "paged_adamw_8bit",

    # Logging
    "logging_steps": 10,

    # Evaluation
    "evaluation_strategy": "epoch",
    "save_strategy": "epoch",

    # Model checkpoints
    "save_total_limit": 3,
    "load_best_model_at_end": True,

    # Reproducibility
    "seed": 42,
}

# =============================================================================
# LoRA CONFIGURATION
# =============================================================================

LORA_CONFIG = {
    # LoRA rank (higher = more parameters but better quality)
    "r": 64,

    # LoRA alpha (scaling factor)
    "lora_alpha": 16,

    # Target modules to apply LoRA
    "target_modules": [
        "q_proj",
        "k_proj",
        "v_proj",
        "o_proj",
        "gate_proj",
        "up_proj",
        "down_proj",
    ],

    # Dropout
    "lora_dropout": 0.1,

    # Bias setting
    "bias": "none",

    # Task type
    "task_type": "CAUSAL_LM",
}

# =============================================================================
# QUANTIZATION CONFIGURATION
# =============================================================================

QUANTIZATION_CONFIG = {
    # Use 4-bit quantization for training
    "load_in_4bit": True,

    # Quantization type
    "bnb_4bit_quant_type": "nf4",

    # Compute dtype
    "bnb_4bit_compute_dtype": "float16",

    # Double quantization
    "bnb_4bit_use_double_quant": True,
}

# =============================================================================
# DATA CONFIGURATION
# =============================================================================

# Training data paths
DATA_DIR = "ml/data"
TRAIN_FILE = "eventhub_train.jsonl"
VAL_FILE = "eventhub_val.jsonl"

# Train/validation split ratio
VAL_RATIO = 0.1

# Maximum sequence length
MAX_SEQ_LENGTH = 2048

# =============================================================================
# INFERENCE CONFIGURATION
# =============================================================================

INFERENCE_CONFIG = {
    # Server settings
    "host": "0.0.0.0",
    "port": 8000,

    # Default generation parameters
    "max_tokens": 512,
    "temperature": 0.7,
    "top_p": 0.95,
    "top_k": 50,

    # Model loading
    "device_map": "auto",
    "torch_dtype": "float16",
}

# =============================================================================
# SYSTEM PROMPT
# =============================================================================

SYSTEM_PROMPT = """You are an intelligent assistant for EventHub, a premier event management platform in Nigeria. Help users discover events, book tickets, and answer questions about the platform. Be friendly, helpful, and enthusiastic about events!"""

# =============================================================================
# WEIGHTS & BIASES (Optional)
# =============================================================================

# Enable W&B logging for training monitoring
USE_WANDB = False

# W&B project name (if enabled)
WANDB_PROJECT = "eventhub-ai"

# W&B run name (if enabled)
WANDB_RUN_NAME = "llama3-finetune"

# =============================================================================
# HARDWARE SETTINGS
# =============================================================================

# GPU settings
GPU_CONFIG = {
    # Enable GPU if available
    "use_gpu": True,

    # Multi-GPU strategy: "auto", "balanced", "sequential"
    "multi_gpu_strategy": "auto",

    # Enable gradient checkpointing to save memory
    "gradient_checkpointing": True,

    # Enable CPU offloading if GPU memory is limited
    "cpu_offload": False,
}

# =============================================================================
# ADVANCED SETTINGS
# =============================================================================

# Flash Attention 2 (requires flash-attn package)
USE_FLASH_ATTENTION = False

# Compile model with torch.compile (PyTorch 2.0+)
USE_TORCH_COMPILE = False

# Push model to Hugging Face Hub after training
PUSH_TO_HUB = False
HUB_MODEL_ID = "your-username/eventhub-llama3"

# Enable automatic mixed precision
USE_AMP = True

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def get_full_data_path(filename: str) -> str:
    """Get full path for data file."""
    import os
    return os.path.join(DATA_DIR, filename)

def print_config():
    """Print current configuration."""
    print("=" * 80)
    print("EventHub Custom AI Configuration")
    print("=" * 80)
    print(f"\n📦 Model: {BASE_MODEL}")
    print(f"💾 Output: {MODEL_OUTPUT_DIR}")
    print(f"\n🎯 Training Epochs: {TRAINING_CONFIG['num_train_epochs']}")
    print(f"📊 Batch Size: {TRAINING_CONFIG['per_device_train_batch_size']} x {TRAINING_CONFIG['gradient_accumulation_steps']} = {TRAINING_CONFIG['per_device_train_batch_size'] * TRAINING_CONFIG['gradient_accumulation_steps']}")
    print(f"📈 Learning Rate: {TRAINING_CONFIG['learning_rate']}")
    print(f"🔧 LoRA Rank: {LORA_CONFIG['r']}")
    print(f"💡 W&B Logging: {'✅ Enabled' if USE_WANDB else '❌ Disabled'}")
    print("=" * 80)
    print()

if __name__ == "__main__":
    print_config()
