import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, CheckCircle, FileDown, Stethoscope, Calendar, Activity } from 'lucide-react-native';
import { COLORS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import { getPrescriptions, toggleMedicationTaken } from '../services/api';
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

const getInitials = (name) => {
  if (!name) return 'Dr';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

export default function MyPrescriptionsScreen({ navigation }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => { loadPrescriptions(); }, []);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const [list, todayStatus] = await Promise.all([
        getPrescriptions(),
        loadTodayStatus(),
      ]);
      setPrescriptions(applyDailyReset(list, todayStatus));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleMedsCheck = async (prescriptionId, medIndex, medName, currentTaken) => {
    const newTaken = !currentTaken;
    try {
      // Optimistic UI update
      const updated = prescriptions.map(rx => {
        const rxId = rx._id || rx.id;
        if (rxId === prescriptionId) {
          const key = rx.medicines ? 'medicines' : 'medications';
          const meds = [...(rx[key] || [])];
          if (meds[medIndex]) {
            meds[medIndex] = { ...meds[medIndex], taken: newTaken };
          }
          return { ...rx, [key]: meds };
        }
        return rx;
      });
      setPrescriptions(updated);

      await saveTodayStatus(prescriptionId, medIndex, newTaken);
      await toggleMedicationTaken(prescriptionId, medIndex);

      if (newTaken) {
        triggerLocalNotification('Dose Verified! 👍', `Logged intake of ${medName}. Stay healthy!`);
      }
    } catch (err) { console.error(err); }
  };

  const handleDownloadPDF = async (doctorName) => {
    setDownloading(true);
    await new Promise(r => setTimeout(r, 1200));
    setDownloading(false);
    triggerLocalNotification('Download Complete 📂', `Prescription from ${doctorName} saved to local directory.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Prescriptions</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : prescriptions.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No prescriptions found.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {prescriptions.map((rx) => {
            const medicinesList = rx.medicines || rx.medications || [];
            const active = medicinesList.some(med => 
              isMedicineActive(rx.createdAt || rx.date, med.duration)
            );

            return (
              <GlassCard key={rx._id || rx.id} style={styles.rxCard}>
                {/* Status and Date Header */}
                <View style={styles.cardHeaderTop}>
                  <View style={[styles.statusBadge, active ? styles.activeBadge : styles.completedBadge]}>
                    <View style={[styles.statusDot, active ? styles.activeDot : styles.completedDot]} />
                    <Text style={[styles.statusText, active ? styles.activeText : styles.completedText]}>
                      {active ? 'Active' : 'Completed'}
                    </Text>
                  </View>
                  <View style={styles.dateBadge}>
                    <Calendar size={12} color={COLORS.textMuted} />
                    <Text style={styles.dateText}>
                      {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : rx.date}
                    </Text>
                  </View>
                </View>

                {/* Doctor Section */}
                <View style={styles.cardHeader}>
                  <View style={styles.docAvatar}>
                    <Text style={styles.docInitials}>{getInitials(rx.doctorId?.name || rx.doctorName)}</Text>
                  </View>
                  <View style={styles.docInfo}>
                    <Text style={styles.docName}>{rx.doctorId?.name || rx.doctorName || 'Doctor'}</Text>
                    <Text style={styles.docSpec}>{rx.doctorId?.specialization || rx.specialty || 'General'} Specialist</Text>
                  </View>
                  <TouchableOpacity
                    disabled={downloading}
                    onPress={() => handleDownloadPDF(rx.doctorId?.name || rx.doctorName)}
                    style={styles.downloadBtn}
                  >
                    <FileDown size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>

                {/* Diagnosis Box */}
                {rx.diagnosis && (
                  <View style={styles.diagnosisBox}>
                    <Activity size={13} color="#0284c7" style={{ marginRight: 6 }} />
                    <Text style={styles.diagnosisText} numberOfLines={2}>
                      Diagnosis: {rx.diagnosis}
                    </Text>
                  </View>
                )}

                <View style={styles.divider} />
                <Text style={styles.subTitle}>Medications Checklist</Text>

                {(() => {
                  const activeMeds = medicinesList.filter(med => 
                    isMedicineActive(rx.createdAt || rx.date, med.duration)
                  );
                  if (activeMeds.length === 0) {
                    return <Text style={styles.completedDurationText}>All medications completed.</Text>;
                  }
                  return activeMeds.map((med) => {
                    const originalIndex = medicinesList.indexOf(med);
                    return (
                      <View key={originalIndex} style={[styles.medItem, med.taken && styles.medItemTaken]}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => handleMedsCheck(rx._id || rx.id, originalIndex, med.name, med.taken)}
                          style={styles.checkbox}
                        >
                          <CheckCircle
                            size={22}
                            color={med.taken ? COLORS.success : '#cbd5e1'}
                            fill={med.taken ? 'rgba(22,163,74,0.1)' : 'transparent'}
                          />
                        </TouchableOpacity>
                        <View style={styles.medDetails}>
                          <Text style={[styles.medName, med.taken && styles.medCrossed]}>{med.name}</Text>
                          <Text style={styles.medFrequency}>{med.dose || med.dosage} · {med.frequency}</Text>
                        </View>
                        <Text style={styles.medTime}>{med.time || med.timing || med.duration || ''}</Text>
                      </View>
                    );
                  });
                })()}
              </GlassCard>
            );
          })}
        </ScrollView>
      )}

      {downloading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loaderText}>Generating digital PDF receipt...</Text>
        </View>
      )}
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
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { color: COLORS.textMuted, fontSize: 15, textAlign: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  rxCard: { marginBottom: 20, padding: 18, backgroundColor: COLORS.cardBg, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  
  cardHeaderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activeBadge: { backgroundColor: '#ecfdf5' },
  completedBadge: { backgroundColor: '#f1f5f9' },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  activeDot: { backgroundColor: COLORS.success },
  completedDot: { backgroundColor: COLORS.textMuted },
  statusText: { fontSize: 11, fontWeight: '700' },
  activeText: { color: COLORS.success },
  completedText: { color: COLORS.textMuted },
  
  dateBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600' },
  
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  docAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f0f9ff', borderWidth: 1, borderColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  docInitials: { color: COLORS.primary, fontSize: 14, fontWeight: '700' },
  docInfo: { flex: 1 },
  docName: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  docSpec: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600', marginTop: 1 },
  downloadBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: 'rgba(14,165,233,0.06)', borderWidth: 1, borderColor: 'rgba(14,165,233,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  
  diagnosisBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', borderLeftWidth: 3, borderLeftColor: '#0284c7', padding: 10, borderRadius: 4, marginVertical: 6 },
  diagnosisText: { flex: 1, color: '#0369a1', fontSize: 12, fontWeight: '600' },
  
  divider: { height: 1.5, backgroundColor: COLORS.border, marginVertical: 14 },
  subTitle: { color: COLORS.text, fontSize: 13, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  medItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  medItemTaken: { backgroundColor: '#f8fafc', borderRadius: 8 },
  checkbox: { marginRight: 12 },
  medDetails: { flex: 1 },
  medName: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  medCrossed: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  medFrequency: { color: COLORS.textMuted, fontSize: 11, marginTop: 2, fontWeight: '500' },
  medTime: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600' },
  
  completedDurationText: { fontSize: 13, color: COLORS.textMuted, fontStyle: 'italic', marginVertical: 8 },
  
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248,250,252,0.9)',
    justifyContent: 'center', alignItems: 'center', zIndex: 99,
  },
  loaderText: { color: COLORS.text, fontSize: 15, fontWeight: '600', marginTop: 18 },
});
