import type { FriendFavorite } from '@/types/favoriteTypes';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from 'firebase/firestore';
import { getCurrentUid } from '../utils/authHelpers';
  
  const db = getFirestore()
  
  export async function fetchFriendsFavorites(): Promise<FriendFavorite[]> {
    const uid = getCurrentUid();
    if (!uid) throw new Error('Not authenticated')
  
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) return []
  
    const friendUids: string[] = userSnap.data().friends || [];
    const allData: FriendFavorite[] = [];
  
    for (const friendUid of friendUids) {
      const userDoc = await getDoc(doc(db, 'users', friendUid))
      const favsSnap = await getDocs(collection(db, 'users', friendUid, 'favorites'))
  
      const favorites = favsSnap.docs.map(doc => parseInt(doc.id))
      const friendData = userDoc.exists()
        ? userDoc.data()
        : { fullName: 'Unknown', username: 'unknown' }
  
      allData.push({
        uid: friendUid,
        favorites,
        fullName: friendData.fullName,
        username: friendData.username,
      })
    }
  
    return allData
  }
  