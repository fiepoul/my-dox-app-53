import type { UserPublic } from '@/types/userTypes';
import {
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { getCurrentUid } from '../utils/authHelpers';
  
  const db = getFirestore()
  
  export async function findUserByUsername(username: string): Promise<UserPublic | null> {
  const q = query(collection(db, 'users'), where('username', '==', username));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  const data = docSnap.data();

  return {
    uid: docSnap.id,
    fullName: data.fullName ?? '',
    username: data.username ?? '',
  };
}
  
  export async function addFriendByUsername(username: string): Promise<void> {
  const friend = await findUserByUsername(username);
  if (!friend) throw new Error('User not found');

  const myUid = getCurrentUid();
  if (friend.uid === myUid) {
    throw new Error("You can't add yourself");
  }

  const userRef = doc(db, 'users', myUid);
  const friendRef = doc(db, 'users', friend.uid);

  await Promise.all([
    updateDoc(userRef, { friends: arrayUnion(friend.uid) }),
    updateDoc(friendRef, { friends: arrayUnion(myUid) }),
  ]);
}

  export async function fetchCurrentUserData(): Promise<UserPublic> {
  const uid = getCurrentUid();
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error('User not found');

  const data = userSnap.data();
  return {
    uid,
    fullName: data.fullName ?? '',
    username: data.username ?? '',
  };
}
  
  
  export async function removeFriend(uidToRemove: string): Promise<void> {
  const myUid = getCurrentUid();
  const myRef = doc(db, 'users', myUid);
  const theirRef = doc(db, 'users', uidToRemove);

  await Promise.all([
    updateDoc(myRef, { friends: arrayRemove(uidToRemove) }),
    updateDoc(theirRef, { friends: arrayRemove(myUid) }),
  ]);
}
  