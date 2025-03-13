"use client"

import React, { useEffect, useRef, useState } from 'react'

interface VideoSource {
  url: string
  resolution: number
}

interface VideoPlayerProps {
  animeSlug: string
  seasonNumber: number
  episodeNumber: number
  onTimeUpdate?: (time: number) => void
  onEnded?: () => void
}

interface VideoQuality {
  resolution: number
  url: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  animeSlug,
  seasonNumber,
  episodeNumber,
  onTimeUpdate,
  onEnded
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [qualities, setQualities] = useState<VideoQuality[]>([])
  const [currentQuality, setCurrentQuality] = useState<number>(720)

  const PLAYER_BASE_URL = "https://do7---ha-k8y3jyfa-8gcx.zyapbot.eu.org"
  const API_BASE_URL = "https://api.openani.me"

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(
          `${API_BASE_URL}/anime/${animeSlug}/season/${seasonNumber}/episode/${episodeNumber}`
        )

        if (!response.ok) {
          throw new Error('Video kaynağı alınamadı')
        }

        const data = await response.json()
        
        if (data.episodeData?.files?.length) {
          // Tüm kaliteleri kaydet
          const availableQualities = data.episodeData.files.map((file: any) => ({
            resolution: file.resolution,
            url: `${PLAYER_BASE_URL}/animes/${animeSlug}/${seasonNumber}/${file.file}`
          })).sort((a: VideoQuality, b: VideoQuality) => b.resolution - a.resolution)

          setQualities(availableQualities)
          
          // En yüksek kaliteyi seç
          const defaultQuality = availableQualities[0]
          setCurrentQuality(defaultQuality.resolution)
          setVideoUrl(defaultQuality.url)
        } else {
          throw new Error('Video kaynağı bulunamadı')
        }
      } catch (err) {
        console.error('Video yükleme hatası:', err)
        setError('Video yüklenemedi. Lütfen daha sonra tekrar deneyin.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideoUrl()
  }, [animeSlug, seasonNumber, episodeNumber])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleError = () => {
      setError('Video oynatılamıyor. Lütfen internet bağlantınızı kontrol edin.')
      setIsLoading(false)
    }

    const handleLoadStart = () => {
      setIsLoading(true)
      setError(null)
    }

    const handleLoadedData = () => {
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      onTimeUpdate?.(video.currentTime)
    }

    video.addEventListener('error', handleError)
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', onEnded || (() => {}))

    return () => {
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', onEnded || (() => {}))
    }
  }, [onTimeUpdate, onEnded])

  const handleQualityChange = (resolution: number) => {
    const newQuality = qualities.find(q => q.resolution === resolution)
    if (!newQuality || !videoRef.current) return

    const currentTime = videoRef.current.currentTime
    const isPaused = videoRef.current.paused

    setCurrentQuality(resolution)
    setVideoUrl(newQuality.url)

    // Kalite değiştiğinde mevcut oynatma konumunu koru
    const handleLoaded = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = currentTime
        if (!isPaused) videoRef.current.play()
      }
    }

    videoRef.current.addEventListener('loadeddata', handleLoaded, { once: true })
  }

  const handleSkipIntro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 90 // 90 saniye ileri sar
    }
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group">
      {videoUrl && (
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          playsInline
          preload="metadata"
          src={videoUrl}
        >
          Video oynatıcı tarayıcınız tarafından desteklenmiyor.
        </video>
      )}

      {/* Kalite Seçici */}
      {qualities.length > 0 && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="bg-black/40 backdrop-blur-md rounded-lg p-3 shadow-xl border border-white/10">
            <div className="text-sm text-white font-medium mb-2 drop-shadow-lg">Kalite</div>
            <div className="space-y-1.5">
              {qualities.map(quality => (
                <button
                  key={quality.resolution}
                  onClick={() => handleQualityChange(quality.resolution)}
                  className={`block w-full text-left px-4 py-2 rounded-md text-sm transition-all duration-200 
                    ${currentQuality === quality.resolution
                      ? 'bg-white/20 text-white font-medium shadow-lg'
                      : 'text-white/90 hover:bg-white/10 hover:text-white hover:shadow-md'
                    } backdrop-blur-sm drop-shadow-lg`}
                >
                  {quality.resolution}p
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* İntro Atlama Butonu */}
      <button
        onClick={handleSkipIntro}
        className="absolute bottom-20 right-4 px-4 py-2 bg-white/90 hover:bg-white 
                   text-black font-medium rounded-md shadow-lg transition-all 
                   transform hover:scale-105 active:scale-100"
      >
        +90 Saniye
      </button>

      {/* Yükleniyor Göstergesi */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white font-medium">Yükleniyor...</span>
          </div>
        </div>
      )}

      {/* Hata Mesajı */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm">
          <div className="text-center p-6 max-w-md">
            <p className="text-red-500 font-semibold mb-2">{error}</p>
            <p className="text-white/80 text-sm">
              Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer
