import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert, Linking
} from 'react-native';
import { ArrowLeft, Send, Video, Wifi, WifiOff } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { StreamChat } from 'stream-chat';
import api from '../services/api';

import { SOCKET_URL as BACKEND_URL, VIDEO_BASE_URL } from '../config';

// ─── helpers ─────────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, '0');
const fmtTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  const h = d.getHours(), m = d.getMinutes();
  return `${pad(h % 12 || 12)}:${pad(m)} ${h >= 12 ? 'PM' : 'AM'}`;
};

// Stream channel ID must be sorted for consistency (same as web)
const makeChannelId = (id1, id2) => [id1, id2].sort().join('-');

// Detect URLs in text and split into parts
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

const Bubble = ({ msg, myId }) => {
  const isMine = msg.user?.id === myId;
  const text = msg.text || '';
  const time = fmtTime(msg.created_at);

  // Split message into plain text and URL segments
  const parts = text.split(URL_REGEX);

  return (
    <View style={[s.bubbleWrap, isMine ? s.bubbleWrapMine : s.bubbleWrapTheirs]}>
      <View style={[s.bubble, isMine ? s.bubbleMine : s.bubbleTheirs]}>
        <Text style={[s.bubbleText, isMine && s.bubbleTextMine]}>
          {parts.map((part, i) =>
            URL_REGEX.test(part) ? (
              <Text
                key={i}
                style={[s.bubbleLink, isMine && s.bubbleLinkMine]}
                onPress={() => Linking.openURL(part).catch(() =>
                  Alert.alert('Cannot open link', part)
                )}
              >
                {part}
              </Text>
            ) : (
              <Text key={i}>{part}</Text>
            )
          )}
        </Text>
        <Text style={[s.bubbleTime, isMine && s.bubbleTimeMine]}>{time}</Text>
      </View>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ChatScreen({ route, navigation }) {
  const { receiverId } = route.params || {};
  // receiverId = "doctorId-patientId"
  const [doctorId, patientId] = (receiverId || '').split('-');

  const [messages, setMessages]   = useState([]);
  const [text, setText]           = useState('');
  const [myId, setMyId]           = useState(null);
  const [myRole, setMyRole]       = useState(null);
  const [otherName, setOtherName] = useState('');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const channelRef = useRef(null);
  const clientRef  = useRef(null);
  const flatRef    = useRef(null);

  // ── Init Stream Chat ───────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const jwtToken = await SecureStore.getItemAsync('auth_access_token');
        const userRaw  = await SecureStore.getItemAsync('auth_user_details');
        if (!jwtToken || !userRaw) {
          Alert.alert('Session expired', 'Please log in again.');
          navigation.goBack();
          return;
        }
        const user = JSON.parse(userRaw);
        const uid  = user.userId;
        const role = user.role;
        if (mounted) { setMyId(uid); setMyRole(role); }

        // 1. Get Stream token from backend
        const tokenRes = await api.get('/stream/token');
        const { token: streamToken, apiKey } = tokenRes.data;

        // 2. Connect Stream client
        const client = StreamChat.getInstance(apiKey);
        if (client.userID !== uid) {
          await client.connectUser({ id: uid }, streamToken);
        }
        clientRef.current = client;
        if (mounted) setConnected(true);

        // 3. Upsert both users so Stream knows them
        const peerId = role === 'doctor' ? patientId : doctorId;
        await api.post('/stream/upsert-users', { users: [{ id: uid }, { id: peerId }] });

        // 4. Fetch other party name
        try {
          const endpoint = role === 'doctor' ? `/patient/profile/${peerId}` : `/doctor/${peerId}`;
          const nameRes  = await api.get(endpoint);
          const name     = nameRes.data?.data?.name || nameRes.data?.name || 'Chat';
          if (mounted) setOtherName(role === 'doctor' ? name : `Dr. ${name}`);
        } catch { if (mounted) setOtherName('Chat'); }

        // 5. Open / create the messaging channel
        const channelId = makeChannelId(uid, peerId);
        const channel = client.channel('messaging', channelId, {
          members: [uid, peerId],
        });
        await channel.watch();
        channelRef.current = channel;

        // 6. Load existing messages
        if (mounted && channel.state.messages) {
          setMessages([...channel.state.messages]);
        }

        // 7. Listen for new messages in real-time
        channel.on('message.new', (event) => {
          if (mounted) {
            setMessages(prev => {
              if (prev.some(m => m.id === event.message.id)) return prev;
              return [...prev, event.message];
            });
          }
        });

        if (mounted) setLoading(false);
      } catch (err) {
        console.error('ChatScreen init error:', err);
        if (mounted) {
          setError('Could not connect to chat. Check your network connection.');
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      // Stop watching the channel — do NOT disconnect the client (singleton)
      channelRef.current?.stopWatching().catch(() => {});
    };
  }, [receiverId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  // ── Send ──────────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || !channelRef.current) return;
    setText('');
    try {
      await channelRef.current.sendMessage({ text: trimmed });
    } catch (err) {
      console.error('Send error:', err);
      Alert.alert('Error', 'Failed to send message. Please try again.');
      setText(trimmed); // restore
    }
  }, [text]);

  // ── Video Call ────────────────────────────────────────────────────────────
  const startVideoCall = useCallback(async () => {
    if (myRole !== 'doctor') {
      Alert.alert('Video Call', 'Only doctors can initiate video calls. Wait for your doctor to start a call.');
      return;
    }
    const peerId    = patientId;
    const callId   = makeChannelId(myId, peerId);
    const callUrl  = `${VIDEO_BASE_URL}/video-call/${callId}`;
    const callMsg  = `📞 Video call started! Join here: ${callUrl}`;

    // 1. Send the link as a chat message so the patient sees it
    try {
      await channelRef.current?.sendMessage({ text: callMsg });
    } catch (err) {
      console.error('Failed to send video call message:', err);
    }

    // 2. Open the call immediately for the doctor
    try {
      await Linking.openURL(callUrl);
    } catch {
      Alert.alert('Video Call', `Open this link in your browser:\n${callUrl}`);
    }
  }, [myId, myRole, patientId]);

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={s.loadingText}>Connecting to chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color="#0f172a" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Chat</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={s.center}>
          <Text style={s.errorIcon}>⚠️</Text>
          <Text style={s.errorTitle}>Connection Failed</Text>
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={() => { setError(null); setLoading(true); }}>
            <Text style={s.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>
              {(otherName || 'C').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.headerName} numberOfLines={1}>{otherName || 'Consultation Chat'}</Text>
            <View style={s.statusRow}>
              {connected
                ? <><Wifi size={10} color="#10b981" /><Text style={s.statusOnline}> Connected</Text></>
                : <><WifiOff size={10} color="#ef4444" /><Text style={s.statusOffline}> Offline</Text></>
              }
            </View>
          </View>
        </View>
        {/* Video call button — only visible to doctors */}
        {myRole === 'doctor' && (
          <TouchableOpacity style={s.videoBtn} onPress={startVideoCall}>
            <Video size={18} color="#fff" />
          </TouchableOpacity>
        )}
        {myRole !== 'doctor' && <View style={{ width: 40 }} />}
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(m, i) => m.id || String(i)}
          contentContainerStyle={s.messageList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={s.emptyChat}>
              <Text style={s.emptyChatIcon}>💬</Text>
              <Text style={s.emptyChatTitle}>Start the conversation</Text>
              <Text style={s.emptyChatSub}>Messages are securely stored</Text>
            </View>
          }
          renderItem={({ item }) => <Bubble msg={item} myId={myId} />}
        />

        {/* Input */}
        <View style={s.inputBar}>
          <TextInput
            style={s.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="#94a3b8"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[s.sendBtn, !text.trim() && s.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!text.trim()}
          >
            <Send size={18} color={text.trim() ? '#fff' : '#94a3b8'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { color: '#64748b', marginTop: 12, fontSize: 14 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
    gap: 10,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#0f172a' },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  headerName: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
  statusOnline: { fontSize: 11, color: '#10b981', fontWeight: '600' },
  statusOffline: { fontSize: 11, color: '#ef4444', fontWeight: '600' },
  videoBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#10b981', shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
  },

  messageList: { padding: 16, paddingBottom: 8, flexGrow: 1 },
  bubbleWrap: { marginBottom: 6, flexDirection: 'row' },
  bubbleWrapMine: { justifyContent: 'flex-end' },
  bubbleWrapTheirs: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '78%', borderRadius: 18,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  bubbleMine: { backgroundColor: '#3b82f6', borderBottomRightRadius: 4 },
  bubbleTheirs: {
    backgroundColor: '#fff', borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  bubbleText: { fontSize: 15, color: '#1e293b', lineHeight: 21 },
  bubbleTextMine: { color: '#fff' },
  bubbleLink: {
    fontSize: 15, lineHeight: 21,
    color: '#2563eb', textDecorationLine: 'underline',
  },
  bubbleLinkMine: {
    color: '#bfdbfe', textDecorationLine: 'underline',
  },
  bubbleTime: { fontSize: 10, color: '#94a3b8', marginTop: 3, alignSelf: 'flex-end' },
  bubbleTimeMine: { color: 'rgba(255,255,255,0.65)' },

  emptyChat: { flex: 1, alignItems: 'center', paddingTop: 80 },
  emptyChatIcon: { fontSize: 48, marginBottom: 12 },
  emptyChatTitle: { fontSize: 17, fontWeight: '700', color: '#374151' },
  emptyChatSub: { fontSize: 13, color: '#9ca3af', marginTop: 4 },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0',
  },
  input: {
    flex: 1, minHeight: 44, maxHeight: 100,
    backgroundColor: '#f8fafc', borderRadius: 22,
    borderWidth: 1.5, borderColor: '#e2e8f0',
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 15, color: '#0f172a',
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#3b82f6',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#3b82f6', shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
  },
  sendBtnDisabled: { backgroundColor: '#f1f5f9', shadowOpacity: 0 },

  // Error state
  errorIcon: { fontSize: 48, marginBottom: 12 },
  errorTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 8 },
  errorText: { fontSize: 13, color: '#9ca3af', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  retryBtn: { backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 32 },
  retryBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
