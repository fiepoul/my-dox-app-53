import { useMovieNavigation } from '@/hooks/useMovieNavigation';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FilmPosterProps {
  title: string;
  id: number;
  style?: any; 
}

const FilmPoster = ({ title, id, style }: FilmPosterProps) => {
  const { goToMovieDetails } = useMovieNavigation();

  return (
    <TouchableOpacity onPress={() => goToMovieDetails(id)} style={[styles.posterWrap, style]}>
      <View style={styles.poster}>
        <Text style={styles.posterText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  posterWrap: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  poster: {
    width: 130,
    height: 190,
    backgroundColor: '#0047ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  posterText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});

export default FilmPoster;