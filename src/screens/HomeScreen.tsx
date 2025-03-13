import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Anime } from '../types';
import axios from 'axios';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [featuredAnimes, setFeaturedAnimes] = useState<Anime[]>([]);
  const [trendingAnimes, setTrendingAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        // Normalde gerçek API'lerden veri çekilecek
        // Şimdilik örnek veriler kullanıyoruz
        const featured = [
          {
            slug: 'one-piece',
            turkish: 'One Piece',
            english: 'One Piece',
            romaji: 'One Piece',
            japanese: 'ワンピース',
            originalName: 'One Piece',
            summary: 'Büyük Korsan Çağı. Gold Roger, Korsan Kralı, çıktığı yolculukta tüm dünyada nam salmış ismiyle. Ölümünün ardından gerekli ismi One Piece...',
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
            summary: 'Konoha Köyü\'nde 12 yıl önce Dokuz Kuyruklu Tilki, Kyuubi, köye saldırmış ve köyün lideri olan Dördüncü Hokage bu canavarı yeni doğan bir bebeğin içine mühürleyerek köyü kurtarmıştır...',
            type: 'TV',
            pictures: {
              avatar: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg',
              banner: 'https://cdn.myanimelist.net/images/anime/13/17405l.jpg',
            },
            tmdbScore: 8.3,
            genres: ['Aksiyon', 'Macera', 'Savaş Sanatları']
          }
        ];
        
        setFeaturedAnimes(featured);
        setTrendingAnimes(featured.reverse());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching animes:', error);
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  const handleAnimePress = (slug: string) => {
    navigation.navigate('AnimeDetail', { slug });
  };

  const renderAnimeCard = ({ item }: { item: Anime }) => (
    <TouchableOpacity 
      style={styles.animeCard}
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
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#111827" barStyle="light-content" />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Öne Çıkan Animeler</Text>
        <FlatList
          data={featuredAnimes}
          renderItem={renderAnimeCard}
          keyExtractor={(item) => item.slug}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trend Animeler</Text>
        <FlatList
          data={trendingAnimes}
          renderItem={renderAnimeCard}
          keyExtractor={(item) => item.slug}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
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
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 16,
  },
  featuredList: {
    paddingLeft: 16,
  },
  animeCard: {
    width: 150,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: '#1f2937',
    overflow: 'hidden',
  },
  animeImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  animeInfo: {
    padding: 8,
  },
  animeTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  animeGenres: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 4,
  },
});

export default HomeScreen; 