import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Top section with illustration and logo */}
      <View style={styles.topSection}>
        <Animatable.Image
          animation="fadeInDown"
          delay={300}
          source={require('../assets/study.png')} // 🔁 Your illustration
          style={styles.illustration}
          resizeMode="contain"
        />

        <Animatable.View animation="fadeIn" delay={600} style={styles.logoBox}>
          <Text style={styles.logoTop}>COURSE</Text>
          <Text style={styles.logoBottom}>CORRECT</Text>
        </Animatable.View>
      </View>

      {/* Bottom yellow section */}
      <Animatable.View animation="fadeInUp" delay={900} style={styles.bottomSection}>
        <Animatable.Text animation="bounceIn" delay={1100} style={styles.welcome}>
          Welcome
        </Animatable.Text>

        <Animatable.Text animation="fadeIn" delay={1300} style={styles.description}>
          Plan your courses, take quick notes, track progress and stay ahead.
        </Animatable.Text>

        <Animatable.View animation="zoomIn" delay={1600} style={styles.buttonRow}>
          <TouchableOpacity style={styles.signInBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signUpBtn} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  topSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingTop: 60,
  },
  illustration: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  logoBox: {
    alignItems: 'center',
  },
  logoTop: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1.5,
  },
  logoBottom: {
    fontSize: 32,
    fontWeight: '600',
    color: '#facc15',
    marginTop: -4,
  },
  bottomSection: {
    flex: 1.5,
    backgroundColor: '#facc15',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    color: '#1f2937',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  signInBtn: {
    flex: 1,
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  signUpBtn: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  signInText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  signUpText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 14,
  },
});
