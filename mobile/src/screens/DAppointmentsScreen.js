import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList,
  TouchableOpacity, ActivityIndicator, TextInput, Modal
} from 'react-native';
import {
  ArrowLeft, Search, Calendar, Clock, Mail,
  CheckCircle2, XCircle, Users, History, X, User
} from 'lucide-react-native';
import api, { getAppointments, MOCK_MODE } from '../services/api';
import { triggerLocalNotification } from '../services/notifications';

// ── Helpers ─────────────────────────────────────────────────────────────────
const normalizeStatus = (s) => {
  const v = (s || '').toLowerCase().trim();
  if (v === 'accepted' || v === 'accept') return 'accepted';
  if (v === 'rejected' || v === 'reject') return 'rejected';
  return 'pending';
};

const isPresentOrFuture = (date, time) => {
  if (!date) return true;
  try {
    const [y, m, d] = date.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    if (time) {
      const [h, min] = time.split(':').map(Number);
      dt.setHours(h, min);
    }
    return dt >= new Date();
  } catch { return true; }
};

const formatDate = (date, time) => {
  if (!date) return 'N/A';
  try {
    const [y, m, d] = date.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const base = `${String(d).padStart(2,'0')} ${months[m-1]} ${y}`;
    return time ? `${base}, ${time}` : base;
  } catch { return `${date}${time ? ` ${time}` : ''}`; }
};

