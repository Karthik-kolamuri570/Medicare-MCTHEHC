import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Activity, Search, Calendar, Heart, FileText, Bell, User } from 'lucide-react-native';
import { COLORS } from '../styles/theme';

// Patient Screen Imports
import PatientHomeScreen from '../screens/PatientHomeScreen';
import TopDoctorsScreen from '../screens/TopDoctorsScreen';
import DoctorProfileScreen from '../screens/DoctorProfileScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import GetSecondOpinionScreen from '../screens/GetSecondOpinionScreen';
import PatientConsultationScreen from '../screens/PatientConsultationScreen';
import MyPrescriptionsScreen from '../screens/MyPrescriptionsScreen';
import BloodBankScreen from '../screens/BloodBankScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import BlogsScreen from '../screens/BlogsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function PatientNavigator({ onLogout }) {
  // Memoize custom screen wrappers to maintain stable references
  const StableProfileScreen = useMemo(() => {
    return (props) => <ProfileScreen {...props} onLogout={onLogout} />;
  }, [onLogout]);

  function PatientHomeTabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1.5,
            borderTopColor: '#e2e8f0',
            height: 64,
            paddingBottom: 10,
            paddingTop: 8,
            shadowColor: '#0f172a',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 8,
          },
          tabBarActiveTintColor: '#0ea5e9',
          tabBarInactiveTintColor: '#94a3b8',
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={PatientHomeScreen} 
          options={{
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
          }}
        />
        <Tab.Screen 
          name="TopDoctors" 
          component={TopDoctorsScreen} 
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          }}
        />
        <Tab.Screen 
          name="BloodBank" 
          component={BloodBankScreen} 
          options={{
            tabBarLabel: 'Blood Hub',
            tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
          }}
        />
        <Tab.Screen 
          name="Prescriptions" 
          component={MyPrescriptionsScreen} 
          options={{
            tabBarLabel: 'Meds',
            tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
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
      <Stack.Screen name="PatientHomeTabs" component={PatientHomeTabs} />
      
      {/* Dynamic Sub-screens */}
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
      <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
      <Stack.Screen name="GetSecondOpinion" component={GetSecondOpinionScreen} />
      <Stack.Screen name="MyConsultations" component={PatientConsultationScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="ProfileScreen" component={StableProfileScreen} />
      <Stack.Screen name="Blogs" component={BlogsScreen} />
    </Stack.Navigator>
  );
}
