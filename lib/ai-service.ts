import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
  async generateResponse(messages: Message[], fileContext?: string): Promise<AIResponse> {
    try {
      // Validate API key
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
      console.error('AI Service error:', error);
      
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
      console.error('Image generation error:', error);
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
      console.error('File analysis error:', error);
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
      console.error('Image conversion error:', error);
      throw new Error(`Image conversion error: ${error.message || 'Unknown error occurred'}`);
    }
  }
}

export const aiService = new AIService();