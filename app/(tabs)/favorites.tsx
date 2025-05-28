// This file shows the users favorite films from the Dox API.
import FilmCard from '@/components/filmCard';
import { commonStyles } from '@/styles/CommonStyles';
import type { Film } from '@/types/filmTypes';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchFavorites, removeFavorite } from '../api/DoxFavoritesApi';
import { fetchDoxFilms } from '../api/DoxFilmApi';

const HEADER_OFFSET =
  Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 60 : 60

export default function FavoritesScreen() {
  const router = useRouter()
  const [films, setFilms] = useState<Film[]>([])
  const [favIds, setFavIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Load data + fade-in
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start()

    let alive = true
    ;(async () => {
      try {
        const [all, favArray] = await Promise.all([fetchDoxFilms(), fetchFavorites()])
        if (!alive) return
        setFilms(all)
        setFavIds(new Set(favArray.map((f) => f.id.toString())))
      } catch (e) {
        console.error('Failed to load', e)
      } finally {
        alive && setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  // Remove a favorite
  const handleRemove = useCallback(async (id: number) => {
    await removeFavorite(id)
    setFavIds((prev) => {
      const next = new Set(prev)
      next.delete(id.toString())
      return next
    })
  }, [])

  // Only the films you’ve favorited
  const favoriteFilms = useMemo(
    () => films.filter((f) => favIds.has(f.id.toString())),
    [films, favIds]
  )

  if (loading) {
    return (
      <View style={[commonStyles.center]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
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
          { paddingTop: HEADER_OFFSET + 24 }, 
        ]}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={[commonStyles.accentStripe]} />
            <Text style={[commonStyles.headerMain]}>MY FAVORITES</Text>
            <Text style={[commonStyles.headerSub]}>
              Here are the films you’ve saved. Tap a poster to dive deeper.
            </Text>
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
            onPress={(id) =>
              router.push({ pathname: '/movie/[id]', params: { id: id.toString() } })
            }
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
