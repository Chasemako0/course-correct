import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { supabase } from '../supabase';

export default function Dashboard({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [initials, setInitials] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profile?.full_name) {
        const name = profile.full_name.trim().replace(/\s+/g, ' ');
        setFullName(name);

        const nameParts = name.split(' ');
        const userInitials = nameParts.map(n => n[0]).slice(0, 2).join('').toUpperCase();
        setInitials(userInitials);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.logoTop}>COURSE</Text>
          <Text style={styles.logoBottom}>CORRECT</Text>
        </View>

        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Icon name="notifications-outline" size={22} color="#fff" style={styles.iconSpacing} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.avatarCircle}>
              {initials ? (
                <Text style={styles.avatarText}>{initials}</Text>
              ) : (
                <Icon name="person-outline" size={18} color="#1e3a8a" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.greeting}>
        Welcome Back{fullName ? `, ${fullName.split(' ')[0]}` : ''} <Text style={styles.wave}>👋</Text>
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
        <Text style={styles.menuButton}></Text>
      </TouchableOpacity>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('CourseNotes')}>
          <Icon name="book-outline" size={26} color="#1e3a8a" />
          <Text style={styles.gridLabel}>Course Note</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Planner')}>
          <Icon name="calendar-outline" size={26} color="#1e3a8a" />
          <Text style={styles.gridLabel}>Planner</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Quiz')}>
          <Icon name="help-circle-outline" size={26} color="#1e3a8a" />
          <Text style={styles.gridLabel}>Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Todo')}>
          <Icon name="checkmark-done-outline" size={26} color="#1e3a8a" />
          <Text style={styles.gridLabel}>To-Do</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  logoTop: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1.5,
  },
  logoBottom: {
    fontSize: 20,
    fontWeight: '700',
    color: '#facc15',
    marginTop: -2,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginRight: 12,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  avatarText: {
    color: '#1e3a8a',
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 24,
    marginBottom: 8,
  },
  wave: {
    fontSize: 20,
  },
  menuButton: {
    fontSize: 14,
    color: '#1e3a8a',
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
  },
  gridItem: {
    width: '47%',
    backgroundColor: '#fff',
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  gridLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
});
