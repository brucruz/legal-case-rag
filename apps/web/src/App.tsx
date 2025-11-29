import { useState, FormEvent } from 'react';
import { useSearch } from './hooks/useSearch';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const { results, loading, error, search } = useSearch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    search(query);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatSimilarity = (similarity: number) => {
    return `${(similarity * 100).toFixed(1)}%`;
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Legal Case Search</h1>
        <p className="subtitle">
          Semantic search across European court cases using AI embeddings
        </p>
      </header>

      <main className="main">
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for legal concepts, e.g. 'right to be forgotten' or 'data controller obligations'"
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {results.length > 0 && (
          <div className="results">
            <h2 className="results-title">
              Found {results.length} relevant case{results.length !== 1 ? 's' : ''}
            </h2>
            <div className="results-list">
              {results.map((result, index) => (
                <article key={`${result.case.id}-${index}`} className="case-card">
                  <div className="case-header">
                    <span className="case-number">{result.case.caseNumber}</span>
                    <span className="similarity-badge">
                      {formatSimilarity(result.similarity)} match
                    </span>
                  </div>
                  <h3 className="case-title">{result.case.title}</h3>
                  <div className="case-meta">
                    <span className="court">{result.case.court}</span>
                    <span className="separator">•</span>
                    <span className="date">{formatDate(result.case.date)}</span>
                    <span className="separator">•</span>
                    <span className="jurisdiction">{result.case.jurisdiction}</span>
                  </div>
                  <div className="relevant-chunk">
                    <strong>Relevant excerpt:</strong>
                    <p>{result.relevantChunk}</p>
                  </div>
                  <p className="summary">{result.case.summary}</p>
                  {result.case.sourceUrl && (
                    <a
                      href={result.case.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-link"
                    >
                      View on EUR-Lex →
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {!loading && results.length === 0 && query && !error && (
          <div className="no-results">
            <p>No results found. Try a different search query.</p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          Built with NestJS, GraphQL, Prisma, PostgreSQL + pgvector, and React
        </p>
      </footer>
    </div>
  );
}

export default App;
