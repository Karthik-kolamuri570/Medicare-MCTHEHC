import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Calendar, FileText, Activity, Heart, Bell, Plus, CheckCircle, ChevronRight, Sparkles, Stethoscope, Droplets, Video, BookOpen, Pill, Sun, Sunset, Moon, Coffee, Clock, TrendingUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import { getAppointments, getPrescriptions, toggleMedicationTaken } from '../services/api';
import { triggerLocalNotification } from '../services/notifications';
import { loadTodayStatus, saveTodayStatus, applyDailyReset } from '../utils/medicationDailyReset';

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
      const [apps, rxs, todayStatus] = await Promise.all([
        getAppointments(),
        getPrescriptions(),
        loadTodayStatus(),
      ]);
      
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
      // Apply daily reset: if no local entry for today, med shows as untaken
      setPrescriptions(applyDailyReset(rxs, todayStatus));
    } catch (err) {
      console.error('Error loading home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMedsCheck = async (prescriptionId, medIndex, medName, currentTaken) => {
    const newTaken = !currentTaken;
    try {
      // Optimistic UI update
      const updatedRxs = prescriptions.map(rx => {
        const rxId = rx._id || rx.id;
        if (rxId === prescriptionId) {
          const key = rx.medicines ? 'medicines' : 'medications';
          const updatedMeds = [...(rx[key] || [])];
          if (updatedMeds[medIndex]) {
            updatedMeds[medIndex] = { ...updatedMeds[medIndex], taken: newTaken };
          }
          return { ...rx, [key]: updatedMeds };
        }
        return rx;
      });
      setPrescriptions(updatedRxs);

      // Persist today's status locally (daily reset key)
      await saveTodayStatus(prescriptionId, medIndex, newTaken);

      // Sync to backend
      await toggleMedicationTaken(prescriptionId, medIndex);

      // Notification when marking as taken
      if (newTaken) {
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

        {/* Medication Schedule — enhanced */}
        <MedicationScheduleSection
          prescriptions={prescriptions}
          onToggle={handleMedsCheck}
          onViewAll={() => navigation.navigate('Prescriptions')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Medication Schedule Component
// ─────────────────────────────────────────────

const TIME_SLOTS = [
  { label: 'Morning',   key: 'morning',   icon: Coffee,  color: '#f59e0b', bg: '#fffbeb', border: '#fef3c7', hours: [5, 6, 7, 8, 9, 10, 11] },
  { label: 'Afternoon', key: 'afternoon', icon: Sun,     color: '#f97316', bg: '#fff7ed', border: '#fed7aa', hours: [12, 13, 14, 15, 16] },
  { label: 'Evening',   key: 'evening',   icon: Sunset,  color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', hours: [17, 18, 19, 20] },
  { label: 'Night',     key: 'night',     icon: Moon,    color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', hours: [21, 22, 23, 0, 1, 2, 3, 4] },
];

const getMedTimeSlot = (timeStr) => {
  if (!timeStr) return 'morning';
  const lower = (timeStr || '').toLowerCase();
  // Check for AM/PM time strings first
  const ampmMatch = lower.match(/(\d+)(?::(\d+))?\s*(am|pm)/);
  if (ampmMatch) {
    let hr = parseInt(ampmMatch[1], 10);
    const period = ampmMatch[3];
    if (period === 'pm' && hr !== 12) hr += 12;
    if (period === 'am' && hr === 12) hr = 0;
    for (const slot of TIME_SLOTS) {
      if (slot.hours.includes(hr)) return slot.key;
    }
  }
  // Keyword fallback
  if (lower.includes('morning') || lower.includes('breakfast') || lower.includes('wakeup')) return 'morning';
  if (lower.includes('afternoon') || lower.includes('lunch')) return 'afternoon';
  if (lower.includes('evening') || lower.includes('dinner')) return 'evening';
  if (lower.includes('night') || lower.includes('sleep') || lower.includes('bedtime')) return 'night';
  // Frequency fallback
  if (lower.includes('twice') || lower.includes('2 times')) return 'morning';
  return 'morning';
};

function AnimatedMedRow({ med, onToggle }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,    duration: 120, useNativeDriver: true }),
    ]).start();
    onToggle();
  };

  const slot = TIME_SLOTS.find(s => s.key === getMedTimeSlot(med.time || med.timing || med.frequency));
  const SlotIcon = slot?.icon || Coffee;

  return (
    <Animated.View style={[
      medStyles.medRow,
      med.taken && medStyles.medRowTaken,
      { transform: [{ scale: scaleAnim }] },
    ]}>
      {/* Left: icon badge */}
      <View style={[medStyles.medIconBadge, { backgroundColor: slot?.bg || '#f1f5f9' }]}>
        <SlotIcon size={14} color={slot?.color || '#64748b'} />
      </View>

      {/* Center: name + meta */}
      <View style={medStyles.medDetails}>
        <Text style={[medStyles.medName, med.taken && medStyles.medNameCrossed]} numberOfLines={1}>
          {med.name}
        </Text>
        <Text style={medStyles.medMeta} numberOfLines={1}>
          {[med.dose || med.dosage, med.frequency].filter(Boolean).join(' · ')}
        </Text>
      </View>

      {/* Right: time label + checkbox */}
      <View style={medStyles.medRight}>
        {(med.time || med.timing) ? (
          <View style={medStyles.timeChip}>
            <Clock size={10} color='#64748b' />
            <Text style={medStyles.timeChipText}>{med.time || med.timing}</Text>
          </View>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          style={[
            medStyles.checkbox,
            med.taken && medStyles.checkboxDone,
          ]}
        >
          <CheckCircle
            size={20}
            color={med.taken ? '#ffffff' : '#cbd5e1'}
            fill={med.taken ? '#16a34a' : 'transparent'}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

function MedicationScheduleSection({ prescriptions, onToggle, onViewAll }) {
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

  const total  = activeMeds.length;
  const taken  = activeMeds.filter(m => m.taken).length;
  const pct    = total > 0 ? Math.round((taken / total) * 100) : 0;
  const allDone = total > 0 && taken === total;

  // Group by time slot
  const grouped = {};
  activeMeds.forEach(med => {
    const slotKey = getMedTimeSlot(med.time || med.timing || med.frequency);
    if (!grouped[slotKey]) grouped[slotKey] = [];
    grouped[slotKey].push(med);
  });

  return (
    <>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View style={medStyles.sectionTitleRow}>
          <Pill size={16} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Medication Schedule</Text>
        </View>
        <TouchableOpacity onPress={onViewAll} style={medStyles.viewAllBtn}>
          <Text style={medStyles.viewAllText}>View All</Text>
          <ChevronRight size={13} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {total === 0 ? (
        <GlassCard style={styles.emptyCard}>
          <Pill size={32} color='#cbd5e1' />
          <Text style={[styles.emptyText, { marginTop: 10 }]}>No active medications today.</Text>
        </GlassCard>
      ) : (
        <View style={medStyles.wrapper}>
          {/* Progress summary card */}
          <LinearGradient
            colors={allDone ? ['#065f46', '#059669'] : ['#0c1631', '#1565c0']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={medStyles.progressCard}
          >
            <View style={medStyles.progressLeft}>
              <Text style={medStyles.progressLabel}>
                {allDone ? '🎉 All doses complete!' : "Today's Progress"}
              </Text>
              <Text style={medStyles.progressCount}>
                {taken} / {total} doses taken
              </Text>
              {/* Progress bar */}
              <View style={medStyles.progressBarBg}>
                <View style={[medStyles.progressBarFill, { width: `${pct}%` }]} />
              </View>
            </View>
            <View style={medStyles.progressCircle}>
              <Text style={medStyles.progressPct}>{pct}%</Text>
              <Text style={medStyles.progressPctLabel}>done</Text>
            </View>
          </LinearGradient>

          {/* Time-grouped med rows */}
          {allDone ? (
            <View style={medStyles.allDoneInner}>
              <TrendingUp size={22} color='#16a34a' />
              <Text style={medStyles.allDoneMsg}>Great job! You've maintained your schedule perfectly today.</Text>
            </View>
          ) : (
            TIME_SLOTS.map(slot => {
              const slotMeds = grouped[slot.key];
              if (!slotMeds || slotMeds.length === 0) return null;
              const SlotIcon = slot.icon;
              return (
                <View key={slot.key} style={medStyles.slotSection}>
                  {/* Slot header */}
                  <View style={[medStyles.slotHeader, { borderColor: slot.border, backgroundColor: slot.bg }]}>
                    <SlotIcon size={13} color={slot.color} />
                    <Text style={[medStyles.slotLabel, { color: slot.color }]}>{slot.label}</Text>
                    <View style={medStyles.slotBadge}>
                      <Text style={[medStyles.slotBadgeText, { color: slot.color }]}>
                        {slotMeds.filter(m => m.taken).length}/{slotMeds.length}
                      </Text>
                    </View>
                  </View>
                  {/* Meds */}
                  {slotMeds.map((med, idx) => (
                    <AnimatedMedRow
                      key={`${med.prescriptionId}-${med.medIndex}-${idx}`}
                      med={med}
                      onToggle={() => onToggle(med.prescriptionId, med.medIndex, med.name, med.taken)}
                    />
                  ))}
                </View>
              );
            })
          )}
        </View>
      )}
    </>
  );
}

const medStyles = StyleSheet.create({
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  wrapper: {
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    ...SHADOWS.default,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    paddingBottom: 20,
  },
  progressLeft: {
    flex: 1,
    marginRight: 16,
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  progressCount: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 100,
    backgroundColor: '#34d399',
  },
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPct: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  progressPctLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '600',
  },
  allDoneInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: '#f0fdf4',
  },
  allDoneMsg: {
    flex: 1,
    color: '#15803d',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  slotSection: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  slotLabel: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    letterSpacing: 0.3,
  },
  slotBadge: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  slotBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
    gap: 10,
  },
  medRowTaken: {
    backgroundColor: '#f8fafc',
  },
  medIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medDetails: {
    flex: 1,
    minWidth: 0,
  },
  medName: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  medNameCrossed: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  medMeta: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  medRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 100,
  },
  timeChipText: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  checkboxDone: {
    borderColor: '#16a34a',
    backgroundColor: '#16a34a',
  },
});

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
});
