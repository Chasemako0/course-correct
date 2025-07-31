import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { supabase } from '../supabase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

const handleRegister = async () => {
  if (password !== confirmPassword) {
    Toast.show({ type: 'error', text1: 'Passwords do not match' });
    return;
  }

  setLoading(true);

  try {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    const userId = data.user?.id || data.session?.user?.id;
    if (!userId) throw new Error('No user ID returned after sign-up');

    const full_name = `${firstName} ${lastName}`.trim();

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          full_name,
          email,
          
        },
      ]);

    if (profileError) throw profileError;

    Toast.show({ type: 'success', text1: 'Account created', text2: 'Please log in.' });
    navigation.replace('Login', { email });
  } catch (error) {
    Toast.show({ type: 'error', text1: 'Registration failed', text2: error.message });
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
          <Text style={styles.title}>Sign Up</Text>

          <TextInput
            placeholder="First name"
            placeholderTextColor="#aaa"
            style={styles.input}
            onChangeText={setFirstName}
            value={firstName}
          />
          <TextInput
            placeholder="Last name"
            placeholderTextColor="#aaa"
            style={styles.input}
            onChangeText={setLastName}
            value={lastName}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            style={styles.input}
            onChangeText={setPassword}
            value={password}
          />
          <TextInput
            placeholder="Confirm password"
            placeholderTextColor="#aaa"
            secureTextEntry
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />

          <TouchableOpacity
            style={[styles.button, loading && { backgroundColor: '#444' }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login', { email })}>
            <Text style={styles.link}>Already have an account? Sign In</Text>
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
    flex: 3,
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
    marginBottom: 12,
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
