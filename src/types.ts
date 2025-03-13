export interface Anime {
  slug: string;
  turkish: string;
  english: string;
  romaji: string | null;
  japanese: string | null;
  originalName: string;
  summary: string;
  type: string;
  pictures: {
    avatar: string;
    banner: string;
  };
  tmdbScore?: number;
  genres?: string[];
}

export interface ApiEpisode {
  type: string;
  pictures: {
    banner: string;
    avatar: string;
  };
  romaji: string | null;
  english: string;
  originalName: string;
  turkish: string;
  japanese: string | null;
  slug: string;
  episode: number;
  season: number;
  createdAt: number;
}

export interface AnimeEpisode extends ApiEpisode {
  seasonNumber: number;
  number: number;
  episodeNumber: number;
  title: string;
  thumbnail?: string;
  airDate: string;
  summary: string;
  episodeData: {
    avatar?: string;
    files: Array<{
      file: string;
      resolution: string;
    }>;
    fansub?: {
      id: string;
      name: string;
      secureName: string;
      avatar: string;
      website?: string;
      discord?: string;
    };
  };
} 