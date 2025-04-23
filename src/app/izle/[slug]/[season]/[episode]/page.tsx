'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getEpisodeStream } from '@/services/animeService';
import { Loading, ErrorDisplay } from '@/components';

export default function WatchPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const season = params?.season as string;
  const episode = params?.episode as string;

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const qualities = await getEpisodeStream(slug, parseInt(season), parseInt(episode));
        setVideoUrl(qualities[0]?.url || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Video yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [slug, season, episode]);

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay message={error} />;
  if (!videoUrl) return <ErrorDisplay message="Video bulunamadı" />;

  return (
    <div className="w-full h-screen bg-black">
      <video
        className="w-full h-full"
        controls
        autoPlay
        src={videoUrl}
      />
    </div>
  );
}
