import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, Plus, Trash2, CheckCircle, ShieldAlert } from 'lucide-react-native';
import { COLORS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import GlowingInput from '../components/GlowingInput';
import PremiumButton from '../components/PremiumButton';
import { createPrescription } from '../services/api';
import { triggerLocalNotification } from '../services/notifications';

export default function PrescriptionFormScreen({ navigation }) {
  const [patientName, setPatientName] = useState('Karthik Kolamuri');
  const [medications, setMedications] = useState([
    { name: '', dose: '', frequency: '', time: '09:00 AM' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      { name: '', dose: '', frequency: '', time: '09:00 AM' }
    ]);
  };

  const handleRemoveMedication = (index) => {
    if (medications.length === 1) return;
    const temp = [...medications];
    temp.splice(index, 1);
    setMedications(temp);
  };

  const handleFieldChange = (index, field, value) => {
    const temp = [...medications];
    temp[index][field] = value;
    setMedications(temp);
  };

  const handleIssuePrescription = async () => {
    // Basic verification
    const invalid = medications.some(m => !m.name || !m.dose || !m.frequency);
    if (invalid) {
      triggerLocalNotification('Form Warning', 'Please fill in all medication fields before issuing.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        patientId: 'pat_101',
        medications
      };

      await createPrescription(payload);
      
      await new Promise(r => setTimeout(r, 1000)); // Simulate delay

      triggerLocalNotification(
        'Prescription Issued 📑',
        `Digital prescription successfully issued to Patient ${patientName}.`
      );

      navigation.goBack();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Issue Prescription</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Recipient Details</Text>
        <GlassCard>
          <GlowingInput
            label="Patient Name"
            value={patientName}
            onChangeText={setPatientName}
            placeholder="e.g. Karthik Kolamuri"
            error={null}
          />
        </GlassCard>

        <View style={styles.medHeaderRow}>
          <Text style={styles.sectionTitle}>Medications List</Text>
          <TouchableOpacity 
            style={styles.addDrugBtn}
            onPress={handleAddMedication}
          >
            <Plus size={16} color={COLORS.secondary} style={{ marginRight: 4 }} />
            <Text style={styles.addDrugText}>Add Drug</Text>
          </TouchableOpacity>
        </View>

        {medications.map((med, index) => (
          <GlassCard key={index} style={styles.medCard}>
            <View style={styles.medCardHeader}>
              <Text style={styles.medNumber}>Medication #{index + 1}</Text>
              {medications.length > 1 && (
                <TouchableOpacity onPress={() => handleRemoveMedication(index)}>
                  <Trash2 size={18} color={COLORS.danger} />
                </TouchableOpacity>
              )}
            </View>

            <GlowingInput
              label="Drug Name"
              value={med.name}
              onChangeText={(val) => handleFieldChange(index, 'name', val)}
              placeholder="e.g. Metoprolol Succinate"
              error={null}
            />

            <View style={styles.row}>
              <View style={styles.half}>
                <GlowingInput
                  label="Dose Size"
                  value={med.dose}
                  onChangeText={(val) => handleFieldChange(index, 'dose', val)}
                  placeholder="e.g. 50mg"
                  error={null}
                />
              </View>
              <View style={styles.half}>
                <GlowingInput
                  label="Schedule Time"
                  value={med.time}
                  onChangeText={(val) => handleFieldChange(index, 'time', val)}
                  placeholder="e.g. 09:00 AM"
                  error={null}
                />
              </View>
            </View>

            <GlowingInput
              label="Frequency Instructions"
              value={med.frequency}
              onChangeText={(val) => handleFieldChange(index, 'frequency', val)}
              placeholder="e.g. Once daily after breakfast"
              error={null}
            />
          </GlassCard>
        ))}

        <PremiumButton
          title={loading ? "Securing Digital Signatures..." : "Issue & Digitally Sign Rx"}
          onPress={handleIssuePrescription}
          variant="secondary"
          disabled={loading}
          style={styles.submitBtn}
        />
      </ScrollView>
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
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginVertical: 12, paddingLeft: 4 },
  medHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  addDrugBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(217,119,6,0.1)', borderWidth: 1.5, borderColor: COLORS.secondary,
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8,
  },
  addDrugText: { color: COLORS.secondary, fontSize: 12, fontWeight: '700' },
  medCard: { marginBottom: 16 },
  medCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  medNumber: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  half: { width: '48%' },
  submitBtn: { marginTop: 18 },
});


