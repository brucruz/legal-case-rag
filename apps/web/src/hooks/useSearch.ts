import { useState } from 'react';

interface Case {
  id: string;
  caseNumber: string;
  celexId?: string;
  title: string;
  court: string;
  date: string;
  jurisdiction: string;
  summary: string;
  sourceUrl?: string;
}

export interface SearchResult {
  case: Case;
  relevantChunk: string;
  similarity: number;
}

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query SearchCases($query: String!, $limit: Int) {
              searchCases(query: $query, limit: $limit) {
                similarity
                relevantChunk
                case {
                  id
                  caseNumber
                  celexId
                  title
                  court
                  date
                  jurisdiction
                  summary
                  sourceUrl
                }
              }
            }
          `,
          variables: { query, limit: 10 },
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      setResults(data.data.searchCases);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return { results, loading, error, search, clearResults };
}

