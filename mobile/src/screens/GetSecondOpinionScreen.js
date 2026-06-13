import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert
} from 'react-native';
import { ArrowLeft, ArrowRight, CheckCircle, Search, Clock, MapPin, Video, User, Stethoscope, Calendar as CalendarIcon } from 'lucide-react-native';
import api, { getDoctorsList } from '../services/api';
import CustomCalendarModal from '../components/CustomCalendar';

// ── Helpers ──────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split('T')[0];

function generateSlots(fromTime = '09:00', toTime = '17:00', dateStr) {
  const [sh, sm] = fromTime.split(':').map(Number);
  const [eh, em] = toTime.split(':').map(Number);
  const slots = [];
  let cur = sh * 60 + sm;
  const end = eh * 60 + em;
  const now = new Date();
  const isToday = dateStr === todayStr();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  while (cur + 30 <= end) {
    if (!isToday || cur > nowMins) {
      const h = Math.floor(cur / 60), m = cur % 60;
      const val = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      const h12 = h % 12 || 12;
      const disp = `${h12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
      slots.push({ value: val, display: disp });
    }
    cur += 30;
  }
  return slots;
}

// ── Step indicator ────────────────────────────────────────────────────────────
const STEPS = ['Doctor', 'Details', 'Schedule', 'Confirm'];

function StepBar({ step }) {
  return (
    <View style={s.stepBar}>
      {STEPS.map((label, i) => (
        <React.Fragment key={i}>
          <View style={s.stepItem}>
            <View style={[s.stepCircle, step > i && s.stepDone, step === i && s.stepActive]}>
              {step > i
                ? <CheckCircle size={14} color="#fff" />
                : <Text style={[s.stepNum, step === i && { color: '#fff' }]}>{i + 1}</Text>}
            </View>
            <Text style={[s.stepLabel, step === i && { color: '#3b82f6', fontWeight: '700' }]}>{label}</Text>
          </View>
          {i < STEPS.length - 1 && <View style={[s.stepLine, step > i && s.stepLineDone]} />}
        </React.Fragment>
      ))}
    </View>
  );
}

// ── Step 0: Doctor Selection ──────────────────────────────────────────────────
function StepDoctor({ formData, setFormData }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getDoctorsList()
      .then(list => setDoctors(Array.isArray(list) ? list : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = doctors.filter(d => {
    const q = search.toLowerCase();
    return (d.name || '').toLowerCase().includes(q) ||
      (d.specialty || d.specialization || '').toLowerCase().includes(q) ||
      (d.location || d.hospital || '').toLowerCase().includes(q);
  });

  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
  const isAvail = (d) => {
    const [sh, sm] = (d.fromTime || '09:00').split(':').map(Number);
    const [eh, em] = (d.toTime || '17:00').split(':').map(Number);
    return nowMins >= sh * 60 + sm && nowMins <= eh * 60 + em;
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={s.stepTitle}>Choose Your Specialist</Text>
      <Text style={s.stepSub}>Browse and select a doctor who matches your needs.</Text>
      <View style={s.searchBar}>
        <Search size={15} color="#94a3b8" />
        <TextInput
          style={s.searchInput}
          placeholder="Search doctor, specialty..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {loading
        ? <ActivityIndicator color="#3b82f6" style={{ marginTop: 32 }} />
        : filtered.length === 0
          ? <Text style={s.emptyText}>No doctors found.</Text>
          : filtered.map(d => {
              const id = d.id || d._id?.toString();
              const selected = formData.doctorId === id;
              const avail = isAvail(d);
              return (
                <TouchableOpacity
                  key={id}
                  style={[s.docCard, selected && s.docCardSelected]}
                  onPress={() => setFormData(p => ({ ...p, doctorId: id, _doctor: d }))}
                  activeOpacity={0.8}
                >
                  <View style={s.docAvatar}>
                    <Text style={s.docAvatarText}>{(d.name || 'D')[0].toUpperCase()}</Text>
                    <View style={[s.availDot, { backgroundColor: avail ? '#10b981' : '#94a3b8' }]} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={s.docRow}>
                      <Text style={s.docName}>Dr. {d.name}</Text>
                      {d.fee || d.feePerConsultation
                        ? <Text style={s.docFee}>₹{d.fee || d.feePerConsultation}</Text>
                        : null}
                    </View>
                    <View style={s.specPill}>
                      <Stethoscope size={11} color="#3b82f6" />
                      <Text style={s.specText}>{d.specialty || d.specialization || '—'}</Text>
                    </View>
                    <View style={s.docMeta}>
                      <MapPin size={11} color="#94a3b8" />
                      <Text style={s.docMetaText}>{d.location || d.hospital || 'Medicare Clinic'}</Text>
                      <Clock size={11} color="#94a3b8" style={{ marginLeft: 8 }} />
                      <Text style={s.docMetaText}>{d.fromTime || '09:00'} - {d.toTime || '17:00'}</Text>
                    </View>
                    <Text style={[s.availText, { color: avail ? '#10b981' : '#94a3b8' }]}>
                      {avail ? 'Available Now' : 'Next Available: Tomorrow'}
                    </Text>
                  </View>
                  {selected && <CheckCircle size={20} color="#3b82f6" />}
                </TouchableOpacity>
              );
            })
      }
    </View>
  );
}

// ── Step 1: Condition Details ─────────────────────────────────────────────────
function StepDetails({ formData, setFormData }) {
  return (
    <View>
      <Text style={s.stepTitle}>Explain your Condition</Text>
      <Text style={s.stepSub}>Help the specialist understand your symptoms and history.</Text>
      <Text style={s.fieldLabel}>Chief Complaint / Symptoms *</Text>
      <TextInput
        style={[s.input, { height: 110, textAlignVertical: 'top' }]}
        value={formData.problem}
        onChangeText={v => setFormData(p => ({ ...p, problem: v }))}
        placeholder="Describe what you are feeling..."
        placeholderTextColor="#94a3b8"
        multiline
      />
      <Text style={s.fieldLabel}>Current Treatment / History *</Text>
      <TextInput
        style={[s.input, { height: 90, textAlignVertical: 'top' }]}
        value={formData.treatment}
        onChangeText={v => setFormData(p => ({ ...p, treatment: v }))}
        placeholder="Any medications or previous surgeries..."
        placeholderTextColor="#94a3b8"
        multiline
      />
    </View>
  );
}

// ── Step 2: Schedule ──────────────────────────────────────────────────────────
function StepSchedule({ formData, setFormData }) {
  const doc = formData._doctor;
  const slots = useMemo(() => generateSlots(doc?.fromTime, doc?.toTime, formData.date), [doc, formData.date]);
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <View>
      <Text style={s.stepTitle}>Schedule & Preferences</Text>
      <Text style={s.stepSub}>Choose how and when you'd like to consult.</Text>

      <Text style={s.fieldLabel}>Consultation Mode</Text>
      <View style={s.modeRow}>
        {[{ key: 'online', label: '💻 Video Call' }, { key: 'offline', label: '🏥 Physical Visit' }].map(m => (
          <TouchableOpacity
            key={m.key}
            style={[s.modeBox, formData.mode === m.key && s.modeBoxActive]}
            onPress={() => setFormData(p => ({ ...p, mode: m.key }))}
          >
            <Text style={[s.modeText, formData.mode === m.key && { color: '#fff' }]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={s.fieldLabel}>Date</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShowCalendar(true)}
        style={[s.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
      >
        <Text style={{ fontSize: 14, color: formData.date ? '#0f172a' : '#94a3b8' }}>
          {formData.date || 'Choose consultation date...'}
        </Text>
        <CalendarIcon size={16} color="#64748b" />
      </TouchableOpacity>

      <CustomCalendarModal
        visible={showCalendar}
        selectedDate={formData.date}
        onSelectDate={v => setFormData(p => ({ ...p, date: v, time: '' }))}
        onClose={() => setShowCalendar(false)}
      />

      <Text style={s.fieldLabel}>
        Time Slot{doc ? `  (${doc.fromTime || '09:00'} - ${doc.toTime || '17:00'})` : ''}
      </Text>
      {!formData.date
        ? <Text style={s.noSlots}>Select a date first</Text>
        : slots.length === 0
          ? <Text style={s.noSlots}>No slots available for this date</Text>
          : <View style={s.slotsGrid}>
              {slots.map(slot => (
                <TouchableOpacity
                  key={slot.value}
                  style={[s.slotBtn, formData.time === slot.value && s.slotBtnActive]}
                  onPress={() => setFormData(p => ({ ...p, time: slot.value }))}
                >
                  <Text style={[s.slotText, formData.time === slot.value && { color: '#fff' }]}>
                    {slot.display}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
      }
    </View>
  );
}

// ── Step 3: Confirm ───────────────────────────────────────────────────────────
function StepConfirm({ formData, submitting, onSubmit }) {
  const doc = formData._doctor;
  const rows = [
    { label: 'Doctor', val: doc ? `Dr. ${doc.name} (${doc.specialty || doc.specialization || ''})` : '—' },
    { label: 'Mode', val: formData.mode === 'online' ? '💻 Video Call' : '🏥 Physical Visit' },
    { label: 'Date', val: formData.date || '—' },
    { label: 'Time', val: formData.time ? `${formData.time}` : '—' },
    { label: 'Problem', val: formData.problem },
    { label: 'Treatment', val: formData.treatment },
  ];
  return (
    <View>
      <Text style={s.stepTitle}>Review & Confirm</Text>
      <Text style={s.stepSub}>Please review your request before submitting.</Text>
      <View style={s.confirmCard}>
        {rows.map(r => (
          <View key={r.label} style={s.confirmRow}>
            <Text style={s.confirmLabel}>{r.label}</Text>
            <Text style={s.confirmVal} numberOfLines={3}>{r.val}</Text>
          </View>
        ))}
      </View>
      <View style={s.noteBox}>
        <Text style={s.noteText}>📎 Medical report uploads are handled on the web portal. This request will be submitted without attachments.</Text>
      </View>
      <TouchableOpacity
        style={[s.submitBtn, submitting && { opacity: 0.6 }]}
        onPress={onSubmit}
        disabled={submitting}
      >
        {submitting
          ? <ActivityIndicator color="#fff" size="small" />
          : <Text style={s.submitBtnText}>Confirm & Submit</Text>}
      </TouchableOpacity>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function GetSecondOpinionScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: '', _doctor: null,
    problem: '', treatment: '',
    mode: 'online', date: '', time: '',
  });

  const validate = () => {
    if (step === 0 && !formData.doctorId) { Alert.alert('Required', 'Please select a doctor.'); return false; }
    if (step === 1) {
      if (!formData.problem.trim()) { Alert.alert('Required', 'Please describe your symptoms.'); return false; }
      if (!formData.treatment.trim()) { Alert.alert('Required', 'Please describe your current treatment.'); return false; }
    }
    if (step === 2) {
      if (!formData.date.match(/^\d{4}-\d{2}-\d{2}$/)) { Alert.alert('Required', 'Enter date as YYYY-MM-DD.'); return false; }
      if (!formData.time) { Alert.alert('Required', 'Please select a time slot.'); return false; }
      const doc = formData._doctor;
      if (doc) {
        const [sh, sm] = (doc.fromTime || '09:00').split(':').map(Number);
        const [eh, em] = (doc.toTime || '17:00').split(':').map(Number);
        const [selH, selM] = formData.time.split(':').map(Number);
        const selMins = selH * 60 + selM;
        if (selMins < sh * 60 + sm || selMins > eh * 60 + em) {
          Alert.alert('Outside Hours', `Doctor available ${doc.fromTime || '09:00'} - ${doc.toTime || '17:00'}.`);
          return false;
        }
        if (formData.date === todayStr()) {
          const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
          if (selMins <= nowMins) { Alert.alert('Past Time', 'Select a future time slot.'); return false; }
        }
      }
    }
    return true;
  };

  const handleNext = () => { if (validate()) setStep(s => s + 1); };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append('doctorId', formData.doctorId);
      form.append('problem', formData.problem.trim());
      form.append('treatment', formData.treatment.trim());
      form.append('mode', formData.mode);
      form.append('date', formData.date);
      form.append('time', formData.time);
      form.append('files', { uri: 'data:text/plain;base64,bm8tZmlsZQ==', name: 'note.txt', type: 'text/plain' });
      await api.post('/patient/get-second-opinion', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      Alert.alert('✅ Submitted!', 'Your second opinion request has been sent. You\'ll be notified when the doctor responds.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const doc = formData._doctor;

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Get Second Opinion</Text>
          <Text style={s.headerSub}>Consult with top specialists for a better diagnosis.</Text>
        </View>
      </View>

      <StepBar step={step} />

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {step === 0 && <StepDoctor formData={formData} setFormData={setFormData} />}
        {step === 1 && <StepDetails formData={formData} setFormData={setFormData} />}
        {step === 2 && <StepSchedule formData={formData} setFormData={setFormData} />}
        {step === 3 && <StepConfirm formData={formData} submitting={submitting} onSubmit={handleSubmit} />}
      </ScrollView>

      {/* Footer */}
      <View style={s.footer}>
        {doc && step > 0 && (
          <Text style={s.footerDoc} numberOfLines={1}>
            Selected: <Text style={{ fontWeight: '800' }}>{doc.name}</Text> ({doc.specialty || doc.specialization || ''})
          </Text>
        )}
        <View style={s.footerBtns}>
          <TouchableOpacity
            style={[s.btnBack, step === 0 && { opacity: 0.3 }]}
            onPress={() => setStep(s => s - 1)}
            disabled={step === 0}
          >
            <ArrowLeft size={16} color="#64748b" />
            <Text style={s.btnBackText}>Back</Text>
          </TouchableOpacity>

          {step < 3 && (
            <TouchableOpacity style={s.btnNext} onPress={handleNext}>
              <Text style={s.btnNextText}>Next Step</Text>
              <ArrowRight size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  headerSub: { fontSize: 12, color: '#64748b', marginTop: 1 },

  // Step bar
  stepBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#f1f5f9', borderWidth: 1.5, borderColor: '#e2e8f0',
    alignItems: 'center', justifyContent: 'center',
  },
  stepActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  stepDone: { backgroundColor: '#10b981', borderColor: '#10b981' },
  stepNum: { fontSize: 12, fontWeight: '700', color: '#94a3b8' },
  stepLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '600' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#e2e8f0', marginBottom: 14, marginHorizontal: 4 },
  stepLineDone: { backgroundColor: '#10b981' },

  content: { padding: 16, paddingBottom: 16 },

  stepTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  stepSub: { fontSize: 13, color: '#64748b', marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8, marginTop: 4 },
  input: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1.5, borderColor: '#e2e8f0',
    paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: '#0f172a', marginBottom: 16,
  },

  // Doctor card
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1.5, borderColor: '#e2e8f0',
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a' },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 24, fontSize: 14 },
  docCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1.5, borderColor: '#e2e8f0',
    shadowColor: '#0f172a', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  docCardSelected: { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
  docAvatar: { position: 'relative', width: 48, height: 48 },
  docAvatarText: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#3b82f6', textAlign: 'center',
    lineHeight: 48, color: '#fff', fontWeight: '800', fontSize: 18,
  },
  availDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#fff',
  },
  docRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  docName: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  docFee: { fontSize: 13, fontWeight: '700', color: '#10b981' },
  specPill: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  specText: { fontSize: 12, color: '#3b82f6', fontWeight: '600' },
  docMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  docMetaText: { fontSize: 11, color: '#94a3b8' },
  availText: { fontSize: 11, fontWeight: '700', marginTop: 5 },

  // Mode
  modeRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  modeBox: {
    flex: 1, alignItems: 'center', paddingVertical: 14,
    borderRadius: 12, borderWidth: 1.5, borderColor: '#e2e8f0', backgroundColor: '#f8fafc',
  },
  modeBoxActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  modeText: { fontSize: 13, fontWeight: '700', color: '#64748b' },

  // Slots
  noSlots: { fontSize: 13, color: '#94a3b8', marginBottom: 16, fontStyle: 'italic' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  slotBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#e2e8f0', backgroundColor: '#f8fafc',
  },
  slotBtnActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  slotText: { fontSize: 12, fontWeight: '700', color: '#374151' },

  // Confirm
  confirmCard: {
    backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0',
    padding: 16, marginBottom: 16,
  },
  confirmRow: {
    flexDirection: 'row', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  confirmLabel: { fontSize: 12, fontWeight: '700', color: '#94a3b8', width: 80 },
  confirmVal: { flex: 1, fontSize: 13, color: '#0f172a', lineHeight: 18 },
  noteBox: {
    backgroundColor: '#eff6ff', borderRadius: 10, borderWidth: 1,
    borderColor: '#bfdbfe', padding: 12, marginBottom: 20,
  },
  noteText: { fontSize: 12, color: '#1d4ed8', lineHeight: 18 },
  submitBtn: {
    backgroundColor: '#3b82f6', borderRadius: 14, paddingVertical: 15,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#3b82f6', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  submitBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  // Footer
  footer: {
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  footerDoc: { fontSize: 12, color: '#64748b', marginBottom: 10 },
  footerBtns: { flexDirection: 'row', gap: 10 },
  btnBack: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 18, paddingVertical: 11,
    borderRadius: 12, borderWidth: 1.5, borderColor: '#e2e8f0', backgroundColor: '#f8fafc',
  },
  btnBackText: { fontSize: 14, fontWeight: '700', color: '#64748b' },
  btnNext: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 12,
    shadowColor: '#3b82f6', shadowOpacity: 0.25, shadowRadius: 6, elevation: 3,
  },
  btnNextText: { fontSize: 14, fontWeight: '800', color: '#fff' },
});
