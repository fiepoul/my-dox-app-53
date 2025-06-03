// This component displays a film card with a poster, title, tagline, info line, and a favorite icon. It uses React Native components and styles to create a visually appealing layout.

import { useMovieNavigation } from '@/hooks/useMovieNavigation'
import type { Film } from '@/types/filmTypes'
import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

interface FilmCardProps {
  film: Film
  isFavorite: boolean
  onToggleFavorite: (film: Film) => void
}

export default function FilmCard({
  film,
  isFavorite,
  onToggleFavorite,
}: FilmCardProps) {
  const { goToMovieDetails } = useMovieNavigation(); // Use the custom hook

  const infoParts = [
    film.director,
    film.year != null ? film.year.toString() : null,
    film.country,
    film.category,
  ]
    .filter(Boolean)
    .join(' / ');


    //Afkort filmnavn
  const titleParts = film.title.split(' ');
  const shortenedTitle = titleParts.slice(0, 3).join(' ');
  const displayTitle = titleParts.length > 4 ? shortenedTitle + '...' : shortenedTitle

  return (
    <View style={styles.card}>
      {/* Poster */}
      <TouchableOpacity
        style={styles.poster}
        onPress={() => goToMovieDetails(film.id)} // Call goToMovieDetails
        activeOpacity={0.8}
      >
        <Text style={styles.posterText}>DOX</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {displayTitle.toUpperCase()}
        </Text>

        {/* Tagline (show limited and add ellipsize) */}
        {film.tagline ? (
          <Text style={styles.tagline} numberOfLines={2} ellipsizeMode="tail">
            {film.tagline}
          </Text>
        ) : null}

        </View>

        {/* Info line */}
       <View style={styles.bottom}>
           <Text style={[styles.infoRow]} numberOfLines={1} ellipsizeMode="tail">{infoParts}</Text>
      </View>

      {/* Favorite icon */}
      <TouchableOpacity
        onPress={() => onToggleFavorite(film)}
        style={styles.heartContainer}
        hitSlop={8}
      >
        <Text style={[styles.heart, isFavorite && styles.heartActive]}>
          {isFavorite ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 152,      // Fast bredde
    height: 200, 
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    position: 'relative',
    overflow: 'hidden', // Skjul indhold der overskrider størrelsen
  },
  poster: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#0047FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
  },
  content: {
    padding: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
    marginBottom: 4,
    lineHeight: 18,
    letterSpacing: 1,
  },
  tagline: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
    lineHeight: 16,
  },
  infoRow: {
    fontSize: 10,
    color: '#777',
    textAlign: 'center',
    marginBottom: 4,
  },
  heartContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  heart: {
    fontSize: 18,
    color: '#ccc',
  },
  heartActive: {
    color: '#ff5f6d',
  },
  bottom: {
    position: "absolute",
    bottom: 4,
    left: 0,
    width: "100%",
    padding: 4
  }
})
