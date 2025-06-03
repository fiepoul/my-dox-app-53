// This file shows the user's friends and their favorite films.
import AddFriend from '@/components/addFriends';
import { renderFilmRow } from '@/components/renderFilmRow';
import SectionHeader from '@/components/SectionHeader';
import { commonStyles } from '@/styles/CommonStyles';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useAppData } from '../../context/AppDataContext';

export default function FriendsTab() {
  const { friendsFavorites, allFilms, removeFriend } = useAppData();

  // Remove a friend (mutual)
  const handleRemove = useCallback(
  async (uid: string) => {
    await removeFriend(uid); 
  },
  [removeFriend]
);
  return (
    <SafeAreaView style={[commonStyles.container]}>
      <FlatList
        data={friendsFavorites}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={[
          styles.list,
          { paddingTop: 24 },
        ]}
        ListHeaderComponent={
          <View style={commonStyles.headerBlock}>
            <SectionHeader
              title="MY FRIENDS"
              subtitle="WHY WATCH ALONE WHEN YOU CAN AUDITION A FRIEND?"
            />
            <AddFriend promptText="tired of your friends' film taste?" />
          </View>
        }
        ListEmptyComponent={
          <Text style={commonStyles.emptyText}>
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
              <Text style={commonStyles.emptyText}>NO LIKED FILMS YET</Text>
            ) : (
              <View>
                {renderFilmRow({ filmIds: item.favorites, allFilms: allFilms})}
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
})
