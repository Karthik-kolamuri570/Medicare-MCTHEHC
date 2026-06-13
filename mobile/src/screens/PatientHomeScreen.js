import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Calendar, FileText, Activity, Heart, Bell, Plus, CheckCircle, ChevronRight, Sparkles, Stethoscope, Droplets, Video, BookOpen } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import { getAppointments, getPrescriptions, toggleMedicationTaken } from '../services/api';
import { triggerLocalNotification } from '../services/notifications';

const isMedicineActive = (createdAtStr, durationStr) => {
  if (!createdAtStr) return true;
  try {
    const createdDate = new Date(createdAtStr);
    createdDate.setHours(0, 0, 0, 0);

    let days = 7; // default
    if (durationStr) {
      const match = durationStr.toLowerCase().match(/^(\d+)\s*(day|week|month|year)s?$/);
      if (match) {
        const num = parseInt(match[1], 10);
        const unit = match[2];
        if (unit === 'day') days = num;
        else if (unit === 'week') days = num * 7;
        else if (unit === 'month') days = num * 30;
        else if (unit === 'year') days = num * 365;
      } else {
        const numMatch = durationStr.match(/\d+/);
        if (numMatch) {
          days = parseInt(numMatch[0], 10);
        }
      }
    }

    const endDate = new Date(createdDate);
    endDate.setDate(createdDate.getDate() + days);
    endDate.setHours(23, 59, 59, 999);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return today <= endDate;
  } catch (e) {
    return true;
  }
};

