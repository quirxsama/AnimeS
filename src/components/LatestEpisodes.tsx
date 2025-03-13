'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Icon from './Icon';

interface LatestEpisodeProps {
  episodes: Array<{
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
    episode: number;
    season: number;
  }>;
}

export default function LatestEpisodes({ episodes }: LatestEpisodeProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const episodesPerPage = 6;
  const totalPages = Math.ceil(episodes.length / episodesPerPage);

  // Client tarafında mount olduğunda state'i güncelle
  useEffect(() => {
    setMounted(true);
  }, []);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentEpisodes = episodes.slice(
    currentPage * episodesPerPage,
    (currentPage + 1) * episodesPerPage
  );

  if (!mounted) {
    // Yükleme durumunda minimal bir yapı göster
    return (
      <div className="relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Son Eklenen Bölümler</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Yükleme durumunda iskelet yapısı göster */}
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
          <Icon icon="material-symbols:new-releases" className="text-accent-500" />
          <span>Son Eklenen Bölümler</span>
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
          {currentEpisodes.map((episode, index) => (
            <motion.div
              key={`${episode.slug}-${episode.season}-${episode.episode}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={`/watch/${episode.slug}/${episode.season}/${episode.episode}`}
                className="block bg-card-900 hover:bg-card-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 group h-full"
              >
                <motion.div 
                  className="relative aspect-[2/3]"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={episode.pictures.avatar}
                    alt={`${episode.turkish || episode.english || episode.romaji || episode.originalName} - Bölüm ${episode.episode}`}
                    fill
                    className="object-cover"
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
  <Icon icon="material-symbols:new-releases" className="text-accent-500" />
  {episode.english || episode.turkish || episode.japanese || episode.romaji || episode.originalName}
</h3>
                      <div className="flex flex-col gap-1">
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="px-2 py-1 bg-accent-600/90 rounded text-xs text-white inline-block w-fit flex items-center gap-1"
                        >
                          <Icon icon="material-symbols:tv-series" />
                          Sezon {episode.season}
                        </motion.span>
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="px-2 py-1 bg-background-800/90 rounded text-xs text-white inline-block w-fit flex items-center gap-1"
                        >
                          <Icon icon="material-symbols:playlist-play" />
                          Bölüm {episode.episode}
                        </motion.span>
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