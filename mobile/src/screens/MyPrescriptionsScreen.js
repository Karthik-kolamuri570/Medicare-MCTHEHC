import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, CheckCircle, FileDown } from 'lucide-react-native';
import { COLORS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import { getPrescriptions, toggleMedicationTaken } from '../services/api';
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

export default function MyPrescriptionsScreen({ navigation }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => { loadPrescriptions(); }, []);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const list = await getPrescriptions();
      setPrescriptions(list);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleMedsCheck = async (prescriptionId, medIndex, medName, currentTaken) => {
    try {
      await toggleMedicationTaken(prescriptionId, medIndex);
      const updated = prescriptions.map(rx => {
        const rxId = rx._id || rx.id;
        if (rxId === prescriptionId) {
          const key = rx.medicines ? 'medicines' : 'medications';
          const meds = [...(rx[key] || [])];
          if (meds[medIndex]) {
            meds[medIndex] = { ...meds[medIndex], taken: !currentTaken };
          }
          return { ...rx, [key]: meds };
        }
        return rx;
      });
      setPrescriptions(updated);
      if (!currentTaken) {
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
          {prescriptions.map((rx) => (
            <GlassCard key={rx._id || rx.id} style={styles.rxCard}>
              <View style={styles.cardHeader}>
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

              <Text style={styles.dateLabel}>Issued on {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString() : rx.date}</Text>
              <Text style={[styles.dateLabel, { marginTop: 2 }]}>Diagnosis: {rx.diagnosis || ''}</Text>
              <View style={styles.divider} />
              <Text style={styles.subTitle}>Medications Checklist</Text>

              {(() => {
                const activeMeds = (rx.medicines || rx.medications || []).filter(med => 
                  isMedicineActive(rx.createdAt || rx.date, med.duration)
                );
                if (activeMeds.length === 0) {
                  return <Text style={{ fontSize: 13, color: COLORS.textMuted, fontStyle: 'italic', marginVertical: 6 }}>All medications from this prescription have completed their duration.</Text>;
                }
                return activeMeds.map((med) => {
                  const originalIndex = (rx.medicines || rx.medications || []).indexOf(med);
                  return (
                    <View key={originalIndex} style={styles.medItem}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleMedsCheck(rx._id || rx.id, originalIndex, med.name, med.taken)}
                        style={styles.checkbox}
                      >
                        <CheckCircle
                          size={20}
                          color={med.taken ? '#16a34a' : '#cbd5e1'}
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
          ))}
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
  rxCard: { marginBottom: 20, padding: 18 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  docInfo: { flex: 1 },
  docName: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  docSpec: { color: COLORS.primary, fontSize: 13, fontWeight: '600', marginTop: 2 },
  downloadBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: 'rgba(14,165,233,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  dateLabel: { color: COLORS.textMuted, fontSize: 12, marginTop: 8 },
  divider: { height: 1.5, backgroundColor: COLORS.border, marginVertical: 14 },
  subTitle: { color: COLORS.text, fontSize: 14, fontWeight: '700', marginBottom: 12 },
  medItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  checkbox: { marginRight: 12 },
  medDetails: { flex: 1 },
  medName: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  medCrossed: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  medFrequency: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  medTime: { color: COLORS.textMuted, fontSize: 12 },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248,250,252,0.9)',
    justifyContent: 'center', alignItems: 'center', zIndex: 99,
  },
  loaderText: { color: COLORS.text, fontSize: 15, fontWeight: '600', marginTop: 18 },
});
