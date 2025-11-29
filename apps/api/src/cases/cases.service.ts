import { Injectable } from '@nestjs/common';
import { Case } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { EmbeddingsService } from 'src/embeddings/embeddings.service';

interface SearchResult {
  id: string;
  caseId: string;
  relevantChunk: string;
  similarity: number;
  case: Case;
}

@Injectable()
export class CasesService {
  constructor(
    private readonly database: DatabaseService,
    private readonly embeddings: EmbeddingsService,
  ) {}

  async search(query: string, limit: number = 10): Promise<SearchResult[]> {
    const embedding = await this.embeddings.generate(query);
    const embeddingString = `[${embedding.join(',')}]`;
    const chunks = await this.database.client.$queryRaw<
      {
        id: string;
        caseId: string;
        relevantChunk: string;
        similarity: number;
        case: Case;
      }[]
    >`
      select
        "CaseChunk".id,
        "CaseChunk"."caseId" AS "caseId",
        "CaseChunk".content AS "relevantChunk",
        1 - ("CaseChunk".embedding <=> ${embeddingString}::vector) AS similarity,
        row_to_json("Case".*) AS "case"
      from "CaseChunk"
      left join "Case" on "CaseChunk"."caseId" = "Case".id
      order by "CaseChunk".embedding <=> ${embeddingString}::vector
      limit ${limit}
    `;
    return chunks;
  }
}
