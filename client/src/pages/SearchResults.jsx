import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery().get('query') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        // Mangadex search API with title filter
        const res = await fetch(`https://api.mangadex.org/manga?title=${encodeURIComponent(query)}&limit=20&includes[]=cover_art`);
        const data = await res.json();
        console.log(data);
        setResults(data.data || []);
      } catch (err) {
        console.error('Error fetching search results', err);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  if (!query) return <p>Please enter a search term.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Search results for: "{query}"</h2>

      {loading && <p>Loading...</p>}

      {!loading && results.length === 0 && <p>No results found.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {results.map((manga) => {
          const cover = manga.relationships.find(r => r.type === 'cover_art' || r.type === 'manga');
          const coverUrl = cover
            ? `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}.512.jpg`
            : 'https://via.placeholder.com/512x700?text=No+Cover';

          return (
            <Link key={manga.id} to={`/manga/${manga.id}`} className="group block rounded overflow-hidden shadow hover:shadow-lg">
              <img src={coverUrl} alt={manga.attributes.title.en} className="w-full h-auto" />
              <h3 className="mt-2 text-sm font-semibold line-clamp-2">{manga.attributes.title.en || 'No Title'}</h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
