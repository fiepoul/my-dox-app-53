// context/AppDataContext.tsx
import { addFavorite, fetchFavorites, removeFavorite } from '@/app/api/DoxFavoritesApi';
import { fetchDoxFilms } from '@/app/api/DoxFilmApi';
import { fetchFriendsFavorites } from '@/app/api/friendsApi';
import { addFriendByUsername, removeFriend as apiRemoveFriend, fetchCurrentUserData } from '@/app/api/userApi';
import type { FavoriteInput, FriendFavorite } from '@/types/favoriteTypes';
import type { Film } from '@/types/filmTypes';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';


// 1️⃣ Define the shape of the context
type AppDataContextType = {
  fullName: string;
  allFilms: Film[];
  myFavorites: number[];
  friendsFavorites: FriendFavorite[];
  loading: boolean;
  refreshFriends: () => Promise<void>;
  refreshFavorites: () => Promise<void>;
  addFavorite: (film: FavoriteInput) => Promise<void>;        
  removeFavorite: (filmId: number) => Promise<void>;      
  addFriend: (username: string) => Promise<void>;          
  removeFriend: (uid: string) => Promise<void>;            
};

// 2️⃣ Default context (optional for SSR but we’ll use undefined guard)
const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// 3️⃣ Provider
export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('Guest');
  const [allFilms, setAllFilms] = useState<Film[]>([]);
  const [myFavorites, setMyFavorites] = useState<number[]>([]);
  const [friendsFavorites, setFriendsFavorites] = useState<FriendFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [userData, films, favs, friendsFavs] = await Promise.all([
          fetchCurrentUserData(),
          fetchDoxFilms(),
          fetchFavorites(),
          fetchFriendsFavorites(),
        ]);

        setFullName(userData.fullName || 'Guest');
        setAllFilms(films);
        setMyFavorites(favs.map(f => Number(f.id)).filter(id => !isNaN(id)));
        setFriendsFavorites(friendsFavs);
      } catch (err) {
        console.error('[AppDataContext] Load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleAddFavorite = async (film: FavoriteInput) => {
  await addFavorite(film);
  const updated = await fetchFavorites();
  setMyFavorites(updated.map(f => Number(f.id)).filter(id => !isNaN(id)));
};

const handleRemoveFavorite = async (id: number) => {
  await removeFavorite(id);
  const updated = await fetchFavorites();
  setMyFavorites(updated.map(f => Number(f.id)).filter(id => !isNaN(id)));
};

const handleAddFriend = async (username: string) => {
  await addFriendByUsername(username);
  const updated = await fetchFriendsFavorites();
  setFriendsFavorites(updated);
};

const handleRemoveFriend = async (uid: string) => {
  await apiRemoveFriend(uid);
  const updated = await fetchFriendsFavorites();
  setFriendsFavorites(updated);
};


  // Refresh friends
  const refreshFriends = async () => {
    const updated = await fetchFriendsFavorites();
    setFriendsFavorites(updated);
  };

  const refreshFavorites = async () => {
  const favs = await fetchFavorites();
  setMyFavorites(favs.map(f => Number(f.id)).filter(id => !isNaN(id)));
};


  return (
    <AppDataContext.Provider
  value={{
    fullName,
    allFilms,
    myFavorites,
    friendsFavorites,
    loading,
    refreshFriends,
    refreshFavorites,
    addFavorite: handleAddFavorite,
    removeFavorite: handleRemoveFavorite,
    addFriend: handleAddFriend,
    removeFriend: handleRemoveFriend,
  }}
>
      {children}
    </AppDataContext.Provider>
  );
};

// 4️⃣ Hook med error hvis ikke inde i provider
export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
