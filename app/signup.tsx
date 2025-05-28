import MeltedTitle from '@/components/MeltedTitle';
import SurrealBackground from '@/components/SurrealBackground';
import { commonStyles } from '@/styles/CommonStyles';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { auth, db } from '../firebaseconfig/firebaseconfig';
import { useSurrealAnime } from '../hooks/useSurrealAnime';

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string|null>(null);
  const [loading, setLoading]   = useState(false);
  const { circAnim, rectAnim, meltAnim } = useSurrealAnime();

  const handleSignup = async () => {
    setError(null);
    setLoading(true);
    Keyboard.dismiss();
    try {
      if (!fullName.trim() || !username.trim()) {
        throw new Error('Please fill in name & username');
      }
      // check username uniqueness
      const q = query(collection(db, 'users'), where('username','==',username.trim()));
      const snap = await getDocs(q);
      if (!snap.empty) throw new Error('Username taken');

      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const uid = cred.user.uid;
      await setDoc(doc(db,'users',uid),{
        fullName: fullName.trim(),
        username: username.trim(),
        createdAt: serverTimestamp(),
        friends: [],
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/');
    } catch(e: any) {
      setError(e.message || 'Could not create account');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS==='ios'?'padding':undefined}
      style={[commonStyles.container]}
    >
      {/* Surreal shapes */}
      <SurrealBackground
  circAnim={circAnim}
  rectAnim={rectAnim}
/>

    <SafeAreaView style={styles.inner}>
      <MeltedTitle meltAnim={meltAnim} text="SIGN UP" style={{ color: '#2ecc40' }}/>

        {/* Brief description */}
        <Text style={styles.brief}>
          Become part of the DOX universe.
        </Text>

        <View style={styles.frame}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#555"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            placeholder="Username"
            placeholderTextColor="#555"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#555"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#555"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable onPress={handleSignup} style={styles.signupBtn}>
            {loading
              ? <ActivityIndicator color="#fff"/>
              : <Text style={styles.signupText}>CREATE</Text>
            }
          </Pressable>

          <Pressable onPress={()=>router.back()} style={styles.loginLink}>
            <Text style={styles.loginText}>Already have an account? LOGIN →</Text>
          </Pressable>
        </View>

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
  inner: { flex:1, alignItems:'center', justifyContent:'center', padding:24 },
  heading: {
    fontSize:32,
    fontWeight:'900',
    letterSpacing:4,
    color:'#000',
    marginBottom:8
  },
  brief: {
    fontSize:14,
    color:'#555',
    fontStyle:'italic',
    marginBottom:24,
    textAlign:'center'
  },
  frame: {
    borderWidth:2,
    borderColor:'#000',
    padding:20,
    width:'90%',
    maxWidth:320
  },
  input: {
    borderBottomWidth:1,
    borderColor:'#ccc',
    paddingVertical:12,
    marginBottom:20,
    fontSize:16
  },
  signupBtn: {
    backgroundColor:'#0047ff',
    paddingVertical:14,
    alignItems:'center',
    marginBottom:16
  },
  signupText: {
    color:'#fff',
    fontWeight:'900',
    fontSize:16,
    letterSpacing:2
  },
  loginLink: {
    alignItems:'center',
    paddingVertical:8
  },
  loginText: {
    color:'#0047ff',
    fontWeight:'700',
    fontSize:14,
    letterSpacing:1
  },
  errorBox: {
    marginTop:16,
    backgroundColor:'rgba(255,68,68,0.1)',
    padding:12,
    borderLeftWidth:4,
    borderLeftColor:'#ff5f6d'
  },
  errorText: {
    color:'#990000'
  }
});
