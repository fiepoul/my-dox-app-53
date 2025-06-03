// This file shows the users favorite films from the Dox API.
import FilmCard from '@/components/filmCard';
import SectionHeader from '@/components/SectionHeader';
import { commonStyles } from '@/styles/CommonStyles';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useAppData } from '../../context/AppDataContext';

export default function FavoritesScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    allFilms,
    myFavorites,
    loading,
    removeFavorite,
    refreshFavorites,
  } = useAppData();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRemove = useCallback(
  async (id: number) => {
    await removeFavorite(id);
    await refreshFavorites(); // opdaterer data i context
  },
  [removeFavorite, refreshFavorites]  
  );

  const favoriteFilms = useMemo(
    () => allFilms.filter((f) => myFavorites.includes(f.id)),
    [allFilms, myFavorites]
  );

  if (loading) {
    return (
      <View style={[commonStyles.center]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[commonStyles.container]}>
      <FlatList
        data={favoriteFilms}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.list,
          { paddingTop: 24 }, 
        ]}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <SectionHeader
              title="MY FAVORITES"
              subtitle="Here are the films you’ve saved. Tap a poster to dive deeper."
            />
          </View>
        }
        ListEmptyComponent={
          <Text style={[commonStyles.emptyText]}>
            YOU HAVEN’T SAVED ANY FILMS YET
          </Text>
        }
        renderItem={({ item }) => (
          <FilmCard
            film={item}
            isFavorite={true}
            onToggleFavorite={({ id }) => handleRemove(id)}
          />
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  headerBlock: {
    marginBottom: 24,
    alignItems: 'center',
    zIndex: 1,
  },
})
