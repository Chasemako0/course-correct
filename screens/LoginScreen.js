import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { supabase } from '../supabase';

export default function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route?.params?.email) {
      setEmail(route.params.email);
    }
  }, [route]);

  const handleLogin = async () => {
  if (!email || !password) {
    Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Enter both email and password' });
    return;
  }

  setLoading(true);
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    await supabase.auth.getSession(); 

    Toast.show({ type: 'success', text1: 'Login successful' });
    navigation.replace('MainTabs');
  } catch (error) {
    Toast.show({ type: 'error', text1: 'Login failed', text2: error.message });
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Icon name="arrow-back-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoTop}>COURSE</Text>
            <Text style={styles.logoBottom}>CORRECT</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            style={styles.input}
            onChangeText={setPassword}
            value={password}
          />

          <TouchableOpacity
            style={[styles.button, loading && { backgroundColor: '#444' }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Don’t have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  header: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
    alignItems: 'center',
  },
  logoTop: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  logoBottom: {
    fontSize: 24,
    color: '#facc15',
    fontWeight: '600',
    marginTop: -4,
  },
  formContainer: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 30,
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#1f2937'
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#1e293b',
    borderRadius: 30,
  },
  link: {
    marginTop: 20,
    color: '#1e3a8a',
    fontSize: 14
  }
});
