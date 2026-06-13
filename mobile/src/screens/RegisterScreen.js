import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { User, Stethoscope, Mail, Lock, Calendar, Heart } from 'lucide-react-native';
import { COLORS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import GlowingInput from '../components/GlowingInput';
import PremiumButton from '../components/PremiumButton';
import { registerUser } from '../services/api';
import { initializeSocket } from '../services/socket';
import { triggerLocalNotification } from '../services/notifications';

export default function RegisterScreen({ route, navigation, onLoginSuccess }) {
  const { initialRole } = route.params || { initialRole: 'patient' };
  const [role, setRole] = useState(initialRole);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let valid = true;
    let errs = {};
    if (!fullname) {
      errs.fullname = 'Full Name is required';
      valid = false;
    }
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
    if (role === 'patient') {
      if (!age) {
        errs.age = 'Age is required';
        valid = false;
      }
      if (!gender) {
        errs.gender = 'Gender is required';
        valid = false;
      }
    }
    setErrors(errs);
    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        name: fullname,    // backend expects "name" not "fullname"
        email,
        password,
        age: age ? parseInt(age) : undefined,
        gender,
      };
      
      const user = await registerUser(payload, role);
      await initializeSocket(user.userId, user.role);

      triggerLocalNotification(
        'Account Registered!',
        `Welcome to Medicare-MC, ${user.name}! Your health dashboard is ready.`
      );

      onLoginSuccess(user);
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Registration failed. Try a different email.' });
    } finally {
      setLoading(false);
    }
  };

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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create an Account</Text>
            <Text style={styles.subtitle}>Sign up to get started as a {role}</Text>
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

          {/* Register Card */}
          <GlassCard style={styles.card} active={role === 'patient'}>
            <Text style={styles.cardTitle}>Registration Details</Text>
            <Text style={styles.cardSubtitle}>Fill in all required fields</Text>

            {errors.form && <Text style={styles.formError}>{errors.form}</Text>}

            <GlowingInput
              label="Full Name"
              value={fullname}
              onChangeText={setFullname}
              placeholder="John Doe"
              icon={<User size={18} color="#94a3b8" />}
              error={errors.fullname}
            />

            <GlowingInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="example@medicare.com"
              keyboardType="email-address"
              icon={<Mail size={18} color="#94a3b8" />}
              error={errors.email}
            />

            <GlowingInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              icon={<Lock size={18} color="#94a3b8" />}
              error={errors.password}
            />

            {/* Patient Specific Fields */}
            {role === 'patient' && (
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <GlowingInput
                    label="Age"
                    value={age}
                    onChangeText={setAge}
                    placeholder="25"
                    keyboardType="numeric"
                    icon={<Calendar size={18} color="#94a3b8" />}
                    error={errors.age}
                  />
                </View>
                <View style={styles.halfInput}>
                  <GlowingInput
                    label="Gender"
                    value={gender}
                    onChangeText={setGender}
                    placeholder="Male / Female"
                    icon={<Heart size={18} color="#94a3b8" />}
                    error={errors.gender}
                  />
                </View>
              </View>
            )}

            <PremiumButton
              title={loading ? "Generating Account..." : "Create Profile"}
              onPress={handleRegister}
              variant={role === 'patient' ? 'primary' : 'secondary'}
              disabled={loading}
              style={styles.submitBtn}
            />
          </GlassCard>

          {/* Footer Navigation */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already registered? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login', { initialRole: role })}>
              <Text style={[
                styles.registerText, 
                role === 'doctor' && styles.registerTextDoctor
              ]}>Login via your portal</Text>
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
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
    marginBottom: 20,
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
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfInput: {
    width: '48%',
  },
  submitBtn: {
    marginTop: 18,
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
    marginTop: 12,
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
