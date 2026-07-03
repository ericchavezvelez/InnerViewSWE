import { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { DATA_STRUCTURES, ALGORITHMS, type LessonMeta } from '@/src/data/lessonList';

const COMPLETED_KEY = '@innerview:completed_lessons';

const TOTAL_AVAILABLE = [...DATA_STRUCTURES, ...ALGORITHMS].filter((l) => l.available).length;

export default function LessonsScreen() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const topicBackground = useThemeColor({ light: '#ffffff', dark: '#2c2c2e' }, 'background');
  const lockedBackground = useThemeColor({ light: '#f9f9f9', dark: '#1c1c1e' }, 'background');

  // Reload completed set each time the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(COMPLETED_KEY).then((raw) => {
        setCompleted(new Set(raw ? JSON.parse(raw) : []));
      });
    }, [])
  );

  function renderLesson(lesson: LessonMeta) {
    if (!lesson.available) {
      return (
        <View
          key={lesson.name}
          style={[styles.topicRow, { backgroundColor: lockedBackground }, styles.topicRowLocked]}>
          <ThemedText style={styles.topicIcon}>{lesson.icon}</ThemedText>
          <View style={styles.topicInfo}>
            <ThemedText style={[styles.topicText, styles.topicTextLocked]}>{lesson.name}</ThemedText>
            <ThemedText style={styles.topicDescription}>{lesson.description}</ThemedText>
          </View>
          <ThemedText style={styles.comingSoon}>Soon</ThemedText>
        </View>
      );
    }

    const isDone = completed.has(lesson.name);
    return (
      <TouchableOpacity
        key={lesson.name}
        style={[styles.topicRow, { backgroundColor: topicBackground }]}
        onPress={() => router.push({ pathname: '/lesson/[topic]', params: { topic: lesson.name } } as any)}>
        <ThemedText style={styles.topicIcon}>{lesson.icon}</ThemedText>
        <View style={styles.topicInfo}>
          <ThemedText style={styles.topicText}>{lesson.name}</ThemedText>
          <ThemedText style={styles.topicDescription}>{lesson.description}</ThemedText>
        </View>
        {isDone
          ? <ThemedText style={styles.completedCheck}>✓</ThemedText>
          : <ThemedText style={styles.chevron}>›</ThemedText>}
      </TouchableOpacity>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title">Lessons</ThemedText>
          <ThemedText style={styles.subtitle}>Concepts to help you level up</ThemedText>
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.round((completed.size / TOTAL_AVAILABLE) * 100)}%` },
                ]}
              />
            </View>
            <ThemedText style={styles.progressLabel}>
              {completed.size} / {TOTAL_AVAILABLE}
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Data Structures</ThemedText>
          <View style={styles.topicList}>
            {DATA_STRUCTURES.map(renderLesson)}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Algorithms</ThemedText>
          <View style={styles.topicList}>
            {ALGORITHMS.map(renderLesson)}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
    gap: 32,
  },
  header: {
    gap: 6,
  },
  subtitle: {
    opacity: 0.5,
    fontSize: 15,
  },
  section: {
    gap: 12,
  },
  topicList: {
    gap: 8,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 12,
  },
  topicRowLocked: {
    opacity: 0.5,
  },
  topicIcon: {
    fontSize: 22,
  },
  topicInfo: {
    flex: 1,
    gap: 2,
  },
  topicText: {
    fontSize: 16,
    fontWeight: '600',
  },
  topicTextLocked: {
    opacity: 0.7,
  },
  topicDescription: {
    fontSize: 12,
    opacity: 0.5,
  },
  chevron: {
    fontSize: 20,
    opacity: 0.4,
  },
  completedCheck: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4caf50',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e5e5ea',
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0a7ea4',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0a7ea4',
    minWidth: 36,
    textAlign: 'right',
  },
  comingSoon: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8e8e93',
    backgroundColor: '#e5e5ea',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
