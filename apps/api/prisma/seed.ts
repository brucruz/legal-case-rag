import dotenv from 'dotenv';
import * as fs from 'fs';
import OpenAI from 'openai';
import * as path from 'path';

// Load env BEFORE using any env vars
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

interface CaseDataWithoutText {
  caseNumber: string;
  celexId: string;
  title: string;
  court: string;
  date: string;
  jurisdiction: string;
  summary: string;
  fullTextFile: string;
  sourceUrl: string;
}

type CaseData = CaseDataWithoutText & {
  fullText: string;
};

const casesDir = path.resolve(__dirname, '../../../data/texts');
const outputFile = path.resolve(__dirname, '../../../data/cases.json');
const metadataRaw = fs.readFileSync(outputFile, 'utf-8');
const metadata: CaseData[] = JSON.parse(metadataRaw) as CaseData[];
const casesWithText = metadata.map((caseData) => {
  const fullText = fs.readFileSync(
    path.join(casesDir, caseData.fullTextFile),
    'utf-8',
  );
  return { ...caseData, fullText };
});

function chunkText(
  text: string,
  maxChunkSize: number = 1500,
  minChunkSize: number = 50,
): string[] {
  const paragraphs = text.split('\n\n');
  const chunks: Set<string> = new Set();
  let currentChunk = '';
  for (const paragraph of paragraphs) {
    const delimiter = currentChunk ? '\n\n' : '';
    const willExceedMaxChunk =
      currentChunk.length + paragraph.length > maxChunkSize;
    if (willExceedMaxChunk) {
      if (currentChunk) chunks.add(currentChunk.trim());
      currentChunk = paragraph;
    } else {
      currentChunk += delimiter + paragraph;
    }
  }
  if (currentChunk.trim()) {
    chunks.add(currentChunk.trim());
  }
  // removing chunks that are too short to have any meaningful content
  return Array.from(chunks).filter(
    (chunk) => chunk.trim().length > minChunkSize,
  );
}

async function main() {
  // Dynamic import for PrismaClient (needs env vars loaded first)
  const { PrismaClient } = await import('@prisma/client');

  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async function generateEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  }

  try {
    console.log(`Seeding ${casesWithText.length} cases...`);
    for (const caseData of casesWithText) {
      console.log(`Seeding case ${caseData.caseNumber}...`);
      const caseRecord = await prisma.case.upsert({
        where: { caseNumber: caseData.caseNumber },
        create: {
          caseNumber: caseData.caseNumber,
          celexId: caseData.celexId,
          title: caseData.title,
          court: caseData.court,
          date: new Date(caseData.date).toISOString(),
          jurisdiction: caseData.jurisdiction,
          summary: caseData.summary,
          fullText: caseData.fullText,
        },
        update: {},
      });
      // delete existing chunks for this case (if re-seeding)
      await prisma.caseChunk.deleteMany({
        where: { caseId: caseRecord.id },
      });
      const chunks = chunkText(caseData.fullText);
      console.log(
        `Generated ${chunks.length} chunks for case ${caseData.caseNumber}`,
      );
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        console.log(`  Processing chunk ${i + 1}/${chunks.length}...`);
        const embedding = await generateEmbedding(chunk);
        const embeddingString = `[${embedding.join(',')}]`;
        await prisma.$executeRawUnsafe(
          `INSERT INTO "CaseChunk" (id, "caseId", content, embedding)
          VALUES (gen_random_uuid(), $1, $2, $3::vector)`,
          caseRecord.id,
          chunk,
          embeddingString,
        );
      }
      console.log(
        `Seeded ${chunks.length} chunks for case ${caseData.caseNumber}`,
      );
    }
    console.log('Seeding complete');
  } catch (e) {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
