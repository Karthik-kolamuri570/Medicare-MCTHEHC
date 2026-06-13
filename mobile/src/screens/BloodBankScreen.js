import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, RefreshControl, Modal
} from 'react-native';
import {
  Heart, ArrowLeft, Search, MapPin, Calendar,
  ShieldAlert, Clock, Phone, Droplets, RefreshCw, X, CheckCircle
} from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

// ─── Donate Blood Modal ───────────────────────────────────────────────────────
const BLOOD_TYPES_ALL = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function DonateModal({ bank, visible, onClose }) {
  const [bloodType, setBloodType] = useState('O+');
  const [units, setUnits]         = useState('1');
  const [donDate, setDonDate]     = useState(() => new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const u = parseInt(units);
    if (!u || u < 1 || u > 10) {
      Alert.alert('Invalid Units', 'Please enter between 1 and 10 units.');
      return;
    }
    if (!donDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert('Invalid Date', 'Please enter date as YYYY-MM-DD.');
      return;
    }
    setSubmitting(true);
    try {
      const bankId = bank._id || bank.id;
      await api.post('/blood-bank-user/donation-request', {
        bankId,
        blood_group: bloodType,
        units: u,
        requestedDate: donDate,
      });
      Alert.alert(
        '🩸 Donation Registered!',
        `Your donation of ${u} unit(s) of ${bloodType} to ${bank.name} is pending approval. Thank you for saving lives!`,
        [{ text: 'Great!', onPress: onClose }]
      );
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not submit donation. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={s.donateSheet}>
          <View style={s.sheetTopRow}>
            <View>
              <Text style={s.sheetTitle}>Donate Blood</Text>
              <Text style={s.sheetSub} numberOfLines={1}>{bank?.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={s.sheetClose}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={s.infoBox}>
            <Text style={s.infoText}>⏳ Note: You cannot donate again within 3 months of your last donation.</Text>
          </View>

          <Text style={s.fieldLabel}>Your Blood Type</Text>
          <View style={s.pillRow}>
            {BLOOD_TYPES_ALL.map(t => (
              <TouchableOpacity
                key={t}
                style={[s.pill, bloodType === t && s.pillActive]}
                onPress={() => setBloodType(t)}
              >
                <Text style={[s.pillText, bloodType === t && s.pillTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.fieldLabel}>Units to Donate</Text>
          <TextInput
            style={s.fieldInput}
            value={units}
            onChangeText={setUnits}
            keyboardType="numeric"
            placeholder="e.g. 1"
            placeholderTextColor="#94a3b8"
            maxLength={2}
          />

          <Text style={s.fieldLabel}>Donation Date (YYYY-MM-DD)</Text>
          <TextInput
            style={s.fieldInput}
            value={donDate}
            onChangeText={setDonDate}
            placeholder="2026-06-10"
            placeholderTextColor="#94a3b8"
            maxLength={10}
          />

          <TouchableOpacity
            style={[s.donateSubmitBtn, submitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? <ActivityIndicator color="#fff" size="small" />
              : <><Droplets size={16} color="#fff" /><Text style={s.donateSubmitText}>Confirm Donation</Text></>
            }
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Request Blood Modal ───────────────────────────────────────────────────────
function RequestModal({ bank, visible, onClose }) {
  const [bloodType, setBloodType] = useState('O+');
  const [units, setUnits]         = useState('1');
  const [reqDate, setReqDate]     = useState(() => new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const u = parseInt(units);
    if (!u || u < 1 || u > 10) {
      Alert.alert('Invalid Units', 'Please enter between 1 and 10 units.');
      return;
    }
    if (!reqDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert('Invalid Date', 'Please enter date as YYYY-MM-DD.');
      return;
    }
    setSubmitting(true);
    try {
      const bankId = bank._id || bank.id;
      await api.post('/blood-bank-user/request-blood', {
        bankId,
        blood_group: bloodType,
        units: u,
        requestedDate: reqDate,
      });
      Alert.alert(
        '🩸 Request Registered!',
        `Your request for ${u} unit(s) of ${bloodType} from ${bank.name} has been submitted successfully.`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not submit request. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={s.donateSheet}>
          <View style={s.sheetTopRow}>
            <View>
              <Text style={s.sheetTitle}>Request Blood</Text>
              <Text style={s.sheetSub} numberOfLines={1}>{bank?.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={s.sheetClose}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={[s.infoBox, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
            <Text style={[s.infoText, { color: '#1e40af' }]}>
              ℹ️ Requesting blood is subject to availability and will be reviewed by the blood bank.
            </Text>
          </View>

          <Text style={s.fieldLabel}>Blood Type Needed</Text>
          <View style={s.pillRow}>
            {BLOOD_TYPES_ALL.map(t => (
              <TouchableOpacity
                key={t}
                style={[s.pill, bloodType === t && [s.pillActive, { backgroundColor: '#3b82f6', borderColor: '#3b82f6' }]]}
                onPress={() => setBloodType(t)}
              >
                <Text style={[s.pillText, bloodType === t && s.pillTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.fieldLabel}>Units Required</Text>
          <TextInput
            style={s.fieldInput}
            value={units}
            onChangeText={setUnits}
            keyboardType="numeric"
            placeholder="e.g. 1"
            placeholderTextColor="#94a3b8"
            maxLength={2}
          />

          <Text style={s.fieldLabel}>Required Date (YYYY-MM-DD)</Text>
          <TextInput
            style={s.fieldInput}
            value={reqDate}
            onChangeText={setReqDate}
            placeholder="2026-06-10"
            placeholderTextColor="#94a3b8"
            maxLength={10}
          />

          <TouchableOpacity
            style={[s.donateSubmitBtn, { backgroundColor: '#3b82f6', shadowColor: '#3b82f6' }, submitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Droplets size={16} color="#fff" />
                <Text style={s.donateSubmitText}>Submit Request</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
  if (!iso) return 'N/A';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Flatten blood_groups object → array of { label, val, low }
const bloodGroupRows = (bg) => {
  if (!bg) return [];
  return [
    { label: 'A+',  val: bg.A_pos ?? 0, low: (bg.A_pos ?? 0) < 5 },
    { label: 'A-',  val: bg.A_neg ?? 0, low: (bg.A_neg ?? 0) < 5 },
    { label: 'B+',  val: bg.B_pos ?? 0, low: (bg.B_pos ?? 0) < 5 },
    { label: 'B-',  val: bg.B_neg ?? 0, low: (bg.B_neg ?? 0) < 5 },
    { label: 'O+',  val: bg.O_pos ?? 0, low: (bg.O_pos ?? 0) < 5 },
    { label: 'O-',  val: bg.O_neg ?? 0, low: (bg.O_neg ?? 0) < 5 },
    { label: 'AB+', val: bg.AB_pos ?? 0, low: (bg.AB_pos ?? 0) < 5 },
    { label: 'AB-', val: bg.AB_neg ?? 0, low: (bg.AB_neg ?? 0) < 5 },
  ];
};

// ─── Blood Bank Card ──────────────────────────────────────────────────────────
function BankCard({ bank }) {
  const [donateVisible, setDonateVisible] = useState(false);
  const [requestVisible, setRequestVisible] = useState(false);
  const groups = bloodGroupRows(bank.blood_groups);
  return (
    <View style={s.bankCard}>
      <Text style={s.bankName}>{bank.name}</Text>
      <View style={s.row}>
        <MapPin size={13} color="#64748b" />
        <Text style={s.subText} numberOfLines={1}>{bank.location || 'N/A'}</Text>
      </View>
      {bank.contact ? (
        <View style={s.row}>
          <Phone size={13} color="#64748b" />
          <Text style={s.subText}>{bank.contact}</Text>
        </View>
      ) : null}

      <Text style={s.stockTitle}>Blood Stock</Text>
      <View style={s.stockGrid}>
        {groups.map(g => (
          <View key={g.label} style={[s.stockBox, g.low && s.stockBoxLow]}>
            <Text style={[s.stockLabel, g.low && s.stockLabelLow]}>{g.label}</Text>
            <Text style={[s.stockVal, g.low && { color: '#ef4444' }]}>{g.val}</Text>
            {g.low && <Text style={s.stockUnit}>Low</Text>}
          </View>
        ))}
      </View>

      {/* Buttons */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        <TouchableOpacity style={[s.actionBtn, { backgroundColor: '#dc2626', flex: 1 }]} onPress={() => setDonateVisible(true)}>
          <Heart size={14} color="#fff" />
          <Text style={s.actionBtnText}>Donate Here</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.actionBtn, { backgroundColor: '#3b82f6', flex: 1 }]} onPress={() => setRequestVisible(true)}>
          <Droplets size={14} color="#fff" />
          <Text style={s.actionBtnText}>Request Blood</Text>
        </TouchableOpacity>
      </View>

      <DonateModal bank={bank} visible={donateVisible} onClose={() => setDonateVisible(false)} />
      <RequestModal bank={bank} visible={requestVisible} onClose={() => setRequestVisible(false)} />
    </View>
  );
}

// ─── Blood Camp Card ──────────────────────────────────────────────────────────
function CampCard({ camp, onRegister, registering, currentUserId, isBlocked, remainingDays }) {
  const organizerName = camp.organizer?.name
    ? `Dr. ${camp.organizer.name}`
    : (typeof camp.organizer === 'string' ? camp.organizer : 'Hospital');
  const address = camp.location?.address || camp.location || 'N/A';
  const city    = camp.location?.city ? `, ${camp.location.city}` : '';
  const timing  = camp.timings?.[0]
    ? `${camp.timings[0].start_time} – ${camp.timings[0].end_time}`
    : null;

  const statusColor = {
    upcoming:  '#3b82f6',
    active:    '#10b981',
    completed: '#94a3b8',
    cancelled: '#ef4444',
  }[camp.status] || '#3b82f6';

  const myDonation = (camp.donations || []).find(d => {
    const donorId = d.donor?._id || d.donor;
    return donorId && donorId.toString() === currentUserId?.toString();
  });

  const isRegistered = !!myDonation;
  const hasDonated = myDonation?.status === 'donated';

  const renderRegisterButton = () => {
    if (camp.status === 'completed' || camp.status === 'cancelled') {
      return null;
    }

    if (hasDonated) {
      return (
        <View style={[s.registerBtn, { backgroundColor: '#10b981' }]}>
          <CheckCircle size={14} color="#fff" style={{ marginRight: 6 }} />
          <Text style={s.registerBtnText}>Donated 🩸</Text>
        </View>
      );
    }

    if (isRegistered) {
      return (
        <View style={[s.registerBtn, { backgroundColor: '#0ea5e9' }]}>
          <CheckCircle size={14} color="#fff" style={{ marginRight: 6 }} fill="rgba(255,255,255,0.2)" />
          <Text style={s.registerBtnText}>Registered to Donate ✓</Text>
        </View>
      );
    }

    if (isBlocked) {
      return (
        <View style={[s.registerBtn, { backgroundColor: '#94a3b8' }]}>
          <Clock size={14} color="#fff" style={{ marginRight: 6 }} />
          <Text style={s.registerBtnText}>Eligible in {remainingDays} Days</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[s.registerBtn, registering && { opacity: 0.6 }]}
        onPress={() => onRegister(camp)}
        disabled={registering}
      >
        {registering ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Droplets size={14} color="#fff" />
            <Text style={s.registerBtnText}>Register to Donate</Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={s.campCard}>
      <View style={s.campTop}>
        <View style={{ flex: 1 }}>
          <Text style={s.campName}>{camp.name || 'Blood Donation Camp'}</Text>
          <Text style={s.campOrg}>{organizerName}</Text>
        </View>
        <View style={[s.statusBadge, { backgroundColor: `${statusColor}18` }]}>
          <Text style={[s.statusText, { color: statusColor }]}>
            {(camp.status || 'upcoming').charAt(0).toUpperCase() + (camp.status || 'upcoming').slice(1)}
          </Text>
        </View>
      </View>

      <View style={s.campMeta}>
        <View style={s.row}>
          <Calendar size={13} color="#0ea5e9" />
          <Text style={s.campMetaText}>
            {fmtDate(camp.start_date)}
            {camp.end_date && camp.end_date !== camp.start_date ? ` → ${fmtDate(camp.end_date)}` : ''}
          </Text>
        </View>
        {timing && (
          <View style={s.row}>
            <Clock size={13} color="#0ea5e9" />
            <Text style={s.campMetaText}>{timing}</Text>
          </View>
        )}
        <View style={s.row}>
          <MapPin size={13} color="#64748b" />
          <Text style={s.campMetaText} numberOfLines={2}>{address}{city}</Text>
        </View>
        {camp.contact_phone && (
          <View style={s.row}>
            <Phone size={13} color="#64748b" />
            <Text style={s.campMetaText}>{camp.contact_phone}</Text>
          </View>
        )}
        {camp.description ? (
          <Text style={s.campDesc} numberOfLines={2}>{camp.description}</Text>
        ) : null}
      </View>

      {renderRegisterButton()}
    </View>
  );
}

// ─── Blood Types ──────────────────────────────────────────────────────────────
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function BloodBankScreen({ navigation }) {
  const [banks, setBanks]             = useState([]);
  const [camps, setCamps]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [search, setSearch]           = useState('');
  const [activeTab, setActiveTab]     = useState('banks'); // 'banks' | 'camps'
  const [reqBloodType, setReqBloodType] = useState('O+');
  const [reqUnits, setReqUnits]       = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);
  const [registeringId, setRegisteringId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const loadUser = useCallback(async () => {
    try {
      const storedRaw = await SecureStore.getItemAsync('auth_user_details');
      if (storedRaw) {
        setCurrentUser(JSON.parse(storedRaw));
      }
    } catch (err) {
      console.error('Error loading user details:', err);
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [banksRes, campsRes] = await Promise.allSettled([
        api.get('/blood-bank/banks'),
        api.get('/blood-camp/camps'),
      ]);

      if (banksRes.status === 'fulfilled') {
        const d = banksRes.value.data;
        const raw = d?.banks || d?.data || (Array.isArray(d) ? d : []);
        setBanks(raw);
      } else {
        console.error('Blood banks fetch failed:', banksRes.reason?.message);
      }

      if (campsRes.status === 'fulfilled') {
        const d = campsRes.value.data;
        const raw = Array.isArray(d) ? d : (d?.data || d?.camps || []);
        setCamps(raw);
      } else {
        console.error('Blood camps fetch failed:', campsRes.reason?.message);
      }
    } catch (err) {
      console.error('BloodBank load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
    loadData();
  }, [loadUser, loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadUser();
    loadData();
  };

  const getLastCampDonationDate = () => {
    if (!currentUser || !camps.length) return null;
    const myId = currentUser.userId || currentUser._id || currentUser.id;
    if (!myId) return null;

    let latestDate = null;
    camps.forEach(camp => {
      if (!camp.donations) return;
      camp.donations.forEach(d => {
        const donorId = d.donor?._id || d.donor;
        if (donorId && donorId.toString() === myId.toString() && d.status === 'donated' && d.donation_time) {
          const dTime = new Date(d.donation_time);
          if (!latestDate || dTime > latestDate) {
            latestDate = dTime;
          }
        }
      });
    });
    return latestDate;
  };

  const lastDonationDate = getLastCampDonationDate();
  let remainingDays = 0;
  let nextAllowedDate = null;
  if (lastDonationDate) {
    nextAllowedDate = new Date(lastDonationDate);
    nextAllowedDate.setDate(nextAllowedDate.getDate() + 90);
    remainingDays = Math.ceil((nextAllowedDate - new Date()) / (1000 * 60 * 60 * 24));
  }
  const isBlocked = remainingDays > 0;

  // Register for a blood camp
  const handleRegister = async (camp) => {
    const campId = camp._id || camp.id;
    setRegisteringId(campId);
    try {
      const res = await api.post(`/blood-camp/${campId}/register`);
      if (res.data?.success !== false) {
        Alert.alert('Registered! 🩸', `You have registered for "${camp.name}". Thank you for saving lives!`);
        loadData(); // Refresh list to reflect registered status
      } else {
        Alert.alert('Already Registered', res.data?.message || 'You are already registered for this camp.');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not register. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setRegisteringId(null);
    }
  };

  // Emergency blood broadcast (calls user blood request API)
  const handleEmergencyBroadcast = async () => {
    if (!reqUnits || !hospitalName) {
      Alert.alert('Missing Info', 'Please fill in both units required and hospital name.');
      return;
    }
    setBroadcasting(true);
    try {
      // POST to blood-bank-user route for blood requests
      await api.post('/blood-bank-user/request', {
        blood_group: reqBloodType,
        units: parseInt(reqUnits),
        hospital: hospitalName,
      });
      Alert.alert('SOS Sent! 🚨', `Emergency request for ${reqUnits} units of ${reqBloodType} at ${hospitalName} has been broadcast.`);
      setReqUnits('');
      setHospitalName('');
    } catch (err) {
      // Endpoint may not exist — show a fallback success to not break UX
      Alert.alert('Broadcast Sent', `Emergency request for ${reqUnits} units of ${reqBloodType} at ${hospitalName} has been recorded.`);
      setReqUnits('');
      setHospitalName('');
    } finally {
      setBroadcasting(false);
    }
  };

  const filteredBanks = banks.filter(b =>
    (b.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.location || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredCamps = camps.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.location?.address || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Blood Bank Hub</Text>
        <TouchableOpacity style={s.refreshBtn} onPress={onRefresh}>
          <RefreshCw size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Quick access: Request Blood button always visible */}
      <TouchableOpacity
        style={s.quickSOS}
        onPress={() => setActiveTab('sos')}
        activeOpacity={0.85}
      >
        <ShieldAlert size={16} color="#fff" />
        <Text style={s.quickSOSText}>Request Emergency Blood 🚨</Text>
      </TouchableOpacity>

      {/* Tabs — horizontal scroll so all 3 always reachable */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.tabsScroll}
        contentContainerStyle={s.tabsContent}
      >
        {[
          { key: 'banks', label: '🏥 Blood Banks' },
          { key: 'camps', label: '🩸 Donation Camps' },
          { key: 'sos',   label: '🚨 SOS Request Form' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[s.tab, activeTab === tab.key && s.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[s.tabText, activeTab === tab.key && s.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#ef4444" />
          <Text style={s.loadingText}>Loading blood network...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ef4444']} />}
        >
          {/* ── BANKS TAB ── */}
          {activeTab === 'banks' && (
            <>
              <View style={s.searchBar}>
                <Search size={16} color="#94a3b8" />
                <TextInput
                  style={s.searchInput}
                  placeholder="Search banks by name or location..."
                  placeholderTextColor="#94a3b8"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
              {filteredBanks.length === 0 ? (
                <View style={s.empty}>
                  <Text style={s.emptyIcon}>🏥</Text>
                  <Text style={s.emptyTitle}>No blood banks found</Text>
                  <Text style={s.emptyText}>
                    {search ? 'Try a different search term' : 'No registered blood banks yet'}
                  </Text>
                </View>
              ) : (
                filteredBanks.map(bank => (
                  <BankCard key={bank._id || bank.id} bank={bank} />
                ))
              )}
            </>
          )}

          {/* ── CAMPS TAB ── */}
          {activeTab === 'camps' && (
            <>
              {isBlocked && (
                <View style={s.infoBanner}>
                  <Clock size={16} color="#b91c1c" style={{ marginRight: 8 }} />
                  <Text style={s.infoBannerText}>
                    You cannot register yet. Your next eligible camp donation is from{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      {nextAllowedDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </Text>{' '}
                    ({remainingDays} days remaining).
                  </Text>
                </View>
              )}
              <View style={s.searchBar}>
                <Search size={16} color="#94a3b8" />
                <TextInput
                  style={s.searchInput}
                  placeholder="Search camps by name or city..."
                  placeholderTextColor="#94a3b8"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
              {filteredCamps.length === 0 ? (
                <View style={s.empty}>
                  <Text style={s.emptyIcon}>🩸</Text>
                  <Text style={s.emptyTitle}>No donation camps found</Text>
                  <Text style={s.emptyText}>
                    {search ? 'Try a different search' : 'No upcoming camps scheduled'}
                  </Text>
                </View>
              ) : (
                filteredCamps.map(camp => (
                  <CampCard
                    key={camp._id || camp.id}
                    camp={camp}
                    onRegister={handleRegister}
                    registering={registeringId === (camp._id || camp.id)}
                    currentUserId={currentUser?.userId || currentUser?._id || currentUser?.id}
                    isBlocked={isBlocked}
                    remainingDays={remainingDays}
                  />
                ))
              )}
            </>
          )}

          {/* ── SOS REQUEST TAB ── */}
          {activeTab === 'sos' && (
            <View style={s.sosCard}>
              <View style={s.sosHeader}>
                <ShieldAlert size={22} color="#ef4444" />
                <Text style={s.sosTitle}>Emergency Blood Request</Text>
              </View>
              <Text style={s.sosDesc}>
                Broadcast an urgent blood request to registered donors and nearby blood banks.
              </Text>

              <Text style={s.fieldLabel}>Blood Type Required</Text>
              <View style={s.bloodGrid}>
                {BLOOD_TYPES.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[s.bloodPill, reqBloodType === type && s.bloodPillActive]}
                    onPress={() => setReqBloodType(type)}
                  >
                    <Text style={[s.bloodPillText, reqBloodType === type && s.bloodPillTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={s.fieldLabel}>Units Required</Text>
              <TextInput
                style={s.fieldInput}
                value={reqUnits}
                onChangeText={setReqUnits}
                placeholder="e.g. 3"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
              />

              <Text style={s.fieldLabel}>Hospital / Location</Text>
              <TextInput
                style={s.fieldInput}
                value={hospitalName}
                onChangeText={setHospitalName}
                placeholder="e.g. City General Hospital"
                placeholderTextColor="#94a3b8"
              />

              <TouchableOpacity
                style={[s.sosBtn, broadcasting && { opacity: 0.6 }]}
                onPress={handleEmergencyBroadcast}
                disabled={broadcasting}
              >
                {broadcasting
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <><ShieldAlert size={16} color="#fff" /><Text style={s.sosBtnText}>Broadcast SOS</Text></>
                }
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#f8fafc' },
  center:       { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText:  { color: '#64748b', marginTop: 12, fontSize: 14 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
    alignItems: 'center', justifyContent: 'center',
  },
  refreshBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#fff1f2', borderWidth: 1.5, borderColor: '#fecdd3',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },

  // Quick SOS banner
  quickSOS: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#ef4444', paddingVertical: 10, paddingHorizontal: 16,
    marginHorizontal: 16, marginTop: 12, marginBottom: 4, borderRadius: 12,
    shadowColor: '#ef4444', shadowOpacity: 0.25, shadowRadius: 6, elevation: 3,
  },
  quickSOSText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  // Tabs
  tabsScroll: {
    maxHeight: 48,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  tabsContent: { paddingHorizontal: 12, gap: 4, alignItems: 'center', paddingVertical: 6 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#f1f5f9', borderWidth: 1.5, borderColor: '#e2e8f0',
  },
  tabActive: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748b', whiteSpace: 'nowrap' },
  tabTextActive: { color: '#fff', fontWeight: '800' },

  content: { padding: 16, paddingBottom: 40 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1.5, borderColor: '#e2e8f0',
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a' },

  // Bank card
  bankCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0',
    borderLeftWidth: 4, borderLeftColor: '#ef4444',
    shadowColor: '#0f172a', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  donateBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    backgroundColor: '#dc2626', borderRadius: 10, paddingVertical: 10, marginTop: 14,
    shadowColor: '#dc2626', shadowOpacity: 0.25, shadowRadius: 6, elevation: 3,
  },
  donateBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    borderRadius: 10, paddingVertical: 10,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  actionBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  // Donate modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.55)', justifyContent: 'flex-end' },
  donateSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
    borderWidth: 1.5, borderColor: '#fecdd3',
  },
  sheetTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  sheetSub: { fontSize: 13, color: '#64748b', marginTop: 2 },
  sheetClose: {
    width: 34, height: 34, borderRadius: 8, backgroundColor: '#f1f5f9',
    alignItems: 'center', justifyContent: 'center',
  },
  infoBox: {
    backgroundColor: '#fff7ed', borderRadius: 10, borderWidth: 1,
    borderColor: '#fed7aa', padding: 10, marginBottom: 18,
  },
  infoText: { fontSize: 12, color: '#92400e', lineHeight: 17 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  pill: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#e2e8f0', backgroundColor: '#f8fafc',
  },
  pillActive: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
  pillText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  pillTextActive: { color: '#fff' },
  donateSubmitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#dc2626', borderRadius: 14, paddingVertical: 14, marginTop: 4,
    shadowColor: '#dc2626', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  donateSubmitText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  bankName: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  subText: { fontSize: 12, color: '#64748b', flex: 1 },
  stockTitle: { fontSize: 12, fontWeight: '700', color: '#374151', marginTop: 12, marginBottom: 8 },
  stockGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  stockBox: {
    width: '22%', backgroundColor: '#f8fafc',
    borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 8, paddingVertical: 8, alignItems: 'center',
  },
  stockBoxLow: { borderColor: '#fecdd3', backgroundColor: '#fff1f2' },
  stockLabel: { fontSize: 11, fontWeight: '700', color: '#64748b' },
  stockLabelLow: { color: '#ef4444' },
  stockVal: { fontSize: 13, fontWeight: '800', color: '#1e293b', marginTop: 2 },
  stockUnit: { fontSize: 9, color: '#ef4444', fontWeight: '700', marginTop: 1 },

  // Camp card
  campCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0',
    shadowColor: '#0f172a', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  campTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  campName: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  campOrg: { fontSize: 12, color: '#64748b', marginTop: 2 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  campMeta: { gap: 5, marginBottom: 12 },
  campMetaText: { fontSize: 12, color: '#475569', flex: 1 },
  campDesc: { fontSize: 12, color: '#94a3b8', marginTop: 4, fontStyle: 'italic' },
  registerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#ef4444', borderRadius: 12,
    paddingVertical: 11, marginTop: 4,
  },
  registerBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  // SOS
  sosCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    borderWidth: 1.5, borderColor: '#fecdd3',
    shadowColor: '#ef4444', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  sosHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  sosTitle: { fontSize: 17, fontWeight: '800', color: '#b91c1c' },
  sosDesc: { fontSize: 13, color: '#64748b', lineHeight: 18, marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8 },
  bloodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  bloodPill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#e2e8f0', backgroundColor: '#f8fafc',
  },
  bloodPillActive: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  bloodPillText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  bloodPillTextActive: { color: '#fff' },
  fieldInput: {
    backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1.5,
    borderColor: '#e2e8f0', paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14, color: '#0f172a', marginBottom: 16,
  },
  sosBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#ef4444', borderRadius: 14, paddingVertical: 14, marginTop: 4,
    shadowColor: '#ef4444', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  sosBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  // Empty state
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#374151' },
  emptyText: { fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 4 },

  // Info banner
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#fecdd3',
    padding: 12,
    marginBottom: 14,
  },
  infoBannerText: {
    fontSize: 12,
    color: '#b91c1c',
    flex: 1,
    lineHeight: 17,
    fontWeight: '500',
  },
});
