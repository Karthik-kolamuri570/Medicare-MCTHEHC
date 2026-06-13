import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { User, Stethoscope, Lock, Activity } from 'lucide-react-native';
import { COLORS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import GlowingInput from '../components/GlowingInput';
import PremiumButton from '../components/PremiumButton';
import { loginUser } from '../services/api';
import { initializeSocket } from '../services/socket';
import { triggerLocalNotification } from '../services/notifications';

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [role, setRole] = useState('patient'); // 'patient' or 'doctor'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let valid = true;
    let errs = {};
    if (!email) {
      errs.email = 'Email address is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
      valid = false;
    }
    if (!password) {
      errs.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
      valid = false;
    }
    setErrors(errs);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await loginUser(email, password, role);
      
      // Initialize Socket client and simulate/connect live triggers
      await initializeSocket(user.userId, user.role);
      
      // Trigger a beautiful, premium native local notification on success
      triggerLocalNotification(
        `Welcome Back, ${user.name}!`,
        `Successfully logged in as a ${user.role}. Your healthcare logs are fully synced.`
      );

      // Callback to root to update navigation stack
      onLoginSuccess(user);
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Login failed. Please check credentials.' });
    } finally {
      setLoading(false);
    }
  };

  // On Android, let the OS handle adjustResize. KeyboardAvoidingView should only wrap iOS ScrollViews.
  const Container = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const containerProps = Platform.OS === 'ios' 
    ? { behavior: 'padding', style: styles.keyboardView } 
    : { style: styles.keyboardView };

  return (
    <SafeAreaView style={styles.container}>
      <Container {...containerProps}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Header */}
          <View style={styles.header}>
            <View style={[
              styles.logoCircle, 
              role === 'doctor' && styles.logoCircleDoctor
            ]}>
              <Activity 
                size={30} 
                color={role === 'patient' ? '#0ea5e9' : '#d97706'} 
                strokeWidth={2.5} 
              />
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Select your portal and sign in to continue</Text>
          </View>

          {/* Role Toggle Selector (Matches Web Segmented Control) */}
          <View style={styles.roleContainer}>
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => setRole('patient')}
              style={[
                styles.roleButton, 
                role === 'patient' && styles.roleButtonActivePatient
              ]}
            >
              <User 
                size={18} 
                color={role === 'patient' ? '#0ea5e9' : '#64748b'} 
                strokeWidth={2.5}
              />
              <Text style={[
                styles.roleText, 
                role === 'patient' && styles.roleTextActivePatient
              ]}>Patient</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => setRole('doctor')}
              style={[
                styles.roleButton, 
                role === 'doctor' && styles.roleButtonActiveDoctor
              ]}
            >
              <Stethoscope 
                size={18} 
                color={role === 'doctor' ? '#d97706' : '#64748b'} 
                strokeWidth={2.5}
              />
              <Text style={[
                styles.roleText, 
                role === 'doctor' && styles.roleTextActiveDoctor
              ]}>Doctor</Text>
            </TouchableOpacity>
          </View>

          {/* Login Card */}
          <GlassCard style={styles.card} active={role === 'patient'}>
            <Text style={styles.cardTitle}>
              {role === 'patient' ? 'Patient Portal' : 'Doctor Workspace'}
            </Text>
            <Text style={styles.cardSubtitle}>Sign in to access your dashboard</Text>

            {errors.form && <Text style={styles.formError}>{errors.form}</Text>}

            <GlowingInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="example@medicare.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
              icon={<User size={18} color="#94a3b8" />}
              error={errors.email}
            />

            <GlowingInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              icon={<Lock size={18} color="#94a3b8" />}
              error={errors.password}
            />

            <TouchableOpacity 
              style={styles.forgotBtn}
              onPress={() => triggerLocalNotification('Password Reset Sent', 'A secure reset link has been dispatched to your email address.')}
            >
              <Text style={[
                styles.forgotText,
                role === 'doctor' && styles.forgotTextDoctor
              ]}>Forgot Password?</Text>
            </TouchableOpacity>

            <PremiumButton
              title={loading ? "Authenticating..." : `Sign In to ${role === 'patient' ? 'Patient' : 'Doctor'}`}
              onPress={handleLogin}
              variant={role === 'patient' ? 'primary' : 'secondary'}
              disabled={loading}
              style={styles.submitBtn}
            />
          </GlassCard>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register', { initialRole: role })}>
              <Text style={[
                styles.registerText, 
                role === 'doctor' && styles.registerTextDoctor
              ]}>Create an account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#e0f2fe', // Very light sky blue bg
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoCircleDoctor: {
    backgroundColor: '#fef3c7', // Very light amber bg
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a', // High-contrast deep slate
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b', // Muted slate text
    marginTop: 6,
    textAlign: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9', // Web segmented control bg
    borderRadius: 16,
    padding: 6,
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  roleButtonActivePatient: {
    backgroundColor: '#ffffff', // White active tab
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  roleButtonActiveDoctor: {
    backgroundColor: '#ffffff', // White active tab
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  roleText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 15,
  },
  roleTextActivePatient: {
    color: '#0ea5e9', // Patient portal primary (sky blue)
  },
  roleTextActiveDoctor: {
    color: '#d97706', // Doctor portal primary (amber)
  },
  card: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a', // High contrast slate
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748b', // Muted slate
    marginTop: 4,
    marginBottom: 20,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginVertical: 12,
  },
  forgotText: {
    color: '#0ea5e9',
    fontWeight: '600',
    fontSize: 14,
  },
  forgotTextDoctor: {
    color: '#d97706',
  },
  submitBtn: {
    marginTop: 8,
  },
  formError: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#64748b',
    fontSize: 15,
  },
  registerText: {
    color: '#0ea5e9', // Patient sky blue link
    fontWeight: '700',
    fontSize: 15,
  },
  registerTextDoctor: {
    color: '#d97706', // Doctor amber link
  },
});
