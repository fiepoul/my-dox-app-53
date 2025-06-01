import { auth, db } from '@/firebaseconfig/firebaseconfig';
import * as Haptics from 'expo-haptics';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import { Platform } from 'react-native';

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (fullName: string, username: string, email: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      if (!fullName.trim() || !username.trim()) {
        throw new Error('Please fill in name & username');
      }

      const q = query(collection(db, 'users'), where('username','==',username.trim()));
      const snap = await getDocs(q);
      if (!snap.empty) throw new Error('Username taken');

      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const uid = cred.user.uid;

      await setDoc(doc(db, 'users', uid), {
        fullName: fullName.trim(),
        username: username.trim(),
        createdAt: serverTimestamp(),
        friends: [],
      });

      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      return true;
    } catch (e: any) {
      setError(e.message || 'Could not create account');
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
};
