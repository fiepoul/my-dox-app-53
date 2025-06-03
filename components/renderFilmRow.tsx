import FilmPoster from '@/components/filmPoster';
import type { Film } from '@/types/filmTypes';
import React from 'react';
import { FlatList } from 'react-native';

interface RenderFilmRowProps {
  filmIds: number[];
  allFilms: Film[];
  style?: any; // Allow custom styles
}

export const renderFilmRow = ({ filmIds, allFilms, style }: RenderFilmRowProps) => {
  const posters = filmIds
    .map(id => allFilms.find(f => f.id === id))
    .filter((f): f is Film => Boolean(f))
    .slice(0, 10);

  return (
    <FlatList
      data={posters}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <FilmPoster title={item.title} id={item.id} style={style} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 16 }}
    />
  );
};