import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, ScrollView, Modal
} from 'react-native';
import {
  Search, Star, MapPin, Stethoscope, Clock, Building2,
  SlidersHorizontal, X, Award, BadgeCheck, ArrowRight, Navigation
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../styles/theme';
import api, { getDoctorsList, MOCK_MODE } from '../services/api';

const SPEC_ICONS = {
  'Cardiologist': '🫀', 'Dermatologist': '🧴', 'Neurologist': '🧠',
  'Orthopedic': '🦴', 'Gynecologist': '🩺', 'Pediatrician': '👶',
  'Psychiatrist': '💆', 'ENT': '👂', 'General Physician': '💊',
  'Dentist': '🦷', 'Radiologist': '🔬',
};

const FEE_RANGES = [
  { label: 'Any', min: 0, max: Infinity },
  { label: '<₹300', min: 0, max: 300 },
  { label: '₹300–600', min: 300, max: 600 },
  { label: '₹600–1000', min: 600, max: 1000 },
  { label: '₹1000+', min: 1000, max: Infinity },
];

const RATING_OPTIONS = [
  { label: 'Any', min: 0 },
  { label: '3★+', min: 3 },
  { label: '4★+', min: 4 },
  { label: '4.5★+', min: 4.5 },
];

const isAvailableNow = (from, to) => {
  if (!from || !to) return false;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = from.split(':').map(Number);
  const [eh, em] = to.split(':').map(Number);
  return cur >= sh * 60 + sm && cur <= eh * 60 + em;
};

function DoctorCard({ doc, onProfile, onBook }) {
  const avail = isAvailableNow(doc.fromTime, doc.toTime);
  const emoji = SPEC_ICONS[doc.specialization || doc.specialty] || '🩺';
  const fee = doc.feePerConsultation || doc.fee || 0;
  const rating = doc.averageRating || doc.rating || 0;
  const spec = doc.specialization || doc.specialty || '';

  return (
    <View style={styles.card}>
      {/* Top row */}
      <View style={styles.cardHeader}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>{emoji}</Text>
          </View>
          <View style={[styles.availDot, { backgroundColor: avail ? '#16a34a' : '#94a3b8' }]} />
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>{doc.name}</Text>
            {(doc.verifiedByAdmin === 'approved' || MOCK_MODE) && (
              <BadgeCheck size={15} color={COLORS.primary} />
            )}
          </View>
          <Text style={styles.specText}>{spec}</Text>
          <View style={styles.ratingRow}>
            <Star size={12} color="#f59e0b" fill="#f59e0b" />
            <Text style={styles.ratingVal}>{rating ? rating.toFixed(1) : 'New'}</Text>
            {doc.totalRatings > 0 && <Text style={styles.ratingCount}>({doc.totalRatings})</Text>}
          </View>
        </View>
      </View>

      {/* Chips */}
      <View style={styles.chipsRow}>
        {doc.experience > 0 && (
          <View style={styles.chip}>
            <Award size={10} color="#2563eb" />
            <Text style={styles.chipText}>{doc.experience}yr exp</Text>
          </View>
        )}
        {(doc.location || doc.hospital) && (
          <View style={[styles.chip, styles.chipRose]}>
            <MapPin size={10} color="#e11d48" />
            <Text style={[styles.chipText, { color: '#e11d48' }]} numberOfLines={1}>
              {doc.location || doc.hospital}
            </Text>
          </View>
        )}
      </View>

      {/* Hours */}
      {(doc.fromTime || doc.toTime) && (
        <View style={styles.hoursRow}>
          <Clock size={12} color={COLORS.textMuted} />
          <Text style={styles.hoursText}>{doc.fromTime || '09:00'} – {doc.toTime || '17:00'}</Text>
          <View style={[styles.availPill, { backgroundColor: avail ? '#dcfce7' : '#f1f5f9' }]}>
            <Text style={[styles.availText, { color: avail ? '#16a34a' : '#64748b' }]}>
              {avail ? 'Available' : 'Unavailable'}
            </Text>
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.feeLabel}>CONSULTATION</Text>
          <Text style={styles.feeVal}>₹{fee || '—'}</Text>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.profileBtn} onPress={() => onProfile(doc)}>
            <Text style={styles.profileBtnText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bookBtn, !avail && !MOCK_MODE && styles.bookBtnDisabled]}
            onPress={() => onBook(doc)}
            disabled={!avail && !MOCK_MODE}
          >
            <Text style={styles.bookBtnText}>Book</Text>
            <ArrowRight size={13} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function TopDoctorsScreen({ navigation }) {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSpec, setFilterSpec] = useState('');
  const [filterFeeIdx, setFilterFeeIdx] = useState(0);
  const [filterRatingIdx, setFilterRatingIdx] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await getDoctorsList();
      setDoctors(list);
      // Extract unique specializations
      const specs = [...new Set(list.map(d => d.specialization || d.specialty).filter(Boolean))];
      setSpecializations(specs);
      if (!MOCK_MODE) {
        try {
          const specRes = await api.get('/doctor/all-specializations');
          if (specRes.data?.data?.length) setSpecializations(specRes.data.data);
        } catch {}
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = doctors.filter(d => {
    const q = search.toLowerCase();
    const matchQ = !q || [d.name, d.specialization, d.specialty, d.location, d.hospital]
      .some(f => (f || '').toLowerCase().includes(q));
    const matchSpec = !filterSpec || (d.specialization || d.specialty) === filterSpec;
    const fee = d.feePerConsultation || d.fee || 0;
    const fr = FEE_RANGES[filterFeeIdx];
    const matchFee = fee >= fr.min && fee <= fr.max;
    const minR = RATING_OPTIONS[filterRatingIdx].min;
    const matchRating = !minR || (d.averageRating || d.rating || 0) >= minR;
    return matchQ && matchSpec && matchFee && matchRating;
  });

  const activeCount = [filterSpec, filterFeeIdx !== 0, filterRatingIdx !== 0].filter(Boolean).length;

  const clearAll = () => { setSearch(''); setFilterSpec(''); setFilterFeeIdx(0); setFilterRatingIdx(0); };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Hero ── */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Stethoscope size={12} color="#2563eb" />
          <Text style={styles.heroBadgeText}>Find a Doctor</Text>
        </View>
        <Text style={styles.heroTitle}>Find Your <Text style={styles.heroTitleBlue}>Specialist</Text></Text>
        <Text style={styles.heroSub}>
          {doctors.length > 0 ? `${doctors.length}+` : 'Top-rated'} verified doctors across India
        </Text>

        {/* Search */}
        <View style={styles.searchBar}>
          <Search size={16} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name, specialty, location..."
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
      </View>

      {/* ── Specialty chips ── */}
      {specializations.length > 0 && (
        <View style={styles.specChipsWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.specChips}>
            {specializations.slice(0, 8).map(s => (
              <TouchableOpacity
                key={s}
                onPress={() => setFilterSpec(filterSpec === s ? '' : s)}
                style={[styles.specChip, filterSpec === s && styles.specChipActive]}
              >
                <Text style={styles.specChipEmoji}>{SPEC_ICONS[s] || '🩺'}</Text>
                <Text style={[styles.specChipText, filterSpec === s && styles.specChipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
            {filterSpec && (
              <TouchableOpacity onPress={() => setFilterSpec('')} style={styles.clearChip}>
                <X size={12} color="#64748b" />
                <Text style={styles.clearChipText}>Clear</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}

      {/* ── Controls bar ── */}
      <View style={styles.controlsBar}>
        <TouchableOpacity
          style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
          onPress={() => setShowFilters(v => !v)}
        >
          <SlidersHorizontal size={14} color={showFilters ? COLORS.primary : COLORS.text} />
          <Text style={[styles.filterToggleText, showFilters && { color: COLORS.primary }]}>Filters</Text>
          {activeCount > 0 && <View style={styles.filterBadge}><Text style={styles.filterBadgeText}>{activeCount}</Text></View>}
        </TouchableOpacity>
        {activeCount > 0 && (
          <TouchableOpacity onPress={clearAll} style={styles.clearAllBtn}>
            <X size={12} color="#ef4444" />
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.resultsCount}><Text style={{ fontWeight: '700' }}>{filtered.length}</Text> found</Text>
      </View>

      {/* ── Filter Panel ── */}
      {showFilters && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterLabel}>Fee Range</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {FEE_RANGES.map((r, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setFilterFeeIdx(i)}
                style={[styles.pill, filterFeeIdx === i && styles.pillActive]}
              >
                <Text style={[styles.pillText, filterFeeIdx === i && styles.pillTextActive]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.filterLabel}>Min Rating</Text>
          <View style={styles.pillRow}>
            {RATING_OPTIONS.map((r, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setFilterRatingIdx(i)}
                style={[styles.pill, filterRatingIdx === i && styles.pillActive]}
              >
                <Text style={[styles.pillText, filterRatingIdx === i && styles.pillTextActive]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilters(false)}>
            <Text style={styles.applyBtnText}>Show {filtered.length} Results</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── List ── */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Finding specialists...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>No specialists found</Text>
          <Text style={styles.emptyText}>Try adjusting your search or clearing filters.</Text>
          {(search || activeCount > 0) && (
            <TouchableOpacity style={styles.clearAllBtn2} onPress={clearAll}>
              <Text style={styles.clearAllBtn2Text}>Clear All Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => (item._id || item.id)?.toString()}
          renderItem={({ item }) => (
            <DoctorCard
              doc={item}
              onProfile={doc => navigation.navigate('DoctorProfile', { doctor: doc })}
              onBook={doc => navigation.navigate('BookAppointment', {
                doctorId: doc._id || doc.id,
                doctor: doc,
              })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },

  // Hero
  hero: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 18,
    borderBottomWidth: 1.5, borderBottomColor: '#e2e8f0',
  },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#dbeafe',
    borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5,
    alignSelf: 'flex-start', marginBottom: 10,
  },
  heroBadgeText: { color: '#2563eb', fontSize: 12, fontWeight: '700' },
  heroTitle: { fontSize: 22, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5, marginBottom: 4 },
  heroTitleBlue: { color: '#2563eb' },
  heroSub: { color: '#64748b', fontSize: 13, fontWeight: '500', marginBottom: 14 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 14, paddingHorizontal: 14, height: 48,
  },
  searchInput: { flex: 1, color: '#0f172a', fontSize: 14 },

  // Spec chips
  specChipsWrap: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  specChips: { paddingHorizontal: 16, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  specChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6,
  },
  specChipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  specChipEmoji: { fontSize: 13 },
  specChipText: { color: '#475569', fontSize: 12, fontWeight: '700' },
  specChipTextActive: { color: '#ffffff' },
  clearChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fecaca',
    borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6,
  },
  clearChipText: { color: '#ef4444', fontSize: 12, fontWeight: '700' },

  // Controls bar
  controlsBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  filterToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  filterToggleActive: { borderColor: COLORS.primary, backgroundColor: '#eff6ff' },
  filterToggleText: { color: '#0f172a', fontSize: 13, fontWeight: '700' },
  filterBadge: {
    backgroundColor: COLORS.primary, borderRadius: 10,
    paddingHorizontal: 6, paddingVertical: 1,
  },
  filterBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  clearAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clearAllText: { color: '#ef4444', fontSize: 12, fontWeight: '700' },
  resultsCount: { marginLeft: 'auto', color: '#64748b', fontSize: 13 },

  // Filter panel
  filterPanel: {
    backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  filterLabel: { color: '#0f172a', fontSize: 13, fontWeight: '700', marginBottom: 8 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  pill: {
    backgroundColor: '#f1f5f9', borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 100, paddingHorizontal: 14, paddingVertical: 7,
  },
  pillActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  pillText: { color: '#475569', fontSize: 12, fontWeight: '700' },
  pillTextActive: { color: '#ffffff' },
  applyBtn: {
    backgroundColor: '#2563eb', borderRadius: 12,
    paddingVertical: 12, alignItems: 'center',
  },
  applyBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },

  // List
  listContent: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  loadingText: { color: '#64748b', marginTop: 12, fontSize: 14 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { color: '#0f172a', fontSize: 18, fontWeight: '800', marginBottom: 6 },
  emptyText: { color: '#64748b', fontSize: 14, textAlign: 'center' },
  clearAllBtn2: {
    marginTop: 14, backgroundColor: '#fee2e2', borderRadius: 100,
    paddingHorizontal: 20, paddingVertical: 10,
  },
  clearAllBtn2Text: { color: '#ef4444', fontWeight: '700', fontSize: 13 },

  // Doctor Card
  card: {
    backgroundColor: '#ffffff', borderRadius: 20,
    borderWidth: 1.5, borderColor: '#e2e8f0',
    padding: 16, marginBottom: 14,
    shadowColor: '#0f172a', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04, shadowRadius: 12, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 12 },
  avatarWrap: { position: 'relative' },
  avatarCircle: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 26 },
  availDot: {
    position: 'absolute', bottom: -2, right: -2,
    width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#fff',
  },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  nameText: { color: '#0f172a', fontSize: 16, fontWeight: '800', flex: 1 },
  specText: { color: '#2563eb', fontSize: 13, fontWeight: '600', marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingVal: { color: '#d97706', fontSize: 13, fontWeight: '700' },
  ratingCount: { color: '#94a3b8', fontSize: 12 },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#eff6ff', borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  chipRose: { backgroundColor: '#fff1f2' },
  chipText: { color: '#2563eb', fontSize: 11, fontWeight: '700' },

  hoursRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#f8fafc', borderRadius: 10, padding: 10, marginBottom: 12,
  },
  hoursText: { color: '#475569', fontSize: 12, fontWeight: '600', flex: 1 },
  availPill: { borderRadius: 100, paddingHorizontal: 8, paddingVertical: 3 },
  availText: { fontSize: 11, fontWeight: '700' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  feeLabel: { color: '#94a3b8', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  feeVal: { color: '#0f172a', fontSize: 18, fontWeight: '800', marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: 8 },
  profileBtn: {
    borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 10,
    paddingVertical: 9, paddingHorizontal: 16, backgroundColor: '#f8fafc',
  },
  profileBtnText: { color: '#475569', fontSize: 13, fontWeight: '700' },
  bookBtn: {
    backgroundColor: '#2563eb', borderRadius: 10,
    paddingVertical: 9, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  bookBtnDisabled: { backgroundColor: '#cbd5e1' },
  bookBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
});
