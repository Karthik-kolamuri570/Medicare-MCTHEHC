import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Switch,
  ScrollView, ActivityIndicator, Alert, RefreshControl, Image
} from 'react-native';
import {
  User, Mail, Phone, MapPin, Stethoscope, ShieldAlert,
  LogOut, Bell, KeyRound, ArrowLeft, RefreshCw, Calendar, Star,
  Clock, Award, BadgeCheck, Briefcase, Building2, IndianRupee,
  Heart, Hash, FileText
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

      const endpoint = role === 'doctor' ? '/doctor/me' : '/patient/me';
      const res = await api.get(endpoint);
      const data = res.data?.data || res.data?.doctor || res.data?.patient || res.data || {};

      setProfile({
        // ── Common fields ──
        name:           data.name || data.fullname || stored?.name || 'N/A',
        email:          data.email || stored?.email || 'N/A',
        phone:          data.contact || data.phone || data.phoneNumber || 'N/A',
        gender:         data.gender || 'N/A',
        age:            data.age ? `${data.age} yrs` : 'N/A',
        address:        data.address || data.location || 'N/A',
        role,
        profileImage:   data.profileImage || stored?.profileImage || null,
        joinedAt:       data.createdAt || null,

        // ── Doctor-specific ──
        specialization: data.specialization || data.specialty || null,
        hospital:       data.hospital || null,
        location:       data.location || null,
        fee:            data.feePerConsultation || data.fee || null,
        experience:     data.experience || null,
        rating:         data.rating || data.averageRating || null,
        totalRatings:   data.totalRatings || null,
        totalRatingScore: data.totalRatingScore || null,
        fromTime:       data.fromTime || null,
        toTime:         data.toTime || null,
        status:         data.status || null,
        verifiedByAdmin: data.verifiedByAdmin || null,
        certification:  data.certification || null,
        about:          data.about || data.bio || null,
      });
    } catch (err) {
      console.error('Profile fetch error:', err?.response?.data || err.message);
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
              const endpoint = profile?.role === 'doctor' ? '/doctor/logout' : '/patient/logout';
              await api.get(endpoint).catch(() => {});
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

  // ── helpers ─────────────────────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return null; }
  };

  const getVerificationBadge = (status) => {
    switch (status) {
      case 'approved': return { color: '#16a34a', bg: '#dcfce7', label: 'Verified', icon: '✓' };
      case 'rejected': return { color: '#dc2626', bg: '#fef2f2', label: 'Rejected', icon: '✗' };
      case 'pending':  return { color: '#d97706', bg: '#fffbeb', label: 'Pending Review', icon: '⏳' };
      default: return null;
    }
  };

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
  const verificationBadge = isDoctor ? getVerificationBadge(profile?.verifiedByAdmin) : null;

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

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <View style={[s.roleBadge, isDoctor && s.roleBadgeDoctor]}>
              {isDoctor
                ? <Stethoscope size={12} color="#fff" />
                : <User size={12} color="#fff" />
              }
              <Text style={s.roleText}>
                {isDoctor ? 'Doctor' : 'Patient'}
              </Text>
            </View>

            {/* Doctor Verification Badge */}
            {isDoctor && verificationBadge && (
              <View style={[s.verificationBadge, { backgroundColor: verificationBadge.bg }]}>
                <BadgeCheck size={12} color={verificationBadge.color} />
                <Text style={[s.verificationText, { color: verificationBadge.color }]}>
                  {verificationBadge.label}
                </Text>
              </View>
            )}
          </View>

          {/* Doctor online status */}
          {isDoctor && profile?.status && (
            <View style={[s.statusPill, {
              backgroundColor: profile.status === 'Online' ? '#dcfce7' : '#f1f5f9'
            }]}>
              <View style={[s.statusDot, {
                backgroundColor: profile.status === 'Online' ? '#16a34a' : '#94a3b8'
              }]} />
              <Text style={[s.statusText, {
                color: profile.status === 'Online' ? '#16a34a' : '#64748b'
              }]}>{profile.status}</Text>
            </View>
          )}

          {/* Doctor Rating Summary */}
          {isDoctor && profile?.rating != null && profile.rating > 0 && (
            <View style={s.ratingRow}>
              <Star size={16} color="#f59e0b" fill="#f59e0b" />
              <Text style={s.ratingVal}>{profile.rating.toFixed(1)}</Text>
              {profile.totalRatings > 0 && (
                <Text style={s.ratingCount}>({profile.totalRatings} ratings)</Text>
              )}
            </View>
          )}

          {/* Member since */}
          {profile?.joinedAt && (
            <Text style={s.memberSince}>Member since {formatDate(profile.joinedAt)}</Text>
          )}
        </View>

        {/* ── Personal Info ── */}
        <Text style={s.sectionTitle}>Personal Information</Text>
        <View style={s.infoCard}>
          <InfoRow icon={<Mail size={16} color="#0ea5e9" />}     label="Email"   value={profile?.email} />
          <InfoRow icon={<Phone size={16} color="#0ea5e9" />}    label="Phone"   value={profile?.phone} />
          <InfoRow icon={<User size={16} color="#0ea5e9" />}     label="Gender"  value={profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : 'N/A'} />
          <InfoRow icon={<Calendar size={16} color="#0ea5e9" />} label="Age"     value={profile?.age} />
          <InfoRow icon={<MapPin size={16} color="#0ea5e9" />}   label="Address" value={profile?.address} last />
        </View>

        {/* ── Doctor Professional Details ── */}
        {isDoctor && (
          <>
            <Text style={s.sectionTitle}>Professional Details</Text>
            <View style={s.infoCard}>
              <InfoRow icon={<Stethoscope size={16} color="#8b5cf6" />} label="Specialization" value={profile?.specialization} />
              <InfoRow icon={<Building2 size={16} color="#8b5cf6" />}   label="Hospital"       value={profile?.hospital} />
              <InfoRow icon={<MapPin size={16} color="#8b5cf6" />}      label="Location"       value={profile?.location} />
              <InfoRow icon={<Briefcase size={16} color="#8b5cf6" />}   label="Experience"     value={profile?.experience ? `${profile.experience} years` : null} />
              <InfoRow icon={<IndianRupee size={16} color="#8b5cf6" />} label="Fee / Consult"  value={profile?.fee ? `₹${profile.fee}` : null} />
              {profile?.certification && (
                <InfoRow icon={<Award size={16} color="#8b5cf6" />}     label="Certification"  value={profile.certification} />
              )}
              {profile?.about && (
                <InfoRow icon={<FileText size={16} color="#8b5cf6" />}  label="About"          value={profile.about} />
              )}
              <InfoRow icon={<Clock size={16} color="#8b5cf6" />}      label="Working Hours"  value={
                profile?.fromTime && profile?.toTime
                  ? `${profile.fromTime} – ${profile.toTime}`
                  : null
              } last />
            </View>

            {/* Doctor Stats Cards */}
            <Text style={s.sectionTitle}>Performance</Text>
            <View style={s.statsRow}>
              <View style={[s.statCard, { borderColor: '#bae6fd' }]}>
                <Star size={20} color="#f59e0b" />
                <Text style={s.statValue}>{profile?.rating?.toFixed(1) || '0.0'}</Text>
                <Text style={s.statLabel}>Rating</Text>
              </View>
              <View style={[s.statCard, { borderColor: '#c4b5fd' }]}>
                <Heart size={20} color="#8b5cf6" />
                <Text style={s.statValue}>{profile?.totalRatings || 0}</Text>
                <Text style={s.statLabel}>Reviews</Text>
              </View>
              <View style={[s.statCard, { borderColor: '#a7f3d0' }]}>
                <Briefcase size={20} color="#10b981" />
                <Text style={s.statValue}>{profile?.experience || '—'}</Text>
                <Text style={s.statLabel}>Yrs Exp</Text>
              </View>
            </View>
          </>
        )}

        {/* ── Patient Quick Stats (if patient) ── */}
        {!isDoctor && (
          <>
            <Text style={s.sectionTitle}>Account Details</Text>
            <View style={s.infoCard}>
              <InfoRow icon={<Hash size={16} color="#0ea5e9" />} label="Account Type" value="Patient" />
              <InfoRow icon={<Heart size={16} color="#ef4444" />} label="Health Portal" value="Active" last />
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
        <Text style={s.infoValue} numberOfLines={3}>
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
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#0ea5e9', shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
  },
  avatarCircleDoctor: { backgroundColor: '#8b5cf6', shadowColor: '#8b5cf6' },
  avatarImg: { width: 88, height: 88, borderRadius: 44, marginBottom: 14 },
  avatarText: { fontSize: 30, fontWeight: '800', color: '#fff' },
  profileName: { fontSize: 22, fontWeight: '800', color: '#0f172a', letterSpacing: -0.3 },
  profileEmail: { fontSize: 13, color: '#64748b', marginTop: 4 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#0ea5e9', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  roleBadgeDoctor: { backgroundColor: '#8b5cf6' },
  roleText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  // Verification badge
  verificationBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  verificationText: { fontSize: 11, fontWeight: '700' },

  // Online status
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginTop: 10,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },

  // Rating
  ratingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10,
  },
  ratingVal: { color: '#d97706', fontSize: 15, fontWeight: '800' },
  ratingCount: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },

  // Member since
  memberSince: { color: '#94a3b8', fontSize: 11, fontWeight: '600', marginTop: 10 },

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

  // Stats row
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, gap: 8,
  },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 16,
    alignItems: 'center', borderWidth: 1.5,
    shadowColor: '#0f172a', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  statValue: { fontSize: 20, fontWeight: '900', color: '#0f172a', marginTop: 8 },
  statLabel: { fontSize: 10, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },

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
