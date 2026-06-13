import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Star, MapPin, Clock, ArrowLeft } from 'lucide-react-native';
import { COLORS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import PremiumButton from '../components/PremiumButton';

export default function DoctorProfileScreen({ route, navigation }) {
  const { doctor } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Banner Card */}
        <GlassCard style={styles.profileBanner}>
          {/* Avatar circle */}
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {doctor.name.split(' ').filter(n => n.startsWith('Dr.') ? false : true).map(n => n[0]).slice(0, 2).join('')}
              </Text>
            </View>
            <View style={[
              styles.onlinePill,
              { backgroundColor: doctor.status === 'Online' ? '#dcfce7' : '#f1f5f9' }
            ]}>
              <View style={[styles.onlineDot, { backgroundColor: doctor.status === 'Online' ? '#16a34a' : '#94a3b8' }]} />
              <Text style={[styles.onlineText, { color: doctor.status === 'Online' ? '#16a34a' : '#64748b' }]}>
                {doctor.status}
              </Text>
            </View>
          </View>

          <Text style={styles.nameText}>{doctor.name}</Text>
          <Text style={styles.specText}>{doctor.specialization || doctor.specialty}</Text>

          <View style={styles.ratingRow}>
            <Star size={16} color="#f59e0b" fill="#f59e0b" style={{ marginRight: 6 }} />
            <Text style={styles.ratingVal}>{doctor.rating}</Text>
            <Text style={styles.reviewVal}> · {doctor.reviews} Reviews</Text>
          </View>
        </GlassCard>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>EXPERIENCE</Text>
            <Text style={styles.statVal}>12+ Years</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>CONSULT FEE</Text>
            <Text style={styles.statVal}>₹{doctor.feePerConsultation || doctor.fee || '—'}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>PATIENTS</Text>
            <Text style={styles.statVal}>{doctor.totalPatients || '—'}</Text>
          </View>
        </View>

        {/* About Bio */}
        <Text style={styles.sectionTitle}>About Specialist</Text>
        <GlassCard style={styles.infoCard}>
          <Text style={styles.bioText}>{doctor.bio || doctor.about || 'No bio available.'}</Text>
        </GlassCard>

        {/* Practice Location */}
        <Text style={styles.sectionTitle}>Practice Location</Text>
        <GlassCard style={styles.infoCard}>
          <View style={styles.rowIcon}>
            <MapPin size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
            <Text style={styles.locName}>{doctor.hospital || 'Medical Facility'}</Text>
          </View>
          <Text style={styles.locAddress}>{doctor.location}</Text>
        </GlassCard>

        {/* Availability */}
        <Text style={styles.sectionTitle}>Standard Availability</Text>
        <GlassCard style={styles.infoCard}>
          <View style={styles.rowIcon}>
            <Clock size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
            <Text style={styles.locName}>Working Hours</Text>
          </View>
          <Text style={styles.locAddress}>
            {doctor.fromTime && doctor.toTime
              ? `${doctor.fromTime} – ${doctor.toTime}`
              : 'Mon – Sat · 09:00 AM – 05:00 PM'}
          </Text>
        </GlassCard>

      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <PremiumButton
          title={doctor.status === 'Online' ? "Schedule Consultation" : "Doctor Currently Offline"}
          onPress={() => navigation.navigate('BookAppointment', { doctorId: doctor._id || doctor.id, doctor })}
          disabled={doctor.status !== 'Online'}
          variant="primary"
          style={styles.bookCtaBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1.5, borderBottomColor: COLORS.border, backgroundColor: COLORS.cardBg,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  scrollContent: { padding: 16, paddingBottom: 100 },

  // Profile Banner
  profileBanner: { marginBottom: 16, padding: 20 },
  avatarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  avatarCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center',
  },
  avatarInitials: { color: COLORS.primary, fontSize: 22, fontWeight: '800' },
  onlinePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  onlineDot: { width: 8, height: 8, borderRadius: 4 },
  onlineText: { fontSize: 12, fontWeight: '700' },
  nameText: { color: COLORS.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  specText: { color: COLORS.primary, fontSize: 14, fontWeight: '600', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  ratingVal: { color: '#d97706', fontSize: 14, fontWeight: '700' },
  reviewVal: { color: COLORS.textMuted, fontSize: 13 },

  // Stats
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statBox: {
    flex: 1, backgroundColor: COLORS.cardBg, borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: 14, padding: 14, alignItems: 'center', marginHorizontal: 4,
    ...SHADOWS.default,
  },
  statLabel: { color: COLORS.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  statVal: { color: COLORS.text, fontSize: 15, fontWeight: '800', marginTop: 5 },

  // Info Cards
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginBottom: 10, marginTop: 8, paddingLeft: 4 },
  infoCard: { marginBottom: 14, padding: 16 },
  bioText: { color: COLORS.textMuted, fontSize: 14, lineHeight: 22 },
  rowIcon: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locName: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  locAddress: { color: COLORS.textMuted, fontSize: 13, lineHeight: 18, paddingLeft: 30 },

  // Footer
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.cardBg, padding: 20,
    borderTopWidth: 1.5, borderTopColor: COLORS.border,
  },
  bookCtaBtn: { width: '100%' },
});
