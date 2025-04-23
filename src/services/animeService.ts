export const API_URL = 'https://api.openani.me';
const PLAYER_URL = 'https://do7---ha-k8y3jyfa-8gcx.zyapbot.eu.org';

export interface Anime {
  slug: string;
  turkish?: string;
  english?: string;
  romaji?: string;
  summary?: string;
  pictures?: {
    banner?: string;
    avatar?: string;
    poster?: string;
  };
  title?: string;
  genres?: string[];
  score?: number;
  status?: string;
  firstAirDate?: string;
  tmdbScore?: number;
  malId?: number;
}

export interface AnimeEpisode {
  episodeData: {
    avatar?: string;
    files?: Array<{
      file: string;
      resolution: number;
    }>;
    fansub?: {
      id: string;
      name: string;
      secureName: string;
      avatar: string;
      website: string;
      discord: string;
    };
    name?: string;
    summary?: string;
    airDate?: string;
  };
  airDate: string;
  summary: string;
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
  number: number; // For display
  episodeNumber: number; // For URL generation
  season: number;
  seasonNumber: number;
  createdAt: number;
  title: string;
  thumbnail: string;
  malId?: number; // MyAnimeList ID'si
  avatar?: string;
}

export interface Season {
  season_number: number;
  name?: string;
  episode_count: number;
}

export interface ProductionCompany {
  id: string;
  name: string;
  logo?: string;
}

export interface NextEpisode {
  air_date: string;
  episode_number: number;
  name: string;
  season_number: number;
}

export interface Review {
  author: string;
  rating: number;
  content: string;
  date: string;
}

export interface AnimeDetails {
  slug: string;
  turkish: string;
  english: string;
  romaji: string;
  japanese: string | null;
  originalName: string;
  summary: string;
  pictures: {
    banner: string;
    avatar: string;
  };
  title: string;
  type: string;
  episodeRuntime: number;
  adult: boolean;
  inProduction: boolean;
  tmdbID: string;
  malID: string;
  logos: string[];
  keywords: string[];
  genres: string[];
  genresEnglish: string[];
  firstAirDate: string;
  lastAirDate: string;
  seasons: Season[];
  nextEpisodeToAir: NextEpisode | null;
  productionCompanies: ProductionCompany[];
  numberOfEpisodes: number;
  numberOfSeasons: number;
  tmdbScore: number;
  website: string;
  source: string;
  broadcast: string;
  explicitGenres: string[];
  themes: string[];
  demographics: string[];
  trailer: string;
  ageRating: string;
  myAnimeListURL: string;
  explorePageCategories: string[];
  malWebsites: string[];
  reviews: Review[];
  reviewRating: number;
  status?: string;
}

export interface AnimeResponse {
  episodes: AnimeEpisode[]
  totalCount: number
  totalPages: number
  page: number
  groupedEpisodes: AnimeEpisode[][]
}

export interface AnimeSearchResult {
  slug: string
  turkish: string
  english: string
  romaji: string
  summary: string
  pictures: {
    avatar: string
  }
}

interface LatestEpisode {
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
  id: string;
  episode: number;
  season: number;
  createdAt: number;
}

interface LatestEpisodesResponse {
  episodes: LatestEpisode[];
  totalCount: number;
  totalPages: number;
  page: number;
}

interface AniSkipResponse {
  results: {
    interval: {
      startTime: number;
      endTime: number;
    };
    skipType: string;
  }[];
}

export interface AnimeFilters {
  categories?: string[];
  score?: [number, number];
  dateRange?: [number, number];
  page?: number;
}

export interface ApiEpisodeFile {
  file: string;
  resolution: number;
}

export interface ApiEpisode {
  avatar?: string;
  thumbnail?: string;
  episodeNumber: number;
  name?: string;
  summary?: string;
  airDate?: string;
  files?: ApiEpisodeFile[];
  fansub?: {
    id: string;
    name: string;
    secureName: string;
    avatar: string;
    website: string;
    discord: string;
  };
  malId?: number;
  season: number;
  episode: number;
  pictures: {
    banner: string;
    avatar: string;
  };
}