const getInitials = (name) => {
  if (!name) return 'P';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const STATUS_COLORS = {
  pending:  { bg: '#fffbeb', text: '#b45309', bar: '#f59e0b' },
  accepted: { bg: '#ecfdf5', text: '#065f46', bar: '#10b981' },
  rejected: { bg: '#fef2f2', text: '#991b1b', bar: '#ef4444' },
};

// ── Appointment Card ─────────────────────────────────────────────────────────
function AppCard({ appt, onAccept, onReject, actionLoading, actionId }) {
  const status = normalizeStatus(appt.status);
  const sc = STATUS_COLORS[status];
  const patientName = appt.patientName ||
    (typeof appt.patientId === 'object' ? appt.patientId?.name : null) || 'Patient';
  const patientEmail = typeof appt.patientId === 'object' ? appt.patientId?.email : null;
  const isPast = !isPresentOrFuture(appt.date, appt.time);
  const isLoading = actionLoading && actionId === (appt._id || appt.id);

  return (
    <View style={[styles.card, isPast && styles.cardPast]}>
      {/* Left status bar */}
      <View style={[styles.cardBar, { backgroundColor: sc.bar }]} />

      <View style={styles.cardContent}>
        {/* Header row: avatar + name + status badge */}
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(patientName)}</Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName} numberOfLines={1}>{patientName}</Text>
            <Text style={styles.timeAgo} numberOfLines={1}>
              {appt.createdAt
                ? new Date(appt.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                : '—'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
            <Text style={[styles.statusBadgeText, { color: sc.text }]}>
              {status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Info rows */}
        <View style={styles.infoRow}>
          <User size={14} color="#3b82f6" style={{ marginRight: 10 }} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Medical Problem</Text>
            <Text style={styles.infoValue} numberOfLines={2}>
              {appt.problem || 'Not specified'}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Calendar size={14} color="#3b82f6" style={{ marginRight: 10 }} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Appointment Schedule</Text>
            <Text style={styles.infoValue}>{formatDate(appt.date, appt.time)}</Text>
          </View>
        </View>

        {patientEmail && (
          <View style={styles.infoRow}>
            <Mail size={14} color="#3b82f6" style={{ marginRight: 10 }} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Patient Contact</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{patientEmail}</Text>
            </View>
          </View>
        )}

        {/* Action buttons — only for pending & future */}
        {status === 'pending' && !isPast && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.rejectBtn, isLoading && { opacity: 0.6 }]}
              onPress={() => onReject(appt._id || appt.id)}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator size="small" color="#ef4444" /> : (
                <>
                  <XCircle size={14} color="#ef4444" />
                  <Text style={styles.rejectBtnText}>Reject</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.acceptBtn, isLoading && { opacity: 0.6 }]}
              onPress={() => onAccept(appt._id || appt.id)}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator size="small" color="#fff" /> : (
                <>
                  <CheckCircle2 size={14} color="#fff" />
                  <Text style={styles.acceptBtnText}>Accept</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

// ── Main Screen ─────────────────────────────────────────────────────────────
export default function DAppointmentsScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionId, setActionId] = useState(null);

  const FILTERS = [
    { key: 'all',      label: 'All' },
    { key: 'pending',  label: 'Pending' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'history',  label: 'History' },
  ];

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const list = await getAppointments();
      setAppointments(Array.isArray(list) ? list : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAction = async (id, action) => {
    setActionLoading(true);
    setActionId(id);
    try {
      if (MOCK_MODE) {
        await new Promise(r => setTimeout(r, 700));
        setAppointments(prev => prev.map(a =>
          (a._id || a.id) === id ? { ...a, status: action === 'accept' ? 'accepted' : 'rejected' } : a
        ));
      } else {
        const endpoint = action === 'accept'
          ? `/doctor/accept-appointment/${id}`
          : `/doctor/reject-appointment/${id}`;
        const res = await api.put(endpoint);
        if (res.data?.success) {
          const updated = res.data.data;
          setAppointments(prev => prev.map(a =>
            (a._id || a.id) === (updated._id || id) ? { ...a, status: updated.status } : a
          ));
        }
      }
      triggerLocalNotification(
        action === 'accept' ? 'Appointment Accepted ✅' : 'Appointment Rejected ❌',
        `The appointment has been ${action === 'accept' ? 'accepted' : 'rejected'} successfully.`
      );
    } catch (err) {
      console.error(err);
      triggerLocalNotification('Action Failed', err?.response?.data?.message || 'Could not update appointment.');
    } finally {
      setActionLoading(false);
      setActionId(null);
    }
  };

  // Stats
  const stats = {
    total:    appointments.filter(a => isPresentOrFuture(a.date, a.time)).length,
    pending:  appointments.filter(a => normalizeStatus(a.status) === 'pending'  && isPresentOrFuture(a.date, a.time)).length,
    accepted: appointments.filter(a => normalizeStatus(a.status) === 'accepted' && isPresentOrFuture(a.date, a.time)).length,
    rejected: appointments.filter(a => normalizeStatus(a.status) === 'rejected' && isPresentOrFuture(a.date, a.time)).length,
  };

  // Filtered list
  const filtered = appointments.filter(appt => {
    const status = normalizeStatus(appt.status);
    const isFuture = isPresentOrFuture(appt.date, appt.time);
    const filterMatch =
      filter === 'all'     ? isFuture :
      filter === 'history' ? true :
      (status === filter && isFuture);

    const patientName = appt.patientName ||
      (typeof appt.patientId === 'object' ? appt.patientId?.name : '') || '';
    const q = search.toLowerCase();
    const searchMatch = !q || (
      patientName.toLowerCase().includes(q) ||
      (appt.problem || '').toLowerCase().includes(q) ||
      (typeof appt.patientId === 'object' ? appt.patientId?.email || '' : '').toLowerCase().includes(q)
    );
    return filterMatch && searchMatch;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointments</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Page title */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Patient Queue</Text>
          <Text style={styles.pageSub}>Manage your patient appointments efficiently</Text>
        </View>

        {/* Stats bar */}
        <View style={styles.statsRow}>
          {[
            { label: 'Current', count: stats.total,    color: '#3b82f6', bg: '#eff6ff' },
            { label: 'Pending', count: stats.pending,  color: '#d97706', bg: '#fffbeb' },
            { label: 'Accepted',count: stats.accepted, color: '#059669', bg: '#ecfdf5' },
            { label: 'Rejected',count: stats.rejected, color: '#dc2626', bg: '#fef2f2' },
          ].map(s => (
            <View key={s.label} style={[styles.statCard, { borderTopColor: s.color }]}>
              <Text style={[styles.statCount, { color: s.color }]}>{s.count}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Controls: search + filter */}
        <View style={styles.controls}>
          {/* Search */}
          <View style={styles.searchBox}>
            <Search size={16} color="#94a3b8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search patient or problem..."
              placeholderTextColor="#94a3b8"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <X size={16} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
          {/* Filter tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
            <View style={styles.filters}>
              {FILTERS.map(f => (
                <TouchableOpacity
                  key={f.key}
                  onPress={() => setFilter(f.key)}
                  style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
                >
                  <Text style={[styles.filterBtnText, filter === f.key && styles.filterBtnTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Loading appointments...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No appointments found</Text>
            <Text style={styles.emptyText}>
              {search || filter !== 'all'
                ? 'Try adjusting your search or filter'
                : filter === 'history'
                  ? 'You have no historical appointments'
                  : 'You have no current appointments'}
            </Text>
          </View>
        ) : (
          filtered.map(appt => (
            <AppCard
              key={(appt._id || appt.id)?.toString() || Math.random().toString()}
              appt={appt}
              onAccept={(id) => handleAction(id, 'accept')}
              onReject={(id) => handleAction(id, 'reject')}
              actionLoading={actionLoading}
              actionId={actionId}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: '#ffffff', borderBottomWidth: 1.5, borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: '#0f172a', fontSize: 18, fontWeight: '700' },

  scroll: { padding: 16, paddingBottom: 40 },

  pageHeader: { marginBottom: 16 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: '#1e293b', letterSpacing: -0.5 },
  pageSub: { color: '#64748b', fontSize: 13, fontWeight: '500', marginTop: 2 },

  // Stats bar
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: '#ffffff', borderRadius: 14,
    borderWidth: 1, borderColor: '#e2e8f0',
    borderTopWidth: 3, padding: 12, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02, shadowRadius: 4, elevation: 1,
  },
  statCount: { fontSize: 22, fontWeight: '800', marginBottom: 2 },
  statLabel: { color: '#64748b', fontSize: 10, fontWeight: '700', letterSpacing: 0.4 },

  // Controls
  controls: {
    backgroundColor: '#ffffff', borderRadius: 18,
    borderWidth: 1, borderColor: '#f1f5f9', padding: 12,
    marginBottom: 16, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03, shadowRadius: 6, elevation: 2,
  },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 12, paddingHorizontal: 12, height: 44,
  },
  searchIcon: { flexShrink: 0 },
  searchInput: { flex: 1, color: '#1e293b', fontSize: 14 },
  filtersScroll: {},
  filters: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 4, gap: 4 },
  filterBtn: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10,
  },
  filterBtnActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  filterBtnText: { color: '#64748b', fontSize: 13, fontWeight: '600' },
  filterBtnTextActive: { color: '#3b82f6' },

  // Center / Empty
  center: { alignItems: 'center', paddingVertical: 60 },
  loadingText: { color: '#64748b', marginTop: 12, fontSize: 14 },
  emptyState: {
    alignItems: 'center', paddingVertical: 50,
    backgroundColor: '#ffffff', borderRadius: 20,
    borderWidth: 2, borderColor: '#e2e8f0', borderStyle: 'dashed',
  },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { color: '#374151', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptyText: { color: '#6b7280', fontSize: 13, textAlign: 'center', paddingHorizontal: 20 },

  // Appointment Card
  card: {
    backgroundColor: '#ffffff', borderRadius: 20,
    borderWidth: 1, borderColor: '#f1f5f9',
    marginBottom: 14, flexDirection: 'row', overflow: 'hidden',
    shadowColor: '#0f172a', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04, shadowRadius: 12, elevation: 2,
  },
  cardPast: { opacity: 0.75 },
  cardBar: { width: 5 },
  cardContent: { flex: 1, padding: 16 },

  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#3b82f6', shadowOpacity: 0.25, shadowRadius: 6, elevation: 3,
  },
  avatarText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  patientInfo: { flex: 1, minWidth: 0 },
  patientName: { color: '#1e293b', fontSize: 16, fontWeight: '700' },
  timeAgo: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  infoRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#f8fafc', borderRadius: 10, padding: 10, marginBottom: 8,
  },
  infoContent: { flex: 1 },
  infoLabel: { color: '#64748b', fontSize: 11, fontWeight: '600', marginBottom: 2 },
  infoValue: { color: '#1e293b', fontSize: 13, fontWeight: '500', lineHeight: 18 },

  actionRow: {
    flexDirection: 'row', gap: 10,
    borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12, marginTop: 4,
  },
  rejectBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#fef2f2', borderWidth: 1.5, borderColor: '#fecaca',
    borderRadius: 12, paddingVertical: 11,
  },
  rejectBtnText: { color: '#ef4444', fontWeight: '800', fontSize: 14 },
  acceptBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#10b981', borderRadius: 12, paddingVertical: 11,
    shadowColor: '#10b981', shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  acceptBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
});
