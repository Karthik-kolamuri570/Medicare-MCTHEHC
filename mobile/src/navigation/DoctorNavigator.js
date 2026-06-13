import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Activity, Calendar, FileText, BookOpen, User, Bell } from 'lucide-react-native';
import { COLORS } from '../styles/theme';

// Doctor Screen Imports
import DoctorHomeScreen from '../screens/DoctorHomeScreen';
import DAppointmentsScreen from '../screens/DAppointmentsScreen';
import PrescriptionFormScreen from '../screens/PrescriptionFormScreen';
import DSecondOpinionsScreen from '../screens/DSecondOpinionsScreen';
import DOnlineConsultationScreen from '../screens/DOnlineConsultationScreen';
import DBlogsScreen from '../screens/DBlogsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function DoctorNavigator({ onLogout }) {
  // Memoize custom screen wrappers to maintain stable references
  const StableProfileScreen = useMemo(() => {
    return (props) => <ProfileScreen {...props} onLogout={onLogout} />;
  }, [onLogout]);

  function DoctorHomeTabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0f172a',
            borderTopWidth: 1.5,
            borderTopColor: 'rgba(255, 255, 255, 0.08)',
            height: 64,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarActiveTintColor: COLORS.secondary,
          tabBarInactiveTintColor: '#64748b',
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={DoctorHomeScreen} 
          options={{
            tabBarLabel: 'Workspace',
            tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
          }}
        />
        <Tab.Screen 
          name="DAppointments" 
          component={DAppointmentsScreen} 
          options={{
            tabBarLabel: 'Queue',
            tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          }}
        />
        <Tab.Screen 
          name="DSecondOpinions" 
          component={DSecondOpinionsScreen} 
          options={{
            tabBarLabel: 'Opinions',
            tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
          }}
        />
        <Tab.Screen 
          name="DBlogs" 
          component={DBlogsScreen} 
          options={{
            tabBarLabel: 'Articles',
            tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={StableProfileScreen} 
          options={{
            tabBarLabel: 'Account',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0b0f19' },
      }}
    >
      {/* Root Tabs */}
      <Stack.Screen name="DoctorHomeTabs" component={DoctorHomeTabs} />
      
      {/* Dynamic Sub-screens */}
      <Stack.Screen name="PrescriptionForm" component={PrescriptionFormScreen} />
      <Stack.Screen name="DOnlineConsultation" component={DOnlineConsultationScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="ProfileScreen" component={StableProfileScreen} />
    </Stack.Navigator>
  );
}
