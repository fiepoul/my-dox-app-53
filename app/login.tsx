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
  Dimensions,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db, googleProvider } from '../firebaseconfig/firebaseconfig';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHAPE_SIZE = 180;

export default function LoginScreen() {
  const router = useRouter();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "1000450722631-8ejmu5sjsndmte9vrsns0tmhr47h50dh.apps.googleusercontent.com",
    iosClientId: "1000450722631-8ejmu5sjsndmte9vrsns0tmhr47h50dh.apps.googleusercontent.com",
    clientId: "1000450722631-k92e2k75vjcoh0d2ddnk0ag296q5kore.apps.googleusercontent.com",
  })

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      console.log("✅ Logged in as:", user.email);
  
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);
  
      if (!userSnap.exists()) {
        // 🔧 Opret bruger-dokument med samme felter som email-signup
        await setDoc(userDocRef, {
          fullName: user.displayName || '',
          username: user.email?.split('@')[0] || 'user',
          createdAt: serverTimestamp(),
          friends: [],
          // favorites kommer automatisk som en subcollection, så den oprettes først når du sætter noget ind i den
        });
        console.log('📄 Firestore-profil oprettet for Google-bruger');
      }
  
      // Gå videre til appen
      router.replace('/');
    } catch (err) {
      console.error("❌ Google login fejlede:", err);
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
  const circleAnim = useRef(new Animated.Value(0)).current;
  const rectAnim   = useRef(new Animated.Value(0)).current;
  const meltAnim   = useRef(new Animated.Value(0)).current;
  const formFade   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Load email history
    AsyncStorage.getItem('previousEmails').then(stored => {
      if (stored) setSuggestions(JSON.parse(stored));
    });
    // Animate shapes
    Animated.loop(
      Animated.sequence([
        Animated.timing(circleAnim, { toValue:1, duration:6000, easing:Easing.linear, useNativeDriver:true }),
        Animated.timing(circleAnim, { toValue:0, duration:6000, easing:Easing.linear, useNativeDriver:true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(rectAnim, { toValue:1, duration:8000, easing:Easing.inOut(Easing.ease), useNativeDriver:true }),
        Animated.timing(rectAnim, { toValue:0, duration:8000, easing:Easing.inOut(Easing.ease), useNativeDriver:true }),
      ])
    ).start();
    // Heading “melt”
    Animated.loop(
      Animated.sequence([
        Animated.timing(meltAnim, { toValue:1, duration:2000, easing:Easing.inOut(Easing.quad), useNativeDriver:true }),
        Animated.timing(meltAnim, { toValue:0, duration:2000, easing:Easing.inOut(Easing.quad), useNativeDriver:true }),
      ])
    ).start();
    // Fade in form
    Animated.timing(formFade, { toValue:1, delay:800, duration:600, easing:Easing.out(Easing.exp), useNativeDriver:true }).start();
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
  
      // ✅ Haptics kun hvis ikke web
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
      style={styles.container}
    >
      {/* moving abstract shapes */}
      <Animated.View
        style={[
          styles.shapeCircle,
          {
            transform: [
              { translateX: circleAnim.interpolate({ inputRange:[0,1], outputRange:[-SHAPE_SIZE, SCREEN_WIDTH*0.6] }) },
              { translateY: circleAnim.interpolate({ inputRange:[0,1], outputRange:[-SHAPE_SIZE*0.5, SCREEN_HEIGHT*0.2] }) },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.shapeRect,
          {
            transform: [
              { rotate: rectAnim.interpolate({ inputRange:[0,1], outputRange:['0deg','360deg'] }) }
            ],
          },
        ]}
      />

      <SafeAreaView style={styles.inner}>
        {/* CPH:DOX title */}
        <Animated.Text
          style={[
            styles.appTitle,
            {
              transform: [
                { skewX: meltAnim.interpolate({ inputRange:[0,1], outputRange:['0deg','10deg'] }) },
                { translateY: meltAnim.interpolate({ inputRange:[0,1], outputRange:[0,10] }) },
              ],
              opacity: meltAnim.interpolate({ inputRange:[0,1], outputRange:[1,0.8] }),
            },
          ]}
        >
          CPH:DOX
        </Animated.Text>

        {/* Short tagline */}
        <Text style={styles.tagline}>
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

            <Pressable onPress={handleGoogleLogin} style={styles.googleButton}>
              <Text style={styles.googleText}>LOGIN MED GOOGLE</Text>
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
  container: { flex: 1, backgroundColor: '#fff' },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0047ff',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  
  googleText: {
    color: '#0047ff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
  shapeCircle: {
    position: 'absolute',
    width: SHAPE_SIZE,
    height: SHAPE_SIZE,
    borderRadius: SHAPE_SIZE/2,
    backgroundColor: 'rgba(0,68,255,0.1)',
  },
  shapeRect: {
    position: 'absolute',
    width: SHAPE_SIZE*1.2,
    height: SHAPE_SIZE*0.5,
    backgroundColor: 'rgba(255,64,129,0.1)',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 6,
    color: '#0047ff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 24,
    textAlign: 'center',
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
  loginButton: {
    backgroundColor: '#0047ff',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
  },
  signupButton: {
    borderWidth: 1,
    borderColor: '#0047ff',
    paddingVertical: 12,
    alignItems: 'center',
  },
  signupText: {
    color: '#0047ff',
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
