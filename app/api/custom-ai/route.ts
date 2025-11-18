import { NextRequest, NextResponse } from 'next/server';

// API route to communicate with the custom Llama 3 inference server

const INFERENCE_SERVER_URL = process.env.CUSTOM_AI_URL || 'http://localhost:8000';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GenerateRequest {
  messages: Message[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, max_tokens = 512, temperature = 0.7 } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Check if inference server is configured
    if (!INFERENCE_SERVER_URL) {
      return NextResponse.json(
        {
          error: 'Custom AI server not configured',
          fallback: true,
          message: 'Please set CUSTOM_AI_URL environment variable'
        },
        { status: 503 }
      );
    }

    // Forward request to inference server
    const response = await fetch(`${INFERENCE_SERVER_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        max_tokens,
        temperature,
        top_p: 0.95,
      } as GenerateRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: errorData.detail || 'Inference server error',
          fallback: true,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      response: data.response,
      model: data.model,
      tokens_used: data.tokens_used,
    });
  } catch (error) {
    console.error('Custom AI API error:', error);

    // Return error with fallback flag so frontend can use Claude agent
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to process request',
        fallback: true,
        message: 'Custom AI unavailable, please use the Claude agent instead',
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const response = await fetch(`${INFERENCE_SERVER_URL}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          status: 'offline',
          message: 'Inference server is not responding',
        },
        { status: 503 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      status: 'online',
      inference_server: data,
      url: INFERENCE_SERVER_URL,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'offline',
        error: error instanceof Error ? error.message : 'Unknown error',
        url: INFERENCE_SERVER_URL,
      },
      { status: 503 }
    );
  }
}
