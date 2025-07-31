import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, Modal, Alert, StyleSheet, ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { supabase } from '../supabase';

export default function CourseNote({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');

  const fetchNotes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('course_notes')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      Alert.alert('Error fetching notes', error.message);
    } else {
      const sorted = sortNotes(data);
      setNotes(sorted);
      setFilteredNotes(sorted);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [search, selectedTag, notes, sortOrder]);

  const sortNotes = (list) => {
    return [...list].sort((a, b) => {
      const aDate = new Date(a.created_at);
      const bDate = new Date(b.created_at);
      return sortOrder === 'newest' ? bDate - aDate : aDate - bDate;
    });
  };

  const filterNotes = () => {
    let filtered = sortNotes(notes);

    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(n =>
        (n.title || '').toLowerCase().includes(term) ||
        (n.content || '').toLowerCase().includes(term) ||
        (n.tags || []).some(t => t.toLowerCase().includes(term))
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(n => (n.tags || []).includes(selectedTag));
    }

    setFilteredNotes(filtered);
  };

  const addNote = async () => {
    if (!content.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const tagsArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const { error } = await supabase.from('course_notes').insert({
      title,
      content,
      tags: tagsArray,
      is_done: false,
      user_id: user.id,
    });

    if (error) {
      Alert.alert('Error adding note', error.message);
    } else {
      setTitle('');
      setContent('');
      setTags('');
      setModalVisible(false);
      fetchNotes();
    }
  };

  const toggleDone = async (note) => {
    const { error } = await supabase
      .from('course_notes')
      .update({ is_done: !note.is_done })
      .eq('id', note.id);

    if (!error) fetchNotes();
  };

  const deleteNote = (id) => {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('course_notes').delete().eq('id', id);
          if (!error) fetchNotes();
        },
      },
    ]);
  };

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags || [])));

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Icon name="arrow-back-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Course Notes</Text>

      <TextInput
        placeholder="Search notes or tags..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />



      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity onPress={() => setSortOrder('newest')} style={[styles.sortBtn, sortOrder === 'newest' && styles.tagActive]}>
          <Text style={styles.sortText}>Newest</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortOrder('oldest')} style={[styles.sortBtn, sortOrder === 'oldest' && styles.tagActive]}>
          <Text style={styles.sortText}>Oldest</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={[styles.noteCard, item.is_done && styles.noteDone]}>
            <View style={styles.noteHeader}>
              <TouchableOpacity onPress={() => toggleDone(item)}>
                <Icon
                  name={item.is_done ? 'checkbox-outline' : 'square-outline'}
                  size={24}
                  color="#1e3a8a"
                />
              </TouchableOpacity>
              <Text style={[styles.noteTitle, item.is_done && styles.strike]}>{item.title}</Text>
              <TouchableOpacity onPress={() => deleteNote(item.id)}>
                <Icon name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.noteText, item.is_done && styles.strike]}>{item.content}</Text>
            <View style={styles.noteTags}>
              {(item.tags || []).map((tag, i) => (
                <Text key={i} style={styles.noteTag}>{tag}</Text>
              ))}
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={22} color="#fff" />
        <Text style={styles.addButtonText}>Add Note</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>New Note</Text>
            <TextInput
              placeholder="Enter title"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              placeholder="Enter notes..."
              style={[styles.input, { height: 100 }]}
              multiline
              value={content}
              onChangeText={setContent}
            />
            <TextInput
              placeholder="Tags (comma-separated)"
              style={styles.input}
              value={tags}
              onChangeText={setTags}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addNote} style={styles.saveBtn}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', color: '#1f2937', marginTop: 100, marginBottom: 10, textAlign: 'center' },
  search: {
    marginHorizontal: 24, borderWidth: 1, borderColor: '#d1d5db',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16,
  },
  tagsContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12 },
  tag: {
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: '#e5e7eb', borderRadius: 20, marginRight: 8,
  },

  tagText: { color: '#1f2937', fontWeight: '200' },
  sortRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, marginBottom: 10,
  },
  sortLabel: { fontSize: 14, marginRight: 8 },
  sortBtn: {
    paddingHorizontal: 12, paddingVertical: 4,
    backgroundColor: '#e5e7eb', borderRadius: 12, marginRight: 8,
  },
  sortText: { color: '#1f2937', fontWeight: '500' },
noteCard: {
  backgroundColor: '#ffffff', // was dark blue, change to white
  padding: 16,
  borderRadius: 12,
  marginHorizontal: 24,
  marginBottom: 12,
  elevation: 2,
},

  noteHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 8,
  },
noteTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#1f2937', // dark gray
  flex: 1,
  marginLeft: 8,
},
noteText: {
  fontSize: 14,
  color: '#1f2937',
},

  noteTags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  noteTag: {
    backgroundColor: '#dbeafe', color: '#1e3a8a',
    fontSize: 12, paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 12, marginRight: 6, marginBottom: 4,
  },
  strike: { textDecorationLine: 'line-through', color: '#9ca3af' },
  noteDone: { backgroundColor: '#f1f5f9' },
  addButton: {
    position: 'absolute', bottom: 80, right: 24,
    backgroundColor: '#1e3a8a', flexDirection: 'row',
    alignItems: 'center', paddingVertical: 10,
    paddingHorizontal: 16, borderRadius: 30, elevation: 5,
  },
  addButtonText: { color: '#fff', marginLeft: 8, fontWeight: '600', fontSize: 14 },
  modalOverlay: {
    flex: 1, justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 24,
  },
  modalView: { backgroundColor: '#fff', borderRadius: 12, padding: 24 },
  modalTitle: {
    fontSize: 20, fontWeight: '700',
    color: '#1f2937', marginBottom: 12,
  },
  input: {
    borderWidth: 1, borderColor: '#d1d5db',
    borderRadius: 8, paddingHorizontal: 12,
    paddingVertical: 10, fontSize: 16, marginBottom: 16,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  cancelBtn: { padding: 10, marginRight: 8 },
  cancelText: { color: '#6b7280', fontWeight: '500' },
  saveBtn: { padding: 10, backgroundColor: '#1e3a8a', borderRadius: 8 },
  saveText: { color: '#fff', fontWeight: '600' },
  backBtn: {
    position: 'absolute', top: 40, left: 20, zIndex: 10,
    backgroundColor: '#1e3a8a', padding: 8, borderRadius: 30,
  },
});
