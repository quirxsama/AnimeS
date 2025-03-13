"use client"

import React, { useState, useRef, useEffect } from 'react'
import AnimeFilters from '@/components/AnimeFilters'
import { getFilteredAnimes, type AnimeFilters as FilterType } from '@/services/animeService'
import AnimeCard from '@/components/AnimeCard'
import { motion, AnimatePresence } from 'framer-motion'
import axios, { CancelTokenSource } from 'axios'
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AnimeResult {
  id: string;
  slug: string;
  title: string;
  summary: string;
  pictures: {
    avatar: string;
  };
}

export default function BrowsePage() {
  const [animes, setAnimes] = useState<AnimeResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource | null>(null)
  const lastFilterRef = useRef<FilterType | null>(null)
  const isMobileFilterChangeRef = useRef(false)

  useEffect(() => {
    // İlk yüklemede filtreleri uygula
    if (isInitialLoad) {
      handleFilterChange({});
    }
  }, []);

  const handleFilterChange = async (filters: FilterType) => {
    try {
      // Eğer mobil filtre değişikliği ise ve modal henüz kapanmamışsa işlemi yapma
      if (isMobileFilterChangeRef.current && showMobileFilters) {
        return;
      }

      // Önceki isteği iptal et
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Yeni istek yapıldı')
      }

      // Eğer filtreler değişmediyse ve ilk yükleme değilse, isteği yapma
      if (!isInitialLoad && JSON.stringify(lastFilterRef.current) === JSON.stringify(filters)) {
        return
      }

      // Yeni bir cancel token oluştur
      cancelTokenRef.current = axios.CancelToken.source()
      lastFilterRef.current = filters

      setLoading(true)
      setError(null)

      const response = await getFilteredAnimes({ 
        ...filters, 
        page: currentPage 
      }, cancelTokenRef.current.token)
      
      if (response === null) {
        return
      }
      
      const animeData = response?.animes || response || []
      if (!Array.isArray(animeData)) {
        throw new Error('Geçersiz API yanıtı')
      }

      setAnimes(animeData.map(anime => ({
        id: anime.id || anime.slug,
        slug: anime.slug,
        title: anime.title?.turkish || anime.turkish || anime.title?.english || anime.english || anime.title?.romaji || anime.romaji,
        summary: anime.summary || anime.description || '',
        pictures: {
          avatar: anime.pictures?.avatar || anime.pictures?.poster || ''
        }
      })))

      setTotalPages(response.totalPages || 1)
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('İstek iptal edildi:', err.message)
        return
      }
      setError('Animeler yüklenirken bir hata oluştu')
      console.error(err)
    } finally {
      setLoading(false)
      setIsInitialLoad(false)
      isMobileFilterChangeRef.current = false
    }
  }

  // Bileşen temizlendiğinde aktif istekleri iptal et
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Bileşen kaldırıldı')
      }
    }
  }, [])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    handleFilterChange({ page: newPage })
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col space-y-4 md:space-y-8">
          {/* Başlık ve Filtre Bölümü */}
          <div className="flex items-center justify-between relative z-20">
            <div className="flex items-center space-x-4">
              <Search className="w-6 h-6 text-muted-foreground" />
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                Anime Keşfet
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden flex items-center space-x-2"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtreler</span>
              </Button>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {animes.length} sonuç
              </span>
            </div>
          </div>

          {/* Sayfalama - Üst */}
          {!loading && animes.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center space-x-2 sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Önceki</span>
              </Button>
              <div className="flex items-center space-x-2 px-4 text-sm">
                <span className="font-medium">{currentPage}</span>
                <span className="text-muted-foreground">/ {totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="flex items-center space-x-2"
              >
                <span className="hidden sm:inline">Sonraki</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-8">
            {/* Masaüstü Filtreler */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block lg:col-span-1 h-fit sticky top-20"
            >
              <div className="bg-card rounded-lg p-4 shadow-lg backdrop-blur-sm bg-opacity-90">
                <AnimeFilters onFilterChange={handleFilterChange} isInitialLoad={isInitialLoad} />
              </div>
            </motion.div>

            {/* Anime Listesi */}
            <div className="lg:col-span-4">
              {error ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/10 text-red-500 rounded-lg p-4 text-center"
                >
                  <p>{error}</p>
                </motion.div>
              ) : loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : animes.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-lg p-8 text-center"
                >
                  <p className="text-lg text-muted-foreground">Sonuç bulunamadı</p>
                </motion.div>
              ) : (
                <motion.div 
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
                >
                  {animes.map((anime) => (
                    <motion.div key={anime.id} variants={item}>
                      <AnimeCard anime={anime} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Sayfalama - Alt */}
              {!loading && animes.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center space-x-2 mt-8"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Önceki</span>
                  </Button>
                  <div className="flex items-center space-x-2 px-4 text-sm">
                    <span className="font-medium">{currentPage}</span>
                    <span className="text-muted-foreground">/ {totalPages}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="flex items-center space-x-2"
                  >
                    <span className="hidden sm:inline">Sonraki</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobil Filtreler */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
              >
                <div className="fixed inset-x-0 top-0 bg-card p-4 shadow-lg max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Filtreler</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowMobileFilters(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <AnimeFilters 
                    onFilterChange={(filters) => {
                      isMobileFilterChangeRef.current = true;
                      setShowMobileFilters(false);
                      setTimeout(() => {
                        handleFilterChange(filters);
                      }, 300);
                    }} 
                    isInitialLoad={false} 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
} 