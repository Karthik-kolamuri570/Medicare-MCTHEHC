import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
  Modal, ScrollView, ActivityIndicator, Alert, TextInput,
  KeyboardAvoidingView, Platform, RefreshControl
} from 'react-native';
import {
  ArrowLeft, BookOpen, Plus, Heart, MessageCircle,
  Calendar, Edit3, Trash2, X, Send, Tag, CheckCircle, Clock
} from 'lucide-react-native';
import api from '../services/api';

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const CATEGORIES = [
  'Cardiology','Pediatrics','Diet & Nutrition','Neurology',
  'Dermatology','Orthopedics','Psychiatry','Fitness','General'
];

const STATUS_COLORS = { published: '#10b981', draft: '#f59e0b' };
const STATUS_ICONS  = {
  published: <CheckCircle size={13} color="#10b981" />,
  draft:     <Clock size={13} color="#f59e0b" />,
};

// ─── Blog Card (Doctor's) ─────────────────────────────────────────────────────
function DoctorBlogCard({ blog, onEdit, onDelete }) {
  const status = blog.status || 'draft';
  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={s.cardTitle} numberOfLines={2}>{blog.title}</Text>
          <Text style={s.cardDesc} numberOfLines={1}>{blog.description}</Text>
        </View>
        <View style={[s.statusBadge, { backgroundColor: `${STATUS_COLORS[status]}18` }]}>
          {STATUS_ICONS[status]}
          <Text style={[s.statusText, { color: STATUS_COLORS[status] }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>

      {blog.tags?.length > 0 && (
        <View style={s.tagsRow}>
          {blog.tags.slice(0, 4).map(t => (
            <View key={t} style={s.tag}>
              <Tag size={9} color="#64748b" />
              <Text style={s.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={s.cardMeta}>
        <Calendar size={12} color="#94a3b8" />
        <Text style={s.metaText}>{fmtDate(blog.createdAt)}</Text>
        <Heart size={12} color="#ef4444" style={{ marginLeft: 12 }} />
        <Text style={s.metaText}>{blog.likes_count || 0}</Text>
        <MessageCircle size={12} color="#3b82f6" style={{ marginLeft: 12 }} />
        <Text style={s.metaText}>{blog.comments_count || 0}</Text>
      </View>

      <View style={s.cardActions}>
        <TouchableOpacity style={s.editBtn} onPress={() => onEdit(blog)}>
          <Edit3 size={14} color="#3b82f6" />
          <Text style={s.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.deleteBtn} onPress={() => onDelete(blog)}>
          <Trash2 size={14} color="#ef4444" />
          <Text style={s.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Blog Editor Modal ────────────────────────────────────────────────────────
function BlogEditorModal({ visible, blog, onClose, onSaved }) {
  const isEdit = !!blog;
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [content,     setContent]     = useState('');
  const [tags,        setTags]        = useState('');
  const [category,    setCategory]    = useState('General');
  const [status,      setStatus]      = useState('draft');
  const [saving,      setSaving]      = useState(false);

  // Populate when editing
  useEffect(() => {
    if (blog) {
      setTitle(blog.title || '');
      setDescription(blog.description || '');
      setContent(blog.content || '');
      setTags((blog.tags || []).join(', '));
      setStatus(blog.status || 'draft');
    } else {
      setTitle(''); setDescription(''); setContent('');
      setTags(''); setCategory('General'); setStatus('draft');
    }
  }, [blog, visible]);

  const validate = () => {
    if (!title.trim() || title.trim().length < 5) {
      Alert.alert('Validation', 'Title must be at least 5 characters.'); return false;
    }
    if (!description.trim() || description.trim().length < 10) {
      Alert.alert('Validation', 'Description must be at least 10 characters.'); return false;
    }
    if (!content.trim() || content.trim().length < 50) {
      Alert.alert('Validation', 'Content must be at least 50 characters.'); return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = {
      title:       title.trim(),
      description: description.trim(),
      content:     content.trim(),
      tags:        tags.split(',').map(t => t.trim()).filter(Boolean),
      status,
    };
    try {
      if (isEdit) {
        await api.put(`/blogs/update-blog/${blog._id}`, payload);
        Alert.alert('Updated ✅', 'Blog updated successfully.');
      } else {
        await api.post('/blogs/create-blog', payload);
        Alert.alert('Published 📢', status === 'published' ? 'Blog is now live!' : 'Blog saved as draft.');
      }
      onSaved();
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to save blog. Try again.';
      Alert.alert('Error', msg);
    } finally { setSaving(false); }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={s.modalContainer}>
        <View style={s.modalHeader}>
          <TouchableOpacity style={s.closeBtn} onPress={onClose}>
            <X size={20} color="#0f172a" />
          </TouchableOpacity>
          <Text style={s.modalTitle}>{isEdit ? 'Edit Blog' : 'New Blog'}</Text>
          <TouchableOpacity
            style={[s.saveBtn, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator size="small" color="#fff" />
              : <><Send size={14} color="#fff" /><Text style={s.saveBtnText}>Save</Text></>
            }
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={s.editorContent} showsVerticalScrollIndicator={false}>

            {/* Status toggle */}
            <Text style={s.fieldLabel}>Status</Text>
            <View style={s.statusRow}>
              {['draft','published'].map(st => (
                <TouchableOpacity
                  key={st}
                  style={[s.statusPill, status === st && { backgroundColor: STATUS_COLORS[st], borderColor: STATUS_COLORS[st] }]}
                  onPress={() => setStatus(st)}
                >
                  <Text style={[s.statusPillText, status === st && { color: '#fff' }]}>
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Title */}
            <Text style={s.fieldLabel}>Title *</Text>
            <TextInput
              style={s.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. 10 Essential Heart-Healthy Habits"
              placeholderTextColor="#94a3b8"
              maxLength={200}
            />
            <Text style={s.charCount}>{title.length}/200</Text>

            {/* Description */}
            <Text style={s.fieldLabel}>Description * (shown in feed)</Text>
            <TextInput
              style={[s.input, { height: 80 }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Brief summary visible in the blog list..."
              placeholderTextColor="#94a3b8"
              multiline
              maxLength={500}
            />
            <Text style={s.charCount}>{description.length}/500</Text>

            {/* Category (stored as tag) */}
            <Text style={s.fieldLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll}>
              {CATEGORIES.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[s.catPill, category === c && s.catPillActive]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[s.catText, category === c && { color: '#fff' }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Tags */}
            <Text style={s.fieldLabel}>Tags (comma separated)</Text>
            <TextInput
              style={s.input}
              value={tags}
              onChangeText={setTags}
              placeholder="e.g. heart, diet, wellness"
              placeholderTextColor="#94a3b8"
            />

            {/* Content */}
            <Text style={s.fieldLabel}>Content * (full article)</Text>
            <TextInput
              style={[s.input, { height: 200 }]}
              value={content}
              onChangeText={setContent}
              placeholder="Write your full article here (minimum 50 characters)..."
              placeholderTextColor="#94a3b8"
              multiline
            />
            <Text style={s.charCount}>{content.length} characters</Text>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function DBlogsScreen({ navigation }) {
  const [blogs,     setBlogs]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);
  const [editBlog, setEditBlog]   = useState(null); // null = new, blog = edit mode

  const loadBlogs = useCallback(async () => {
    try {
      const res = await api.get('/blogs/doctor/blogs');
      const raw = Array.isArray(res.data) ? res.data : (res.data?.blogs || []);
      setBlogs(raw.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error('DBlogs load error:', err?.response?.data || err.message);
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { loadBlogs(); }, []);

  const onRefresh = () => { setRefreshing(true); loadBlogs(); };

  const openNew  = () => { setEditBlog(null); setEditorVisible(true); };
  const openEdit = (blog) => { setEditBlog(blog); setEditorVisible(true); };

  const handleDelete = (blog) => {
    Alert.alert(
      'Delete Blog',
      `Are you sure you want to delete "${blog.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/blogs/delete-blog/${blog._id}`);
              setBlogs(prev => prev.filter(b => b._id !== blog._id));
            } catch (err) {
              Alert.alert('Error', err?.response?.data?.message || 'Failed to delete blog.');
            }
          }
        }
      ]
    );
  };

  const publishedCount = blogs.filter(b => b.status === 'published').length;
  const draftCount     = blogs.filter(b => b.status === 'draft').length;

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Articles</Text>
        <TouchableOpacity style={s.newBtn} onPress={openNew}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats bar */}
      {!loading && blogs.length > 0 && (
        <View style={s.statsBar}>
          <View style={s.statItem}>
            <Text style={s.statNum}>{blogs.length}</Text>
            <Text style={s.statLabel}>Total</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={[s.statNum, { color: '#10b981' }]}>{publishedCount}</Text>
            <Text style={s.statLabel}>Published</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={[s.statNum, { color: '#f59e0b' }]}>{draftCount}</Text>
            <Text style={s.statLabel}>Drafts</Text>
          </View>
        </View>
      )}

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={s.loadingText}>Loading your articles...</Text>
        </View>
      ) : (
        <FlatList
          data={blogs}
          keyExtractor={b => b._id}
          renderItem={({ item }) => (
            <DoctorBlogCard
              blog={item}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyIcon}>✍️</Text>
              <Text style={s.emptyTitle}>No articles yet</Text>
              <Text style={s.emptySub}>Tap the + button to write your first health article</Text>
              <TouchableOpacity style={s.emptyBtn} onPress={openNew}>
                <Plus size={16} color="#fff" />
                <Text style={s.emptyBtnText}>Write Article</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Editor Modal */}
      <BlogEditorModal
        visible={editorVisible}
        blog={editBlog}
        onClose={() => setEditorVisible(false)}
        onSaved={loadBlogs}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#f8fafc' },
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#64748b', marginTop: 12, fontSize: 14 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
    alignItems: 'center', justifyContent: 'center',
  },
  newBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },

  statsBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statNum: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  statLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: '#e2e8f0' },

  listContent: { padding: 16, paddingBottom: 40 },

  // Doctor blog card
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: '#e2e8f0',
    shadowColor: '#0f172a', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  cardTop: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a', lineHeight: 21 },
  cardDesc: { fontSize: 12, color: '#64748b', marginTop: 3 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, height: 28, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '700' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#f1f5f9', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3,
  },
  tagText: { fontSize: 11, color: '#64748b', fontWeight: '600' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  metaText: { fontSize: 11, color: '#94a3b8', marginLeft: 4 },
  cardActions: { flexDirection: 'row', gap: 10 },
  editBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#eff6ff', borderRadius: 10, borderWidth: 1, borderColor: '#bfdbfe', paddingVertical: 9,
  },
  editBtnText: { color: '#3b82f6', fontWeight: '700', fontSize: 13 },
  deleteBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#fff1f2', borderRadius: 10, borderWidth: 1, borderColor: '#fecdd3', paddingVertical: 9,
  },
  deleteBtnText: { color: '#ef4444', fontWeight: '700', fontSize: 13 },

  // Empty
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 52, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#374151' },
  emptySub: { fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 6, maxWidth: 260 },
  emptyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#3b82f6', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, marginTop: 20,
  },
  emptyBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  // Editor modal
  modalContainer: { flex: 1, backgroundColor: '#f8fafc' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
    alignItems: 'center', justifyContent: 'center',
  },
  modalTitle: { flex: 1, fontSize: 17, fontWeight: '800', color: '#0f172a' },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#3b82f6', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
  },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  editorContent: { padding: 20, paddingBottom: 60 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1.5, borderColor: '#e2e8f0',
    paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: '#0f172a',
    textAlignVertical: 'top',
  },
  charCount: { fontSize: 11, color: '#94a3b8', textAlign: 'right', marginTop: 4 },

  statusRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  statusPill: {
    paddingHorizontal: 20, paddingVertical: 9, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#e2e8f0', backgroundColor: '#f8fafc',
  },
  statusPillText: { fontSize: 13, fontWeight: '700', color: '#64748b' },

  catScroll: { marginBottom: 4 },
  catPill: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#f1f5f9', borderWidth: 1.5, borderColor: '#e2e8f0', marginRight: 8,
  },
  catPillActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  catText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
});
