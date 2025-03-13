import { useState, useEffect } from 'react'

/**
 * Bir değerin değişimini geciktirmek için kullanılan hook
 * @param value Geciktirilecek değer
 * @param delay Gecikme süresi (milisaniye)
 * @returns Geciktirilmiş değer
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Değer değiştiğinde yeni bir zamanlayıcı başlat
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Temizleme fonksiyonu
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
