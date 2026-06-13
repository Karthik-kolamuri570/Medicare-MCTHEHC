import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const pad = (n) => String(n).padStart(2, '0');

export default function CustomCalendarModal({ visible, onClose, onSelectDate, selectedDate, minDate }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Initialize calendar view month/year based on selectedDate or today
  const initialDate = selectedDate ? new Date(selectedDate) : today;
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth()); // 0-indexed

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate days grid
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  const daysGrid = [];
  // Add empty slots for padding
  for (let i = 0; i < firstDayIndex; i++) {
    daysGrid.push({ type: 'empty', key: `empty-${i}` });
  }
  // Add actual days
  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
    const dateObj = new Date(currentYear, currentMonth, day);
    dateObj.setHours(0, 0, 0, 0);

    const isPast = minDate 
      ? dateObj < new Date(minDate)
      : dateObj < today;

    daysGrid.push({
      type: 'day',
      dayNum: day,
      dateStr,
      disabled: isPast,
      key: `day-${day}`
    });
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.modalContainer}>
          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>Select Date</Text>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Month Navigator */}
          <View style={s.monthNav}>
            <TouchableOpacity onPress={handlePrevMonth} style={s.navBtn}>
              <ChevronLeft size={20} color="#334155" />
            </TouchableOpacity>
            <Text style={s.monthLabel}>{MONTHS[currentMonth]} {currentYear}</Text>
            <TouchableOpacity onPress={handleNextMonth} style={s.navBtn}>
              <ChevronRight size={20} color="#334155" />
            </TouchableOpacity>
          </View>

          {/* Days of Week Header */}
          <View style={s.weekHeader}>
            {DAYS_OF_WEEK.map(d => (
              <Text key={d} style={s.weekDay}>{d}</Text>
            ))}
          </View>

          {/* Days Grid */}
          <View style={s.grid}>
            {daysGrid.map((item, idx) => {
              if (item.type === 'empty') {
                return <View key={item.key} style={s.gridCell} />;
              }

              const isSelected = selectedDate === item.dateStr;
              return (
                <TouchableOpacity
                  key={item.key}
                  disabled={item.disabled}
                  onPress={() => {
                    onSelectDate(item.dateStr);
                    onClose();
                  }}
                  style={[
                    s.gridCell,
                    s.dayCell,
                    isSelected && s.selectedCell,
                    item.disabled && s.disabledCell
                  ]}
                >
                  <Text style={[
                    s.dayText,
                    isSelected && s.selectedDayText,
                    item.disabled && s.disabledDayText
                  ]}>
                    {item.dayNum}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 340,
    padding: 18,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a'
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc'
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b'
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8
  },
  weekDay: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    width: 36,
    textAlign: 'center'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
  gridCell: {
    width: '14.28%', // 7 columns
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2
  },
  dayCell: {
    borderRadius: 12,
  },
  selectedCell: {
    backgroundColor: '#3b82f6',
  },
  disabledCell: {
    opacity: 0.25,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155'
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: '700'
  },
  disabledDayText: {
    color: '#94a3b8',
    textDecorationLine: 'line-through'
  }
});
