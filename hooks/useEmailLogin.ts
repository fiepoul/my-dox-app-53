import { auth } from '@/firebaseconfig/firebaseconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Platform } from 'react-native';

export const useEmailLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);

      const stored = await AsyncStorage.getItem('previousEmails');
      const list = stored ? JSON.parse(stored) : [];
      if (!list.includes(email.trim())) {
        await AsyncStorage.setItem('previousEmails', JSON.stringify([email.trim(), ...list].slice(0, 5)));
      }

      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      return true;
    } catch {
      setError('Wrong email or password');
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleEmailLogin, loading, error };
};
