'use client';

import { useState } from 'react';
import Icon from './Icon';

interface GenreFilterProps {
  genres: string[];
  years: number[];
  studios: string[];
  onFilterChange: (filters: {
    genres: string[];
    years: number[];
    studios: string[];
  }) => void;
}

export default function GenreFilter({ genres, years, studios, onFilterChange }: GenreFilterProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedStudio, setSelectedStudio] = useState<string>('');

  const handleGenreChange = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(newGenres);
    onFilterChange({
      genres: newGenres,
      years: selectedYear ? [parseInt(selectedYear)] : [],
      studios: selectedStudio ? [selectedStudio] : []
    });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-card-900 rounded-xl">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm mb-2 text-white/70">Türler</label>
        <div className="flex flex-wrap gap-2">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => handleGenreChange(genre)}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                selectedGenres.includes(genre)
                  ? 'bg-accent-500 text-white'
                  : 'bg-card-800 text-white/70 hover:bg-card-700'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="w-48">
        <label className="block text-sm mb-2 text-white/70">Yıl</label>
        <select
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            onFilterChange({
              genres: selectedGenres,
              years: e.target.value ? [parseInt(e.target.value)] : [],
              studios: selectedStudio ? [selectedStudio] : []
            });
          }}
          className="w-full px-4 py-2 bg-card-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          <option value="">Tüm Yıllar</option>
          {years.sort((a, b) => b - a).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="w-48">
        <label className="block text-sm mb-2 text-white/70">Stüdyo</label>
        <select
          value={selectedStudio}
          onChange={(e) => {
            setSelectedStudio(e.target.value);
            onFilterChange({
              genres: selectedGenres,
              years: selectedYear ? [parseInt(selectedYear)] : [],
              studios: e.target.value ? [e.target.value] : []
            });
          }}
          className="w-full px-4 py-2 bg-card-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          <option value="">Tüm Stüdyolar</option>
          {studios.sort().map(studio => (
            <option key={studio} value={studio}>{studio}</option>
          ))}
        </select>
      </div>

      {(selectedGenres.length > 0 || selectedYear || selectedStudio) && (
        <button
          onClick={() => {
            setSelectedGenres([]);
            setSelectedYear('');
            setSelectedStudio('');
            onFilterChange({ genres: [], years: [], studios: [] });
          }}
          className="px-4 py-2 bg-card-800 text-sm rounded-lg hover:bg-card-700 transition-colors flex items-center gap-2"
        >
          <Icon icon="material-symbols:filter-alt-off" />
          Filtreleri Temizle
        </button>
      )}
    </div>
  );
}
