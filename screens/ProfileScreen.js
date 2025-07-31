import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator, Image, ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../supabase';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ todos: 0, notes: 0, planner: 0, quizzes: 0 });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(profileData);

      const fetchCount = async (table) => {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        return count || 0;
      };

      const todos = await fetchCount('todo_items');
      const notes = await fetchCount('course_notes');
      const planner = await fetchCount('planner_tasks');
      const quizzes = await fetchCount('quiz_results');

      setStats({ todos, notes, planner, quizzes });
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout failed', error.message);
    } else {
      navigation.replace('Landing');
    }
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access media library is needed.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const file = result.assets[0];
      const fileExt = file.uri.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const response = await fetch(file.uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

      if (uploadError) {
        Alert.alert('Upload failed', uploadError.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (!updateError) {
        setProfile({ ...profile, avatar_url: publicUrl });
      }
    }
  };

  if (loading || !profile) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  const statItems = [
    { icon: 'list-outline', label: 'Todos', value: stats.todos },
    { icon: 'document-text-outline', label: 'Notes', value: stats.notes },
    { icon: 'calendar-outline', label: 'Planner Tasks', value: stats.planner },
    { icon: 'help-circle-outline', label: 'Quizzes Taken', value: stats.quizzes },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        <TouchableOpacity onPress={handleImagePick} style={styles.avatarWrapper}>
          {profile.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <Icon name="person-circle-outline" size={100} color="#1e3a8a" />
          )}
          <View style={styles.cameraIcon}>
            <Icon name="camera-outline" size={18} color="#1e3a8a" />
          </View>
        </TouchableOpacity>

        <Text style={styles.name}>{profile?.full_name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.joinDate}>
          Joined: {new Date(user?.created_at).toLocaleDateString()}
        </Text>
      </View>

      {statItems.map((item, index) => (
        <View key={index} style={styles.statCard}>
          <Icon name={item.icon} size={22} color="#1e3a8a" />
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>{item.label}</Text>
            <Text style={styles.statValue}>{item.value}</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#fefefe',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  avatarWrapper: { position: 'relative', marginBottom: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: -6,
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    padding: 4,
  },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  email: { fontSize: 14, color: '#6b7280' },
  joinDate: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  statContent: {
    marginLeft: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    color: '#1e3a8a',
    fontWeight: '700',
  },
  logoutBtn: {
    marginTop: 30,
    backgroundColor: '#fee2e2',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  logoutText: {
    color: '#b91c1c',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
