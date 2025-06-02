import type { FriendFavorite } from '@/types/favoriteTypes';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
} from 'firebase/firestore';
import { getCurrentUid } from '../utils/authHelpers';

const db = getFirestore();

// Funktionsmetode til at sætte en realtime lytter til venner
export function subscribeToFriendsFavorites(callback: (data: FriendFavorite[]) => void) {
  const uid = getCurrentUid();
  if (!uid) throw new Error('Not authenticated');

  const userRef = doc(db, 'users', uid);

  // Lyt til brugerens dokument for at få list over venner
  const unsubscribeUser = onSnapshot(userRef, async (userSnap) => {
    if (!userSnap.exists()) {
      callback([]);
      return;
    }
    const friendUids: string[] = userSnap.data().friends || [];

    // Hvis ingen venner, retur
    if (friendUids.length === 0) {
      callback([]);
      return;
    }

    // Samle alle venner's favoritter i et array
    const allFavorites: FriendFavorite[] = [];

    // For hver ven, lyt til deres 'favorites'-kald
    // Her bruger vi `Promise.all` for at håndtere flere async kald samtidigt
    const promises = friendUids.map(async (friendUid) => {
      const userDocSnap = await getDoc(doc(db, 'users', friendUid));
      const favsSnap = await getDocs(
        collection(db, 'users', friendUid, 'favorites')
      );

      const favorites = favsSnap.docs.map((favDoc) => parseInt(favDoc.id, 10));

      const friendData = userDocSnap.exists()
        ? userDocSnap.data()
        : { fullName: 'Unknown', username: 'unknown' };

      return {
        uid: friendUid,
        favorites,
        fullName: friendData.fullName,
        username: friendData.username,
      } as FriendFavorite;
    });

    const friendsData = await Promise.all(promises);
    callback(friendsData);
  });

  // Returner fjernelsesfunktion
  return () => {
    unsubscribeUser();
  };
}
