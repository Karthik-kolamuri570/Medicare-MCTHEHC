import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  Switch, ActivityIndicator
} from 'react-native';
import {
  Users, Clock, DollarSign, Calendar, MessageSquare,
  Plus, Bell, Stethoscope, FileText, Star, Activity
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import { getAppointments, getDoctorStats } from '../services/api';
import { triggerLocalNotification } from '../services/notifications';

export default function DoctorHomeScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    totalRevenue: 0,
    rating: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [doctorName, setDoctorName] = useState('Doctor');

  useEffect(() => {
    loadDoctorData();
    const unsubscribe = navigation.addListener('focus', () => loadDoctorData());
    return unsubscribe;
  }, [navigation]);

  const loadDoctorData = async () => {
    try {
      setLoading(true);
      const apps = await getAppointments();
      setAppointments(apps);
      try {
        const s = await getDoctorStats();
        if (s) {
          setStats(s);
          if (s.name) setDoctorName(s.name);
        }
      } catch (_) {}
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnlineToggle = (val) => {
    setIsOnline(val);
    triggerLocalNotification(
      val ? 'Practice is ONLINE 🟢' : 'Practice is OFFLINE 🔴',
      val
        ? 'You are visible to new patient appointment bookings.'
        : 'New patient booking registrations have been temporarily paused.'
    );
  };

  // Quick Hub services — mirrors the web DoctorDashboard services grid
  const services = [
    { name: 'Appointments',  icon: Calendar,    color: '#3b82f6', iconBg: '#eff6ff', screen: 'DAppointments' },
    { name: 'Consultations', icon: Stethoscope, color: '#10b981', iconBg: '#ecfdf5', screen: 'DOnlineConsultation' },
    { name: 'Prescriptions', icon: FileText,    color: '#8b5cf6', iconBg: '#f5f3ff', screen: 'PrescriptionForm' },
    { name: 'My Blogs',      icon: Activity,    color: '#f59e0b', iconBg: '#fef3c7', screen: 'DBlogs' },
  ];

  const StatCard = ({ label, value, iconBg, iconColor, icon: Icon }) => (
    <View style={styles.statCard}>
      <View style={styles.statCardInner}>
        <View>
          <Text style={styles.statLabel}>{label}</Text>
          <Text style={[styles.statVal, { color: iconColor }]}>{value}</Text>
        </View>
        <View style={[styles.statIconCircle, { backgroundColor: iconBg }]}>
          <Icon size={20} color={iconColor} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Welcome Banner (web: linear-gradient(135deg, #1e293b, #0f172a)) ── */}
        <LinearGradient
          colors={['#1e293b', '#0f172a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.bannerGlow} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerGreet}>Welcome back,</Text>
            <Text style={styles.bannerName}>
              Dr. <Text style={styles.bannerNameHighlight}>{doctorName}</Text>
            </Text>
            <Text style={styles.bannerSub}>
              Here's what's happening with your practice today.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Bell size={20} color="#ffffff" />
            <View style={styles.bellBadge} />
          </TouchableOpacity>
        </LinearGradient>

        {/* ── Online Status Toggle ── */}
        <GlassCard style={styles.toggleCard}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>Consultation Status</Text>
              <Text style={styles.toggleSub}>
                {isOnline ? 'Patients can book and call you now' : 'Currently resting / offline'}
              </Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={handleOnlineToggle}
              trackColor={{ false: '#e2e8f0', true: 'rgba(14,165,233,0.3)' }}
              thumbColor={isOnline ? COLORS.primary : '#94a3b8'}
            />
          </View>
        </GlassCard>

        {/* ── Quick Hub Services Grid (mirrors web) ── */}
        <Text style={styles.sectionTitle}>Quick Hub</Text>
        <View style={styles.servicesGrid}>
          {services.map((svc, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.8}
              style={styles.serviceCard}
              onPress={() => navigation.navigate(svc.screen)}
            >
              <View style={[styles.serviceIconBg, { backgroundColor: svc.iconBg }]}>
                <svc.icon size={22} color={svc.color} />
              </View>
              <Text style={styles.serviceCardText}>{svc.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Overview Stats (mirrors web stat cards) ── */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <StatCard
          label="TODAY'S APPOINTMENTS"
          value={stats.todayAppointments || appointments.length}
          icon={Calendar}
          iconBg="#eff6ff"
          iconColor="#3b82f6"
        />
        <StatCard
          label="TOTAL PATIENTS"
          value={stats.totalPatients || 0}
          icon={Users}
          iconBg="#f0f9ff"
          iconColor="#0ea5e9"
        />
        <StatCard
          label="TOTAL REVENUE"
          value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          iconBg="#f0fdf4"
          iconColor="#16a34a"
        />
        <StatCard
          label="PROFESSIONAL RATING"
          value={stats.rating ? `${Number(stats.rating).toFixed(1)} / 5.0` : 'N/A'}
          icon={Star}
          iconBg="#fef3c7"
          iconColor="#f59e0b"
        />

        {/* ── Patient Queue ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Patient Queue</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DAppointments')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 10 }} />
        ) : appointments.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No appointments listed.</Text>
          </GlassCard>
        ) : (
          appointments.slice(0, 3).map((app) => (
            <GlassCard key={app.id} style={styles.queueCard}>
              <View style={styles.queueItem}>
                <View style={styles.queueDetails}>
                  <Text style={styles.patientName}>{app.patientName || 'Patient'}</Text>
                  <Text style={styles.queueType}>{app.type} · {app.time}</Text>
                  <View style={styles.dateTimeRow}>
                    <Calendar size={13} color={COLORS.primary} style={{ marginRight: 6 }} />
                    <Text style={styles.queueDate}>{app.date}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.prescriptionBtn}
                  onPress={() => navigation.navigate('PrescriptionForm', { patientId: app.patientId })}
                >
                  <Plus size={14} color="#ffffff" />
                  <Text style={styles.btnText}>Rx</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Banner ──
  banner: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  bannerGlow: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(59,130,246,0.2)',
  },
  bannerContent: { flex: 1, zIndex: 1 },
  bannerGreet: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  bannerName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: -0.3,
  },
  bannerNameHighlight: { color: '#60a5fa' },
  bannerSub: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
    maxWidth: '90%',
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  bellBadge: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },

  // ── Toggle ──
  toggleCard: { marginHorizontal: 16, marginBottom: 20 },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  toggleSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },

  // ── Section headers ──
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 4,
  },
  viewAllText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Services Grid ──
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  serviceCard: {
    width: '46%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    margin: '2%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.default,
  },
  serviceIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceCardText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },

  // ── Stat Cards ──
  statCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.default,
  },
  statCardInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  statVal: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
  },
  statIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Queue ──
  queueCard: { marginHorizontal: 16, marginBottom: 12 },
  queueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  queueDetails: { flex: 1 },
  patientName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  queueType: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  queueDate: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  prescriptionBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },

  emptyCard: {
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});
