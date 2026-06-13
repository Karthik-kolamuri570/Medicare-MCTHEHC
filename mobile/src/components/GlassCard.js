import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function GlassCard({ children, style, active = false }) {
  return (
    <View style={[
      styles.card,
      active && styles.activeCard,
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,           // Matches web .unified-login-container rounded corners
    borderWidth: 2,
    borderColor: '#e2e8f0',     // Elegant light border
    backgroundColor: '#ffffff', // Pure white card background
    padding: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  activeCard: {
    borderColor: '#0ea5e9',     // Active sky blue border focus (Patient portal)
  },
});
