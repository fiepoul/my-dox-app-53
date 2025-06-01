// This file shows the user's friends and their favorite films.
import AddFriend from '@/components/addFriends';
import SectionHeader from '@/components/SectionHeader';
import { commonStyles } from '@/styles/CommonStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppData } from '../../context/AppDataContext';

const HEADER_OFFSET =
  Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 60 : 60

export default function FriendsTab() {
  const router = useRouter()
  const { friendsFavorites, allFilms, refreshFriends, removeFriend, loading } = useAppData();

  // Remove a friend (mutual)
  const handleRemove = useCallback(
  async (uid: string) => {
    await removeFriend(uid);
    await refreshFriends(); 
  },
  [removeFriend, refreshFriends]
);

if (loading) return <Text>Loading...</Text>;

  // Helper: find a film title by its ID
  const findFilmTitle = (id: number) => {
    const m = allFilms.find(f => f.id === id)
    return m?.title || `Film ID ${id}`
  }

  return (
    <SafeAreaView style={[commonStyles.container]}>
      <FlatList
        data={friendsFavorites}
        keyExtractor={(item, idx) => item.uid + idx}
        contentContainerStyle={[
          styles.list,
          { paddingTop: HEADER_OFFSET + 24 },
        ]}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <SectionHeader
              title="MY FRIENDS"
              subtitle="WHY WATCH ALONE WHEN YOU CAN AUDITION A FRIEND?"
            />
            <AddFriend promptText="tired of your friends' film taste?" />
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            YOU HAVEN’T ADDED ANY FRIENDS YET
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.block}>
            <View style={styles.headerRow}>
              <Text style={styles.userName}>
                {item.fullName.toUpperCase()}
              </Text>
              <Pressable onPress={() => handleRemove(item.uid)} hitSlop={12}>
                <Ionicons name="trash-outline" size={20} color="#000" />
              </Pressable>
            </View>
            {item.favorites.length === 0 ? (
              <Text style={styles.emptyText}>NO LIKED FILMS YET</Text>
            ) : (
              <View style={styles.filmGrid}>
                {item.favorites.map((fid: number) => (
                  <Pressable
                    key={fid}
                    style={styles.filmCard}
                    onPress={() =>
                      router.push({
                        pathname: '/movie/[id]',
                        params: { id: fid.toString() },
                      })
                    }
                  >
                    <Text style={styles.filmTitle} numberOfLines={3}>
                      {findFilmTitle(fid).toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
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

  headerBlock: {
    marginBottom: 12,
    alignItems: 'center',
  },
  block: {
    marginBottom: 12,        
    padding: 12,             
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1,
  },

  filmGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  filmCard: {
    width: '44%',
    aspectRatio: 3 / 4,
    backgroundColor: '#0047ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 4,
    padding: 6,
  },
  filmTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  emptyListText: {
    marginTop: 80,
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    fontStyle: 'italic',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    fontSize: 13,
  },
})
