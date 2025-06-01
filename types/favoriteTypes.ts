export type Favorite = {
  id: string; // Firestore dokument-ID som string
  title: string;
  posterUrl?: string | null;
  addedAt?: number;
};

export type FavoriteInput = {
  id: number;
  title: string;
  posterUrl?: string;
};

export type FriendFavorite = {
  uid: string;
  fullName: string;
  username: string;
  favorites: number[];
};