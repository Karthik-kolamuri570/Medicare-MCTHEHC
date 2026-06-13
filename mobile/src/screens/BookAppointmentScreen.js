import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView,
  Modal, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Linking, Alert
} from 'react-native';
import {
  Calendar as CalendarIcon, Clock, CreditCard, X, ArrowLeft,
  AlertCircle, CheckCircle, ChevronDown
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import PremiumButton from '../components/PremiumButton';
import api, { bookAppointment, MOCK_MODE } from '../services/api';
import { triggerLocalNotification } from '../services/notifications';
import CustomCalendarModal from '../components/CustomCalendar';

// ── Helpers ────────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, '0');

/** Return the next N calendar dates as { label, dayNum, dateStr (YYYY-MM-DD) } */
const getUpcomingDates = (count = 6) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    result.push({
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()],
      dayNum: pad(d.getDate()),
      dateStr: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    });
  }
  return result;
};

// ── Component ────────────────────────────────────────────────────────────────
export default function BookAppointmentScreen({ route, navigation }) {
  // Route params: { doctorId, doctor } — doctor is the full object for display
  const { doctorId, doctor: doctorParam } = route.params || {};

  const DATES = getUpcomingDates(6);

  // Form state
  const [selectedDate, setSelectedDate] = useState(DATES[0].dateStr);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);   // { startTime, label, available }
  const [problem, setProblem] = useState('');

  // Slot loading state
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  // Doctor info (fetched from backend if not passed)
  const [doctor, setDoctor] = useState(doctorParam || null);
  const [doctorLoading, setDoctorLoading] = useState(!doctorParam);

  // Payment / booking flow
  const [showPayModal, setShowPayModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // ── Fetch doctor profile if not passed ──────────────────────────────────
  useEffect(() => {
    if (!doctorParam && doctorId) {
      (async () => {
        try {
          setDoctorLoading(true);
          const res = await api.get(`/doctor/profile/${doctorId}`);
          if (res.data?.data) setDoctor(res.data.data);
        } catch (e) { console.error('Doctor fetch failed', e); }
        finally { setDoctorLoading(false); }
      })();
    }
  }, [doctorId, doctorParam]);

  // ── Fetch available slots when date changes ──────────────────────────────
  useEffect(() => {
    setSelectedSlot(null);
    setSlots([]);
    setSlotsError(null);
    if (!doctorId || !selectedDate) return;

    if (MOCK_MODE) {
      // Generate mock time slots for demo
      const mockSlots = [
        { startTime: '09:00', label: '09:00 AM', available: true },
        { startTime: '09:30', label: '09:30 AM', available: false },
        { startTime: '10:00', label: '10:00 AM', available: true },
        { startTime: '10:30', label: '10:30 AM', available: true },
        { startTime: '11:00', label: '11:00 AM', available: false },
        { startTime: '11:30', label: '11:30 AM', available: true },
        { startTime: '14:00', label: '02:00 PM', available: true },
        { startTime: '14:30', label: '02:30 PM', available: true },
        { startTime: '15:00', label: '03:00 PM', available: false },
        { startTime: '15:30', label: '03:30 PM', available: true },
      ];
      setSlots(mockSlots);
      return;
    }

    (async () => {
      try {
        setSlotsLoading(true);
        const res = await api.get(`/doctor/slots/${doctorId}?date=${selectedDate}`);
        setSlots(res.data?.data?.slots || []);
      } catch (err) {
        setSlotsError('Could not load available slots. Please try another date.');
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    })();
  }, [doctorId, selectedDate]);

  // ── Proceed to checkout gate ─────────────────────────────────────────────
  const handleCheckout = () => {
    if (!selectedSlot) {
      triggerLocalNotification('Select a Slot', 'Please choose an available time slot.');
      return;
    }
    if (!problem.trim()) {
      triggerLocalNotification('Describe Your Concern', 'Please briefly describe your health concern.');
      return;
    }
    setBookingError(null);
    setShowPayModal(true);
  };

  // ── Confirm & book → Stripe checkout ────────────────────────────────────
  const handlePayAndBook = async () => {
    setShowPayModal(false);
    setLoading(true);
    setBookingError(null);
    try {
      // Step 1: Book the appointment slot
      const payload = {
        doctorId: doctor?._id || doctor?.id || doctorId,
        date: selectedDate,
        time: selectedSlot.startTime,
        problem: problem.trim(),
      };
      const result = await bookAppointment(payload);

      if (MOCK_MODE) {
        triggerLocalNotification('Appointment Booked! 🎉', `Slot on ${selectedDate} at ${selectedSlot.label} confirmed.`);
        navigation.reset({ index: 0, routes: [{ name: 'PatientHomeTabs' }] });
        return;
      }

      const appointmentId = result?.data?._id || result?.data?.id;
      const patientEmail = result?.data?.patientEmail || result?.data?.patientId?.email || '';

      if (!appointmentId) {
        setBookingError(result?.message || 'Booking failed. Please try again.');
        return;
      }

      // Step 2: Create Stripe checkout session
      const payRes = await api.post('/payment/check-out', {
        appointmentId,
        patientEmail,
      });

      // Backend returns { id: sessionId, url: checkoutUrl }
      const checkoutUrl = payRes.data?.url
        || (payRes.data?.id ? `https://checkout.stripe.com/pay/${payRes.data.id}` : null);

      if (checkoutUrl) {
        // Step 3: Open Stripe checkout in phone browser
        await Linking.openURL(checkoutUrl);
        triggerLocalNotification('Payment Started 💳', 'Complete payment in the browser. Return here when done.');
        navigation.reset({ index: 0, routes: [{ name: 'PatientHomeTabs' }] });
      } else {
        setBookingError('Payment gateway did not return a checkout link. Please try again.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      const isNetworkError = !err?.response && (err?.message === 'Network Error' || err?.code === 'ECONNABORTED');
      if (isNetworkError) {
        setBookingError(
          'Cannot reach the server.\n\n' +
          '• Make sure your phone is on the same WiFi network as this computer.\n' +
          '• Or switch MOCK_MODE to true in api.js to test without a server.'
        );
      } else {
        setBookingError(err?.response?.data?.message || 'Booking failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (doctorLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerFlex}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loaderText}>Loading doctor details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const doctorName = doctor?.name || 'Doctor';
  const specialization = doctor?.specialization || doctor?.specialty || '';
  const fee = doctor?.feePerConsultation || doctor?.fee || 800;
  const fromTime = doctor?.fromTime || '09:00';
  const toTime = doctor?.toTime || '18:00';

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Doctor Quick Info ── */}
          <GlassCard style={styles.doctorCard}>
            <View style={styles.doctorAvatar}>
              <Text style={styles.doctorInitials}>
                {doctorName.replace('Dr. ', '').split(' ').map(n => n[0]).slice(0, 2).join('')}
              </Text>
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctorName}</Text>
              {!!specialization && <Text style={styles.doctorSpec}>{specialization}</Text>}
              <Text style={styles.doctorHours}>
                <Clock size={12} color={COLORS.textMuted} /> {fromTime} – {toTime}
              </Text>
            </View>
            <View style={styles.feeBadge}>
              <Text style={styles.feeLabel}>Fee</Text>
              <Text style={styles.feeVal}>₹{fee}</Text>
            </View>
          </GlassCard>

          {/* ── Date Selector ── */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 12 }}>
            <Text style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0 }]}>Select Consultation Date</Text>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => setShowCalendar(true)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(14,165,233,0.1)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 100 }}
            >
              <CalendarIcon size={14} color={COLORS.primary} />
              <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: '700' }}>Calendar</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateSlider}>
            {(() => {
              const displayedDates = [...DATES];
              if (!DATES.some(d => d.dateStr === selectedDate)) {
                const dateObj = new Date(selectedDate);
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                displayedDates.push({
                  label: days[dateObj.getDay()],
                  dayNum: pad(dateObj.getDate()),
                  dateStr: selectedDate
                });
              }
              return displayedDates.map((d) => (
                <TouchableOpacity
                  key={d.dateStr}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDate(d.dateStr)}
                  style={[styles.dateCard, selectedDate === d.dateStr && styles.dateCardActive]}
                >
                  <Text style={[styles.dayLabel, selectedDate === d.dateStr && styles.textActive]}>
                    {d.label}
                  </Text>
                  <Text style={[styles.dateVal, selectedDate === d.dateStr && styles.textActive]}>
                    {d.dayNum}
                  </Text>
                </TouchableOpacity>
              ));
            })()}
          </ScrollView>

          <CustomCalendarModal
            visible={showCalendar}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onClose={() => setShowCalendar(false)}
          />

          {/* ── Slot Picker ── */}
          <View style={styles.slotHeader}>
            <Text style={styles.sectionTitle}>Available Time Slots</Text>
            {selectedSlot && (
              <View style={styles.selectedSlotBadge}>
                <CheckCircle size={13} color={COLORS.primary} />
                <Text style={styles.selectedSlotText}>{selectedSlot.label}</Text>
              </View>
            )}
          </View>

          {slotsLoading && (
            <View style={styles.slotsLoadingRow}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.slotsLoadingText}>Checking availability...</Text>
            </View>
          )}

          {slotsError && !slotsLoading && (
            <GlassCard style={styles.errorCard}>
              <AlertCircle size={18} color={COLORS.danger} style={{ marginRight: 8 }} />
              <Text style={styles.errorText}>{slotsError}</Text>
            </GlassCard>
          )}

          {!slotsLoading && !slotsError && slots.length === 0 && selectedDate && (
            <GlassCard style={styles.noSlotsCard}>
              <Text style={styles.noSlotsText}>No slots available for this date. Try another day.</Text>
            </GlassCard>
          )}

          {!slotsLoading && slots.length > 0 && (
            <View style={styles.slotGrid}>
              {slots.map((slot) => (
                <TouchableOpacity
                  key={slot.startTime}
                  activeOpacity={slot.available ? 0.8 : 1}
                  disabled={!slot.available}
                  onPress={() => slot.available && setSelectedSlot(slot)}
                  style={[
                    styles.slotCard,
                    !slot.available && styles.slotCardBooked,
                    selectedSlot?.startTime === slot.startTime && styles.slotCardActive,
                  ]}
                >
                  <Clock
                    size={13}
                    color={
                      !slot.available ? '#cbd5e1'
                        : selectedSlot?.startTime === slot.startTime ? '#ffffff'
                          : COLORS.textMuted
                    }
                    style={{ marginRight: 5 }}
                  />
                  <Text style={[
                    styles.slotText,
                    !slot.available && styles.slotTextBooked,
                    selectedSlot?.startTime === slot.startTime && styles.textActive,
                  ]}>
                    {slot.label}
                  </Text>
                  {!slot.available && (
                    <Text style={styles.bookedTag}>Booked</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── Health Concern ── */}
          <Text style={styles.sectionTitle}>Describe Your Health Concern</Text>
          <View style={styles.textAreaWrapper}>
            <TextInput
              style={styles.textArea}
              placeholder="e.g. Severe headache for 2 days, chest pain, recurring fever..."
              placeholderTextColor={COLORS.textMuted}
              value={problem}
              onChangeText={setProblem}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* ── Error Banner ── */}
          {bookingError && (
            <GlassCard style={styles.errorCard}>
              <AlertCircle size={18} color={COLORS.danger} style={{ marginRight: 8 }} />
              <Text style={styles.errorText}>{bookingError}</Text>
            </GlassCard>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Footer CTA ── */}
      <View style={styles.footer}>
        <PremiumButton
          title={loading ? 'Processing...' : `Proceed to Payment • ₹${fee}`}
          onPress={handleCheckout}
          disabled={loading || !selectedSlot || !problem.trim()}
          variant="primary"
          style={styles.checkoutBtn}
        />
        <Text style={styles.footerNote}>🔒 256-bit encrypted secure transaction</Text>
      </View>

      {/* ── Payment Confirmation Modal ── */}
      <Modal
        visible={showPayModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPayModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.stripeSheet}>
            <View style={styles.sheetHeader}>
              <View style={styles.stripeBadge}>
                <CreditCard size={18} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.stripeBadgeText}>Confirm Booking</Text>
              </View>
              <TouchableOpacity onPress={() => setShowPayModal(false)}>
                <X size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.sheetDivider} />

            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Appointment Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Doctor</Text>
                <Text style={styles.summaryVal}>{doctorName}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Specialization</Text>
                <Text style={styles.summaryVal}>{specialization || '—'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date</Text>
                <Text style={styles.summaryVal}>{selectedDate}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Time Slot</Text>
                <Text style={styles.summaryVal}>{selectedSlot?.label}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Concern</Text>
                <Text style={[styles.summaryVal, { maxWidth: '60%' }]} numberOfLines={2}>
                  {problem}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.summaryTotalLabel}>Total Pay</Text>
                <Text style={styles.summaryTotalVal}>₹{fee}</Text>
              </View>
            </View>

            <PremiumButton
              title="Confirm & Pay Now"
              onPress={handlePayAndBook}
              variant="primary"
              style={styles.sheetBtn}
            />
            <Text style={styles.stripeFooterMuted}>
              Payments secured via Stripe. Your card data is never stored.
            </Text>
          </View>
        </View>
      </Modal>

      {/* ── Full-screen Loader ── */}
      {loading && (
        <View style={styles.loaderBackdrop}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loaderText}>Processing your booking...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerFlex: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },

  // Header
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
  scrollContent: { padding: 20, paddingBottom: 120 },

  // Doctor card
  doctorCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, padding: 16 },
  doctorAvatar: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  doctorInitials: { color: COLORS.primary, fontSize: 20, fontWeight: '800' },
  doctorInfo: { flex: 1 },
  doctorName: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  doctorSpec: { color: COLORS.primary, fontSize: 13, fontWeight: '600', marginTop: 2 },
  doctorHours: { color: COLORS.textMuted, fontSize: 12, marginTop: 4 },
  feeBadge: { alignItems: 'center', backgroundColor: '#f0fdf4', borderRadius: 10, padding: 10 },
  feeLabel: { color: '#16a34a', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  feeVal: { color: '#16a34a', fontSize: 18, fontWeight: '800', marginTop: 2 },

  // Section title
  sectionTitle: { color: COLORS.text, fontSize: 15, fontWeight: '700', marginTop: 20, marginBottom: 12, paddingLeft: 2 },

  // Date slider
  dateSlider: { flexDirection: 'row', marginBottom: 4 },
  dateCard: {
    backgroundColor: COLORS.cardBg, borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16,
    marginRight: 10, alignItems: 'center', minWidth: 70,
  },
  dateCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dayLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600' },
  dateVal: { color: COLORS.text, fontSize: 18, fontWeight: '800', marginTop: 6 },
  textActive: { color: '#ffffff' },

  // Slot grid
  slotHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  selectedSlotBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(14,165,233,0.1)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  selectedSlotText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },

  slotsLoadingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 10 },
  slotsLoadingText: { color: COLORS.textMuted, fontSize: 14 },

  errorCard: { flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 8 },
  errorText: { color: COLORS.danger, fontSize: 14, flex: 1 },
  noSlotsCard: { alignItems: 'center', padding: 20 },
  noSlotsText: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center' },

  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  slotCard: {
    backgroundColor: COLORS.cardBg, borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: 12, width: '47%', height: 48,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  slotCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  slotCardBooked: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', opacity: 0.6 },
  slotText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
  slotTextBooked: { color: '#cbd5e1' },
  bookedTag: {
    fontSize: 9, fontWeight: '700', color: '#94a3b8',
    backgroundColor: '#f1f5f9', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1,
    marginLeft: 4,
  },

  // Text area
  textAreaWrapper: {
    backgroundColor: COLORS.cardBg, borderRadius: 14,
    borderWidth: 1.5, borderColor: COLORS.border,
    padding: 14, marginBottom: 8,
  },
  textArea: {
    color: COLORS.text, fontSize: 14, lineHeight: 22,
    minHeight: 100,
  },

  // Footer
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.cardBg, padding: 20, paddingBottom: 24,
    borderTopWidth: 1.5, borderTopColor: COLORS.border,
  },
  checkoutBtn: { width: '100%' },
  footerNote: { color: COLORS.textMuted, fontSize: 11, textAlign: 'center', marginTop: 8 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'flex-end' },
  stripeSheet: {
    backgroundColor: COLORS.cardBg, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderWidth: 1.5, borderColor: COLORS.border, padding: 24, paddingBottom: 40,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stripeBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#6366f1',
    paddingVertical: 7, paddingHorizontal: 14, borderRadius: 10,
  },
  stripeBadgeText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  sheetDivider: { height: 1.5, backgroundColor: COLORS.border, marginVertical: 18 },
  summaryContainer: {
    backgroundColor: COLORS.background, borderRadius: 16, padding: 16, marginBottom: 20,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  summaryTitle: { color: COLORS.text, fontSize: 14, fontWeight: '700', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginVertical: 4 },
  summaryLabel: { color: COLORS.textMuted, fontSize: 13 },
  summaryVal: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
  totalRow: { marginTop: 12, borderTopWidth: 1.5, borderTopColor: COLORS.border, paddingTop: 10 },
  summaryTotalLabel: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  summaryTotalVal: { color: COLORS.primary, fontSize: 20, fontWeight: '800' },
  sheetBtn: { width: '100%', marginBottom: 12 },
  stripeFooterMuted: { color: COLORS.textMuted, fontSize: 11, textAlign: 'center' },

  // Full-screen loader
  loaderBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248,250,252,0.92)',
    justifyContent: 'center', alignItems: 'center', zIndex: 99,
  },
  loaderText: { color: COLORS.text, fontSize: 15, fontWeight: '600', marginTop: 16 },
});
