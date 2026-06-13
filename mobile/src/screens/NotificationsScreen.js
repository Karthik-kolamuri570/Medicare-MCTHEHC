import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, Bell, CheckSquare, Trash2, MailOpen } from 'lucide-react-native';
import { COLORS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import { getNotifications, markNotificationsAsRead } from '../services/api';
import { clearBadgeCounter } from '../services/notifications';

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    clearBadgeCounter(); // Clear native badge counts when opened
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const list = await getNotifications();
      setNotifications(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markNotificationsAsRead();
      const updated = notifications.map(n => ({ ...n, unread: false }));
      setNotifications(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = () => {
    setNotifications([]);
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
        <Text style={styles.headerTitle}>System Alerts</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionIcon} 
            onPress={handleMarkAllRead}
            disabled={notifications.length === 0}
          >
            <CheckSquare size={18} color={notifications.length > 0 ? COLORS.primary : '#64748b'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionIcon} 
            onPress={handleClearAll}
            disabled={notifications.length === 0}
          >
            <Trash2 size={18} color={notifications.length > 0 ? COLORS.danger : '#64748b'} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.centerContainer}>
          <Bell size={48} color={COLORS.textMuted} style={{ marginBottom: 14 }} />
          <Text style={styles.emptyText}>All caught up! No new notifications.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {notifications.map((item) => (
            <GlassCard 
              key={item.id} 
              style={styles.card}
              active={item.unread}
            >
              <View style={styles.notifyRow}>
                <View style={[
                  styles.iconBg,
                  { backgroundColor: item.unread ? 'rgba(14,165,233,0.1)' : '#f8fafc' }
                ]}>
                  {item.unread ? (
                    <Bell size={18} color={COLORS.primary} />
                  ) : (
                    <MailOpen size={18} color="#94a3b8" />
                  )}
                </View>
                
                <View style={styles.details}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.titleText, item.unread && styles.titleUnread]}>
                      {item.title}
                    </Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                  <Text style={styles.msgText}>{item.message}</Text>
                </View>
              </View>
            </GlassCard>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.cardBg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 15,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 12,
    padding: 14,
  },
  notifyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBg: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  details: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  titleUnread: {
    color: COLORS.text,
    fontWeight: '700',
  },
  timeText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  msgText: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
});
