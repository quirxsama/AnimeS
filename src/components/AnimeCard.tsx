"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface AnimeCardProps {
  anime: {
    slug: string
    title: string
    summary: string
    pictures: {
      avatar: string
    }
  }
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link
      href={`/anime/${anime.slug}`}
      className="block h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
    >
      <motion.div
        className="relative h-full bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={anime.pictures.avatar || '/placeholder.jpg'}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-60 group-hover:opacity-80 group-focus-visible:opacity-80 transition-all duration-300" />
        </div>
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4 text-white transition-all duration-300 transform group-hover:-translate-y-2 group-focus-visible:-translate-y-2"
          initial={{ y: 0 }}
          whileHover={{ y: -8 }}
        >
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 transition-all duration-300 group-hover:text-shadow group-focus-visible:text-shadow group-hover:outline-text group-focus-visible:outline-text">
            {anime.title}
          </h3>
          <p className="text-sm text-gray-200 line-clamp-2 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300">
            {anime.summary}
          </p>
        </motion.div>
      </motion.div>
    </Link>
  )
}
