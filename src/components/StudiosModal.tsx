'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';

interface StudiosModalProps {
  isOpen: boolean;
  onClose: (selected: string[]) => void;
  studios: string[];
  selectedStudios: string[];
}

export function StudiosModal({ isOpen, onClose, studios, selectedStudios: initialSelected }: StudiosModalProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSelected(initialSelected);
  }, [initialSelected]);

  const toggleStudio = (studio: string) => {
    const newSelected = selected.includes(studio)
      ? selected.filter(s => s !== studio)
      : [...selected, studio];
    setSelected(newSelected);
  };

  const filteredStudios = studios.filter(studio => 
    studio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className={`fixed inset-0 z-[9999] ${isOpen ? 'block' : 'hidden'}`}
      style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
    >
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card-900 p-6 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl border border-white/5"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Icon icon="material-symbols:movie-studio" />
              Stüdyolar
            </h2>
            <button onClick={() => onClose(selected)}>
              <Icon icon="material-symbols:close" className="text-2xl" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Stüdyo ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 mb-4 bg-card-800 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-custom-slate"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {filteredStudios.map((studio) => (
              <motion.button
                key={studio}
                onClick={() => toggleStudio(studio)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full text-sm transition-all duration-200 ${
                  selected.includes(studio)
                    ? 'bg-custom-slate text-white shadow-lg shadow-custom-slate/25'
                    : 'bg-card-800 text-white/70 hover:bg-card-700'
                }`}
              >
                {studio}
              </motion.button>
            ))}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => {
                setSelected([]);
                onClose([]);
              }}
              className="px-4 py-2 text-sm bg-card-800 rounded-full hover:bg-card-700 transition-all duration-200"
            >
              Temizle
            </button>
            <button
              onClick={() => onClose(selected)}
              className="px-4 py-2 text-sm bg-custom-slate hover:bg-custom-slate/80 rounded-full transition-all duration-200"
            >
              Uygula ({selected.length})
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
