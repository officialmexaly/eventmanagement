"""
Fine-tune Llama 3 model on EventHub data using LoRA/QLoRA.

This script implements efficient fine-tuning using:
- QLoRA (4-bit quantization) for memory efficiency
- PEFT (Parameter-Efficient Fine-Tuning)
- Supervised Fine-Tuning (SFT) for instruction-following
"""

import os
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments,
    pipeline,
)
from peft import LoraConfig, prepare_model_for_kbit_training, get_peft_model
from datasets import load_dataset
from trl import SFTTrainer
import wandb

class EventHubModelTrainer:
    """Fine-tune Llama 3 for EventHub-specific tasks."""

    def __init__(
        self,
        model_name: str = "meta-llama/Meta-Llama-3-8B",
        output_dir: str = "ml/models/eventhub-llama3",
        use_wandb: bool = False,
    ):
        self.model_name = model_name
        self.output_dir = output_dir
        self.use_wandb = use_wandb

        os.makedirs(output_dir, exist_ok=True)

        if use_wandb:
            wandb.init(project="eventhub-ai", name="llama3-finetune")

    def load_model_and_tokenizer(self):
        """Load Llama 3 model with 4-bit quantization."""
        print("🔄 Loading model and tokenizer...")

        # Configure 4-bit quantization for efficient training
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_use_double_quant=True,
        )

        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.model_name,
            trust_remote_code=True,
            padding_side="right",
            add_eos_token=True,
            add_bos_token=True,
        )

        # Set pad token if not exists
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
            self.tokenizer.pad_token_id = self.tokenizer.eos_token_id

        # Load model with quantization
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_name,
            quantization_config=bnb_config,
            device_map="auto",
            trust_remote_code=True,
        )

        # Prepare model for k-bit training
        self.model = prepare_model_for_kbit_training(self.model)
        self.model.config.use_cache = False
        self.model.config.pretraining_tp = 1

        print("✅ Model and tokenizer loaded successfully!")
        return self.model, self.tokenizer

    def configure_lora(self):
        """Configure LoRA for parameter-efficient fine-tuning."""
        print("🔧 Configuring LoRA...")

        lora_config = LoraConfig(
            r=64,  # LoRA rank
            lora_alpha=16,  # LoRA scaling factor
            target_modules=[
                "q_proj",
                "k_proj",
                "v_proj",
                "o_proj",
                "gate_proj",
                "up_proj",
                "down_proj",
            ],
            lora_dropout=0.1,
            bias="none",
            task_type="CAUSAL_LM",
        )

        self.model = get_peft_model(self.model, lora_config)

        # Print trainable parameters
        trainable_params = sum(p.numel() for p in self.model.parameters() if p.requires_grad)
        total_params = sum(p.numel() for p in self.model.parameters())

        print(f"✅ LoRA configured!")
        print(f"   Trainable params: {trainable_params:,} ({100 * trainable_params / total_params:.2f}%)")
        print(f"   Total params: {total_params:,}")

        return lora_config

    def load_training_data(self, data_path: str = "ml/data"):
        """Load prepared training dataset."""
        print(f"📂 Loading training data from {data_path}...")

        # Load JSONL files
        dataset = load_dataset(
            'json',
            data_files={
                'train': f'{data_path}/eventhub_train.jsonl',
                'validation': f'{data_path}/eventhub_val.jsonl'
            }
        )

        print(f"✅ Dataset loaded!")
        print(f"   Training examples: {len(dataset['train'])}")
        print(f"   Validation examples: {len(dataset['validation'])}")

        return dataset

    def setup_training_args(self):
        """Configure training arguments."""
        training_args = TrainingArguments(
            output_dir=self.output_dir,
            per_device_train_batch_size=4,
            per_device_eval_batch_size=4,
            gradient_accumulation_steps=4,
            num_train_epochs=3,
            learning_rate=2e-4,
            fp16=True,
            save_strategy="epoch",
            evaluation_strategy="epoch",
            logging_steps=10,
            warmup_ratio=0.1,
            lr_scheduler_type="cosine",
            optim="paged_adamw_8bit",
            save_total_limit=3,
            load_best_model_at_end=True,
            report_to="wandb" if self.use_wandb else "none",
            seed=42,
        )

        return training_args

    def train(self, dataset):
        """Execute fine-tuning."""
        print("\n🚀 Starting fine-tuning...\n")

        training_args = self.setup_training_args()

        # Initialize SFT Trainer
        trainer = SFTTrainer(
            model=self.model,
            train_dataset=dataset['train'],
            eval_dataset=dataset['validation'],
            tokenizer=self.tokenizer,
            args=training_args,
            max_seq_length=2048,
            dataset_text_field="text",
            packing=False,
        )

        # Start training
        trainer.train()

        print("\n✅ Training completed!")

        return trainer

    def save_model(self, trainer):
        """Save fine-tuned model and tokenizer."""
        print(f"\n💾 Saving model to {self.output_dir}...")

        # Save model
        trainer.model.save_pretrained(self.output_dir)
        self.tokenizer.save_pretrained(self.output_dir)

        print("✅ Model saved successfully!")

    def test_model(self, prompt: str = "Show me upcoming tech events"):
        """Test the fine-tuned model."""
        print(f"\n🧪 Testing model with prompt: '{prompt}'\n")

        # Create inference pipeline
        pipe = pipeline(
            "text-generation",
            model=self.model,
            tokenizer=self.tokenizer,
        )

        # Format test prompt
        test_prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are an intelligent assistant for EventHub, a premier event management platform in Nigeria. Help users discover events, book tickets, and answer questions about the platform. Be friendly, helpful, and enthusiastic about events!<|eot_id|><|start_header_id|>user<|end_header_id|>

