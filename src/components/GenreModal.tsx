'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';

interface GenreModalProps {
  isOpen: boolean;
  onClose: (selected: string[]) => void;
  genres: string[];
  selectedGenres: string[];
}

export function GenreModal({ isOpen, onClose, genres, selectedGenres: initialSelected }: GenreModalProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  useEffect(() => {
    setSelected(initialSelected);
  }, [initialSelected]);

  const toggleGenre = (genre: string) => {
    const newSelected = selected.includes(genre)
      ? selected.filter(g => g !== genre)
      : [...selected, genre];
    setSelected(newSelected);
  };

  return (
    <div 
      className={`absolute inset-0 z-[99999] ${isOpen ? 'block' : 'hidden'}`}
      style={{ 
        background: 'rgba(0, 0, 0, 0.7)', 
        backdropFilter: 'blur(8px)',
      }}
      onClick={() => onClose(selected)}
    >
      <div className="absolute inset-0 flex items-start justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          className="relative bg-card-900 p-6 rounded-2xl max-w-2xl w-full mt-20 shadow-2xl border border-white/10"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Türler</h2>
            <button onClick={() => onClose(selected)}>
              <Icon icon="material-symbols:close" className="text-2xl" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {genres.map((genre) => (
              <motion.button
                key={genre}
                onClick={() => toggleGenre(genre)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded text-sm transition-colors ${
                  selected.includes(genre)
                    ? 'bg-accent-500 text-white'
                    : 'bg-card-800 text-white/70 hover:bg-card-700'
                }`}
              >
                {genre}
              </motion.button>
            ))}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => {
                setSelected([]);
                onClose([]);
              }}
              className="px-4 py-2 text-sm bg-card-800 rounded hover:bg-card-700"
            >
              Temizle
            </button>
            <button
              onClick={() => onClose(selected)}
              className="px-4 py-2 text-sm bg-accent-500 rounded hover:bg-accent-600"
            >
              Uygula ({selected.length})
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
