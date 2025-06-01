import MeltedTitle from '@/components/MeltedTitle';
import SurrealBackground from '@/components/SurrealBackground';
import { useEmailLogin } from '@/hooks/useEmailLogin';
import { useEmailSuggestions } from '@/hooks/useEmailSuggestions';
import { useGoogleLogin } from '@/hooks/useGoogleLogin';
import { commonStyles } from '@/styles/CommonStyles';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useSurrealAnime } from '../hooks/useSurrealAnime';

export default function LoginScreen() {
  const router = useRouter();
  const { circAnim, rectAnim, meltAnim } = useSurrealAnime();
  const { handleEmailLogin, loading, error } = useEmailLogin();
  const { signIn: handleGoogleLogin } = useGoogleLogin();
  const { suggestions, updateSuggestions } = useEmailSuggestions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Animations
  const formFade   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
  Animated.timing(formFade, {
    toValue: 1,
    duration: 600,
    useNativeDriver: true,
  }).start();
  }, []);

  const handleLogin = async () => {
  Keyboard.dismiss();
  const success = await handleEmailLogin(email, password);
  if (success) {
    await updateSuggestions(email);
    router.replace('/');
  }
};

const filtered = useMemo(() =>
  suggestions.filter(e =>
    e.toLowerCase().startsWith(email.toLowerCase()) && email.length > 0
  ),
  [suggestions, email]
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
