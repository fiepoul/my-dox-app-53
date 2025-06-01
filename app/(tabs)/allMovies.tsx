import FilmCard from '@/components/filmCard';
import { commonStyles } from '@/styles/CommonStyles';
import type { Film } from '@/types/filmTypes';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  View
} from 'react-native';
import { useAppData } from '../context/AppDataContext';

const HEADER_HEIGHT = 80;

export default function AllFilmsScreen() {
  const router = useRouter();
  const {
    allFilms,
    myFavorites,
    addFavorite,
    removeFavorite,
    loading,
  } = useAppData();

  const handlePress = useCallback(
    (id: number) => {
      router.push({ pathname: '/movie/[id]', params: { id: id.toString() } });
    },
    [router]
  );

  const toggleFavorite = useCallback(
    async (film: Film) => {
      const isFav = myFavorites.includes(film.id);
      if (isFav) {
        await removeFavorite(film.id);
      } else {
        await addFavorite({
          id: film.id,
          title: film.title,
          posterUrl: film.posterUrl ?? undefined,
        });
        if (Platform.OS !== 'web') Haptics.selectionAsync();
      }
    },
    [myFavorites, addFavorite, removeFavorite]
  );


  if (loading) {
    return (
      <View style={[commonStyles.center]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  return (
    <View style={[commonStyles.container]}>
      <FlatList
        data={allFilms}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FilmCard
            film={item}
            isFavorite={myFavorites.includes(item.id)}
            onToggleFavorite={toggleFavorite}
            onPress={handlePress}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    paddingTop: HEADER_HEIGHT,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  }
})
