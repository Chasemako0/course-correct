import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Swipeable } from 'react-native-gesture-handler';
import { supabase } from '../supabase';

export default function Planner({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [recurrence, setRecurrence] = useState('none');
  const [showPicker, setShowPicker] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  const formattedDateTime = (date) =>
    `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

  const fetchTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('planner_tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('datetime', { ascending: true });

    if (error) {
      Alert.alert("Error fetching tasks", error.message);
    } else {
      setTasks(data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSave = async () => {
    if (!taskTitle.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("Not logged in", "You must be logged in to save tasks.");
      return;
    }

    const payload = {
      title: taskTitle,
      datetime: selectedDate.toISOString(),
      recurring: recurrence,
      user_id: user.id,
    };

    let result;
    if (editTaskId) {
      result = await supabase
        .from('planner_tasks')
        .update(payload)
        .eq('id', editTaskId);
    } else {
      result = await supabase
        .from('planner_tasks')
        .insert(payload);
    }

    if (result.error) {
      Alert.alert("Error", result.error.message);
    } else {
      fetchTasks();
      setModalVisible(false);
      resetForm();
    }
  };

  const deleteTask = async (id) => {
    const { error } = await supabase
      .from('planner_tasks')
      .delete()
      .eq('id', id);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      fetchTasks();
    }
  };

  const openEditModal = (task) => {
    setTaskTitle(task.title);
    setSelectedDate(new Date(task.datetime));
    setRecurrence(task.recurring || 'none');
    setEditTaskId(task.id);
    setModalVisible(true);
  };

  const resetForm = () => {
    setTaskTitle('');
    setSelectedDate(new Date());
    setRecurrence('none');
    setEditTaskId(null);
  };

  const renderRightActions = (task) => (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        style={[styles.swipeButton, { backgroundColor: '#10b981' }]}
        onPress={() => openEditModal(task)}
      >
        <Icon name="create-outline" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.swipeButton, { backgroundColor: '#ef4444' }]}
        onPress={() => deleteTask(task.id)}
      >
        <Icon name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Icon name="arrow-back-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={{ marginTop: 100, paddingHorizontal: 24 }}>
        <Text style={styles.title}>Planner</Text>
        <Text style={styles.subText}>
          Your class schedule, reminders, and study sessions.
        </Text>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item)}>
            <View style={styles.taskCard}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskTime}>
                {formattedDateTime(new Date(item.datetime))}
              </Text>
              {item.recurring !== 'none' && (
                <Text style={styles.recurrence}>Repeats: {item.recurring}</Text>
              )}
            </View>
          </Swipeable>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Icon name="add" size={22} color="#fff" />
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{editTaskId ? 'Edit Task' : 'New Task'}</Text>
            <TextInput
              placeholder="Enter task title"
              style={styles.input}
              value={taskTitle}
              onChangeText={setTaskTitle}
            />

            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={styles.datePickerButton}
            >
              <Text style={styles.datePickerText}>{formattedDateTime(selectedDate)}</Text>
              <Icon name="calendar-outline" size={20} color="#1e3a8a" />
            </TouchableOpacity>

            {showPicker && (
              <View style={{ backgroundColor: '#1f2937', borderRadius: 12 }}>
                <DateTimePicker
                  value={selectedDate}
                  mode="datetime"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(e, date) => {
                    if (date) setSelectedDate(date);
                    setShowPicker(false);
                  }}
                  themeVariant="dark"
                />
              </View>
            )}

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={recurrence}
                onValueChange={(itemValue) => setRecurrence(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="No Repeat" value="none" />
                <Picker.Item label="Daily" value="daily" />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Monthly" value="monthly" />
              </Picker>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                <Text style={styles.saveText}>{editTaskId ? 'Update' : 'Save'}</Text>
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
  taskCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 24,
    elevation: 2,
  },
  taskTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  taskTime: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  recurrence: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
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
  modalView: { backgroundColor: '#fff', borderRadius: 12, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1f2937', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  datePickerText: { fontSize: 16, color: '#1f2937' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  cancelBtn: { padding: 10, marginRight: 8 },
  cancelText: { color: '#6b7280', fontWeight: '500' },
  saveBtn: { padding: 10, backgroundColor: '#1e3a8a', borderRadius: 8 },
  saveText: { color: '#fff', fontWeight: '600' },
  swipeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    marginVertical: 6,
    borderRadius: 10,
  },
  pickerContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  picker: {
    color: '#1f2937',
    height: 50,
  },
});
