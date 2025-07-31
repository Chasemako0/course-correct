import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Swipeable } from 'react-native-gesture-handler';
import { supabase } from '../supabase';

export default function Todo({ navigation }) {
  const [todos, setTodos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  const fetchTodos = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('todo_items')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      Alert.alert('Error fetching todos', error.message);
    } else {
      setTodos(data);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTitle.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('todo_items').insert({
      title: newTitle,
      user_id: user.id,
    });

    if (error) {
      Alert.alert('Error adding todo', error.message);
    } else {
      setNewTitle('');
      setModalVisible(false);
      fetchTodos();
    }
  };

  const toggleTodo = async (id, currentStatus) => {
    const { error } = await supabase
      .from('todo_items')
      .update({ completed: !currentStatus })
      .eq('id', id);

    if (error) {
      Alert.alert('Error updating status', error.message);
    } else {
      fetchTodos();
    }
  };

  const deleteTodo = async (id) => {
    const { error } = await supabase.from('todo_items').delete().eq('id', id);
    if (error) {
      Alert.alert('Error deleting', error.message);
    } else {
      fetchTodos();
    }
  };

  const renderRightActions = (item) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => deleteTodo(item.id)}
    >
      <Icon name="trash-outline" size={22} color="#fff" />
    </TouchableOpacity>
  );

  const filteredTodos = (filter === 'all'
    ? todos
    : todos.filter((item) =>
        filter === 'completed' ? item.completed : !item.completed
      )
  ).sort((a, b) =>
    sortOrder === 'asc'
      ? new Date(a.created_at) - new Date(b.created_at)
      : new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Icon name="arrow-back-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={{ marginTop: 100, paddingHorizontal: 24 }}>
        <Text style={styles.title}>TO-DO</Text>
        <Text style={styles.subText}>Stay on track with your tasks</Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterBar}>
        {['all', 'active', 'completed'].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.filterButton,
              filter === f && styles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort Button */}
      <View style={styles.sortBar}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          <Icon
            name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
            size={16}
            color="#1e3a8a"
          />
          <Text style={styles.sortButtonText}>
            {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item)}>
            <TouchableOpacity
              style={styles.todoCard}
              onPress={() => toggleTodo(item.id, item.completed)}
            >
              <Icon
                name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={item.completed ? '#10b981' : '#9ca3af'}
              />
              <Text
                style={[
                  styles.todoText,
                  item.completed && {
                    textDecorationLine: 'line-through',
                    color: '#9ca3af',
                  },
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          </Swipeable>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Icon name="add" size={22} color="#fff" />
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>New To-Do</Text>
            <TextInput
              placeholder="Enter task"
              style={styles.input}
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addTodo} style={styles.saveBtn}>
                <Text style={styles.saveText}>Add</Text>
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
  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: '#1e3a8a',
    padding: 8,
    borderRadius: 30,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#1f2937' },
  subText: { fontSize: 16, color: '#6b7280', marginBottom: 20 },
  todoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 12,
    elevation: 2,
  },
  todoText: { fontSize: 16, fontWeight: '500', color: '#1f2937' },
  deleteButton: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    marginVertical: 6,
    borderRadius: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 80,
    right: 24,
    backgroundColor: '#1e3a8a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    elevation: 5,
  },
  addButtonText: { color: '#fff', marginLeft: 8, fontWeight: '600', fontSize: 14 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 24,
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  cancelBtn: { padding: 10, marginRight: 8 },
  cancelText: { color: '#6b7280', fontWeight: '500' },
  saveBtn: { padding: 10, backgroundColor: '#1e3a8a', borderRadius: 8 },
  saveText: { color: '#fff', fontWeight: '600' },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#1e3a8a',
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  sortBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sortButtonText: {
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '500',
  },
});
