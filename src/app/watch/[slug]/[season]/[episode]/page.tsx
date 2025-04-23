"use client"

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { getAnimeDetails, getAnimeEpisodes, getAniSkipData } from '@/services/animeService';
import { Loading, ErrorDisplay, VideoPlayer } from '@/components';
import { motion } from 'framer-motion';

interface SkipTimes {
  opening?: { start: number; end: number };
  ending?: { start: number; end: number };
}

interface Episode {
  seasonNumber: number;
  episode: number;
  title?: string;
  avatar?: string;
  malId?: number;
  airDate?: string;
  summary?: string;
  fansub?: {
    id: string;
    name: string;
    secureName: string;
    avatar: string;
    website: string;
    discord: string;
  };
  episodeData?: {
    avatar?: string;
    files?: Array<{
      file: string;
      resolution: number;
    }>;
    airDate?: string;
    summary?: string;
    fansub?: {
      id: string;
      name: string;
      secureName: string;
      avatar: string;
      website: string;
      discord: string;
    };
  };
}

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animeDetails, setAnimeDetails] = useState<any>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [skipTimes, setSkipTimes] = useState<SkipTimes | undefined>(undefined);
  const [selectedSeason, setSelectedSeason] = useState<number>(Number(params.season));

  // Sezonları grupla
  const seasons = useMemo(() => {
    const seasonMap = episodes.reduce((acc, episode) => {
      const season = episode.seasonNumber;
      if (!acc[season]) {
        acc[season] = [];
      }
      acc[season].push(episode);
      return acc;
    }, {} as Record<number, Episode[]>);

    return Object.entries(seasonMap)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([season, episodes]) => ({
        number: Number(season),
        episodes: episodes.sort((a, b) => a.episode - b.episode)
      }));
  }, [episodes]);

  // Seçili sezonun bölümlerini filtrele
  const filteredEpisodes = useMemo(() => {
    return episodes
      .filter(ep => ep.seasonNumber === selectedSeason)
      .sort((a, b) => a.episode - b.episode);
  }, [episodes, selectedSeason]);

  const loadAnimeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Anime detaylarını al
      const details = await getAnimeDetails(params.slug as string);
      setAnimeDetails(details);

      // Bölümleri al
      const allEpisodes = await getAnimeEpisodes(params.slug as string);
      
      // API'den gelen episodeData/avatar bilgisini episode nesnesine ekle
      const episodesWithAvatar = allEpisodes.map(episode => ({
        ...episode,
        avatar: episode.episodeData?.avatar || episode.avatar || episode.thumbnail
      }));
      
      setEpisodes(episodesWithAvatar);

      // Mevcut bölümü bul
      const episode = episodesWithAvatar.find(
        ep => ep.seasonNumber === Number(params.season) && ep.episode === Number(params.episode)
      );

      if (!episode) {
        throw new Error('Bölüm bulunamadı');
      }

      setCurrentEpisode(episode);

      // AniSkip verilerini al
      if (episode.malId) {
        try {
          const skipData = await getAniSkipData(episode.malId, episode.episode);
          setSkipTimes(skipData || undefined);
        } catch (err) {
          console.warn('AniSkip verileri alınamadı:', err);
        }
      }

    } catch (err) {
      console.error('Veri yüklenirken hata:', err);
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [params.slug, params.season, params.episode]);

  useEffect(() => {
    loadAnimeData();
  }, [loadAnimeData]);

  const handleTimeUpdate = (currentTime: number) => {
    // İzleme geçmişi kaldırıldı
  };

  const handleVideoEnd = () => {
    // Sonraki bölüme geç
    const currentIndex = episodes.findIndex(
      ep => ep.seasonNumber === Number(params.season) && ep.episode === Number(params.episode)
    );

    if (currentIndex < episodes.length - 1) {
      const nextEpisode = episodes[currentIndex + 1];
      router.push(`/watch/${params.slug}/${nextEpisode.seasonNumber}/${nextEpisode.episode}`);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Video Oynatıcı */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-card">
          <VideoPlayer
            animeSlug={params.slug as string}
            seasonNumber={Number(params.season)}
            episodeNumber={Number(params.episode)}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
          />
        </div>

        {/* Bölüm Bilgileri ve Navigasyon */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              {currentEpisode?.title || 'Bölüm ' + params.episode}
            </h1>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <span>{animeDetails?.english || animeDetails?.romaji}</span>
              <span>•</span>
              <span>Sezon {params.season}</span>
              <span>•</span>
              <span>Bölüm {params.episode}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const prevEp = episodes.find(
                  ep => ep.seasonNumber === Number(params.season) && ep.episode === Number(params.episode) - 1
                );
                if (prevEp) {
                  router.push(`/watch/${params.slug}/${prevEp.seasonNumber}/${prevEp.episode}`);
                }
              }}
              disabled={!episodes.some(
                ep => ep.seasonNumber === Number(params.season) && ep.episode === Number(params.episode) - 1
              )}
              className="px-4 py-2 rounded-lg bg-card hover:bg-accent disabled:opacity-50 
                         disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Önceki Bölüm</span>
            </button>

            <button
              onClick={() => {
                const nextEp = episodes.find(
                  ep => ep.seasonNumber === Number(params.season) && ep.episode === Number(params.episode) + 1
                );
                if (nextEp) {
                  router.push(`/watch/${params.slug}/${nextEp.seasonNumber}/${nextEp.episode}`);
                }
              }}
              disabled={!episodes.some(
                ep => ep.seasonNumber === Number(params.season) && ep.episode === Number(params.episode) + 1
              )}
              className="px-4 py-2 rounded-lg bg-card hover:bg-accent disabled:opacity-50 
                         disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <span>Sonraki Bölüm</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* İki Sütunlu İçerik */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sol Sütun - Bölüm Listesi */}
          <div className="flex-1 max-w-3xl">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">Bölümler</h2>
                <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm rounded-xl p-1.5 border border-border/50">
                  {seasons.map((season) => (
                    <button
                      key={season.number}
                      onClick={() => setSelectedSeason(season.number)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${selectedSeason === season.number
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 ring-2 ring-purple-500/20'
                          : 'hover:bg-accent text-muted-foreground hover:text-foreground hover:shadow-md'
                        }`}
                    >
                      Sezon {season.number}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredEpisodes.map((episode) => (
                  <motion.div
                    key={`${episode.seasonNumber}-${episode.episode}`}
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => router.push(`/watch/${params.slug}/${episode.seasonNumber}/${episode.episode}`)}
                    className={`group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200
                      ${episode.seasonNumber === Number(params.season) && 
                        episode.episode === Number(params.episode)
                          ? 'bg-purple-500/10 ring-2 ring-purple-500 shadow-lg shadow-purple-500/10'
                          : 'bg-card hover:bg-accent/50 hover:shadow-md'
                      }`}
                  >
                    {/* Bölüm Küçük Resmi */}
                    <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0 
                                  ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                      <div className="relative w-full h-full">
                        <Image
                          src={episode.avatar || animeDetails?.pictures?.banner || '/episode-placeholder.jpg'}
                          alt={`Bölüm ${episode.episode}`}
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          fill
                          sizes="128px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = animeDetails?.pictures?.banner || animeDetails?.pictures?.avatar || '/episode-placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                      <div className="absolute bottom-1.5 left-2 text-xs font-medium text-white/90 bg-black/50 
                                    px-1.5 py-0.5 rounded backdrop-blur-sm">
                        {episode.episode}. Bölüm
                      </div>
                    </div>

                    {/* Bölüm Bilgileri */}
                    <div className="flex-grow min-w-0">
                      <div className={`font-medium transition-colors duration-200
                        ${episode.seasonNumber === Number(params.season) && 
                          episode.episode === Number(params.episode)
                            ? 'text-purple-500'
                            : 'group-hover:text-purple-500'
                        }`}>
                        {episode.episode}. Bölüm
                      </div>
                      {episode.title && (
                        <div className="text-sm text-muted-foreground line-clamp-1 mt-1 group-hover:text-foreground/80 transition-colors">
                          {episode.title}
                        </div>
                      )}
                    </div>

                    {/* Oynat İkonu */}
                    <div className="flex-shrink-0 text-muted-foreground group-hover:text-purple-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ Sütun - Bilgiler ve Yorumlar */}
          <div className="lg:w-80 space-y-6">
            {/* Bölüm Detayları */}
            <div className="bg-card rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Bölüm Bilgileri</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Yayın Tarihi</span>
                  <span>{currentEpisode?.episodeData?.airDate || 'Bilinmiyor'}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fansub</span>
                  <span>{currentEpisode?.episodeData?.fansub?.name || 'Bilinmiyor'}</span>
                </div>

                {currentEpisode?.episodeData?.summary && (
                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-1">Özet</div>
                    <p className="text-sm">{currentEpisode.episodeData.summary}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Anime Bilgileri */}
            <div className="bg-card rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Anime Bilgileri</h3>
              
              <div className="space-y-2">
                {animeDetails?.japanese && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Japonca</span>
                    <span>{animeDetails.japanese}</span>
                  </div>
                )}
                
                {animeDetails?.type && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tür</span>
                    <span>{animeDetails.type.toUpperCase()}</span>
                  </div>
                )}

                {animeDetails?.summary && (
                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-1">Özet</div>
                    <p className="text-sm line-clamp-4">{animeDetails.summary}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Yorumlar Bölümü */}
            <div className="bg-card rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Yorumlar</h3>
              
              <div className="space-y-4">
                {/* Yorum Yok Durumu */}
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Henüz yorum yapılmamış</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