export default function PatientHomeScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
    
    // Focus listener to refresh data when user returns to Home
    const unsubscribe = navigation.addListener('focus', () => {
      loadHomeData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const apps = await getAppointments();
      const rxs = await getPrescriptions();
      
      const today = new Date();
      today.setHours(0,0,0,0);
      
      const upcomingApps = apps.filter(app => {
        if (!app.date) return true;
        try {
          const appDate = new Date(app.date.split('T')[0]);
          appDate.setHours(0,0,0,0);
          return appDate >= today;
        } catch {
          return true;
        }
      });

      setAppointments(upcomingApps.slice(0, 2)); // Show top 2 upcoming
      setPrescriptions(rxs);
    } catch (err) {
      console.error('Error loading home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMedsCheck = async (prescriptionId, medIndex, medName, currentTaken) => {
    try {
      await toggleMedicationTaken(prescriptionId, medIndex);
      
      // Update local state instantly
      const updatedRxs = prescriptions.map(rx => {
        const rxId = rx._id || rx.id;
        if (rxId === prescriptionId) {
          const key = rx.medicines ? 'medicines' : 'medications';
          const updatedMeds = [...(rx[key] || [])];
          if (updatedMeds[medIndex]) {
            updatedMeds[medIndex] = { ...updatedMeds[medIndex], taken: !currentTaken };
          }
          return { ...rx, [key]: updatedMeds };
        }
        return rx;
      });
      setPrescriptions(updatedRxs);

      // Trigger achievement notification if checked
      if (!currentTaken) {
        triggerLocalNotification(
          'Medication Completed! 🌟',
          `Excellent job maintaining your schedule. You have taken your ${medName}.`
        );
      }
    } catch (err) {
      console.error('Error ticking off medication:', err);
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Hero Header — matches web landing gradient hero ── */}
        <LinearGradient
          colors={['#0c1631', '#1a237e', '#1565c0', '#0097a7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroHeader}
        >
          {/* Orb glow — mirrors web .hero-orb */}
          <View style={styles.heroOrb1} />
          <View style={styles.heroOrb2} />

          <View style={styles.heroContent}>
            <View style={styles.heroTagRow}>
              <Sparkles size={13} color="#67e8f9" />
              <Text style={styles.heroTagText}>#1 Healthcare Platform</Text>
            </View>
            <Text style={styles.heroGreet}>Welcome Back,</Text>
            <Text style={styles.heroName}>Karthik Kolamuri</Text>
            <Text style={styles.heroSub}>
              Connect with verified specialists, book instant appointments, access world-class healthcare.
            </Text>

            {/* Trust metrics — matches web .hero-metrics */}
            <View style={styles.heroMetrics}>
              <View style={styles.metric}>
                <Text style={styles.metricVal}>5,000+</Text>
                <Text style={styles.metricLabel}>Patients</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metric}>
                <Text style={styles.metricVal}>200+</Text>
                <Text style={styles.metricLabel}>Doctors</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metric}>
                <Text style={styles.metricVal}>4.9★</Text>
                <Text style={styles.metricLabel}>Rating</Text>
              </View>
            </View>
          </View>

          {/* Bell button on dark bg */}
          <TouchableOpacity
            style={styles.heroBellBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Bell size={20} color="#ffffff" />
            <View style={styles.bellBadge} />
          </TouchableOpacity>
        </LinearGradient>

        {/* ── Quick Action Pills — matches web .hero-pills ── */}
        <View style={styles.pillsRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('TopDoctors')}
            style={styles.heroPill}
          >
            <Stethoscope size={14} color="#0ea5e9" />
            <Text style={styles.heroPillText}>Find Doctor</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('MyConsultations')}
            style={styles.heroPill}
          >
            <Video size={14} color="#6366f1" />
            <Text style={styles.heroPillText}>My Consults</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('BloodBank')}
            style={styles.heroPill}
          >
            <Droplets size={14} color="#ef4444" />
            <Text style={styles.heroPillText}>Blood Bank</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Blogs')}
            style={styles.heroPill}
          >
            <BookOpen size={14} color="#10b981" />
            <Text style={styles.heroPillText}>Health Blogs</Text>
          </TouchableOpacity>
        </View>

        {/* ── Service Tiles — matches web .svc-grid ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Digital Health Actions</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsSlider}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('TopDoctors')}
            style={styles.actionCard}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#6366f115' }]}>
              <Plus size={24} color="#6366f1" />
            </View>
            <Text style={styles.actionCardTitle}>Book Appt</Text>
            <Text style={styles.actionCardDesc}>Top specialists</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('MyConsultations')}
            style={styles.actionCard}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#2563eb15' }]}>
              <Video size={24} color="#2563eb" />
            </View>
            <Text style={styles.actionCardTitle}>My Consults</Text>
            <Text style={styles.actionCardDesc}>Track & chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('GetSecondOpinion')}
            style={styles.actionCard}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#d9770615' }]}>
              <Stethoscope size={24} color="#d97706" />
            </View>
            <Text style={styles.actionCardTitle}>2nd Opinion</Text>
            <Text style={styles.actionCardDesc}>Expert review</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('BloodBank')}
            style={styles.actionCard}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#dc262615' }]}>
              <Droplets size={24} color="#dc2626" />
            </View>
            <Text style={styles.actionCardTitle}>Blood Hub</Text>
            <Text style={styles.actionCardDesc}>Find camps</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Blogs')}
            style={styles.actionCard}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#10b98115' }]}>
              <BookOpen size={24} color="#10b981" />
            </View>
            <Text style={styles.actionCardTitle}>Health Blogs</Text>
            <Text style={styles.actionCardDesc}>Expert articles</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Upcoming Appointments */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Consultations</Text>
        </View>

        {appointments.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No upcoming appointments scheduled.</Text>
            <TouchableOpacity 
              style={styles.bookNowBtn}
              onPress={() => navigation.navigate('TopDoctors')}
            >
              <Text style={styles.bookNowText}>Book Appointment Now</Text>
            </TouchableOpacity>
          </GlassCard>
        ) : (
          appointments.map((app) => (
            <GlassCard key={app._id || app.id} active style={{ marginHorizontal: 20, marginBottom: 4 }}>
              <View style={styles.appContainer}>
                <View style={styles.appDetails}>
                  <Text style={styles.docName}>{app.doctorId?.name || app.doctorName || 'Doctor'}</Text>
                  <Text style={styles.docSpec}>{app.doctorId?.specialization || app.specialty || 'General'} • {app.type || 'Clinic Visit'}</Text>
                  <View style={styles.dateTimeRow}>
                    <Calendar size={14} color={COLORS.primary} style={{ marginRight: 6 }} />
                    <Text style={styles.appDateTime}>{app.date} at {app.time}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.appBadge}
                  onPress={() => {
                    const did = app.doctorId?._id || app.doctorId;
                    const pid = app.patientId?._id || app.patientId;
                    if (did) {
                      navigation.navigate('Chat', { receiverId: `${did}-${pid}` });
                    }
                  }}
                >
                  <Text style={styles.badgeText}>Start</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          ))
        )}

        {/* Medication Compliance Checkpoint */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Medication Schedule</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Prescriptions')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {(() => {
          const activeMeds = [];
          prescriptions.forEach(rx => {
            const meds = rx.medicines || rx.medications || [];
            meds.forEach((med, index) => {
              if (isMedicineActive(rx.createdAt || rx.date, med.duration)) {
                activeMeds.push({
                  ...med,
                  prescriptionId: rx._id || rx.id,
                  medIndex: index,
                });
              }
            });
          });

          if (activeMeds.length === 0) {
            return (
              <GlassCard style={styles.emptyCard}>
                <Text style={styles.emptyText}>No active medications registered.</Text>
              </GlassCard>
            );
          }

          return (
            <GlassCard style={styles.medCard}>
              <Text style={styles.medHeaderTitle}>Today's Doses</Text>
              {activeMeds.map((med, idx) => (
                <View key={`${med.prescriptionId}-${med.medIndex}-${idx}`} style={styles.medRow}>
                  <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={() => handleMedsCheck(med.prescriptionId, med.medIndex, med.name, med.taken)}
                    style={styles.medCheckbox}
                  >
                    <CheckCircle 
                      size={22} 
                      color={med.taken ? '#16a34a' : '#cbd5e1'} 
                      fill={med.taken ? 'rgba(22, 163, 74, 0.1)' : 'transparent'}
                    />
                  </TouchableOpacity>
                  <View style={styles.medDetails}>
                    <Text style={[styles.medNameText, med.taken && styles.medNameCrossed]}>
                      {med.name}
                    </Text>
                    <Text style={styles.medFrequency}>{med.dose || med.dosage} · {med.frequency}</Text>
                  </View>
                  <Text style={styles.medTime}>{med.time || med.duration || ''}</Text>
                </View>
              ))}
            </GlassCard>
          );
        })()}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Hero Header — mirrors web .hero gradient section ──
  heroHeader: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  heroOrb1: {
    position: 'absolute',
    top: -80,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
  },
  heroOrb2: {
    position: 'absolute',
    bottom: -60,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
  },
  heroContent: { zIndex: 1 },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  heroTagText: {
    color: '#67e8f9',
    fontSize: 12,
    fontWeight: '700',
  },
  heroGreet: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
  heroName: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: -0.5,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    maxWidth: '85%',
  },
  // Hero metrics — mirrors web .hero-metrics
  heroMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 16,
  },
  metric: { alignItems: 'center' },
  metricVal: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '500',
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroBellBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
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

  // ── Hero Pills — mirrors web .hero-pills ──
  pillsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1.5,
    borderBottomColor: '#e2e8f0',
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  heroPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  viewAllText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  actionsSlider: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    width: 120,
    padding: 16,
    marginRight: 12,
    alignItems: 'flex-start',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  actionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionCardTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800',
  },
  actionCardDesc: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 3,
    fontWeight: '500',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    marginHorizontal: 20,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  bookNowBtn: {
    backgroundColor: 'rgba(14, 165, 233, 0.08)',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 100,
  },
  bookNowText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  appContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appDetails: {
    flex: 1,
  },
  docName: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },
  docSpec: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  appDateTime: {
    color: '#0ea5e9',
    fontSize: 13,
    fontWeight: '600',
  },
  appBadge: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  medCard: {
    padding: 16,
    marginHorizontal: 20,
  },
  medHeaderTitle: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 8,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  medCheckbox: {
    marginRight: 12,
  },
  medDetails: {
    flex: 1,
  },
  medNameText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
  },
  medNameCrossed: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  medFrequency: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  medTime: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
});
