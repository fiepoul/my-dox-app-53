import { UserProfile } from '@/types/userTypes';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Platform } from 'react-native';
import { auth, db, googleProvider } from '../firebaseconfig/firebaseconfig';

export const useGoogleLogin = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "1000450722631-8ejmu5sjsndmte9vrsns0tmhr47h50dh.apps.googleusercontent.com",
    iosClientId: "1000450722631-8ejmu5sjsndmte9vrsns0tmhr47h50dh.apps.googleusercontent.com",
    clientId: "1000450722631-k92e2k75vjcoh0d2ddnk0ag296q5kore.apps.googleusercontent.com",
  });

  const signIn = async (): Promise<UserProfile | undefined> => {
    console.log('auth:', auth);
    console.log('googleProvider:', googleProvider);
    if (Platform.OS === 'web') {
      // Web: brug Firebase signInWithPopup
      const userCred = await signInWithPopup(auth, googleProvider);
      const user = userCred.user;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          fullName: user.displayName || '',
          username: user.email?.split('@')[0],
          createdAt: serverTimestamp(),
          friends: [],
        });
      }
      return {
        uid: user.uid,
        email: user.email || '',
        fullName: user.displayName || '',
        username: user.email?.split('@')[0] || 'user',
      };
    } else {
      // Native: brug expo-auth-session
      const result = await promptAsync();
      if (result.type !== 'success' || !result.authentication?.idToken) {
        console.warn("❌ Google login failed or cancelled");
        return;
      }
      const credential = GoogleAuthProvider.credential(result.authentication.idToken);
      const userCred = await signInWithCredential(auth, credential);
      const user = userCred.user;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          fullName: user.displayName || '',
          username: user.email?.split('@')[0],
          createdAt: serverTimestamp(),
          friends: [],
        });
      }
      return {
        uid: user.uid,
        email: user.email || '',
        fullName: user.displayName || '',
        username: user.email?.split('@')[0] || 'user',
      };
    }
  };

  return { request, response, signIn };
};