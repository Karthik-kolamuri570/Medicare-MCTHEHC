import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, Modal, ScrollView,
  RefreshControl, Alert, KeyboardAvoidingView, Platform, Image
} from 'react-native';
import {
  ArrowLeft, Search, Heart, MessageCircle, Calendar,
  User, Tag, Send, X, BookOpen, ChevronRight, RefreshCw
} from 'lucide-react-native';
import api from '../services/api';

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const TAGS_COLORS = [
  '#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899'
];
const tagColor = (tag) => TAGS_COLORS[tag.charCodeAt(0) % TAGS_COLORS.length];

// ─── Blog Card ────────────────────────────────────────────────────────────────
function BlogCard({ blog, onPress, onLike, liked }) {
  const author = blog.doctor_id?.name ? `Dr. ${blog.doctor_id.name}` : 'Doctor';
  return (
    <TouchableOpacity style={s.card} onPress={() => onPress(blog)} activeOpacity={0.85}>
      {blog.image_url ? (
        <Image source={{ uri: blog.image_url }} style={s.cardImg} resizeMode="cover" />
      ) : (
        <View style={s.cardImgPlaceholder}>
          <BookOpen size={32} color="#cbd5e1" />
        </View>
      )}

      <View style={s.cardBody}>
        {/* Tags */}
        {blog.tags?.length > 0 && (
          <View style={s.tagsRow}>
            {blog.tags.slice(0, 3).map(t => (
              <View key={t} style={[s.tag, { backgroundColor: `${tagColor(t)}18` }]}>
                <Text style={[s.tagText, { color: tagColor(t) }]}>{t}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={s.cardTitle} numberOfLines={2}>{blog.title}</Text>
        <Text style={s.cardDesc} numberOfLines={2}>{blog.description}</Text>

        <View style={s.cardMeta}>
          <View style={s.metaLeft}>
            <User size={12} color="#94a3b8" />
            <Text style={s.metaText}>{author}</Text>
          </View>
          <View style={s.metaLeft}>
            <Calendar size={12} color="#94a3b8" />
            <Text style={s.metaText}>{fmtDate(blog.createdAt)}</Text>
          </View>
        </View>

        <View style={s.cardFooter}>
          <TouchableOpacity style={s.likeBtn} onPress={() => onLike(blog._id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Heart size={16} color={liked ? '#ef4444' : '#94a3b8'} fill={liked ? '#ef4444' : 'none'} />
            <Text style={[s.likeCount, liked && { color: '#ef4444' }]}>
              {blog.likes_count || 0}
            </Text>
          </TouchableOpacity>
          <View style={s.likeBtn}>
            <MessageCircle size={16} color="#94a3b8" />
            <Text style={s.likeCount}>{blog.comments_count || 0}</Text>
          </View>
          <View style={s.readMore}>
            <Text style={s.readMoreText}>Read</Text>
            <ChevronRight size={14} color="#3b82f6" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Blog Detail Modal ────────────────────────────────────────────────────────
function BlogDetailModal({ blog, visible, onClose, onLike, liked }) {
  const [comments, setComments]       = useState([]);
  const [commentsLoading, setCL]      = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting]   = useState(false);

  const loadComments = useCallback(async () => {
    if (!blog?._id) return;
    setCL(true);
    try {
      const res = await api.get(`/blogs/${blog._id}/comments`);
      setComments(res.data?.comments || []);
    } catch { setComments([]); }
    finally { setCL(false); }
  }, [blog?._id]);

  useEffect(() => {
    if (visible && blog?._id) loadComments();
  }, [visible, blog?._id]);

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/blogs/add-comment', {
        blog_id: blog._id,
        comment_text: commentText.trim(),
      });
      setCommentText('');
      loadComments();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to post comment';
      Alert.alert('Error', msg);
    } finally { setSubmitting(false); }
  };

  if (!blog) return null;
  const author = blog.doctor_id?.name ? `Dr. ${blog.doctor_id.name}` : 'Doctor';

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={s.modalContainer}>
        {/* Modal Header */}
        <View style={s.modalHeader}>
          <TouchableOpacity style={s.modalBack} onPress={onClose}>
            <X size={20} color="#0f172a" />
          </TouchableOpacity>
          <Text style={s.modalHeaderTitle} numberOfLines={1}>{blog.title}</Text>
          <TouchableOpacity style={s.modalLike} onPress={() => onLike(blog._id)}>
            <Heart size={20} color={liked ? '#ef4444' : '#94a3b8'} fill={liked ? '#ef4444' : 'none'} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={s.modalContent} showsVerticalScrollIndicator={false}>
            {/* Cover image */}
            {blog.image_url && (
              <Image source={{ uri: blog.image_url }} style={s.modalImg} resizeMode="cover" />
            )}

            {/* Author + date */}
            <View style={s.authorRow}>
              <View style={s.authorAvatar}>
                <Text style={s.authorInitial}>
                  {(blog.doctor_id?.name || 'D')[0].toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={s.authorName}>{author}</Text>
                <Text style={s.authorDate}>{fmtDate(blog.createdAt)}</Text>
              </View>
            </View>

            {/* Tags */}
            {blog.tags?.length > 0 && (
              <View style={[s.tagsRow, { marginBottom: 16 }]}>
                {blog.tags.map(t => (
                  <View key={t} style={[s.tag, { backgroundColor: `${tagColor(t)}18` }]}>
                    <Tag size={10} color={tagColor(t)} />
                    <Text style={[s.tagText, { color: tagColor(t) }]}>{t}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Title & Description */}
            <Text style={s.detailTitle}>{blog.title}</Text>
            <Text style={s.detailDesc}>{blog.description}</Text>

            {/* Divider */}
            <View style={s.divider} />

            {/* Content */}
            <Text style={s.detailContent}>{blog.content || '(Content not available)'}</Text>

            {/* Stats */}
            <View style={s.statsRow}>
              <View style={s.stat}>
                <Heart size={14} color="#ef4444" fill="#ef4444" />
                <Text style={s.statText}>{blog.likes_count || 0} Likes</Text>
              </View>
              <View style={s.stat}>
                <MessageCircle size={14} color="#3b82f6" />
                <Text style={s.statText}>{blog.comments_count || 0} Comments</Text>
              </View>
            </View>

            <View style={s.divider} />

            {/* Comments */}
            <Text style={s.commentsTitle}>Comments</Text>
            {commentsLoading ? (
              <ActivityIndicator color="#3b82f6" style={{ marginVertical: 12 }} />
            ) : comments.length === 0 ? (
              <Text style={s.noComments}>No comments yet. Be the first!</Text>
            ) : (
              comments.map(c => (
                <View key={c._id} style={s.commentCard}>
                  <View style={s.commentAvatar}>
                    <Text style={s.commentInitial}>
                      {(c.patient_id?.name || 'P')[0].toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.commentAuthor}>{c.patient_id?.name || 'Patient'}</Text>
                    <Text style={s.commentText}>{c.comment_text}</Text>
                    <Text style={s.commentDate}>{fmtDate(c.createdAt)}</Text>
                    {/* Replies */}
                    {c.replies?.map(r => (
                      <View key={r._id} style={s.replyCard}>
                        <Text style={s.replyAuthor}>{r.patient_id?.name || 'Patient'}</Text>
                        <Text style={s.replyText}>{r.comment_text}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Comment input */}
          <View style={s.commentInput}>
            <TextInput
              style={s.commentBox}
              placeholder="Write a comment..."
              placeholderTextColor="#94a3b8"
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={300}
            />
            <TouchableOpacity
              style={[s.commentSend, !commentText.trim() && { opacity: 0.4 }]}
              onPress={handleComment}
              disabled={!commentText.trim() || submitting}
            >
              {submitting
                ? <ActivityIndicator size="small" color="#fff" />
                : <Send size={16} color="#fff" />
              }
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function BlogsScreen({ navigation }) {
  const [blogs, setBlogs]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch]       = useState('');
  const [searching, setSearching] = useState(false);
  const [likedIds, setLikedIds]   = useState(new Set());
  const [selectedBlog, setSelected] = useState(null);
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(true);
  const searchTimer               = useRef(null);

  const loadBlogs = useCallback(async (pg = 1, reset = false) => {
    if (pg === 1) setLoading(true);
    try {
      const res = await api.get('/blogs/blogs', { params: { page: pg, limit: 10 } });
      const data  = res.data?.blogs || [];
      const total = res.data?.pagination?.totalPages || 1;
      setBlogs(prev => reset || pg === 1 ? data : [...prev, ...data]);
      setHasMore(pg < total);
      setPage(pg);
    } catch (err) {
      console.error('Blogs load error:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const searchBlogs = useCallback(async (q) => {
    setSearching(true);
    try {
      const res = await api.get('/blogs/blogs/search', { params: { query: q, limit: 20 } });
      setBlogs(res.data?.blogs || []);
      setHasMore(false);
    } catch {
      setBlogs([]);
    } finally { setSearching(false); }
  }, []);

  useEffect(() => { loadBlogs(1, true); }, []);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    if (!search.trim()) { loadBlogs(1, true); return; }
    searchTimer.current = setTimeout(() => searchBlogs(search.trim()), 400);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  const onRefresh = () => { setRefreshing(true); setSearch(''); loadBlogs(1, true); };

  const loadMore = () => {
    if (hasMore && !loading && !search) loadBlogs(page + 1);
  };

  const handleLike = async (blogId) => {
    const wasLiked = likedIds.has(blogId);
    // Optimistic update
    setLikedIds(prev => {
      const n = new Set(prev);
      wasLiked ? n.delete(blogId) : n.add(blogId);
      return n;
    });
    setBlogs(prev => prev.map(b =>
      b._id === blogId
        ? { ...b, likes_count: (b.likes_count || 0) + (wasLiked ? -1 : 1) }
        : b
    ));
    try {
      await api.post('/blogs/like/toggle', { blog_id: blogId });
    } catch (err) {
      // Revert on error
      setLikedIds(prev => {
        const n = new Set(prev);
        wasLiked ? n.add(blogId) : n.delete(blogId);
        return n;
      });
    }
  };

  const openBlog = async (blog) => {
    try {
      // Fetch full blog (includes content + signed image_url)
      const res = await api.get(`/blogs/blog/${blog._id}`);
      const full = res.data?.data || res.data || blog;
      setSelected(full);
    } catch {
      setSelected(blog);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Health Blogs</Text>
        <TouchableOpacity style={s.refreshBtn} onPress={onRefresh}>
          <RefreshCw size={18} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={s.searchBar}>
        {searching
          ? <ActivityIndicator size="small" color="#3b82f6" style={{ marginRight: 8 }} />
          : <Search size={16} color="#94a3b8" style={{ marginRight: 8 }} />
        }
        <TextInput
          style={s.searchInput}
          placeholder="Search blogs by title, content, tags..."
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

      {loading && page === 1 ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={s.loadingText}>Loading health blogs...</Text>
        </View>
      ) : (
        <FlatList
          data={blogs}
          keyExtractor={b => b._id}
          renderItem={({ item }) => (
            <BlogCard
              blog={item}
              onPress={openBlog}
              onLike={handleLike}
              liked={likedIds.has(item._id)}
            />
          )}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={hasMore && !search ? (
            <ActivityIndicator color="#3b82f6" style={{ marginVertical: 16 }} />
          ) : null}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyIcon}>📝</Text>
              <Text style={s.emptyTitle}>
                {search ? 'No blogs match your search' : 'No blogs published yet'}
              </Text>
              <Text style={s.emptySub}>
                {search ? 'Try different keywords' : 'Check back soon for health insights'}
              </Text>
            </View>
          }
        />
      )}

      {/* Blog Detail Modal */}
      <BlogDetailModal
        blog={selectedBlog}
        visible={!!selectedBlog}
        onClose={() => setSelected(null)}
        onLike={handleLike}
        liked={selectedBlog ? likedIds.has(selectedBlog._id) : false}
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
  refreshBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#eff6ff', borderWidth: 1.5, borderColor: '#bfdbfe',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginVertical: 12,
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1.5, borderColor: '#e2e8f0',
    paddingHorizontal: 14, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a' },

  listContent: { padding: 16, paddingBottom: 32 },

  // Blog card
  card: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#e2e8f0',
    shadowColor: '#0f172a', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    overflow: 'hidden',
  },
  cardImg: { width: '100%', height: 160 },
  cardImgPlaceholder: {
    width: '100%', height: 100,
    backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center',
  },
  cardBody: { padding: 14 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  tagText: { fontSize: 11, fontWeight: '700' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', lineHeight: 22 },
  cardDesc: { fontSize: 13, color: '#64748b', lineHeight: 18, marginTop: 6 },
  cardMeta: { flexDirection: 'row', gap: 16, marginTop: 10 },
  metaLeft: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: '#94a3b8' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginRight: 16 },
  likeCount: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  readMore: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 2 },
  readMoreText: { fontSize: 12, color: '#3b82f6', fontWeight: '700' },

  // Empty
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#374151' },
  emptySub: { fontSize: 13, color: '#9ca3af', marginTop: 4, textAlign: 'center' },

  // Detail modal
  modalContainer: { flex: 1, backgroundColor: '#f8fafc' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  modalBack: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
    alignItems: 'center', justifyContent: 'center',
  },
  modalHeaderTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: '#0f172a' },
  modalLike: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#fff1f2', borderWidth: 1.5, borderColor: '#fecdd3',
    alignItems: 'center', justifyContent: 'center',
  },
  modalContent: { padding: 16, paddingBottom: 80 },
  modalImg: { width: '100%', height: 200, borderRadius: 14, marginBottom: 16 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  authorAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center',
  },
  authorInitial: { color: '#fff', fontWeight: '800', fontSize: 16 },
  authorName: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  authorDate: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  detailTitle: { fontSize: 22, fontWeight: '800', color: '#0f172a', lineHeight: 30, marginBottom: 10 },
  detailDesc: { fontSize: 15, color: '#64748b', lineHeight: 22, marginBottom: 6, fontStyle: 'italic' },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 16 },
  detailContent: { fontSize: 15, color: '#374151', lineHeight: 24 },
  statsRow: { flexDirection: 'row', gap: 20, marginTop: 16 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 13, color: '#64748b', fontWeight: '600' },

  // Comments
  commentsTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  noComments: { fontSize: 13, color: '#94a3b8', textAlign: 'center', paddingVertical: 16 },
  commentCard: {
    flexDirection: 'row', gap: 10, marginBottom: 14,
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#f1f5f9',
  },
  commentAvatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#8b5cf6', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  commentInitial: { color: '#fff', fontWeight: '800', fontSize: 13 },
  commentAuthor: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  commentText: { fontSize: 13, color: '#374151', lineHeight: 18, marginTop: 3 },
  commentDate: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  replyCard: {
    marginTop: 8, backgroundColor: '#f8fafc',
    borderRadius: 8, padding: 8, borderLeftWidth: 2, borderLeftColor: '#8b5cf6',
  },
  replyAuthor: { fontSize: 12, fontWeight: '700', color: '#374151' },
  replyText: { fontSize: 12, color: '#64748b', marginTop: 2 },

  // Comment input
  commentInput: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0',
  },
  commentBox: {
    flex: 1, minHeight: 40, maxHeight: 100,
    backgroundColor: '#f8fafc', borderRadius: 20,
    borderWidth: 1.5, borderColor: '#e2e8f0',
    paddingHorizontal: 14, paddingVertical: 8,
    fontSize: 14, color: '#0f172a',
  },
  commentSend: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center',
  },
});
