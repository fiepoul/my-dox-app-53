import type { Favorite, FavoriteInput } from '@/types/favoriteTypes';
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    setDoc
} from "firebase/firestore";
import { db } from "../firebaseconfig/firebaseconfig";
import { getCurrentUid } from "../utils/authHelpers";
  
  // Hent alle favoritter for nuværende bruger
  export async function fetchFavorites(): Promise<Favorite[]> {
  const uid = getCurrentUid();
  const favCol = collection(db, "users", uid, "favorites");
  const snap = await getDocs(favCol);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Favorite));
}
  
  // Tilføj en favorit
 export async function addFavorite(film: FavoriteInput): Promise<void> {
  const uid = getCurrentUid();
  const favDoc = doc(db, "users", uid, "favorites", film.id.toString());
  await setDoc(favDoc, {
    title: film.title,
    posterUrl: film.posterUrl || null,
    addedAt: Date.now()
  });
}
  
  // Fjern en favorit
  export async function removeFavorite(filmId: number) {
    const uid = getCurrentUid();
    const favDoc = doc(db, "users", uid, "favorites", filmId.toString());
    await deleteDoc(favDoc);
  }