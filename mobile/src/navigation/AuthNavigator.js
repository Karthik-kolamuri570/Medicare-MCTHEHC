import React, { useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

export default function AuthNavigator({ onLoginSuccess }) {
  // Memoize the functional component wrappers to maintain 100% stable references
  // This completely stops React Navigation from unmounting and remounting screens on typing!
  const StableLoginScreen = useMemo(() => {
    return (props) => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />;
  }, [onLoginSuccess]);

  const StableRegisterScreen = useMemo(() => {
    return (props) => <RegisterScreen {...props} onLoginSuccess={onLoginSuccess} />;
  }, [onLoginSuccess]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0b0f19' },
      }}
    >
      <Stack.Screen name="Login" component={StableLoginScreen} />
      <Stack.Screen name="Register" component={StableRegisterScreen} />
    </Stack.Navigator>
  );
}
