import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Switch,
  ScrollView, ActivityIndicator, Alert, RefreshControl, Image
} from 'react-native';
import {
  User, Mail, Phone, MapPin, Stethoscope, ShieldAlert,
  LogOut, Bell, KeyRound, ArrowLeft, RefreshCw, Calendar, Star
} from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';
import { logoutUser } from '../services/api';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const USER_DATA_KEY    = 'auth_user_details';

export default function ProfileScreen({ route, navigation, onLogout }) {
  const [profile, setProfile]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  // ── fetch real profile from backend ────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    try {
      const storedRaw = await SecureStore.getItemAsync(USER_DATA_KEY);
      const stored    = storedRaw ? JSON.parse(storedRaw) : null;
      const role      = stored?.role || 'patient';

      // Use /api/me for the authoritative data
      const endpoint = role === 'doctor' ? '/doctor/me' : '/patient/me';
      const res = await api.get(endpoint);
      const data = res.data?.data || res.data?.doctor || res.data?.patient || res.data || {};

      setProfile({
        name:           data.name || data.fullname || stored?.name || 'N/A',
        email:          data.email || stored?.email || 'N/A',
        phone:          data.contact || data.phone || data.phoneNumber || 'N/A',
        gender:         data.gender || 'N/A',
        age:            data.age ? `${data.age} yrs` : 'N/A',
        address:        data.address || data.location || 'N/A',
        role,
        // Doctor-specific
        specialization: data.specialization || data.specialty || null,
        hospital:       data.hospital || null,
        fee:            data.feePerConsultation || data.fee || null,
        experience:     data.experience || null,
        rating:         data.averageRating || data.rating || null,
        profileImage:   data.profileImage || stored?.profileImage || null,
      });
    } catch (err) {
      console.error('Profile fetch error:', err?.response?.data || err.message);
      // Fallback to stored user data
      try {
        const storedRaw = await SecureStore.getItemAsync(USER_DATA_KEY);
        if (storedRaw) {
          const s = JSON.parse(storedRaw);
          setProfile({
            name: s.name || 'N/A', email: 'N/A', phone: 'N/A',
            gender: 'N/A', age: 'N/A', address: 'N/A',
            role: s.role || 'patient', profileImage: s.profileImage || null,
          });
        }
      } catch {}
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchProfile(); };

  // ── logout ──────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of Medicare?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try {
              // Call backend logout endpoint first
              const endpoint = profile?.role === 'doctor' ? '/doctor/logout' : '/patient/logout';
              await api.get(endpoint).catch(() => {}); // ignore backend errors
              await logoutUser();
              if (onLogout) onLogout();
            } catch (err) {
              console.error('Logout error:', err);
              await logoutUser();
              if (onLogout) onLogout();
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  // ── avatar initials ─────────────────────────────────────────────────────────
  const initials = profile?.name
    ? profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  // ── render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}>
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text style={s.loadingText}>Loading your profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isDoctor = profile?.role === 'doctor';

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>My Profile</Text>
        <TouchableOpacity style={s.refreshBtn} onPress={onRefresh}>
          <RefreshCw size={18} color="#0ea5e9" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0ea5e9']} />}
      >
        {/* ── Avatar Card ── */}
        <View style={s.avatarCard}>
          {profile?.profileImage ? (
            <Image source={{ uri: profile.profileImage }} style={s.avatarImg} />
          ) : (
            <View style={[s.avatarCircle, isDoctor && s.avatarCircleDoctor]}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
          )}
          <Text style={s.profileName}>{profile?.name || 'N/A'}</Text>
          <Text style={s.profileEmail}>{profile?.email || 'N/A'}</Text>
          <View style={[s.roleBadge, isDoctor && s.roleBadgeDoctor]}>
            {isDoctor
              ? <Stethoscope size={12} color="#fff" />
              : <User size={12} color="#fff" />
            }
            <Text style={s.roleText}>
              {isDoctor ? 'Doctor' : 'Patient'}
            </Text>
          </View>
        </View>

        {/* ── Personal Info ── */}
        <Text style={s.sectionTitle}>Personal Information</Text>
        <View style={s.infoCard}>
          <InfoRow icon={<Phone size={16} color="#0ea5e9" />}  label="Phone"   value={profile?.phone} />
          <InfoRow icon={<User size={16} color="#0ea5e9" />}   label="Gender"  value={profile?.gender} />
          <InfoRow icon={<Calendar size={16} color="#0ea5e9" />} label="Age"   value={profile?.age} />
          <InfoRow icon={<MapPin size={16} color="#0ea5e9" />}  label="Address" value={profile?.address} last />
        </View>

        {/* ── Doctor-specific Info ── */}
        {isDoctor && (
          <>
            <Text style={s.sectionTitle}>Professional Details</Text>
            <View style={s.infoCard}>
              <InfoRow icon={<Stethoscope size={16} color="#8b5cf6" />} label="Specialization" value={profile?.specialization} />
              {profile?.hospital   && <InfoRow icon={<MapPin size={16} color="#8b5cf6" />}      label="Hospital"   value={profile.hospital} />}
              {profile?.experience && <InfoRow icon={<Calendar size={16} color="#8b5cf6" />}    label="Experience" value={`${profile.experience} yrs`} />}
              {profile?.fee        && <InfoRow icon={<Star size={16} color="#8b5cf6" />}         label="Fee"        value={`₹${profile.fee}`} />}
              {profile?.rating     && <InfoRow icon={<Star size={16} color="#f59e0b" />}         label="Rating"     value={`${profile.rating} ★`} last />}
            </View>
          </>
        )}

        {/* ── Preferences ── */}
        <Text style={s.sectionTitle}>Preferences</Text>
        <View style={s.infoCard}>
          <View style={[s.prefRow]}>
            <View style={s.prefLeft}>
              <Bell size={18} color="#0ea5e9" />
              <View style={{ marginLeft: 12 }}>
                <Text style={s.prefTitle}>Push Notifications</Text>
                <Text style={s.prefSub}>Appointment & health alerts</Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#e2e8f0', true: 'rgba(14,165,233,0.4)' }}
              thumbColor={pushEnabled ? '#0ea5e9' : '#94a3b8'}
            />
          </View>
        </View>

        {/* ── Security ── */}
        <View style={s.securityCard}>
          <View style={s.securityHeader}>
            <ShieldAlert size={18} color="#ef4444" />
            <Text style={s.securityTitle}>Security Advisory</Text>
          </View>
          <Text style={s.securityText}>
            Never share your password or OTP with anyone. Medicare support will never ask for your credentials.
          </Text>
        </View>

        {/* ── Logout Button ── */}
        <TouchableOpacity
          style={[s.logoutBtn, loggingOut && { opacity: 0.6 }]}
          onPress={handleLogout}
          disabled={loggingOut}
          activeOpacity={0.85}
        >
          {loggingOut
            ? <ActivityIndicator size="small" color="#fff" />
            : <><LogOut size={18} color="#fff" /><Text style={s.logoutText}>Sign Out</Text></>
          }
        </TouchableOpacity>

        <Text style={s.version}>Medicare • v2.4.1</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Info Row component ────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, last }) {
  return (
    <View style={[s.infoRow, last && { borderBottomWidth: 0 }]}>
      <View style={s.infoIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue} numberOfLines={2}>
          {value && value !== 'N/A' ? value : <Text style={{ color: '#cbd5e1' }}>Not provided</Text>}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#f8fafc' },
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#64748b', marginTop: 12, fontSize: 14 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  headerTitle: { fontSize: 19, fontWeight: '800', color: '#0f172a' },
  refreshBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#f0f9ff', borderWidth: 1.5, borderColor: '#bae6fd',
    alignItems: 'center', justifyContent: 'center',
  },

  content: { padding: 20, paddingBottom: 48 },

  // Avatar card
  avatarCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24,
    alignItems: 'center', marginBottom: 20,
    borderWidth: 1, borderColor: '#e2e8f0',
    shadowColor: '#0f172a', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  avatarCircleDoctor: { backgroundColor: '#8b5cf6' },
  avatarImg: { width: 80, height: 80, borderRadius: 40, marginBottom: 14 },
  avatarText: { fontSize: 28, fontWeight: '800', color: '#fff' },
  profileName: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  profileEmail: { fontSize: 13, color: '#64748b', marginTop: 4 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#0ea5e9', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6, marginTop: 12,
  },
  roleBadgeDoctor: { backgroundColor: '#8b5cf6' },
  roleText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  // Section title
  sectionTitle: {
    fontSize: 14, fontWeight: '800', color: '#64748b',
    textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: 10, marginTop: 6, paddingLeft: 2,
  },

  // Info card
  infoCard: {
    backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1, borderColor: '#e2e8f0',
    marginBottom: 20, overflow: 'hidden',
    shadowColor: '#0f172a', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  infoIcon: { width: 32, alignItems: 'center', marginRight: 12 },
  infoLabel: { fontSize: 11, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginTop: 2 },

  // Preferences
  prefRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 16,
  },
  prefLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  prefTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  prefSub: { fontSize: 12, color: '#94a3b8', marginTop: 2 },

  // Security
  securityCard: {
    backgroundColor: '#fff5f5', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#fecdd3', marginBottom: 24,
  },
  securityHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  securityTitle: { fontSize: 14, fontWeight: '700', color: '#b91c1c' },
  securityText: { fontSize: 12, color: '#64748b', lineHeight: 18 },

  // Logout
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#ef4444', borderRadius: 14, paddingVertical: 15,
    shadowColor: '#ef4444', shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  logoutText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  version: { textAlign: 'center', color: '#cbd5e1', fontSize: 11, marginTop: 20 },
});
