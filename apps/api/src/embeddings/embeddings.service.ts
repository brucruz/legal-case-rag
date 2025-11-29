import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class EmbeddingsService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generate(text: string): Promise<number[]> {
    try {
      const embedding = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return embedding.data[0].embedding;
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  private handleError(error: Error): Promise<never> {
    console.error(error);
    throw error;
  }
}
