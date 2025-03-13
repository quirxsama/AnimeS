import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Video from 'react-native-video';
import { RootStackParamList, AnimeEpisode } from '../types';
import axios from 'axios';

type WatchAnimeRouteProp = RouteProp<RootStackParamList, 'WatchAnime'>;
type WatchAnimeNavigationProp = StackNavigationProp<RootStackParamList, 'WatchAnime'>;

const { width } = Dimensions.get('window');
const videoHeight = (width * 9) / 16;

const WatchAnimeScreen = () => {
  const route = useRoute<WatchAnimeRouteProp>();
  const navigation = useNavigation<WatchAnimeNavigationProp>();
  const { episodeId, animeSlug } = route.params;

  const [episode, setEpisode] = useState<AnimeEpisode | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isBuffering, setIsBuffering] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        // Normalde gerçek API'lerden veri çekilecek
        // Şimdilik örnek veriler kullanıyoruz
        const episodeData: AnimeEpisode = {
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
          slug: episodeId,
          episode: 1,
          season: 1,
          createdAt: Date.now(),
          seasonNumber: 1,
          number: 1,
          episodeNumber: 1,
          title: 'Bölüm 1',
          thumbnail: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
          airDate: new Date().toISOString(),
          summary: 'One Piece 1. bölüm özeti',
          episodeData: {
            files: [
              {
                file: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                resolution: '720p'
              }
            ]
          }
        };
        
        setEpisode(episodeData);
        
        // Video URL'sini ayarla
        if (episodeData.episodeData.files && episodeData.episodeData.files.length > 0) {
          setVideoUrl(episodeData.episodeData.files[0].file);
        } else {
          setError('Video dosyası bulunamadı');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching episode data:', error);
        setError('Bölüm yüklenirken bir hata oluştu');
        setLoading(false);
      }
    };

    fetchEpisodeData();
  }, [episodeId, animeSlug]);

  const handleVideoError = (error: any) => {
    setError('Video oynatılırken bir hata oluştu: ' + error.error.errorString);
    setIsBuffering(false);
  };

  const handleVideoLoad = () => {
    setIsBuffering(false);
  };

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      <View style={styles.videoContainer}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.videoWrapper}
          onPress={togglePlayPause}
        >
          <Video
            source={{ uri: videoUrl }}
            style={styles.video}
            resizeMode="contain"
            controls={true}
            paused={paused}
            onError={handleVideoError}
            onLoad={handleVideoLoad}
            onBuffer={({ isBuffering }) => setIsBuffering(isBuffering)}
          />
          
          {isBuffering && (
            <View style={styles.bufferingOverlay}>
              <ActivityIndicator size="large" color="#ef4444" />
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {episode && (
        <ScrollView style={styles.infoContainer}>
          <Text style={styles.episodeTitle}>{episode.title}</Text>
          <Text style={styles.animeName}>{episode.turkish}</Text>
          
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>Sezon {episode.seasonNumber}</Text>
            <Text style={styles.metaText}>Bölüm {episode.episodeNumber}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Özet</Text>
          <Text style={styles.summary}>{episode.summary}</Text>
        </ScrollView>
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
    backgroundColor: '#111827',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  videoContainer: {
    width: '100%',
    height: videoHeight,
    backgroundColor: '#000000',
  },
  videoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    padding: 16,
  },
  episodeTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  animeName: {
    color: '#d1d5db',
    fontSize: 16,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaText: {
    color: '#9ca3af',
    fontSize: 14,
    marginRight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#1f2937',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summary: {
    color: '#d1d5db',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default WatchAnimeScreen; 