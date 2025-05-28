import MeltedTitle from '@/components/MeltedTitle';
import SurrealBackground from '@/components/SurrealBackground';
import { commonStyles } from '@/styles/CommonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db, googleProvider } from '../firebaseconfig/firebaseconfig';
import { useSurrealAnime } from '../hooks/useSurrealAnime';

export default function LoginScreen() {
  const router = useRouter();
  const { circAnim, rectAnim, meltAnim } = useSurrealAnime();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "1000450722631-8ejmu5sjsndmte9vrsns0tmhr47h50dh.apps.googleusercontent.com",
    iosClientId: "1000450722631-8ejmu5sjsndmte9vrsns0tmhr47h50dh.apps.googleusercontent.com",
    clientId: "1000450722631-k92e2k75vjcoh0d2ddnk0ag296q5kore.apps.googleusercontent.com",
  })

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      console.log("Logged in as:", user.email);
  
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);
  
      if (!userSnap.exists()) {
        // Create user document with same fields as email signup
        await setDoc(userDocRef, {
          fullName: user.displayName || '',
          username: user.email?.split('@')[0] || 'user',
          createdAt: serverTimestamp(),
          friends: [],
          // favorites is added as a subcollection automatically
        });
        console.log('Firestore profile created for Google user');
      }
  
      // Go to home screen
      router.replace('/');
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  useEffect (() => {
    if(response?.type==="success")
      console.log("Tilbage fra google" + response.authentication?.accessToken)
  },[response])

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Animations
  const formFade   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
  AsyncStorage.getItem('previousEmails').then(stored => {
    if (stored) setSuggestions(JSON.parse(stored));
  });

  Animated.timing(formFade, {
    toValue: 1,
    duration: 600,
    useNativeDriver: true,
  }).start();
}, []);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    Keyboard.dismiss();
  
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
  
      router.replace('/');
    } catch {
      setError('Wrong email or password');
  
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setLoading(false);
    }
  };

  const filtered = suggestions.filter(e =>
    e.toLowerCase().startsWith(email.toLowerCase()) && email.length > 0
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS==='ios'?'padding':undefined}
      style={[commonStyles.container]}
    >
      {/* moving abstract shapes */}
      <SurrealBackground circAnim={circAnim} rectAnim={rectAnim} />

      <SafeAreaView style={styles.inner}>
        {/* CPH:DOX title */}
        <MeltedTitle meltAnim={meltAnim} text="CPH:DOX" style={{ color: 'orange' }}/>

        {/* Short tagline */}
        <Text style={[commonStyles.headerSub]}>
          Dive into the festival universe.
        </Text>

        {/* Login form */}
        <Animated.View style={{ opacity: formFade, width: '90%', maxWidth: 320 }}>
          <View style={styles.frame}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#555"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={t => { setEmail(t); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && filtered.length > 0 && (
              <View style={styles.suggestionList}>
                {filtered.slice(0,5).map(item => (
                  <TouchableOpacity key={item} onPress={() => { setEmail(item); setShowSuggestions(false); }}>
                    <Text style={styles.suggestion}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TextInput
              placeholder="Password"
              placeholderTextColor="#555"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            <Pressable onPress={handleLogin} style={styles.loginButton} hitSlop={10}>
              {loading
                ? <ActivityIndicator color="#fff"/>
                : <Text style={styles.loginText}>LOGIN</Text>
              }
            </Pressable>

            <Pressable onPress={handleGoogleLogin} style={styles.loginButton}>
              <Text style={styles.loginText}>LOGIN MED GOOGLE</Text>
            </Pressable>

            <Pressable onPress={() => router.push('/signup')} style={styles.signupButton}>
              <Text style={styles.signupText}>SIGN UP</Text>
            </Pressable>
          </View>
        </Animated.View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  loginButton: {
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#0047ff',
  paddingVertical: 14,
  alignItems: 'center',
  marginBottom: 12,
},
  
  loginText: {
    color: '#0047ff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
  frame: {
    borderWidth: 2,
    borderColor: '#000',
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  suggestionList: {
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  signupButton: {
    backgroundColor: '#0047ff',
    borderWidth: 1,
    borderColor: '#0047ff',
    paddingVertical: 12,
    alignItems: 'center',
  },
  signupText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
  errorBox: {
    marginTop: 16,
    backgroundColor: 'rgba(255,68,68,0.1)',
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff5f6d',
  },
  errorText: {
    color: '#990000',
  },
});