export const getFilteredAnimes = async (filters: AnimeFilters) => {
  try {
    const { categories, score, dateRange, page = 1 } = filters;
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());

    if (categories && categories.length > 0) {
      queryParams.append('keywords', categories.join(','));
    }

    if (score) {
      queryParams.append('score', `${score[0]},${score[1]}`);
    }

    if (dateRange) {
      queryParams.append('date', `${dateRange[0]},${dateRange[1]}`);
    }

    const response = await fetch(`${API_URL}/anime?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Anime verileri alınamadı');
    }

    const data = await response.json();
    return {
      animes: data.animes || [],
      totalCount: data.totalCount || 0,
      totalPages: data.totalPages || 0,
      page: data.page || 1
    };
  } catch (error) {
    console.error('Anime filtreleme hatası:', error);
    return {
      animes: [],
      totalCount: 0,
      totalPages: 0,
      page: 1
    };
  }
};

export async function searchAnime(query: string): Promise<AnimeSearchResult[]> {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(`${API_URL}/anime/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      console.error('API Yanıt:', await response.text());
      return [];
    }
    
    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error('Geçersiz API yanıtı:', data);
      return [];
    }

    return data.map((anime: AnimeSearchResult) => ({
      slug: anime.slug,
      turkish: anime.turkish || (anime as any).title?.turkish || (anime as any).title?.english || anime.english || (anime as any).title?.romaji || anime.romaji,
      english: (anime as any).title?.english || anime.english,
      romaji: (anime as any).title?.romaji || anime.romaji,
      summary: (anime as any).description || (anime as any).synopsis || '',
      pictures: {
        avatar: anime.pictures?.avatar || (anime as any).pictures?.poster || ''
      }
    }));
  } catch (error) {
    console.error('Arama hatası:', error);
    return [];
  }
}

export async function getLatestEpisodes(page: number = 1, limit: number = 32): Promise<LatestEpisodesResponse> {
  try {
    const response = await fetch(`${API_URL}/anime/episodes/latest?&limit=${limit}&page=${page}`);
    if (!response.ok) {
      throw new Error(`Latest episodes could not be fetched: ${response.status}`);
    }

    const data = await response.json();
    return {
      episodes: data.episodes,
      totalCount: data.totalCount,
      totalPages: data.totalPages,
      page: data.page
    };
  } catch (error) {
    console.error('Latest episodes fetch error:', error);
    return {
      episodes: [],
      totalCount: 0,
      totalPages: 0,
      page: 1
    };
  }
}

