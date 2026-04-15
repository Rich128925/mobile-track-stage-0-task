import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../constants/Colors';

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const STORAGE_KEY = '@smart-toolkit-tasks';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Unable to load tasks', error);
    }
  };

  const storeTasks = async (updatedTasks: Task[]) => {
    try {
      setTasks(updatedTasks);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.warn('Unable to save tasks', error);
    }
  };

  const handleAddOrUpdate = async () => {
    const title = taskTitle.trim();
    if (!title) {
      Alert.alert('Enter a task', 'Please provide a task description before saving.');
      return;
    }

    setIsSaving(true);
    const updatedTasks = editingId
      ? tasks.map(task => task.id === editingId ? { ...task, title } : task)
      : [{ id: Date.now().toString(), title, completed: false }, ...tasks];

    await storeTasks(updatedTasks);
    setTaskTitle('');
    setEditingId(null);
    setIsSaving(false);
  };

  const handleToggleComplete = async (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    await storeTasks(updatedTasks);
  };

  const handleEditTask = (task: Task) => {
    setTaskTitle(task.title);
    setEditingId(task.id);
  };

  const handleDeleteTask = (id: string) => {
    Alert.alert(
      'Delete task',
      'Are you sure you want to remove this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedTasks = tasks.filter(task => task.id !== id);
            await storeTasks(updatedTasks);
          },
        },
      ]
    );
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTaskTitle('');
  };

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Task Manager</Text>
        <Text style={styles.screenSubtitle}>Create, track, and persist your checklist offline.</Text>

        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>{tasks.length}</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Completed</Text>
              <Text style={styles.statValue}>{completedCount}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <Input
            label={editingId ? 'Edit Task' : 'New Task'}
            placeholder="Add your next checklist item"
            value={taskTitle}
            onChangeText={setTaskTitle}
          />
          <View style={styles.buttonRow}>
            <Button
              title={editingId ? 'Save Task' : 'Add Task'}
              onPress={handleAddOrUpdate}
              isLoading={isSaving}
            />
            {editingId ? (
              <Button
                title="Cancel"
                variant="secondary"
                onPress={handleCancelEdit}
                style={styles.cancelButton}
              />
            ) : null}
          </View>
        </Card>

        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks yet. Add one above to start building your checklist.</Text>
          </View>
        ) : (
          <View style={styles.taskList}>
            {tasks.map(task => (
              <Card key={task.id} style={[styles.taskCard, task.completed && styles.completedTaskCard]}>
                <View style={styles.taskRow}>
                  <TouchableOpacity
                    style={[styles.checkButton, task.completed && styles.checkButtonActive]}
                    onPress={() => handleToggleComplete(task.id)}
                    activeOpacity={0.8}
                  >
                    <FontAwesome name={task.completed ? 'check' : 'circle-o'} size={18} color={task.completed ? Colors.card : Colors.text} />
                  </TouchableOpacity>
                  <View style={styles.taskTextBlock}>
                    <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>{task.title}</Text>
                    <Text style={styles.taskMeta}>{task.completed ? 'Completed' : 'Pending'}</Text>
                  </View>
                  <View style={styles.taskActions}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => handleEditTask(task)}>
                      <FontAwesome name="pencil" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => handleDeleteTask(task.id)}>
                      <FontAwesome name="trash" size={18} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  screenSubtitle: {
    color: Colors.textMuted,
    fontSize: 16,
    marginBottom: 20,
  },
  statsCard: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  card: {
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    marginLeft: 12,
  },
  emptyState: {
    marginTop: 24,
    padding: 24,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  taskList: {
  },
  taskCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  completedTaskCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkButtonActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  taskTextBlock: {
    flex: 1,
  },
  taskTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  taskMeta: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 12,
  },
});
