import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Anime, AnimeEpisode, RootStackParamList } from '../types';
import axios from 'axios';

type AnimeDetailRouteProp = RouteProp<RootStackParamList, 'AnimeDetail'>;
type AnimeDetailNavigationProp = StackNavigationProp<RootStackParamList, 'AnimeDetail'>;

const AnimeDetailScreen = () => {
  const route = useRoute<AnimeDetailRouteProp>();
  const navigation = useNavigation<AnimeDetailNavigationProp>();
  const { slug } = route.params;
  
  const [anime, setAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<AnimeEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        // Normalde gerçek API'lerden veri çekilecek
        // Şimdilik örnek veriler kullanıyoruz
        const animeData: Anime = {
          slug: 'one-piece',
          turkish: 'One Piece',
          english: 'One Piece',
          romaji: 'One Piece',
          japanese: 'ワンピース',
          originalName: 'One Piece',
          summary: 'Büyük Korsan Çağı. Gold Roger, Korsan Kralı, çıktığı yolculukta tüm dünyada nam salmış ismiyle. İdam edilmeden önceki son sözleri insanları denizlere yöneltir: "Hazinemi mi istiyorsunuz? İstiyorsanız bulun. Tüm dünya servetimi orada bıraktım." Bu söz, insanları Büyük Korsan Çağına yöneltir. Maymun D. Luffy, Roger gibi olmak isteyip, Şeytan Meyvesi yedikten sonra lastik özelliği kazanır. Şimdi Luffy, kendi kurduğu korsan ekibiyle, Hasır Şapkalılarla, Grand Line\'da, dünyanın en büyük hazinesi olan One Piece\'i bulmak için maceraya atılır.',
          type: 'TV',
          pictures: {
            avatar: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
            banner: 'https://cdn.myanimelist.net/images/anime/6/73245l.jpg',
          },
          tmdbScore: 8.5,
          genres: ['Aksiyon', 'Macera', 'Fantastik', 'Shounen']
        };

        const episodesData: AnimeEpisode[] = Array.from({ length: 10 }, (_, i) => ({
          type: 'TV',
          pictures: {
            banner: 'https://cdn.myanimelist.net/images/anime/6/73245l.jpg',
            avatar: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
          },
          romaji: 'One Piece',
          english: 'One Piece',
          originalName: 'One Piece',
          turkish: 'One Piece',
          japanese: 'ワンピース',
          slug: `episode-${i + 1}`,
          episode: i + 1,
          season: 1,
          createdAt: Date.now(),
          seasonNumber: 1,
          number: i + 1,
          episodeNumber: i + 1,
          title: `Bölüm ${i + 1}`,
          thumbnail: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
          airDate: new Date().toISOString(),
          summary: `Özet ${i + 1}`,
          episodeData: {
            files: [
              {
                file: 'video.mp4',
                resolution: '720p'
              }
            ]
          }
        }));
        
        setAnime(animeData);
        setEpisodes(episodesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching anime details:', error);
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [slug]);

  const handleEpisodePress = (episodeId: string) => {
    navigation.navigate('WatchAnime', { episodeId, animeSlug: slug });
  };

  const renderEpisodeItem = ({ item }: { item: AnimeEpisode }) => (
    <TouchableOpacity 
      style={styles.episodeItem}
      onPress={() => handleEpisodePress(item.slug)}
    >
      <Image 
        source={{ uri: item.thumbnail }} 
        style={styles.episodeImage}
        resizeMode="cover"
      />
      <View style={styles.episodeInfo}>
        <Text style={styles.episodeTitle}>{item.title}</Text>
        <Text style={styles.episodeSummary} numberOfLines={2}>{item.summary}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading || !anime) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#111827" barStyle="light-content" />
      
      <Image 
        source={{ uri: anime.pictures.banner }} 
        style={styles.bannerImage}
        resizeMode="cover"
      />
      
      <View style={styles.infoContainer}>
        <Image 
          source={{ uri: anime.pictures.avatar }}
          style={styles.avatarImage}
          resizeMode="cover"
        />
        
        <View style={styles.detailsContainer}>
          <Text style={styles.animeTitle}>{anime.turkish}</Text>
          <Text style={styles.animeOriginalTitle}>{anime.originalName}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{anime.tmdbScore}</Text>
              <Text style={styles.statLabel}>TMDB Puanı</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{anime.type}</Text>
              <Text style={styles.statLabel}>Tür</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{episodes.length}</Text>
              <Text style={styles.statLabel}>Bölüm</Text>
            </View>
          </View>
          
          <View style={styles.genresContainer}>
            {anime.genres?.map((genre, index) => (
              <View key={index} style={styles.genreItem}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Özet</Text>
        <Text style={styles.summaryText}>{anime.summary}</Text>
      </View>
      
      <View style={styles.episodesContainer}>
        <Text style={styles.sectionTitle}>Bölümler</Text>
        <FlatList
          data={episodes}
          renderItem={renderEpisodeItem}
          keyExtractor={(item) => item.slug}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
  },
  bannerImage: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  avatarImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  animeTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  animeOriginalTitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: 12,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreItem: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#ffffff',
    fontSize: 12,
  },
  summaryContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryText: {
    color: '#d1d5db',
    fontSize: 14,
    lineHeight: 20,
  },
  episodesContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  episodeItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    overflow: 'hidden',
  },
  episodeImage: {
    width: 120,
    height: 68,
  },
  episodeInfo: {
    flex: 1,
    padding: 8,
  },
  episodeTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  episodeSummary: {
    color: '#9ca3af',
    fontSize: 12,
  },
});

export default AnimeDetailScreen; 