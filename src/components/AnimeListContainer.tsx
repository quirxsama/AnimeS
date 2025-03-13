'use client';

import dynamic from 'next/dynamic';

const AnimatedAnimeList = dynamic(() => import('@/components/AnimatedAnimeList'), {
  ssr: false,
  loading: () => (
    <div className="flex-grow flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  ),
});

export default function AnimeListContainer() {
  return <AnimatedAnimeList />;
}