export async function getAnimeDetails(slug: string): Promise<AnimeDetails> {
  try {
    const response = await fetch(`${API_URL}/anime/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      ...data,
      pictures: {
        banner: data.pictures?.banner || '',
        avatar: data.pictures?.avatar || ''
      }
    };
  } catch (error) {
    console.error('Anime detayları alınamadı:', error);
    throw error;
  }
}

export async function getAnimeEpisodes(slug: string): Promise<AnimeEpisode[]> {
  try {
    const animeDetails = await getAnimeDetails(slug);
    const seasons = animeDetails.numberOfSeasons || 1;
    const allEpisodes: AnimeEpisode[] = [];

    for (let season = 1; season <= seasons; season++) {
      const response = await fetch(`${API_URL}/anime/${slug}/season/${season}`);
      if (!response.ok) continue;

      const data = await response.json();
      const episodes = data.season?.episodes || [];

      episodes.forEach((episode: ApiEpisode) => {
        allEpisodes.push({
          type: 'tv',
          pictures: {
            banner: episode.avatar || '',
            avatar: episode.avatar || episode.thumbnail || ''
          },
          episodeData: {
            avatar: episode.avatar || episode.thumbnail,
            files: episode.files || [],
            fansub: episode.fansub,
            name: episode.name,
            summary: episode.summary,
            airDate: episode.airDate
          },
          slug: slug,
          episode: episode.episodeNumber,
          number: episode.episodeNumber,
          seasonNumber: season,
          title: episode.name || `Bölüm ${episode.episodeNumber}`,
          summary: episode.summary || '',
          airDate: episode.airDate || '',
          thumbnail: episode.avatar || episode.thumbnail || '',
          romaji: null,
          english: "",
          originalName: "",
          turkish: "",
          japanese: null,
          episodeNumber: episode.episodeNumber,
          season: season,
          createdAt: 0,
          malId: episode.malId || 0
        });
      });
    }

    return allEpisodes.sort((a, b) => {
      if (a.seasonNumber !== b.seasonNumber) return a.seasonNumber - b.seasonNumber;
      return a.number - b.number;
    });
  } catch (error) {
    console.error('Bölümler alınamadı:', error);
    return [];
  }
}

interface VideoQuality {
  resolution: number;
  url: string;
}

export async function getEpisodeStream(slug: string, seasonNumber: number, episodeNumber: number): Promise<VideoQuality[]> {
  try {
    const response = await fetch(`${API_URL}/anime/${slug}/season/${seasonNumber}/episode/${episodeNumber}`);
    if (!response.ok) {
      throw new Error(`Stream URL could not be fetched: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API yanıtı:', data); // API yanıtını kontrol et
    
    if (data.episodeData?.files) {
      const sources = data.episodeData.files
        .filter((file: ApiEpisodeFile) => file.file) // Geçerli dosyaları filtrele
        .map((file: ApiEpisodeFile) => ({
          resolution: file.resolution || 720,
          url: `${PLAYER_URL}/stream/${file.file}`
        }));

      console.log('İşlenmiş video kaynakları:', sources); // İşlenmiş kaynakları kontrol et
      
      if (sources.length === 0) {
        throw new Error('Hiç geçerli video kaynağı bulunamadı');
      }

      return sources.sort((a: VideoQuality, b: VideoQuality) => b.resolution - a.resolution);
    }
    
    throw new Error('Video kaynağı bulunamadı veya geçersiz format');
  } catch (error) {
    console.error('Stream URL fetch error:', error);
    throw error;
  }
}

// Video URL'sinin oynatılabilir olduğunu kontrol et
export async function checkVideoPlayable(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type') || '';
    return response.ok && (contentType.includes('video/') || contentType.includes('application/'));
  } catch (e) {
    console.warn('Video kontrol hatası:', e);
    return false;
  }
}

export async function getSimilarAnime(slug: string): Promise<AnimeSearchResult[]> {
  try {
    const response = await fetch(`${API_URL}/anime/${slug}/similar`);
    if (!response.ok) {
      console.error('API Yanıt:', await response.text());
      throw new Error(`Benzer animeler alınamadı: ${response.status}`);
    }
    const data = await response.json();
    return data.map((anime: AnimeSearchResult) => ({
      slug: anime.slug,
      turkish: anime.turkish || anime.english || anime.romaji,
      english: anime.english,
      romaji: anime.romaji,
      summary: (anime as any).description || '',
      pictures: {
        avatar: anime.pictures?.avatar || (anime as any).pictures?.poster || ''
      }
    }));
  } catch (error) {
    console.error('Benzer animeler alınamadı:', error);
    throw error;
  }
}

export async function getAllAnimes(page = 1, limit = 50): Promise<Anime[]> {
  try {
    const response = await fetch(`${API_URL}/anime?page=${page}&limit=${limit}`);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.animes || [];
  } catch (error) {
    console.error('Animeler alınamadı:', error);
    return [];
  }
}

export async function getAniSkipData(malId: number, episodeNumber: number) {
  try {
    const response = await fetch(
      `https://api.aniskip.com/v2/skip-times/${malId}/${episodeNumber}?types[]=op&types[]=ed`
    );
    
    if (!response.ok) {
      throw new Error('AniSkip verisi alınamadı');
    }

    const data: AniSkipResponse = await response.json();
    
    const skipTimes = {
      opening: undefined as { start: number; end: number } | undefined,
      ending: undefined as { start: number; end: number } | undefined
    };

    data.results.forEach(result => {
      if (result.skipType === 'op') {
        skipTimes.opening = {
          start: result.interval.startTime,
          end: result.interval.endTime
        };
      } else if (result.skipType === 'ed') {
        skipTimes.ending = {
          start: result.interval.startTime,
          end: result.interval.endTime
        };
      }
    });

    return skipTimes;
  } catch (error) {
    console.error('AniSkip verisi alınamadı:', error);
    return null;
  }
}
