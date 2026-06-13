import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  ActivityIndicator, Modal, Linking
} from 'react-native';
import {
  ArrowLeft, FileText, CheckCircle, Clock, X,
  ChevronRight, Calendar, User, Stethoscope, AlertCircle
} from 'lucide-react-native';
import { COLORS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import PremiumButton from '../components/PremiumButton';
import api, { getSecondOpinions, MOCK_MODE } from '../services/api';
import { triggerLocalNotification } from '../services/notifications';

const formatDate = (raw) => {
  if (!raw) return '—';
  try {
    const d = new Date(raw);
    return isNaN(d.getTime()) ? String(raw) : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return String(raw); }
};

const STATUS_COLOR = {
  pending: '#d97706', accepted: '#16a34a', completed: '#16a34a',
  rejected: '#ef4444', cancelled: '#94a3b8', rescheduled: '#6366f1',
};
const STATUS_BG = {
  pending: '#fef3c7', accepted: '#dcfce7', completed: '#dcfce7',
  rejected: '#fee2e2', cancelled: '#f1f5f9', rescheduled: '#ede9fe',
};
const STATUS_BAR = {
  pending: '#f59e0b', accepted: '#10b981', completed: '#10b981',
  rejected: '#ef4444', cancelled: '#94a3b8', rescheduled: '#8b5cf6',
};

export default function DSecondOpinionsScreen({ navigation }) {
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState(null);

  const FILTERS = ['All', 'Pending', 'Accepted', 'Rejected'];

  useEffect(() => { loadOpinions(); }, []);

  const loadOpinions = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await getSecondOpinions();
      setOpinions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setError('Failed to load cases.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (caseId, action) => {
    setActionLoading(true);
    try {
      if (MOCK_MODE) {
        await new Promise(r => setTimeout(r, 800));
        setOpinions(prev => prev.map(op =>
          (op._id || op.id) === caseId ? { ...op, status: action } : op
        ));
        if (selectedCase && (selectedCase._id || selectedCase.id) === caseId) {
          setSelectedCase(prev => ({ ...prev, status: action }));
        }
      } else {
        await api.put(`/doctor/get-second-opinion/${caseId}`, { status: action });
        setOpinions(prev => prev.map(op =>
          (op._id || op.id) === caseId ? { ...op, status: action } : op
        ));
        if (selectedCase && (selectedCase._id || selectedCase.id) === caseId) {
          setSelectedCase(prev => ({ ...prev, status: action }));
        }
      }
      const label = action === 'accepted' ? 'Accepted ✅' : 'Rejected ❌';
      triggerLocalNotification(`Case ${label}`, `Second opinion case has been ${action}.`);
    } catch (err) {
      console.error('Action failed', err);
      triggerLocalNotification('Action Failed', err?.response?.data?.message || 'Could not update case.');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = opinions.filter(op => {
    if (filter === 'All') return true;
    return op.status?.toLowerCase() === filter.toLowerCase();
  });

  const getPatientName = (op) => {
    if (!op.patientId) return 'Patient';
    if (typeof op.patientId === 'object') return op.patientId.name || 'Patient';
    return 'Patient';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Second Opinions</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Page title */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Patient Cases</Text>
        <Text style={styles.pageSub}>Review and respond to second opinion requests</Text>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            >
              <Text style={[styles.filterBtnText, filter === f && styles.filterBtnTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <AlertCircle size={32} color={COLORS.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <FileText size={48} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>No cases found</Text>
          <Text style={styles.emptyText}>No {filter !== 'All' ? filter.toLowerCase() + ' ' : ''}second opinion requests assigned.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {filtered.map(op => {
            const key = (op._id || op.id)?.toString() || Math.random().toString();
            const status = op.status || 'pending';
            const patientName = getPatientName(op);
            const barColor = STATUS_BAR[status] || '#94a3b8';

            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.9}
                onPress={() => setSelectedCase(op)}
                style={styles.card}
              >
                {/* Left status bar */}
                <View style={[styles.cardBar, { backgroundColor: barColor }]} />

                <View style={styles.cardBody}>
                  {/* Header row */}
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.cardPatientInfo}>
                      <View style={styles.nameRow}>
                        <User size={14} color={COLORS.textMuted} />
                        <Text style={styles.cardPatientName} numberOfLines={1}>{patientName}</Text>
                      </View>
                      <Text style={styles.cardDate}>
                        <Clock size={11} color={COLORS.textMuted} /> {formatDate(op.createdAt || op.date)}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: STATUS_BG[status] || '#f1f5f9' }]}>
                      <Text style={[styles.statusBadgeText, { color: STATUS_COLOR[status] || '#64748b' }]}>
                        {status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Slot info */}
                  <View style={styles.slotRow}>
                    <Calendar size={13} color={COLORS.textMuted} />
                    <Text style={styles.slotText}>{formatDate(op.date)}</Text>
                    {op.time && <Text style={styles.slotText}> at {op.time}</Text>}
                    {op.mode && (
                      <View style={styles.modeBadge}>
                        <Text style={styles.modeBadgeText}>{op.mode}</Text>
                      </View>
                    )}
                  </View>

                  {/* Problem */}
                  <Text style={styles.cardProblem} numberOfLines={2}>
                    {op.problem || op.description || 'No description provided'}
                  </Text>

                  {/* Actions (if pending) */}
                  {status === 'pending' && (
                    <View style={styles.inlineActions}>
                      <TouchableOpacity
                        style={styles.acceptBtn}
                        onPress={() => handleAction(op._id || op.id, 'accepted')}
                        disabled={actionLoading}
                      >
                        <CheckCircle size={14} color="#fff" />
                        <Text style={styles.acceptBtnText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => handleAction(op._id || op.id, 'rejected')}
                        disabled={actionLoading}
                      >
                        <X size={14} color="#ef4444" />
                        <Text style={styles.rejectBtnText}>Reject</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.viewBtn} onPress={() => setSelectedCase(op)}>
                        <ChevronRight size={14} color={COLORS.primary} />
                        <Text style={styles.viewBtnText}>Details</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {status !== 'pending' && (
                    <TouchableOpacity style={styles.detailsLink} onPress={() => setSelectedCase(op)}>
                      <Text style={styles.detailsLinkText}>View Full Details</Text>
                      <ChevronRight size={13} color={COLORS.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Detail Modal */}
      <Modal
        visible={selectedCase !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedCase(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            {/* Sheet header */}
            <View style={styles.sheetHeaderRow}>
              <View style={styles.sheetBadge}>
                <Stethoscope size={15} color="#fff" />
                <Text style={styles.sheetBadgeText}>Case File</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedCase(null)}>
                <X size={22} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />

            <ScrollView showsVerticalScrollIndicator={false} style={styles.sheetScroll}>
              <Text style={styles.sheetLabel}>PATIENT</Text>
              <Text style={styles.sheetValue}>{selectedCase ? getPatientName(selectedCase) : '—'}</Text>

              <Text style={styles.sheetLabel}>APPOINTMENT DATE & TIME</Text>
              <Text style={styles.sheetValue}>
                {formatDate(selectedCase?.date)}
                {selectedCase?.time ? ` at ${selectedCase.time}` : ''}
              </Text>

              <Text style={styles.sheetLabel}>MODE</Text>
              <Text style={styles.sheetValue}>
                {selectedCase?.mode ? selectedCase.mode.charAt(0).toUpperCase() + selectedCase.mode.slice(1) : '—'}
              </Text>

              <Text style={styles.sheetLabel}>PROBLEM</Text>
              <Text style={styles.sheetDesc}>{selectedCase?.problem || '—'}</Text>

              {selectedCase?.treatment && (
                <>
                  <Text style={styles.sheetLabel}>CURRENT TREATMENT</Text>
                  <Text style={styles.sheetDesc}>{selectedCase.treatment}</Text>
                </>
              )}

              <Text style={styles.sheetLabel}>STATUS</Text>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_BG[selectedCase?.status] || '#f1f5f9', alignSelf: 'flex-start', marginBottom: 16 }]}>
                <Text style={[styles.statusBadgeText, { color: STATUS_COLOR[selectedCase?.status] || '#64748b' }]}>
                  {(selectedCase?.status || 'pending').toUpperCase()}
                </Text>
              </View>

              {/* Files */}
              {selectedCase?.files?.length > 0 && (
                <>
                  <Text style={styles.sheetLabel}>ATTACHED FILES</Text>
                  {selectedCase.files.map((f, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.fileRow}
                      onPress={() => typeof f === 'string' && Linking.openURL(f)}
                    >
                      <FileText size={14} color={COLORS.primary} />
                      <Text style={styles.fileText} numberOfLines={1}>
                        {typeof f === 'string' ? f.split('/').pop() : `File ${i + 1}`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </ScrollView>

            {/* Action buttons if pending */}
            {selectedCase?.status === 'pending' && (
              <View style={styles.sheetActions}>
                <TouchableOpacity
                  style={[styles.sheetAcceptBtn, actionLoading && { opacity: 0.6 }]}
                  onPress={() => handleAction(selectedCase._id || selectedCase.id, 'accepted')}
                  disabled={actionLoading}
                >
                  {actionLoading ? <ActivityIndicator size="small" color="#fff" /> : (
                    <>
                      <CheckCircle size={16} color="#fff" />
                      <Text style={styles.sheetAcceptText}>Accept Case</Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sheetRejectBtn, actionLoading && { opacity: 0.6 }]}
                  onPress={() => handleAction(selectedCase._id || selectedCase.id, 'rejected')}
                  disabled={actionLoading}
                >
                  <X size={16} color="#ef4444" />
                  <Text style={styles.sheetRejectText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
            {selectedCase?.status !== 'pending' && (
              <PremiumButton title="Close" onPress={() => setSelectedCase(null)} variant="primary" style={{ marginTop: 8 }} />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1.5, borderBottomColor: '#e2e8f0', backgroundColor: '#ffffff',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: '#0f172a', fontSize: 18, fontWeight: '700' },
  pageHeader: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  pageTitle: { fontSize: 22, fontWeight: '800', color: '#0f172a', letterSpacing: -0.5 },
  pageSub: { color: '#64748b', fontSize: 13, fontWeight: '500', marginTop: 2 },

  filterBar: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  filterScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100,
    backgroundColor: '#f1f5f9',
  },
  filterBtnActive: { backgroundColor: COLORS.primary },
  filterBtnText: { color: '#64748b', fontSize: 13, fontWeight: '700' },
  filterBtnTextActive: { color: '#ffffff' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  errorText: { color: COLORS.danger, marginTop: 10, fontSize: 14, textAlign: 'center' },
  emptyTitle: { color: '#0f172a', fontSize: 18, fontWeight: '700', marginTop: 14 },
  emptyText: { color: '#64748b', fontSize: 13, textAlign: 'center', marginTop: 4 },

  list: { padding: 16, paddingBottom: 40 },

  card: {
    backgroundColor: '#ffffff', borderRadius: 20,
    borderWidth: 1.5, borderColor: '#e2e8f0',
    marginBottom: 14, flexDirection: 'row', overflow: 'hidden',
    shadowColor: '#0f172a', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03, shadowRadius: 12, elevation: 2,
  },
  cardBar: { width: 6 },
  cardBody: { flex: 1, padding: 16 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardPatientInfo: { flex: 1, marginRight: 10 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  cardPatientName: { color: '#0f172a', fontSize: 15, fontWeight: '800', flex: 1 },
  cardDate: { color: '#64748b', fontSize: 12, fontWeight: '500' },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  slotRow: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#f8fafc', padding: 10, borderRadius: 10, marginBottom: 10 },
  slotText: { color: '#334155', fontSize: 13, fontWeight: '700' },
  modeBadge: { marginLeft: 'auto', backgroundColor: '#eff6ff', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  modeBadgeText: { color: '#2563eb', fontSize: 11, fontWeight: '700' },

  cardProblem: { color: '#475569', fontSize: 13, lineHeight: 20, marginBottom: 12 },

  inlineActions: { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  acceptBtn: {
    flex: 1, backgroundColor: '#10b981', borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 10,
  },
  acceptBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  rejectBtn: {
    flex: 1, backgroundColor: '#fee2e2', borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 10,
  },
  rejectBtnText: { color: '#ef4444', fontWeight: '800', fontSize: 13 },
  viewBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 10,
  },
  viewBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  detailsLink: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  detailsLinkText: { color: COLORS.primary, fontSize: 13, fontWeight: '700' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderWidth: 1.5, borderColor: '#e2e8f0', padding: 24, paddingBottom: 40, maxHeight: '85%',
  },
  sheetHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sheetBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.secondary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7,
  },
  sheetBadgeText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  divider: { height: 1.5, backgroundColor: '#e2e8f0', marginVertical: 16 },
  sheetScroll: { marginBottom: 16 },
  sheetLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginTop: 14, marginBottom: 4 },
  sheetValue: { color: '#0f172a', fontSize: 14, fontWeight: '600' },
  sheetDesc: { color: '#334155', fontSize: 14, lineHeight: 22 },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#eff6ff', borderRadius: 10, padding: 12, marginVertical: 4 },
  fileText: { color: '#2563eb', fontSize: 13, fontWeight: '600', flex: 1 },
  sheetActions: { flexDirection: 'row', gap: 12 },
  sheetAcceptBtn: {
    flex: 1, backgroundColor: '#10b981', borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14,
  },
  sheetAcceptText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  sheetRejectBtn: {
    backgroundColor: '#fee2e2', borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingHorizontal: 20, paddingVertical: 14,
  },
  sheetRejectText: { color: '#ef4444', fontSize: 15, fontWeight: '800' },
});
