import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Modal, TextInput
} from 'react-native';
import {
  ArrowLeft, Video, Calendar, Clock, User, Stethoscope,
  FileText, X, CheckCircle, RefreshCw, AlertCircle
} from 'lucide-react-native';
import api from '../services/api';
import { triggerLocalNotification } from '../services/notifications';

// ── Helpers ─────────────────────────────────────────────────────────────────
const getToday = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const s = dateStr.split('T')[0];
  const [y, m, d] = s.split('-').map(Number);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${String(d).padStart(2,'0')} ${months[m-1]} ${y}`;
};

const getPatientName = (p) => {
  if (!p?.patientId) return 'Patient';
  if (typeof p.patientId === 'object') return p.patientId.name || 'Patient';
  return 'Patient';
};

// ── Appointment Card ─────────────────────────────────────────────────────────
function ConsultCard({ appt, onStartChat, onPrescription, isVirtual }) {
  const patientName = getPatientName(appt);
  const dateStr = appt.date ? appt.date.split('T')[0] : '';
  const isOpinion = !!appt.isSecondOpinion;

  return (
    <View style={[styles.card, isOpinion && styles.cardOpinion]}>
      <View style={[styles.cardBar, { backgroundColor: isOpinion ? '#3b82f6' : '#10b981' }]} />
      <View style={styles.cardBody}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.avatar, { backgroundColor: isOpinion ? '#2563eb' : '#059669' }]}>
            <Text style={styles.avatarText}>
              {patientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName} numberOfLines={1}>{patientName}</Text>
            {isOpinion && (
              <View style={styles.opinionBadge}>
                <Text style={styles.opinionBadgeText}>2nd Opinion</Text>
              </View>
            )}
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailRow}>
          <Calendar size={13} color="#64748b" />
          <Text style={styles.detailText}>{formatDate(dateStr)}</Text>
          <Clock size={13} color="#64748b" style={{ marginLeft: 12 }} />
          <Text style={styles.detailText}>{appt.time || '—'}</Text>
        </View>

        {appt.problem && (
          <View style={styles.problemBox}>
            <Text style={styles.problemLabel}>Chief Complaint</Text>
            <Text style={styles.problemText} numberOfLines={2}>{appt.problem}</Text>
          </View>
        )}

        {/* Actions */}
        {isVirtual && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.chatBtn}
              onPress={() => onStartChat(appt)}
            >
              <Video size={14} color="#fff" />
              <Text style={styles.chatBtnText}>Start Consultation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rxBtn}
              onPress={() => onPrescription(appt)}
            >
              <FileText size={14} color="#0ea5e9" />
              <Text style={styles.rxBtnText}>Rx</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

// ── Prescription Modal ───────────────────────────────────────────────────────
function PrescriptionModal({ appointment, onClose, onSubmit }) {
  const [medications, setMedications] = useState('');
  const [instructions, setInstructions] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!medications.trim()) {
      Alert.alert('Required', 'Please enter at least one medication.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/doctor/prescription', {
        appointmentId: appointment._id,
        patientId: typeof appointment.patientId === 'object'
          ? appointment.patientId?._id
          : appointment.patientId,
        medications: medications.trim(),
        instructions: instructions.trim(),
        notes: notes.trim(),
      });
      triggerLocalNotification('Prescription Sent ✅', `Prescription for ${getPatientName(appointment)} has been saved.`);
      onSubmit?.();
      onClose();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to save prescription. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Write Prescription</Text>
              <Text style={styles.modalSub}>For {getPatientName(appointment)}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Medications *</Text>
              <TextInput
                style={[styles.textArea, { height: 100 }]}
                placeholder="e.g. Paracetamol 500mg - twice daily"
                placeholderTextColor="#94a3b8"
                value={medications}
                onChangeText={setMedications}
                multiline
                textAlignVertical="top"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Instructions</Text>
              <TextInput
                style={[styles.textArea, { height: 80 }]}
                placeholder="e.g. Take after meals, avoid alcohol"
                placeholderTextColor="#94a3b8"
                value={instructions}
                onChangeText={setInstructions}
                multiline
                textAlignVertical="top"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Doctor's Notes</Text>
              <TextInput
                style={[styles.textArea, { height: 80 }]}
                placeholder="Additional notes for patient..."
                placeholderTextColor="#94a3b8"
                value={notes}
                onChangeText={setNotes}
                multiline
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting
                ? <ActivityIndicator size="small" color="#fff" />
                : <><FileText size={16} color="#fff" /><Text style={styles.submitBtnText}>Save & Send Prescription</Text></>
              }
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function DOnlineConsultationScreen({ navigation }) {
  const [todayAppts, setTodayAppts] = useState([]);
  const [futureAppts, setFutureAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prescriptionTarget, setPrescriptionTarget] = useState(null);

  const today = getToday();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [apptRes, opinionRes] = await Promise.all([
        api.get('/doctor/accepted-appointments'),
        api.get('/doctor/get-second-opinion/accept'),
      ]);

      const appointments = (apptRes.data?.data || []).map(a => ({ ...a, isSecondOpinion: false }));
      const opinions     = (opinionRes.data?.data || []).map(a => ({ ...a, isSecondOpinion: true }));
      const all = [...appointments, ...opinions];

      setTodayAppts(all.filter(a => {
        const d = a.date ? a.date.split('T')[0] : '';
        return d === today;
      }));
      setFutureAppts(all.filter(a => {
        const d = a.date ? a.date.split('T')[0] : '';
        return d > today;
      }));
    } catch (err) {
      console.error('Consultation fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    fetchData();
    const unsub = navigation.addListener('focus', fetchData);
    return unsub;
  }, [navigation, fetchData]);

  const handleStartChat = (appt) => {
    const patientId = typeof appt.patientId === 'object'
      ? appt.patientId?._id
      : appt.patientId;
    const doctorId = typeof appt.doctorId === 'object'
      ? appt.doctorId?._id
      : appt.doctorId;
    navigation.navigate('Chat', { receiverId: `${doctorId}-${patientId}` });
  };

  const allCount   = todayAppts.length + futureAppts.length;
  const todayCount = todayAppts.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Online Consultations</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchData}>
          <RefreshCw size={18} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: "Today's Queue", count: todayCount, color: '#10b981', bg: '#ecfdf5' },
            { label: 'Upcoming',      count: futureAppts.length, color: '#3b82f6', bg: '#eff6ff' },
            { label: 'Total Active',  count: allCount, color: '#8b5cf6', bg: '#f5f3ff' },
          ].map(s => (
            <View key={s.label} style={[styles.statCard, { borderTopColor: s.color }]}>
              <Text style={[styles.statCount, { color: s.color }]}>{s.count}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Loading consultations...</Text>
          </View>
        ) : (
          <>
            {/* Virtual Waiting Hall — Today */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionBadge}>
                <Video size={14} color="#10b981" />
              </View>
              <Text style={styles.sectionTitle}>Virtual Waiting Hall</Text>
              <View style={[styles.countBadge, { backgroundColor: '#ecfdf5' }]}>
                <Text style={[styles.countText, { color: '#059669' }]}>{todayCount}</Text>
              </View>
            </View>
            <Text style={styles.sectionSub}>Today's accepted appointments ready for consultation</Text>

            {todayAppts.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyIcon}>🏥</Text>
                <Text style={styles.emptyTitle}>No patients today</Text>
                <Text style={styles.emptyText}>Your waiting hall is clear for today.</Text>
              </View>
            ) : (
              todayAppts.map(a => (
                <ConsultCard
                  key={a._id}
                  appt={a}
                  isVirtual
                  onStartChat={handleStartChat}
                  onPrescription={a => setPrescriptionTarget(a)}
                />
              ))
            )}

            {/* Upcoming Schedule */}
            <View style={[styles.sectionHeader, { marginTop: 24 }]}>
              <View style={[styles.sectionBadge, { backgroundColor: '#eff6ff' }]}>
                <Calendar size={14} color="#3b82f6" />
              </View>
              <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
              <View style={[styles.countBadge, { backgroundColor: '#eff6ff' }]}>
                <Text style={[styles.countText, { color: '#2563eb' }]}>{futureAppts.length}</Text>
              </View>
            </View>
            <Text style={styles.sectionSub}>Future accepted appointments</Text>

            {futureAppts.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyIcon}>📅</Text>
                <Text style={styles.emptyTitle}>No upcoming appointments</Text>
                <Text style={styles.emptyText}>Accepted future appointments will appear here.</Text>
              </View>
            ) : (
              futureAppts.map(a => (
                <ConsultCard
                  key={a._id}
                  appt={a}
                  isVirtual={false}
                  onStartChat={handleStartChat}
                  onPrescription={a => setPrescriptionTarget(a)}
                />
              ))
            )}
          </>
        )}
      </ScrollView>

      {/* Prescription Modal */}
      {prescriptionTarget && (
        <PrescriptionModal
          appointment={prescriptionTarget}
          onClose={() => setPrescriptionTarget(null)}
          onSubmit={() => {}}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: '#fff', borderBottomWidth: 1.5, borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
    alignItems: 'center', justifyContent: 'center',
  },
  refreshBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#eff6ff', borderWidth: 1.5, borderColor: '#bfdbfe',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: '#0f172a', fontSize: 18, fontWeight: '700' },

  scroll: { padding: 16, paddingBottom: 50 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: '#e2e8f0', borderTopWidth: 3,
    padding: 12, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  statCount: { fontSize: 22, fontWeight: '800', marginBottom: 2 },
  statLabel: { color: '#64748b', fontSize: 10, fontWeight: '700', letterSpacing: 0.3, textAlign: 'center' },

  // Section
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  sectionBadge: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: '#ecfdf5',
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { flex: 1, color: '#1e293b', fontSize: 16, fontWeight: '800' },
  countBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  countText: { fontSize: 12, fontWeight: '800' },
  sectionSub: { color: '#64748b', fontSize: 12, marginBottom: 14, marginLeft: 2 },

  // Card
  card: {
    backgroundColor: '#fff', borderRadius: 18,
    borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 12,
    flexDirection: 'row', overflow: 'hidden',
    shadowColor: '#0f172a', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  cardOpinion: { borderColor: '#bfdbfe' },
  cardBar: { width: 5 },
  cardBody: { flex: 1, padding: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, elevation: 2,
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  patientInfo: { flex: 1 },
  patientName: { color: '#1e293b', fontSize: 15, fontWeight: '700' },
  opinionBadge: {
    marginTop: 3, alignSelf: 'flex-start',
    backgroundColor: '#eff6ff', borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  opinionBadgeText: { color: '#2563eb', fontSize: 10, fontWeight: '700' },

  detailRow: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#f8fafc', borderRadius: 8, padding: 8, marginBottom: 10,
  },
  detailText: { color: '#64748b', fontSize: 12, fontWeight: '600' },

  problemBox: {
    backgroundColor: '#f8fafc', borderRadius: 8, padding: 10, marginBottom: 12,
    borderLeftWidth: 3, borderLeftColor: '#e2e8f0',
  },
  problemLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '700', marginBottom: 3, letterSpacing: 0.4 },
  problemText: { color: '#334155', fontSize: 13, lineHeight: 18 },

  actionRow: { flexDirection: 'row', gap: 10 },
  chatBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    backgroundColor: '#10b981', borderRadius: 10, paddingVertical: 10,
    shadowColor: '#10b981', shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
  },
  chatBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  rxBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#f0f9ff', borderWidth: 1.5, borderColor: '#bae6fd',
    borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10,
  },
  rxBtnText: { color: '#0ea5e9', fontWeight: '800', fontSize: 13 },

  // Empty
  emptyBox: {
    alignItems: 'center', padding: 32,
    backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1.5, borderColor: '#e2e8f0', borderStyle: 'dashed',
    marginBottom: 12,
  },
  emptyIcon: { fontSize: 36, marginBottom: 10 },
  emptyTitle: { color: '#374151', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  emptyText: { color: '#9ca3af', fontSize: 13, textAlign: 'center' },

  center: { alignItems: 'center', paddingVertical: 60 },
  loadingText: { color: '#64748b', marginTop: 12, fontSize: 14 },

  // Prescription Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(15,23,42,0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: '90%', padding: 24,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalTitle: { color: '#0f172a', fontSize: 18, fontWeight: '800' },
  modalSub: { color: '#64748b', fontSize: 13, marginTop: 2 },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center',
  },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { color: '#374151', fontSize: 13, fontWeight: '700', marginBottom: 8 },
  textArea: {
    backgroundColor: '#f8fafc', borderRadius: 12,
    borderWidth: 1.5, borderColor: '#e2e8f0',
    padding: 12, color: '#0f172a', fontSize: 14, lineHeight: 20,
  },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#0ea5e9', borderRadius: 14, paddingVertical: 14,
    marginTop: 8, marginBottom: 8,
    shadowColor: '#0ea5e9', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  submitBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