{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

"""

        # Generate response
        result = pipe(
            test_prompt,
            max_new_tokens=256,
            do_sample=True,
            temperature=0.7,
            top_p=0.95,
        )

        print("📝 Model Response:")
        print("-" * 80)
        print(result[0]['generated_text'].split('<|start_header_id|>assistant<|end_header_id|>\n\n')[1].split('<|eot_id|>')[0])
        print("-" * 80)

    def push_to_hub(self, repo_name: str = "eventhub-llama3"):
        """Push model to Hugging Face Hub (optional)."""
        print(f"\n📤 Pushing model to Hugging Face Hub as '{repo_name}'...")

        try:
            self.model.push_to_hub(repo_name)
            self.tokenizer.push_to_hub(repo_name)
            print("✅ Model pushed to Hub successfully!")
        except Exception as e:
            print(f"❌ Error pushing to Hub: {e}")
            print("   Make sure you're logged in: huggingface-cli login")


def main():
    """Main training pipeline."""
    print("=" * 80)
    print("🎯 EventHub Llama 3 Fine-Tuning Pipeline")
    print("=" * 80)
    print()

    # Check for GPU
    if torch.cuda.is_available():
        print(f"✅ GPU Available: {torch.cuda.get_device_name(0)}")
        print(f"   Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
    else:
        print("⚠️  No GPU detected. Training will be slow!")
    print()

    # Initialize trainer
    trainer = EventHubModelTrainer(
        model_name="meta-llama/Meta-Llama-3-8B",
        output_dir="ml/models/eventhub-llama3",
        use_wandb=False,  # Set to True if you want W&B logging
    )

    # Step 1: Load model and tokenizer
    model, tokenizer = trainer.load_model_and_tokenizer()

    # Step 2: Configure LoRA
    lora_config = trainer.configure_lora()

    # Step 3: Load training data
    dataset = trainer.load_training_data()

    # Step 4: Train model
    sft_trainer = trainer.train(dataset)

    # Step 5: Save model
    trainer.save_model(sft_trainer)

    # Step 6: Test model
    print("\n" + "=" * 80)
    print("🎉 Training Complete! Running test inference...")
    print("=" * 80)

    trainer.test_model("Show me upcoming tech events in Lagos")
    trainer.test_model("How do I book tickets?")

    # Optional: Push to Hugging Face Hub
    # Uncomment if you want to share your model
    # trainer.push_to_hub("your-username/eventhub-llama3")

    print("\n" + "=" * 80)
    print("✅ All done! Your EventHub AI model is ready to use!")
    print(f"📁 Model saved at: {trainer.output_dir}")
    print("=" * 80)


if __name__ == "__main__":
    main()
