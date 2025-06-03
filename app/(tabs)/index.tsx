import { renderFilmRow } from '@/components/renderFilmRow';
import { useAuth } from '@/context/AuthContext';
import { commonStyles } from '@/styles/CommonStyles';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import 'react-native-url-polyfill/auto';
import { useAppData } from '../../context/AppDataContext';

export default function HomeScreen() {
  const { user, initializing } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { fullName, myFavorites, friendsFavorites, allFilms} = useAppData();

  // Redirect hvis ikke logget ind
useEffect(() => {
  if (!initializing && !user) {
    router.replace('/login');
  }
}, [initializing, user, router]);

// Animation — kører kun én gang ved mount
useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 800,
    useNativeDriver: true,
  }).start();
}, []); 


  const goToFavorite = () => router.push('/favorites');
  const goToFriends = () => router.push('/friends');

  return (
    <SafeAreaView style={[commonStyles.container]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              hi, <Text style={styles.name}>{fullName.toUpperCase()}</Text>
            </Text>
            <View style={styles.separator} />
            <Text style={[commonStyles.headerSub]}>
              A social film app. Built without pull requests.
            </Text>
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={goToFavorite}>
              <Text style={styles.sectionTitle}>My Favorites</Text>
              <AntDesign name="right" size={18} color="#0047ff" />
            </TouchableOpacity>
            {myFavorites.length > 0
              ? renderFilmRow({ filmIds: myFavorites, allFilms })
              : <Text style={[commonStyles.emptyText]}>You haven’t liked any films yet.</Text>}
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={goToFriends}>
              <Text style={styles.sectionTitle}>Friends’ Favorites</Text>
              <AntDesign name="right" size={18} color="#0047ff" />
            </TouchableOpacity>
            {friendsFavorites.length > 0 ? (
              renderFilmRow({ filmIds: friendsFavorites.flatMap(friend => friend.favorites)
                  .filter((id, index, arr) => arr.indexOf(id) === index)
                  .slice(0, 10), allFilms })
            ) : (
              <Text style={[commonStyles.emptyText]}>Your friends haven’t liked any films yet.</Text>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 38,
    fontWeight: '900',
    color: '#0047ff',
    letterSpacing: 10,
    fontFamily: 'sans-serif-condensed',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  welcomeContainer: {
    marginTop: 12,
    marginBottom: 32,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  name: {
    color: '#0047ff',
  },
  separator: {
    width: 60,
    height: 2,
    backgroundColor: '#000',
    marginTop: 8,
    marginBottom: 14,
  },
  section: {
    marginBottom: 44,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});
