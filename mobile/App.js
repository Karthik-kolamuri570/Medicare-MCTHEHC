import React, { useState, useEffect } from 'react';
import { StatusBar, View, ActivityIndicator, StyleSheet, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

// Silence common Safe Area deprecation warning popups in Expo Go
LogBox.ignoreLogs(['SafeAreaView has been deprecated', 'expo-notifications']);

// Intercept and bypass fatal console.error crashes triggered by expo-notifications in Expo Go
const originalConsoleError = console.error;
console.error = (...args) => {
  const errorMsg = args[0] && typeof args[0] === 'string' ? args[0] : '';
  if (errorMsg.includes('remote notifications') || errorMsg.includes('expo-notifications')) {
    console.warn('[Bypassed fatal Expo Go push error]:', errorMsg);
    return;
  }
  originalConsoleError(...args);
};

import { COLORS } from './src/styles/theme';
import AuthNavigator from './src/navigation/AuthNavigator';
import PatientNavigator from './src/navigation/PatientNavigator';
import DoctorNavigator from './src/navigation/DoctorNavigator';

import { initializeNotifications, registerForPushNotificationsAsync } from './src/services/notifications';
import { initializeSocket, disconnectSocket } from './src/services/socket';
import { checkAuthSession, logoutUser } from './src/services/api';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // { name, role, userId, token }

  useEffect(() => {
    // 1. Initialize Native System Notifications
    initializeNotifications();
    registerForPushNotificationsAsync();

    // 2. Perform Session Recovery
    recoverSession();

    return () => {
      disconnectSocket();
    };
  }, []);

  const recoverSession = async () => {
    try {
      setLoading(true);
      const user = await checkAuthSession();
      if (user) {
        setCurrentUser(user);
        // Start live websockets sync
        await initializeSocket(user.userId, user.role);
      }
    } catch (err) {
      console.log('No active session recovered.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (user) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      disconnectSocket();
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        
        {currentUser === null ? (
          <AuthNavigator onLoginSuccess={handleLoginSuccess} />
        ) : currentUser.role === 'patient' ? (
          <PatientNavigator onLogout={handleLogout} />
        ) : (
          <DoctorNavigator onLogout={handleLogout} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
