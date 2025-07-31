import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, Alert
} from 'react-native';
import { supabase } from '../supabase';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigation = useNavigation();

  const handleChangePassword = async () => {
    if (password !== confirm) {
      Alert.alert("Passwords don't match");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Password changed successfully');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Icon name="arrow-back-outline" size={22} color="#fff" />
      </TouchableOpacity>

      <View style={styles.innerContent}>
        <Text style={styles.title}>Change Password</Text>

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleChangePassword}>
          <Icon name="key-outline" size={18} color="#fff" />
          <Text style={styles.saveText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: '#1e3a8a',
    padding: 10,
    borderRadius: 30,
  },
  innerContent: {
    padding: 24,
    marginTop: 100, // 👈 extra space below back button
  },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20, color: '#1e3a8a' },
  label: { fontSize: 14, color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  saveBtn: {
    flexDirection: 'row',
    backgroundColor: '#4b5563',
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontSize: 16, marginLeft: 8 },
});
