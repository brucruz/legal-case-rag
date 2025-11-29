# Legal Case RAG 🔍⚖️

> A semantic search engine for European court cases, powered by AI embeddings and vector similarity search.

![Legal Case Search Demo](docs/screenshot.png)

## Overview

This project demonstrates a full-stack legal research tool that uses **Retrieval-Augmented Generation (RAG)** to search through EU court cases. Instead of keyword matching, it uses OpenAI embeddings to understand the _meaning_ of your query and find semantically relevant passages.

**Example queries:**

- "right to be forgotten"
- "data controller obligations under GDPR"
- "consent requirements for cookies"
- "personal data processing by search engines"

---

## ✨ Features

- **Semantic Search** — Find cases by meaning, not just keywords
- **Vector Similarity** — pgvector with HNSW index for fast cosine similarity
- **Chunk-level Retrieval** — Returns the most relevant excerpt from each case
- **Similarity Scores** — See how closely each result matches your query
- **EUR-Lex Integration** — Direct links to official case sources

---

## 🛠 Tech Stack

| Layer          | Technology                                        |
| -------------- | ------------------------------------------------- |
| **Backend**    | NestJS with TypeScript                            |
| **API**        | GraphQL (Apollo Server)                           |
| **ORM**        | Prisma                                            |
| **Database**   | PostgreSQL + pgvector extension                   |
| **Embeddings** | OpenAI `text-embedding-3-small` (1536 dimensions) |
| **Frontend**   | React + Vite                                      |
| **Styling**    | Custom CSS (Crimson Pro + IBM Plex Sans)          |
| **Monorepo**   | npm workspaces                                    |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- OpenAI API key

### 1. Clone and install

```bash
git clone https://github.com/brucruz/legal-case-rag.git
cd legal-case-rag
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### 3. Start the database

```bash
docker-compose up -d
```

### 4. Run migrations and seed

```bash
cd apps/api
npx prisma migrate dev
npm run db:seed
```

### 5. Start the servers

**Terminal 1 — API:**

```bash
cd apps/api
npm run start:dev
```

**Terminal 2 — Frontend:**

```bash
cd apps/web
npm run dev
```

### 6. Open the app

- **Frontend:** http://localhost:5173
- **GraphQL Playground:** http://localhost:3000/graphql

---

## 📁 Project Structure

```
legal-case-rag/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── cases/          # Cases module (service, resolver, DTOs)
│   │   │   ├── embeddings/     # OpenAI embeddings service
│   │   │   └── database/       # Prisma database service
│   │   └── prisma/
│   │       ├── schema.prisma   # Database schema
│   │       └── seed.ts         # Seeding script
│   │
│   └── web/                    # React frontend
│       └── src/
│           ├── App.tsx         # Main search UI
│           ├── App.css         # Custom styling
│           └── hooks/
│               └── useSearch.ts # GraphQL search hook
│
├── data/
│   ├── cases.json              # Case metadata
│   └── texts/                  # Full judgment texts
│
└── docker-compose.yml          # PostgreSQL + pgvector
```

---

## 🔌 GraphQL API

### Search Cases

```graphql
query SearchCases($query: String!, $limit: Int) {
  searchCases(query: $query, limit: $limit) {
    similarity
    relevantChunk
    case {
      id
      caseNumber
      title
      court
      date
      jurisdiction
      summary
      sourceUrl
    }
  }
}
```

---

## 🏗 Architecture Decisions

| Decision                      | Rationale                                                      |
| ----------------------------- | -------------------------------------------------------------- |
| **pgvector over Pinecone**    | Self-hosted, no vendor lock-in, works with existing PostgreSQL |
| **HNSW index**                | Faster approximate nearest neighbor search than IVFFlat        |
| **Chunk-based retrieval**     | Better precision than whole-document embeddings                |
| **~1500 char chunks**         | Balances context vs. embedding quality                         |
| **text-embedding-3-small**    | Good quality/cost ratio for legal text                         |
| **Raw SQL for vector search** | Prisma doesn't fully support pgvector operations yet           |
| **GraphQL**                   | Type-safe API, easy frontend integration                       |
| **Custom CSS**                | Full control over legal-themed design                          |

---

## 📊 Sample Data

The database is seeded with landmark EU court cases focused on:

- **GDPR & Data Protection** — Schrems I & II, Google Spain
- **Privacy Rights** — Right to be forgotten, cookie consent
- **Platform Liability** — Facebook fan pages, joint controllers

Cases are sourced from [EUR-Lex](https://eur-lex.europa.eu/) with English translations.

---

## 🎨 Design

The UI uses a legal-inspired design system:

- **Colors:** Navy (#1a1f35), Paper (#f8f5f0), Gold (#c9a227)
- **Fonts:** Crimson Pro (headings), IBM Plex Sans (body)
- **Cards:** Gold left-border accent, similarity badges
- **Layout:** Clean, generous whitespace

---

## 🔮 What I'd Add With More Time

- [ ] **More cases** — Expand to 50+ landmark EU cases
- [ ] **Filters** — By court, jurisdiction, date range, topic
- [ ] **Case detail view** — Full judgment text with highlighted matches
- [ ] **Citation graph** — Show how cases reference each other
- [ ] **RAG chat** — Ask questions and get AI-synthesized answers
- [ ] **Batch embedding** — Parallel processing for faster seeding
- [ ] **Caching** — Redis for frequently searched queries
- [ ] **Authentication** — User accounts and saved searches
- [ ] **Row-level security** — Fine-grained data access control
- [ ] **Deployment** — Docker build + fly.io or Railway

---

## 🧪 Testing the Search

Try these queries to see semantic search in action:

| Query                       | What it finds                              |
| --------------------------- | ------------------------------------------ |
| "right to be forgotten"     | Google Spain case on delisting             |
| "data controller"           | Cases defining controller responsibilities |
| "consent"                   | Cookie consent, GDPR consent requirements  |
| "search engine obligations" | Platform liability cases                   |

---

## 📝 License

MIT

---

## 👤 Author

**Bruno Cruz**  
[GitHub](https://github.com/brucruz) · [LinkedIn](https://linkedin.com/in/brunogcruz)

Built as a demonstration of full-stack skills with NestJS, GraphQL, Prisma, pgvector, and React.
