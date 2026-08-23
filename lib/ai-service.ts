import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
  dangerouslyAllowBrowser: true
});

interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class AIService {
  private useGemini = true; // Set to true to prefer Gemini by default

  private getGenAIClient() {
    const key = process.env.GOOGLE_API_KEY;
    if (key) {
      return new GoogleGenerativeAI(key);
    }
    return null;
  }

  async generateResponse(messages: Message[], fileContext?: string, imageUrls?: string[]): Promise<AIResponse> {
    const genAI = this.getGenAIClient();

    // If Gemini is preferred and available, try it.
    // If it fails, report THAT error, because likely OpenAI is dead anyway.
    if (this.useGemini && genAI) {
      try {
        return await this.generateGeminiResponse(messages, fileContext, imageUrls);
      } catch (geminiError: any) {
        throw new Error(`Gemini Error: ${geminiError.message || geminiError}`);
      }
    }

    // Fallback to OpenAI only if Gemini is NOT configured (no key)
    try {
      // Validate API key for OpenAI
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      // Prepare messages with system prompt
      const systemPrompt = `You are ayoAI, a helpful and intelligent AI assistant. You can help with various tasks including:
- Answering questions and providing information
- Analyzing uploaded files and images
- Converting images to Ghibli-style art
- General conversation and assistance

${fileContext ? `\n\nFile Context:\n${fileContext}` : ''}

Please provide helpful, accurate, and engaging responses.`;

      const fullMessages: Message[] = [
        { role: 'system', content: systemPrompt },
        ...messages
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: fullMessages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';

      return {
        content,
        usage: {
          prompt_tokens: response.usage?.prompt_tokens || 0,
          completion_tokens: response.usage?.completion_tokens || 0,
          total_tokens: response.usage?.total_tokens || 0,
        }
      };

    } catch (error: any) {
      // Handle specific OpenAI errors
      if (error.code === 'invalid_api_key') {
        throw new Error('Invalid OpenAI API key. Please check your configuration.');
      } else if (error.code === 'insufficient_quota') {
        throw new Error('OpenAI quota exceeded. Please check your billing.');
      } else if (error.code === 'rate_limit_exceeded') {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      throw new Error(`AI service error: ${error.message || 'Unknown error occurred'}`);
    }
  }

  async generateGeminiResponse(messages: Message[], fileContext?: string, imageUrls?: string[]): Promise<AIResponse> {
    const genAI = this.getGenAIClient();
    if (!genAI) throw new Error('Google Generative AI not initialized (Missing API Key)');

    // Use gemini-3.6-flash as the latest model (supports vision)
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    let systemPrompt = `You are ayoAI, a helpful and intelligent AI assistant.
${fileContext ? `\n\nFile Context:\n${fileContext}` : ''}
`;

    // Extract the latest user message for the prompt, and history for context
    const lastMessage = messages[messages.length - 1];

    // Map OpenAI roles to Gemini roles
    // user -> user
    // assistant -> model
    // system -> (handled by prepend)
    const history = messages.slice(0, -1).map(msg => {
      let role = 'user';
      if (msg.role === 'assistant') role = 'model';

      // Gemini history cannot contain system messages directly in 'history' usually, 
      // but we filter them out anyway.
      return {
        role: role,
        parts: [{ text: msg.content }]
      };
    }).filter(msg => msg.role === 'user' || msg.role === 'model');

    // Build the message parts (text + images if any)
    const messageParts: any[] = [];

    // Add the text prompt
    const promptWithContext = `${systemPrompt}\n\nUser: ${lastMessage.content}`;
    messageParts.push({ text: promptWithContext });

    // If there are images, fetch and add them
    if (imageUrls && imageUrls.length > 0) {
      for (const imageUrl of imageUrls) {
        try {
          // Fetch the image and convert to base64
          const response = await fetch(imageUrl);
          const arrayBuffer = await response.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          const mimeType = response.headers.get('content-type') || 'image/jpeg';

          messageParts.push({
            inlineData: {
              mimeType: mimeType,
              data: base64
            }
          });
        } catch (error) {
          // Silent fail for image fetch errors
        }
      }
    }

    // Basic chat session
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(messageParts);
    const response = await result.response;
    const text = response.text();

    return {
      content: text,
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    };
  }

  async generateGhibliStyleImage(prompt: string): Promise<string> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      const ghibliPrompt = `Create a Studio Ghibli style illustration of: ${prompt}. 
      The image should have the characteristic soft, dreamy, and whimsical art style of Studio Ghibli films, 
      with gentle colors, detailed backgrounds, and a magical atmosphere.`;

      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: ghibliPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      });

      if (!response.data || !response.data[0] || !response.data[0].url) {
        throw new Error('No image URL returned from OpenAI');
      }
      return response.data[0].url;

    } catch (error: any) {
      throw new Error(`Image generation error: ${error.message || 'Unknown error occurred'}`);
    }
  }

  async analyzeFile(file: File): Promise<{ summary: string; type: string; insights: string[] }> {
    try {
      const fileType = file.type;
      const fileName = file.name;

      // For now, return basic file analysis
      // In a full implementation, you would process the file content
      const analysis = {
        summary: `Uploaded file: ${fileName}`,
        type: fileType,
        insights: [
          `File size: ${(file.size / 1024).toFixed(2)} KB`,
          `File type: ${fileType}`,
          `File name: ${fileName}`
        ]
      };

      // If it's an image, we could analyze it further
      if (fileType.startsWith('image/')) {
        analysis.insights.push('This is an image file that can be processed for Ghibli-style conversion');
      }

      return analysis;

    } catch (error: any) {
      throw new Error(`File analysis error: ${error.message || 'Unknown error occurred'}`);
    }
  }

  async convertImageToGhibli(imageFile: File): Promise<string> {
    try {
      // For DALL-E, we can't directly process uploaded images
      // Instead, we'll create a Ghibli-style image based on a description
      const prompt = `Convert this image to Studio Ghibli art style with soft colors, dreamy atmosphere, and whimsical details`;

      return await this.generateGhibliStyleImage(prompt);

    } catch (error: any) {
      throw new Error(`Image conversion error: ${error.message || 'Unknown error occurred'}`);
    }
  }
}

export const aiService = new AIService();