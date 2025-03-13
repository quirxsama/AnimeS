"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import debounce from 'lodash/debounce';
import axios from 'axios';
import { Star, Calendar, Tag } from 'lucide-react';

interface FilterProps {
  onFilterChange: (filters: {
    categories: string[];
    score: [number, number];
    dateRange: [number, number];
  }) => void;
  isInitialLoad?: boolean;
}

const categories = [
  "dram", "aksiyon", "aksiyon - macera", "komedi", "bilim kurgu", "bilim kurgu - fantazi",
  "korku", "gizem", "romantizm", "tarihi", "büyü", "spor", "isekai", "askeri",
  "savaş - politik", "polisiye", "ölüm", "gizli organizasyon", "ecchi", "harem",
  "ters harem", "vampir", "kan, vahşet", "shounen", "shounen ai", "seinen", "canavar",
  "doğaüstü", "şeytan", "intikam", "zaman yolculuğu", "okul", "uzay", "shoujo",
  "oyun", "samuray", "ninja", "yaşamdan kesitler", "iş hayatı", "dövüş sanatları",
  "yuri", "yaoi"
];

const currentYear = new Date().getFullYear();

export default function AnimeFilters({ onFilterChange, isInitialLoad = true }: FilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 10]);
  const [yearRange, setYearRange] = useState<[number, number]>([1950, currentYear]);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const cancelTokenRef = useRef<any>(null);
  const previousFiltersRef = useRef<string>('');

  const areFiltersChanged = (newFilters: any) => {
    const newFiltersStr = JSON.stringify(newFilters);
    const hasChanged = previousFiltersRef.current !== newFiltersStr;
    previousFiltersRef.current = newFiltersStr;
    return hasChanged;
  };

  // Debounce edilmiş filtre değişikliği
  const debouncedFilterChange = useCallback(
    debounce(async (filters) => {
      // Filtreler değişmediyse istek gönderme
      if (!areFiltersChanged(filters)) {
        return;
      }

      try {
        setIsLoading(true);
        // Önceki isteği iptal et
        if (cancelTokenRef.current) {
          cancelTokenRef.current.cancel('Yeni istek yapıldı');
        }

        // Yeni bir cancel token oluştur
        cancelTokenRef.current = axios.CancelToken.source();

        await onFilterChange({
          ...filters,
          cancelToken: cancelTokenRef.current.token
        });
      } finally {
        setIsLoading(false);
      }
    }, 800), // Debounce süresini 800ms'ye çıkardım
    [onFilterChange]
  );

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      if (isInitialLoad) {
        // İlk yüklemede filtre değerlerini kaydet
        const initialFilters = {
          categories: selectedCategories,
          score: scoreRange,
          dateRange: yearRange
        };
        previousFiltersRef.current = JSON.stringify(initialFilters);
        
        // İlk yüklemede debounce olmadan direk çağır
        onFilterChange(initialFilters);
      }
      return;
    }

    const filters = {
      categories: selectedCategories,
      score: scoreRange,
      dateRange: yearRange,
    };

    // İlk render değilse debounce kullan
    debouncedFilterChange(filters);

    return () => {
      // Temizlik işlemi
      debouncedFilterChange.cancel();
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Bileşen kaldırıldı');
      }
    };
  }, [selectedCategories, scoreRange, yearRange, debouncedFilterChange, isFirstRender, isInitialLoad, onFilterChange]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev =>
      checked ? [...prev, category] : prev.filter(c => c !== category)
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <Tag className="w-5 h-5 text-purple-400" />
          <h3>Kategoriler</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2 group">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category, checked as boolean)
                }
                disabled={isLoading}
                className="border-purple-400 data-[state=checked]:bg-purple-400 data-[state=checked]:border-purple-400"
              />
              <label 
                htmlFor={category} 
                className="text-sm cursor-pointer capitalize group-hover:text-purple-400 transition-colors"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <Star className="w-5 h-5 text-purple-400" />
          <h3>Puan Aralığı</h3>
        </div>
        <div className="px-2">
          <Slider
            value={[scoreRange[0], scoreRange[1]]}
            onValueChange={(value) => setScoreRange([value[0], value[1]])}
            min={0}
            max={10}
            step={0.1}
            disabled={isLoading}
            className="w-full [&_.bg-primary]:bg-purple-400"
          />
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-purple-400 font-medium">{scoreRange[0].toFixed(1)}</span>
            <span className="text-purple-400 font-medium">{scoreRange[1].toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <Calendar className="w-5 h-5 text-purple-400" />
          <h3>Yayın Yılı</h3>
        </div>
        <div className="px-2">
          <Slider
            value={[yearRange[0], yearRange[1]]}
            onValueChange={(value) => setYearRange([value[0], value[1]])}
            min={1950}
            max={currentYear}
            step={1}
            disabled={isLoading}
            className="w-full [&_.bg-primary]:bg-purple-400"
          />
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-purple-400 font-medium">{yearRange[0]}</span>
            <span className="text-purple-400 font-medium">{yearRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 