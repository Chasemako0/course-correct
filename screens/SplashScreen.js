import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // light tap
      navigation.replace('Landing');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInUp" duration={1500} style={styles.logoBox}>
        <Text style={styles.logoTop}>COURSE</Text>
        <Text style={styles.logoBottom}>CORRECT</Text>
        <Text style={styles.tagline}>Your study companion</Text>
        <ActivityIndicator size="large" color="#facc15" style={styles.spinner} />
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: '#111827', // ← updated
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    alignItems: 'center',
  },
  logoTop: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  logoBottom: {
    fontSize: 32,
    color: '#facc15',
    fontWeight: '600',
    marginTop: -4,
  },
  tagline: {
    color: '#e2e8f0',
    fontSize: 14,
    marginTop: 12,
    fontStyle: 'italic',
  },
  spinner: {
    marginTop: 25,
  },
});
