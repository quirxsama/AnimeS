'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchAnime } from '@/services/animeService';
import Link from 'next/link';
import Image from 'next/image';
import IconifyIcon from './IconifyIcon';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchAnimes = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await searchAnime(query);
        setResults(searchResults);
        setShowResults(true);
      } catch (error) {
        console.error('Arama hatası:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchAnimes, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchContainerRef}>
      <div className="relative">
        <label htmlFor="search-input" className="sr-only">Anime ara</label>
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Anime ara..."
          className="w-full px-4 py-3 bg-card-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors pr-10"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Aramayı temizle"
          >
            <IconifyIcon icon="material-symbols:close" width={20} height={20} />
          </button>
        )}
        {loading && (
          <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${query ? 'right-10' : 'right-3'}`}>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-accent-500"></div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div key="search-results">
            <div className="max-h-96 overflow-y-auto">
              {results.map((anime) => (
                <Link
                  key={`${anime.slug}-${anime.malID || Math.random()}`}
                  href={`/anime/${anime.slug}`}
                  className="block hover:bg-gray-700 transition-colors"
                  onClick={() => setShowResults(false)}
                >
                  <div className="flex items-center p-4">
                    <div className="relative h-16 w-12 flex-shrink-0">
                      <Image
                        src={anime.pictures.avatar || '/placeholder.jpg'}
                        alt={`${anime.turkish || anime.english || anime.romaji} - Anime Afişi`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-white font-semibold line-clamp-1">
                        {anime.turkish || anime.english || anime.romaji}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{anime.summary}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
