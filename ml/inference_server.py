"""
FastAPI inference server for EventHub custom Llama 3 model.

This server loads the fine-tuned model and provides REST API endpoints
for generating responses to user queries.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from peft import PeftModel
import uvicorn
import os

# Initialize FastAPI app
app = FastAPI(
    title="EventHub AI API",
    description="Custom fine-tuned Llama 3 model for EventHub",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model and tokenizer
model = None
tokenizer = None
text_generator = None


class Message(BaseModel):
    """Chat message structure."""
    role: str  # 'system', 'user', or 'assistant'
    content: str


class GenerateRequest(BaseModel):
    """Request body for generation endpoint."""
    messages: List[Message]
    max_tokens: Optional[int] = 512
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 0.95


class GenerateResponse(BaseModel):
    """Response from generation endpoint."""
    response: str
    model: str
    tokens_used: Optional[int] = None


@app.on_event("startup")
async def load_model():
    """Load the fine-tuned model on startup."""
    global model, tokenizer, text_generator

    print("🚀 Loading EventHub AI model...")

    model_path = os.getenv("MODEL_PATH", "ml/models/eventhub-llama3")

    try:
        # Load tokenizer
        tokenizer = AutoTokenizer.from_pretrained(
            model_path,
            trust_remote_code=True,
        )

        # Load base model
        base_model = AutoModelForCausalLM.from_pretrained(
            "meta-llama/Meta-Llama-3-8B",
            device_map="auto",
            torch_dtype=torch.float16,
            trust_remote_code=True,
        )

        # Load fine-tuned LoRA weights
        model = PeftModel.from_pretrained(base_model, model_path)
        model.eval()

        # Create text generation pipeline
        text_generator = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            device_map="auto",
        )

        print("✅ Model loaded successfully!")

    except Exception as e:
        print(f"❌ Error loading model: {e}")
        print("   Make sure the model is trained and saved at:", model_path)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "online",
        "message": "EventHub AI API is running!",
        "model_loaded": model is not None,
    }


@app.get("/health")
async def health():
    """Detailed health check."""
    return {
        "status": "healthy" if model is not None else "model_not_loaded",
        "gpu_available": torch.cuda.is_available(),
        "gpu_name": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None,
    }


@app.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest):
    """
    Generate a response using the fine-tuned model.

    Example request:
    ```json
    {
      "messages": [
        {"role": "user", "content": "Show me upcoming tech events"}
      ],
      "max_tokens": 512,
      "temperature": 0.7
    }
    ```
    """
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        # Build prompt in Llama-3 format
        prompt = build_llama3_prompt(request.messages)

        # Generate response
        result = text_generator(
            prompt,
            max_new_tokens=request.max_tokens,
            do_sample=True,
            temperature=request.temperature,
            top_p=request.top_p,
            pad_token_id=tokenizer.eos_token_id,
        )

        # Extract assistant response
        full_text = result[0]['generated_text']
        response = extract_assistant_response(full_text)

        return GenerateResponse(
            response=response,
            model="eventhub-llama3",
            tokens_used=len(tokenizer.encode(full_text)),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


@app.post("/chat")
async def chat(request: GenerateRequest):
    """
    Simplified chat endpoint that returns just the text response.

    Example request:
    ```json
    {
      "messages": [
        {"role": "user", "content": "What events are happening this weekend?"}
      ]
    }
    ```
    """
    result = await generate(request)
    return {"response": result.response}


def build_llama3_prompt(messages: List[Message]) -> str:
    """
    Build prompt in Llama-3 instruction format.

    Format:
    <|begin_of_text|><|start_header_id|>system<|end_header_id|>
    {system_message}<|eot_id|><|start_header_id|>user<|end_header_id|>
    {user_message}<|eot_id|><|start_header_id|>assistant<|end_header_id|>
    """
    # Default system message
    system_message = """You are an intelligent assistant for EventHub, a premier event management platform in Nigeria. Help users discover events, book tickets, and answer questions about the platform. Be friendly, helpful, and enthusiastic about events!"""

    # Override if system message provided
    if messages and messages[0].role == "system":
        system_message = messages[0].content
        messages = messages[1:]

    # Build prompt
    prompt = f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_message}<|eot_id|>"

    # Add conversation history
    for msg in messages:
        if msg.role == "user":
            prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{msg.content}<|eot_id|>"
        elif msg.role == "assistant":
            prompt += f"<|start_header_id|>assistant<|end_header_id|>\n\n{msg.content}<|eot_id|>"

    # Add assistant header for response
    prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"

    return prompt


def extract_assistant_response(full_text: str) -> str:
    """Extract the assistant's response from the generated text."""
    try:
        # Split at the last assistant header
        parts = full_text.split('<|start_header_id|>assistant<|end_header_id|>\n\n')
        if len(parts) >= 2:
            response = parts[-1].split('<|eot_id|>')[0].strip()
            return response
        return full_text
    except Exception:
        return full_text


# Development endpoints for testing

@app.get("/test")
async def test_inference():
    """Quick test endpoint."""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    test_request = GenerateRequest(
        messages=[
            Message(role="user", content="Tell me about EventHub")
        ],
        max_tokens=200,
        temperature=0.7,
    )

    return await generate(test_request)


if __name__ == "__main__":
    print("=" * 80)
    print("🎯 EventHub AI Inference Server")
    print("=" * 80)
    print()
    print("Starting server on http://localhost:8000")
    print("API docs available at http://localhost:8000/docs")
    print()

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
    )
