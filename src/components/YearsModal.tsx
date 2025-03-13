'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';

interface YearsModalProps {
  isOpen: boolean;
  onClose: (selected: string[]) => void;
  years: number[];
  selectedYears: string[];
}

export function YearsModal({ isOpen, onClose, years, selectedYears: initialSelected }: YearsModalProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  useEffect(() => {
    setSelected(initialSelected);
  }, [initialSelected]);

  if (!isOpen) return null;

  const toggleYear = (year: number) => {
    const yearStr = year.toString();
    const newSelected = selected.includes(yearStr)
      ? selected.filter(y => y !== yearStr)
      : [...selected, yearStr];
    setSelected(newSelected);
  };

  const sortedYears = [...years].sort((a, b) => b - a);

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
              <Icon icon="material-symbols:calendar-month" />
              Yıllar
            </h2>
            <button onClick={() => onClose(selected)}>
              <Icon icon="material-symbols:close" className="text-2xl" />
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {sortedYears.map((year) => (
              <motion.button
                key={year}
                onClick={() => toggleYear(year)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full text-sm transition-all duration-200 ${
                  selected.includes(year.toString())
                    ? 'bg-custom-purple text-white shadow-lg shadow-custom-purple/25'
                    : 'bg-card-800 text-white/70 hover:bg-card-700'
                }`}
              >
                {year}
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
              className="px-4 py-2 text-sm bg-custom-purple hover:bg-custom-purpleDark rounded-full transition-all duration-200"
            >
              Uygula ({selected.length})
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
