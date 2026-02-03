'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Icon from './Icon';

interface PopularAnimeProps {
  animes: Array<{
    pictures: {
      banner: string;
      avatar: string;
    };
    english: string;
    turkish: string;
    japanese: string | null;
    romaji: string | null;
    originalName: string;
    slug: string;
    type: string;
    summary: string;
  }>;
}

export default function PopularAnimes({ animes }: PopularAnimeProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const animesPerPage = 6;
  const totalPages = Math.ceil(animes.length / animesPerPage);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentAnimes = animes.slice(
    currentPage * animesPerPage,
    (currentPage + 1) * animesPerPage
  );

  if (!mounted) {
    return (
      <div className="relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Popüler Animeler</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-card-900/50 rounded-lg overflow-hidden shadow-lg aspect-[2/3] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div className="flex justify-between items-center mb-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-white flex items-center gap-2"
        >
          <Icon icon="material-symbols:trending-up" className="text-accent-500" />
          <span>Popüler Animeler</span>
        </motion.h2>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {currentPage + 1} / {totalPages} Sayfa
          </span>
          <div className="flex gap-2">
            <motion.button
              onClick={prevPage}
              whileHover={currentPage !== 0 ? { scale: 1.1 } : {}}
              whileTap={currentPage !== 0 ? { scale: 0.9 } : {}}
              aria-label="Önceki Sayfa"
              className={`p-2 rounded-full transition-all duration-300 relative overflow-hidden
                ${currentPage === 0 
                  ? 'bg-card-900/50 cursor-not-allowed opacity-50' 
                  : 'bg-card-800 hover:bg-card-700'}`}
              disabled={currentPage === 0}
            >
              <motion.div
                className="absolute inset-0 bg-accent-500/20"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <Icon icon="material-symbols:arrow-back-rounded" className="text-2xl relative z-10" />
            </motion.button>

            <motion.button
              onClick={nextPage}
              whileHover={currentPage !== totalPages - 1 ? { scale: 1.1 } : {}}
              whileTap={currentPage !== totalPages - 1 ? { scale: 0.9 } : {}}
              aria-label="Sonraki Sayfa"
              className={`p-2 rounded-full transition-all duration-300 relative overflow-hidden
                ${currentPage === totalPages - 1 
                  ? 'bg-card-900/50 cursor-not-allowed opacity-50' 
                  : 'bg-card-800 hover:bg-card-700'}`}
              disabled={currentPage === totalPages - 1}
            >
              <motion.div
                className="absolute inset-0 bg-accent-500/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <Icon icon="material-symbols:arrow-forward-rounded" className="text-2xl relative z-10" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {currentAnimes.map((anime, index) => (
            <motion.div
              key={anime.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={`/anime/${anime.slug}`}
                className="block bg-card-900 hover-effect hover-brightness rounded-lg overflow-hidden shadow-lg transition-all duration-300 group h-full"
              >
                <motion.div 
                  className="relative aspect-[2/3]"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={anime.pictures.avatar}
                    alt={anime.turkish || anime.english || anime.romaji || anime.originalName}
                    fill
                    className="object-cover hover-brightness"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16.666vw"
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-background-900/90 via-background-900/20 to-transparent"
                    initial={{ opacity: 0.6 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.div 
                      className="absolute bottom-0 p-4 w-full"
                      initial={{ y: 10, opacity: 0.8 }}
                      whileHover={{ y: 0, opacity: 1 }}
                    >
                      <h3 className="text-base font-medium text-white mb-2 line-clamp-2 flex items-center gap-2">
  <Icon icon="material-symbols:movie" className="text-accent-500" />
  {anime.english || anime.turkish || anime.japanese || anime.romaji || anime.originalName}
</h3>
                      <div className="flex flex-col gap-1">
                      <motion.span
  whileHover={{ scale: 1.05 }}
  className="px-2 py-1 bg-accent-600/90 rounded text-xs text-white inline-block w-fit flex items-center gap-1"
>
  <Icon icon="material-symbols:star" />
  IMDB
</motion.span>
                        <motion.p
                          className="text-xs text-gray-300 line-clamp-2 mt-1"
                        >
                          {anime.summary}
                        </motion.p>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 