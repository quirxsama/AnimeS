import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Anime } from '../types';
import axios from 'axios';

type BrowseScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Browse'>;

const genres = [
  'Tümü',
  'Aksiyon',
  'Macera',
  'Komedi',
  'Dram',
  'Fantastik',
  'Korku',
  'Gizem',
  'Romantik',
  'Bilim Kurgu',
  'Spor',
  'Doğaüstü',
  'Psikolojik'
];

const BrowseScreen = () => {
  const navigation = useNavigation<BrowseScreenNavigationProp>();
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('Tümü');

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        setLoading(true);
        // Normalde gerçek API'lerden veri çekilecek
        // Şimdilik örnek veriler kullanıyoruz
        const animeData: Anime[] = [
          {
            slug: 'one-piece',
            turkish: 'One Piece',
            english: 'One Piece',
            romaji: 'One Piece',
            japanese: 'ワンピース',
            originalName: 'One Piece',
            summary: 'Büyük Korsan Çağı...',
            type: 'TV',
            pictures: {
              avatar: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
              banner: 'https://cdn.myanimelist.net/images/anime/6/73245l.jpg',
            },
            tmdbScore: 8.5,
            genres: ['Aksiyon', 'Macera', 'Fantastik']
          },
          {
            slug: 'naruto',
            turkish: 'Naruto',
            english: 'Naruto',
            romaji: 'Naruto',
            japanese: 'ナルト',
            originalName: 'Naruto',
            summary: 'Konoha Köyü\'nde 12 yıl önce...',
            type: 'TV',
            pictures: {
              avatar: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg',
              banner: 'https://cdn.myanimelist.net/images/anime/13/17405l.jpg',
            },
            tmdbScore: 8.3,
            genres: ['Aksiyon', 'Macera', 'Savaş Sanatları']
          },
          {
            slug: 'attack-on-titan',
            turkish: 'Titan Saldırısı',
            english: 'Attack on Titan',
            romaji: 'Shingeki no Kyojin',
            japanese: '進撃の巨人',
            originalName: 'Shingeki no Kyojin',
            summary: 'İnsanlık, Titan adı verilen devasa insansı yaratıklar tarafından...',
            type: 'TV',
            pictures: {
              avatar: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
              banner: 'https://cdn.myanimelist.net/images/anime/10/47347l.jpg',
            },
            tmdbScore: 9.0,
            genres: ['Aksiyon', 'Dram', 'Fantastik']
          },
          {
            slug: 'fullmetal-alchemist-brotherhood',
            turkish: 'Çelik Simyacı: Kardeşlik',
            english: 'Fullmetal Alchemist: Brotherhood',
            romaji: 'Hagane no Renkinjutsushi: Fullmetal Alchemist',
            japanese: '鋼の錬金術師 FULLMETAL ALCHEMIST',
            originalName: 'Hagane no Renkinjutsushi: Fullmetal Alchemist',
            summary: 'Simya, eşdeğer değişim prensibi üzerine kurulu bir bilimdir...',
            type: 'TV',
            pictures: {
              avatar: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg',
              banner: 'https://cdn.myanimelist.net/images/anime/1223/96541l.jpg',
            },
            tmdbScore: 9.1,
            genres: ['Aksiyon', 'Macera', 'Dram', 'Fantastik']
          },
        ];
        
        setAnimes(animeData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching animes:', error);
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  const filteredAnimes = selectedGenre === 'Tümü'
    ? animes
    : animes.filter(anime => anime.genres?.includes(selectedGenre));

  const handleAnimePress = (slug: string) => {
    navigation.navigate('AnimeDetail', { slug });
  };

  const renderGenreItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.genreItem,
        selectedGenre === item && styles.selectedGenreItem
      ]}
      onPress={() => setSelectedGenre(item)}
    >
      <Text
        style={[
          styles.genreText,
          selectedGenre === item && styles.selectedGenreText
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderAnimeItem = ({ item }: { item: Anime }) => (
    <TouchableOpacity
      style={styles.animeItem}
      onPress={() => handleAnimePress(item.slug)}
    >
      <Image
        source={{ uri: item.pictures.avatar }}
        style={styles.animeImage}
        resizeMode="cover"
      />
      <View style={styles.animeInfo}>
        <Text style={styles.animeTitle}>{item.turkish}</Text>
        <Text style={styles.animeGenres}>{item.genres?.join(', ')}</Text>
        <View style={styles.animeMetaContainer}>
          <Text style={styles.animeType}>{item.type}</Text>
          <Text style={styles.animeScore}>★ {item.tmdbScore}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#111827" barStyle="light-content" />
      
      <View style={styles.genresContainer}>
        <FlatList
          data={genres}
          renderItem={renderGenreItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.genresList}
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ef4444" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAnimes}
          renderItem={renderAnimeItem}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={styles.animesList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {selectedGenre} kategorisinde anime bulunamadı.
              </Text>
            </View>
          }
        />
      )}
    </View>
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
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 12,
  },
  genresContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  genresList: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  genreItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#1f2937',
  },
  selectedGenreItem: {
    backgroundColor: '#ef4444',
  },
  genreText: {
    color: '#ffffff',
    fontSize: 14,
  },
  selectedGenreText: {
    fontWeight: 'bold',
  },
  animesList: {
    padding: 16,
  },
  animeItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    overflow: 'hidden',
  },
  animeImage: {
    width: 100,
    height: 150,
  },
  animeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  animeTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  animeGenres: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 8,
  },
  animeMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  animeType: {
    color: '#d1d5db',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#374151',
    borderRadius: 4,
  },
  animeScore: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 200,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BrowseScreen; 