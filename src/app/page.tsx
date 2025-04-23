'use client';

import { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import { type AnimeEpisode, getLatestEpisodes, getAllAnimes } from '@/services/animeService';
import LatestEpisodes from '@/components/LatestEpisodes';
import { PopularAnimes } from '@/components';
import { Loading, ErrorDisplay } from '@/components';
import type { Anime, ApiEpisode } from '@/types';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [latestEpisodes, setLatestEpisodes] = useState<AnimeEpisode[]>([]);
  const [popularAnimes, setPopularAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Son eklenen bölümleri al
        const episodesData = await getLatestEpisodes(1, 30);
        // API yanıtını AnimeEpisode tipine dönüştür
        const formattedEpisodes: AnimeEpisode[] = (episodesData.episodes as ApiEpisode[]).map(episode => ({
          ...episode,
          seasonNumber: episode.season,
          number: episode.episode,
          episodeNumber: episode.episode,
          title: `Bölüm ${episode.episode}`,
          airDate: '',
          summary: '',
          thumbnail: episode.pictures.avatar,
          episodeData: {
            avatar: episode.pictures.avatar,
            files: []
          }
        }));
        setLatestEpisodes(formattedEpisodes);

        // Popüler animeleri al
        const animesData = await getAllAnimes(1, 30);
        // API'den gelen veriyi kontrol et ve Anime tipine uygun şekilde dönüştür
        const formattedAnimes = animesData ? animesData.map(anime => ({
          ...anime,
          turkish: anime.turkish || '',
          english: anime.english || '',
          romaji: anime.romaji || '',
          japanese: '',
          originalName: '',
          type: 'TV',
          summary: anime.summary || '',
          pictures: {
            banner: anime.pictures?.banner || '',
            avatar: anime.pictures?.avatar || '',
            poster: anime.pictures?.poster || ''
          }
        })) : [];
        setPopularAnimes(formattedAnimes);

      } catch (err: unknown) {
        console.error('Veri yükleme hatası:', err);
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-custom-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-custom-slate/20 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-custom-slate/20 rounded-lg aspect-[2/3]"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <main className="min-h-screen bg-custom-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <SearchBar />
        </div>

        {/* Popüler Animeler */}
        <section className="mb-12">
          <PopularAnimes animes={popularAnimes} />
        </section>

        {/* Son Bölümler */}
        <section>
          <LatestEpisodes episodes={latestEpisodes} />
        </section>
      </div>
    </main>
  );
}
