'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchAnime, type AnimeSearchResult } from '@/services/animeService';
import Link from 'next/link';
import Image from 'next/image';
import IconifyIcon from './IconifyIcon';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AnimeSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowResults(false);
        inputRef.current?.blur();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
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

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchContainerRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Anime ara..."
          aria-label="Anime ara"
          className="w-full px-4 py-3 bg-card-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors pr-10"
        />
        {loading ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-accent-500"></div>
          </div>
        ) : query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            aria-label="Aramayı temizle"
          >
            <IconifyIcon icon="material-symbols:close" width="20px" height="20px" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute w-full mt-2 bg-card-800 rounded-lg shadow-xl z-50 overflow-hidden ring-1 ring-white/10"
          >
            {results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {results.map((anime) => (
                  <Link
                    key={`${anime.slug}-${anime.malID || Math.random()}`}
                    href={`/anime/${anime.slug}`}
                    className="block hover:bg-gray-700/50 transition-colors border-b border-white/5 last:border-0"
                    onClick={() => setShowResults(false)}
                  >
                    <div className="flex items-center p-4">
                      <div className="relative h-16 w-12 flex-shrink-0 bg-gray-700 rounded overflow-hidden">
                        <Image
                          src={anime.pictures.avatar || '/placeholder.jpg'}
                          alt={`${anime.turkish || anime.english || anime.romaji} - Anime Afişi`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <h3 className="text-white font-semibold line-clamp-1 text-sm">
                          {anime.turkish || anime.english || anime.romaji}
                        </h3>
                        <p className="text-gray-400 text-xs line-clamp-2 mt-1">
                          {anime.summary || 'Özet bulunmuyor.'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              !loading && query.length >= 2 && (
                <div className="p-8 text-center text-gray-400">
                  <IconifyIcon icon="material-symbols:search-off" className="text-4xl mb-2 opacity-50" />
                  <p>&quot;{query}&quot; için sonuç bulunamadı.</p>
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
