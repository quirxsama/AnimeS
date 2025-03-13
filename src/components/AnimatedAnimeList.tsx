'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Anime {
  id: string;
  type: string;
  pictures: {
    banner: string;
    avatar: string;
  };
  turkish: string;
  english: string;
  summary: string;
  genres: string[];
  tmdbScore: number;
  slug: string;
}

export default function AnimatedAnimeList() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    fetchAnimes();
  }, [page, searchQuery, selectedGenre]);

  const fetchAnimes = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openani.me/anime?page=${page}&keywords=${searchQuery}&score=&date=`
      );
      const data = await response.json();
      
      // API'den gelen verileri düzenle ve tekrarları önle
      const formattedAnimes = data.animes?.map((anime: any) => ({
        id: anime.id || `${anime.slug}-${Math.random().toString(36).substr(2, 9)}`,
        type: anime.type || 'TV',
        pictures: {
          banner: anime.pictures?.banner || '',
          avatar: anime.pictures?.avatar || '/placeholder.jpg'
        },
        turkish: anime.turkish || anime.title?.turkish || '',
        english: anime.english || anime.title?.english || '',
        summary: anime.summary || anime.description || '',
        genres: anime.genres || [],
        tmdbScore: anime.tmdbScore || 0,
        slug: anime.slug
      }));

      // Tekrarlanan animeleri filtrele
      const uniqueAnimes = formattedAnimes?.filter((anime: Anime, index: number, self: Anime[]) =>
        index === self.findIndex((a: Anime) => a.slug === anime.slug)
      ) || [];

      setAnimes(uniqueAnimes);
    } catch (error) {
      console.error('Animeler yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-24"
    >
      {/* Arama ve Filtreleme */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8 space-y-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Anime ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors duration-300"
            />
          </div>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors duration-300"
          >
            <option value="">Tüm Türler</option>
            <option value="Aksiyon">Aksiyon</option>
            <option value="Macera">Macera</option>
            <option value="Komedi">Komedi</option>
            <option value="Dram">Dram</option>
            <option value="Fantezi">Fantezi</option>
            <option value="Romantik">Romantik</option>
            <option value="Bilim Kurgu">Bilim Kurgu</option>
            <option value="Günlük Yaşam">Günlük Yaşam</option>
            <option value="Spor">Spor</option>
            <option value="Doğaüstü">Doğaüstü</option>
            <option value="Gizem">Gizem</option>
            <option value="Psikolojik">Psikolojik</option>
            <option value="Okul">Okul</option>
            <option value="Müzik">Müzik</option>
          </select>
        </div>
      </motion.div>

      {/* Anime Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {animes.map((anime) => (
          <motion.div
            key={`${anime.slug}-${anime.id}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={`/anime/${anime.slug}`}
              className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg group relative"
            >
              <div className="relative aspect-[2/3]">
                <Image
                  src={anime.pictures.avatar}
                  alt={anime.turkish || anime.english}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {anime.genres.slice(0, 3).map((genre, index) => (
                        <span 
                          key={index} 
                          className="text-xs px-2 py-1 bg-purple-600/50 rounded-full text-white"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-3">
                      {anime.summary}
                    </p>
                  </div>
                </div>
                {anime.tmdbScore && (
                  <div className="absolute top-2 right-2 bg-black/80 text-yellow-400 px-2 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                    ★ {anime.tmdbScore.toFixed(1)}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                  {anime.turkish || anime.english}
                </h3>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="capitalize">{anime.type}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Sayfalama */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 flex justify-center gap-4"
      >
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            page === 1
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          Önceki Sayfa
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-6 py-3 rounded-full font-medium bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Sonraki Sayfa
        </button>
      </motion.div>
    </motion.div>
  );
}
