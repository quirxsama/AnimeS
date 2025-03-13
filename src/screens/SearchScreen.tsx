import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
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

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

const SearchScreen = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearched(true);
    
    try {
      // Normalde gerçek API'den veri çekilecek
      // Şimdilik örnek veriler kullanıyoruz
      setTimeout(() => {
        const results: Anime[] = [
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
            slug: 'dr-stone',
            turkish: 'Dr. Stone',
            english: 'Dr. Stone',
            romaji: 'Dr. Stone',
            japanese: 'ドクターストーン',
            originalName: 'Dr. Stone',
            summary: 'Bir gün, gizemli bir ışık tüm insanlığı taşa dönüştürür...',
            type: 'TV',
            pictures: {
              avatar: 'https://cdn.myanimelist.net/images/anime/1613/102576.jpg',
              banner: 'https://cdn.myanimelist.net/images/anime/1613/102576l.jpg',
            },
            tmdbScore: 8.2,
            genres: ['Aksiyon', 'Bilim Kurgu', 'Macera']
          }
        ].filter(anime => 
          anime.turkish.toLowerCase().includes(searchQuery.toLowerCase()) ||
          anime.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (anime.romaji && anime.romaji.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        
        setSearchResults(results);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error searching animes:', error);
      setSearchResults([]);
      setLoading(false);
    }
  };

  const handleAnimePress = (slug: string) => {
    navigation.navigate('AnimeDetail', { slug });
  };

  const renderSearchResult = ({ item }: { item: Anime }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleAnimePress(item.slug)}
    >
      <Image
        source={{ uri: item.pictures.avatar }}
        style={styles.resultImage}
        resizeMode="cover"
      />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.turkish}</Text>
        <Text style={styles.resultOriginalTitle}>{item.originalName}</Text>
        <Text style={styles.resultGenres}>{item.genres?.join(', ')}</Text>
        <View style={styles.resultMetaContainer}>
          <Text style={styles.resultType}>{item.type}</Text>
          <Text style={styles.resultScore}>★ {item.tmdbScore}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#111827" barStyle="light-content" />
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Anime ara..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={styles.searchButtonText}>Ara</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ef4444" />
          <Text style={styles.loadingText}>Aranıyor...</Text>
        </View>
      ) : (
        <>
          {searched && (
            <Text style={styles.resultsText}>
              {searchResults.length > 0 
                ? `"${searchQuery}" için ${searchResults.length} sonuç bulundu`
                : `"${searchQuery}" için sonuç bulunamadı`
              }
            </Text>
          )}
          
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.slug}
            contentContainerStyle={styles.resultsList}
            ListEmptyComponent={
              searched ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Sonuç bulunamadı. Farklı anahtar kelimeler deneyin.
                  </Text>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Favori animelerinizi aramak için yukarıdaki arama çubuğunu kullanın.
                  </Text>
                </View>
              )
            }
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 16,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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
  resultsText: {
    color: '#ffffff',
    fontSize: 14,
    padding: 16,
    paddingBottom: 8,
  },
  resultsList: {
    padding: 16,
  },
  resultItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    overflow: 'hidden',
  },
  resultImage: {
    width: 100,
    height: 150,
  },
  resultInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  resultTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultOriginalTitle: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 4,
  },
  resultGenres: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 8,
  },
  resultMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultType: {
    color: '#d1d5db',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#374151',
    borderRadius: 4,
  },
  resultScore: {
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

export default SearchScreen; 