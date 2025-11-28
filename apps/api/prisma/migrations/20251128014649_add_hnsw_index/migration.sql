-- CreateIndex
CREATE INDEX "CaseChunk_embedding_idx" ON "CaseChunk" USING hnsw (embedding vector_cosine_ops);