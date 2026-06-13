import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  ActivityIndicator, TextInput, Alert, Modal
} from 'react-native';
import {
  MessageSquare, Calendar, Clock, Search, History,
  RefreshCw, X, CheckCircle, XCircle, ArrowLeft,
  AlertCircle, Video, FileText
} from 'lucide-react-native';
import api from '../services/api';

// ─── helpers ────────────────────────────────────────────────────────────────
const isRecentOrFuture = (dateStr) => {
  if (!dateStr) return true;
  try {
    const d = new Date(dateStr.split('T')[0]);
    d.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    return d >= today;
  } catch { return true; }
};

const isFuture = (dateStr, timeStr) => {
  if (!dateStr) return true;
  try {
    return new Date(`${dateStr.split('T')[0]}T${timeStr || '00:00'}`) >= new Date();
  } catch { return true; }
};

const fmtDate = (s) => {
  if (!s) return 'N/A';
  const p = s.split('T')[0];
  const [y, m, d] = p.split('-').map(Number);
  const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${String(d).padStart(2,'0')} ${mon[m-1]} ${y}`;
};

const STATUS_COLORS = {
  pending:   { bg: '#fef3c7', text: '#92400e' },
  accepted:  { bg: '#dcfce7', text: '#166534' },
  rejected:  { bg: '#fee2e2', text: '#991b1b' },
  cancelled: { bg: '#f1f5f9', text: '#475569' },
  completed: { bg: '#ede9fe', text: '#5b21b6' },
};

// ─── Reschedule Modal ───────────────────────────────────────────────────────
function RescheduleModal({ item, onClose, onDone }) {
  const [date, setDate] = useState(item.date?.split('T')[0] || '');
  const [time, setTime] = useState(item.time || '');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!date || !time) { Alert.alert('Required', 'Please enter both date and time.'); return; }
    if (!isFuture(date, time)) { Alert.alert('Invalid', 'Please choose a future date & time.'); return; }
    setSaving(true);
    try {
      const isAppt = item.type === 'appointment';
      const ep = isAppt
        ? `/patient/reschedule-appointment/${item._id}`
        : `/patient/reschedule-second-opinion/${item._id}`;
      await api.put(ep, { date, time });
      onDone();
      onClose();
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.message || 'Reschedule failed.');
    } finally { setSaving(false); }
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.modal}>
          <View style={s.modalHead}>
            <Text style={s.modalTitle}>Reschedule</Text>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}><X size={18} color="#64748b" /></TouchableOpacity>
          </View>
          <Text style={s.modalSub}>Dr. {item.doctorId?.name || 'Doctor'}</Text>

          <Text style={s.fieldLabel}>New Date (YYYY-MM-DD)</Text>
          <TextInput style={s.input} value={date} onChangeText={setDate} placeholder="2025-12-31" placeholderTextColor="#94a3b8" />

          <Text style={s.fieldLabel}>New Time (HH:MM)</Text>
          <TextInput style={s.input} value={time} onChangeText={setTime} placeholder="10:30" placeholderTextColor="#94a3b8" />

          <TouchableOpacity style={[s.confirmBtn, saving && { opacity: 0.6 }]} onPress={submit} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.confirmBtnText}>Confirm Reschedule</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Card ───────────────────────────────────────────────────────────────────
function ConsultCard({ item, onChat, onCancel, onReschedule, actionId }) {
  const isAppt   = item.type === 'appointment';
  const docName  = item.doctorId?.name || 'Pending Assignment';
  const past     = !isFuture(item.date, item.time);
  const rawStatus = (item.status || 'Pending').toLowerCase();
  const displayStatus = rawStatus === 'accepted' && past ? 'Completed' : item.status;
  const statusKey = displayStatus.toLowerCase();
  const sc = STATUS_COLORS[statusKey] || STATUS_COLORS.pending;

  const canChat      = rawStatus === 'accepted' && !past;
  const canModify    = (rawStatus === 'pending' && isRecentOrFuture(item.date))
                    || (rawStatus === 'accepted' && isFuture(item.date, item.time));
  const isLoading    = actionId === item._id;

  return (
    <View style={[s.card, isAppt ? s.cardAppt : s.cardOpinion]}>
      <View style={s.cardTop}>
        <View style={s.cardLeft}>
          <View style={[s.typeBadge, { backgroundColor: isAppt ? '#eff6ff' : '#fdf4ff' }]}>
            {isAppt ? <Calendar size={11} color="#3b82f6" /> : <FileText size={11} color="#9333ea" />}
            <Text style={[s.typeText, { color: isAppt ? '#3b82f6' : '#9333ea' }]}>
              {isAppt ? 'Appointment' : '2nd Opinion'}
            </Text>
          </View>
          <Text style={s.docName}>{docName}</Text>
          <Text style={s.spec}>{item.doctorId?.specialization || (isAppt ? 'Specialist' : 'Expert Review')}</Text>
        </View>
        <View style={[s.statusBadge, { backgroundColor: sc.bg }]}>
          <Text style={[s.statusText, { color: sc.text }]}>{displayStatus}</Text>
        </View>
      </View>

      <View style={s.metaRow}>
        <AlertCircle size={12} color="#94a3b8" />
        <Text style={s.metaText} numberOfLines={1}>{item.problem?.substring(0, 30) || 'N/A'}</Text>
      </View>
      <View style={s.metaRow}>
        <Calendar size={12} color="#94a3b8" />
        <Text style={s.metaText}>{fmtDate(item.date)}</Text>
        <Clock size={12} color="#94a3b8" style={{ marginLeft: 10 }} />
        <Text style={s.metaText}>{item.time || 'N/A'}</Text>
      </View>

      {isRecentOrFuture(item.date) && (
        <View style={s.actionRow}>
          {canChat && (
            <TouchableOpacity style={s.chatBtn} onPress={() => onChat(item)}>
              <MessageSquare size={13} color="#fff" />
              <Text style={s.chatBtnText}>Chat</Text>
            </TouchableOpacity>
          )}
          {canModify && (
            <>
              <TouchableOpacity style={s.reschedBtn} onPress={() => onReschedule(item)} disabled={isLoading}>
                <RefreshCw size={13} color="#0ea5e9" />
                <Text style={s.reschedBtnText}>Reschedule</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.cancelBtn} onPress={() => onCancel(item)} disabled={isLoading}>
                {isLoading ? <ActivityIndicator size="small" color="#ef4444" /> : <><X size={13} color="#ef4444" /><Text style={s.cancelBtnText}>Cancel</Text></>}
              </TouchableOpacity>
            </>
          )}
          {!canModify && !canChat && (
            <View style={s.disabledRow}>
              <XCircle size={13} color="#94a3b8" />
              <Text style={s.disabledText}>{displayStatus}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
const FILTERS = ['all', 'appointments', 'second-opinions', 'history'];
const FILTER_LABELS = { all: 'All', appointments: 'Appointments', 'second-opinions': 'Opinions', history: 'History' };

export default function PatientConsultationScreen({ navigation }) {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [actionId, setActionId] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [apptRes, soRes] = await Promise.allSettled([
        api.get('/patient/appointments'),
        api.get('/patient/get-second-opinion'),
      ]);
      const appts = apptRes.status === 'fulfilled'
        ? (apptRes.value.data?.data || []).map(i => ({ ...i, type: 'appointment' }))
        : [];
      const opinions = soRes.status === 'fulfilled'
        ? (soRes.value.data?.data || []).map(i => ({
            ...i, type: 'second-opinion',
            date: typeof i.date === 'string' ? i.date.split('T')[0] : i.date,
            time: i.time || '10:00',
          }))
        : [];
      const all = [...appts, ...opinions].sort((a, b) => {
        const da = new Date(`${a.date || '2000-01-01'}T${a.time || '00:00'}`);
        const db = new Date(`${b.date || '2000-01-01'}T${b.time || '00:00'}`);
        return db - da;
      });
      setItems(all);
    } catch (e) { console.error('ConsultFetch:', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchData();
    const unsub = navigation.addListener('focus', fetchData);
    return unsub;
  }, [navigation, fetchData]);

  const filtered = items.filter(item => {
    const active = isRecentOrFuture(item.date);
    if (filter === 'all' && !active) return false;
    if (filter === 'appointments' && (item.type !== 'appointment' || !active)) return false;
    if (filter === 'second-opinions' && (item.type !== 'second-opinion' || !active)) return false;
    if (filter === 'history' && active) return false;
    if (search) {
      const t = search.toLowerCase();
      const n = item.doctorId?.name?.toLowerCase() || '';
      const p = item.problem?.toLowerCase() || '';
      if (!n.includes(t) && !p.includes(t)) return false;
    }
    return true;
  });

  const handleChat = (item) => {
    const did = item.doctorId?._id || item.doctorId;
    const pid = item.patientId?._id || item.patientId;
    if (did) navigation.navigate('Chat', { receiverId: `${did}-${pid}` });
  };

  const handleCancel = (item) => {
    Alert.alert('Cancel', `Cancel this ${item.type === 'appointment' ? 'appointment' : 'second opinion'}?`, [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: async () => {
        setActionId(item._id);
        try {
          const ep = item.type === 'appointment'
            ? `/patient/cancel-appointment/${item._id}`
            : `/patient/cancel-second-opinion/${item._id}`;
          await api.post(ep);
          fetchData();
        } catch (e) { Alert.alert('Error', e?.response?.data?.message || 'Failed to cancel.'); }
        finally { setActionId(null); }
      }},
    ]);
  };

  const stats = {
    total: filtered.length,
    appts: filtered.filter(i => i.type === 'appointment').length,
    opinions: filtered.filter(i => i.type === 'second-opinion').length,
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Consultations</Text>
        <TouchableOpacity style={s.refreshBtn} onPress={fetchData}>
          <RefreshCw size={18} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={s.searchRow}>
        <Search size={16} color="#94a3b8" style={{ marginRight: 8 }} />
        <TextInput
          style={s.searchInput}
          placeholder="Search doctor or problem..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
        {search ? <TouchableOpacity onPress={() => setSearch('')}><X size={16} color="#94a3b8" /></TouchableOpacity> : null}
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[s.tab, filter === f && s.tabActive]}>
            {f === 'history' && <History size={12} color={filter === f ? '#fff' : '#64748b'} />}
            <Text style={[s.tabText, filter === f && s.tabTextActive]}>{FILTER_LABELS[f]}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stats */}
      <View style={s.statsRow}>
        {[
          { label: 'Showing',     val: stats.total,    color: '#1e293b' },
          { label: 'Appointments',val: stats.appts,    color: '#3b82f6' },
          { label: '2nd Opinions',val: stats.opinions, color: '#9333ea' },
        ].map(st => (
          <View key={st.label} style={s.statCard}>
            <Text style={[s.statVal, { color: st.color }]}>{st.val}</Text>
            <Text style={s.statLabel}>{st.label}</Text>
          </View>
        ))}
      </View>

      {/* List */}
      {loading ? (
        <View style={s.center}><ActivityIndicator size="large" color="#3b82f6" /></View>
      ) : filtered.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>📭</Text>
          <Text style={s.emptyTitle}>No consultations found</Text>
          <Text style={s.emptyText}>Try adjusting your filter or search</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {filtered.map(item => (
            <ConsultCard
              key={item._id}
              item={item}
              onChat={handleChat}
              onCancel={handleCancel}
              onReschedule={setRescheduleTarget}
              actionId={actionId}
            />
          ))}
        </ScrollView>
      )}

      {rescheduleTarget && (
        <RescheduleModal
          item={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          onDone={fetchData}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  backBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  refreshBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#eff6ff', borderWidth: 1.5, borderColor: '#bfdbfe', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },

  searchRow: { flexDirection: 'row', alignItems: 'center', margin: 16, marginBottom: 8, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1.5, borderColor: '#e2e8f0', paddingHorizontal: 14, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a' },

  tabsScroll: { maxHeight: 48, marginBottom: 4 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
  tabActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  tabTextActive: { color: '#fff' },

  statsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginVertical: 12 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', padding: 12, alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, color: '#64748b', fontWeight: '600', textAlign: 'center', marginTop: 2 },

  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9', padding: 14, shadowColor: '#0f172a', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardAppt: { borderLeftWidth: 4, borderLeftColor: '#3b82f6' },
  cardOpinion: { borderLeftWidth: 4, borderLeftColor: '#9333ea' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardLeft: { flex: 1 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 6 },
  typeText: { fontSize: 10, fontWeight: '700' },
  docName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  spec: { fontSize: 12, color: '#64748b', marginTop: 2 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  metaText: { fontSize: 12, color: '#64748b', fontWeight: '500' },

  actionRow: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  chatBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#10b981', borderRadius: 8, paddingVertical: 7, paddingHorizontal: 12 },
  chatBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  reschedBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#eff6ff', borderWidth: 1.5, borderColor: '#bfdbfe', borderRadius: 8, paddingVertical: 7, paddingHorizontal: 12 },
  reschedBtnText: { color: '#0ea5e9', fontWeight: '700', fontSize: 12 },
  cancelBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#fff1f2', borderWidth: 1.5, borderColor: '#fecdd3', borderRadius: 8, paddingVertical: 7, paddingHorizontal: 12 },
  cancelBtnText: { color: '#ef4444', fontWeight: '700', fontSize: 12 },
  disabledRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  disabledText: { color: '#94a3b8', fontSize: 12 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151' },
  emptyText: { fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 4 },

  overlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  modalSub: { fontSize: 13, color: '#64748b', marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1.5, borderColor: '#e2e8f0', padding: 12, fontSize: 14, color: '#0f172a', marginBottom: 16 },
  confirmBtn: { backgroundColor: '#3b82f6', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  confirmBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
