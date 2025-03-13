'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getAnimeDetails, getAnimeEpisodes, type AnimeDetails, type AnimeEpisode } from '@/services/animeService';
import { Loading, ErrorDisplay } from '@/components';

export default function AnimePage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [episodes, setEpisodes] = useState<AnimeEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonEpisodes, setSeasonEpisodes] = useState<AnimeEpisode[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching anime details for:', slug);
        const animeData = await getAnimeDetails(slug);
        
        if (!isMounted) return;
        
        console.log('Fetching episodes for:', slug);
        const episodesData = await getAnimeEpisodes(slug);
        
        if (!isMounted) return;
        
        setAnime(animeData);
        setEpisodes(episodesData);
        
      } catch (err) {
        console.error('Fetch error:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Veri yüklenemedi');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (episodes.length > 0) {
      const filteredEpisodes = episodes.filter(ep => ep.seasonNumber === selectedSeason);
      setSeasonEpisodes(filteredEpisodes);
    }
  }, [selectedSeason, episodes]);

  const handleEpisodeSelect = (episode: AnimeEpisode) => {
    window.location.href = `/watch/${episode.slug}/${episode.seasonNumber}/${episode.number}`;
  };

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay message={error} />;
  if (!anime) return <ErrorDisplay message="Anime bulunamadı." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card-900/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg"
      >
        {/* Banner Resmi */}
        <div className="relative h-64 md:h-96">
          <img
            src={anime.pictures?.banner || '/placeholder.jpg'}
            alt={anime.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card-900 via-card-900/50 to-transparent" />
        </div>

        {/* Anime Bilgileri */}
        <div className="p-6 relative z-10 bg-gradient-to-b from-card-900/95 to-card-900">
          <h1 className="text-3xl font-bold text-white mb-4">
            {anime.english || anime.turkish || anime.romaji}
          </h1>

          <div className="flex flex-wrap gap-4 mb-6">
            {anime.genres?.map((genre: string) => (
              <span
                key={genre}
                className="px-3 py-1 bg-neutral-700 text-white rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          <p className="text-gray-300 mb-6 line-clamp-3">{anime.summary}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-300 mb-6">
            <div>
              <span className="font-semibold">Puan:</span>
              <span className="ml-2">{anime.tmdbScore?.toFixed(1) || 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold">Durum:</span>
              <span className="ml-2">{anime.status || 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold">Başlangıç:</span>
              <span className="ml-2">{anime.firstAirDate || 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold">Bitiş:</span>
              <span className="ml-2">{anime.lastAirDate || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Sezon Seçici */}
        <div className="mb-6">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {anime.seasons.map((season: any) => (
              <button
                key={`season-${season.season_number}`}
                onClick={() => setSelectedSeason(season.season_number)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap ${
                  selectedSeason === season.season_number
                    ? 'bg-neutral-700 text-white'
                    : 'bg-card-800 text-gray-300 hover:bg-card-700'
                }`}
              >
                {season.name || `${season.season_number}. Sezon`}
                <span className="ml-2 text-sm opacity-75">
                  ({season.episode_count} Bölüm)
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bölüm Listesi */}
        <div className="p-6 bg-card-900/90 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6">
            {anime?.seasons?.find((s: any) => s.season_number === selectedSeason)?.name || `${selectedSeason}. Sezon`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {seasonEpisodes.map((episode) => (
              <motion.div
                key={`${episode.slug}-s${episode.seasonNumber}-e${episode.number}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEpisodeSelect(episode)}
                className="cursor-pointer bg-card-900 hover:bg-card-800 rounded-lg overflow-hidden shadow-md transition-colors"
              >
                <img
                  src={episode.thumbnail || '/episode-placeholder.jpg'}
                  alt={`Bölüm ${episode.number}`}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-3">
                  <h3 className="text-white font-semibold mb-1 line-clamp-1">
                    Bölüm {episode.number}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {episode.title || `Bölüm ${episode.number}`}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
