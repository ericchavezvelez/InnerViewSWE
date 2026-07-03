import { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';
import { computeStreak, computeWeeklyCount } from '@/src/lib/homeUtils';
import { type UserResponseRowWithDate } from '@/src/lib/types';
import { DATA_STRUCTURES, ALGORITHMS, type LessonMeta } from '@/src/data/lessonList';

const COMPLETED_KEY = '@innerview:completed_lessons';
const AVAILABLE_LESSONS = [...DATA_STRUCTURES, ...ALGORITHMS].filter((l) => l.available);

const PROGRESS_CIRCLES = ['Algorithms', 'Data Structures', 'Big O'];

// Maps each question topic to one of the 4 home circle categories
const TOPIC_TO_CATEGORY: Record<string, string> = {
  HashMaps: 'Data Structures',
  Arrays: 'Data Structures',
  Strings: 'Data Structures',
  LinkedLists: 'Data Structures',
  Trees: 'Algorithms',
  Sorting: 'Algorithms',
  'Binary Search': 'Algorithms',
  'DFS / BFS': 'Algorithms',
  'Dynamic Programming': 'Algorithms',
  'Big O': 'Big O',
};

type TopicStats = Record<string, { correct: number; total: number }>;

export default function HomeScreen() {
  const [username, setUsername] = useState('');
  const [topicStats, setTopicStats] = useState<TopicStats>({});
  const [streak, setStreak] = useState(0);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [nextLesson, setNextLesson] = useState<LessonMeta | null>(null);

  const circleBorder = useThemeColor({ light: '#d1d1d6', dark: '#3a3a3c' }, 'background');
  const streakBackground = useThemeColor({ light: '#fff3e0', dark: '#2c1a00' }, 'background');
  const neutralBadge = useThemeColor({ light: '#f2f2f7', dark: '#2c2c2e' }, 'background');
  const cardBackground = useThemeColor({ light: '#f2f2f7', dark: '#1c1c1e' }, 'background');

  // Refetches user data every time the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setTopicStats({});
      setStreak(0);
      setWeeklyCount(0);

      AsyncStorage.getItem(COMPLETED_KEY).then((raw) => {
        const completed = new Set<string>(raw ? JSON.parse(raw) : []);
        setNextLesson(AVAILABLE_LESSONS.find((l) => !completed.has(l.name)) ?? null);
      });

      supabase.auth.getSession().then(({ data: { session } }) => {
        setUsername(session?.user?.user_metadata?.username ?? '');
        if (!session?.user.id) { setLoading(false); return; }

        supabase
          .from('user_responses')
          .select('is_correct, created_at, topics(name)')
          .eq('user_id', session.user.id)
          .then(({ data }) => {
            if (data) {
              const rows = data as unknown as UserResponseRowWithDate[];
              const stats: TopicStats = {};
              for (const row of rows) {
                const topic = row.topics.name;
                const category = TOPIC_TO_CATEGORY[topic] ?? topic;
                if (!stats[category]) stats[category] = { correct: 0, total: 0 };
                stats[category].total += 1;
                if (row.is_correct) stats[category].correct += 1;
              }
              setTopicStats(stats);
              setStreak(computeStreak(data.map((r) => r.created_at)));
              setWeeklyCount(computeWeeklyCount(data.map((r) => r.created_at)));
            }
            setLoading(false);
          });
      });
    }, [])
  );

  // Blue if ≥70% accurate, orange if below, gray if no data
  function getCircleBorderColor(label: string): string {
    const stats = topicStats[label];
    if (!stats || stats.total === 0) return circleBorder;
    return stats.correct / stats.total >= 0.7 ? '#0a7ea4' : '#ff9500';
  }

  // Returns accuracy percentage string, or '—' if no answers yet
  function getCirclePercent(label: string): string {
    const stats = topicStats[label];
    if (!stats || stats.total === 0) return '—';
    return `${Math.round((stats.correct / stats.total) * 100)}%`;
  }

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator style={styles.spinner} size="large" color="#0a7ea4" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title">Welcome back, {username}!</ThemedText>
          <View style={styles.badgeRow}>
            <View style={[styles.streakBadge, { backgroundColor: streak === 0 ? neutralBadge : streakBackground }]}>
              <ThemedText style={styles.streakText}>
                {streak === 0 ? '👋 Start your streak!' : `🔥 ${streak} Day Streak`}
              </ThemedText>
            </View>
            <View style={[styles.streakBadge, { backgroundColor: neutralBadge }]}>
              <ThemedText style={styles.streakText}>
                {weeklyCount} this week
              </ThemedText>
            </View>
          </View>
        </View>

        {nextLesson ? (
          <TouchableOpacity
            style={[styles.nudgeCard, { backgroundColor: cardBackground }]}
            onPress={() => router.push({ pathname: '/lesson/[topic]', params: { topic: nextLesson.name } } as any)}>
            <View style={styles.nudgeLeft}>
              <ThemedText style={styles.nudgeLabel}>Continue Learning</ThemedText>
              <ThemedText style={styles.nudgeName}>{nextLesson.name}</ThemedText>
              <ThemedText style={styles.nudgeDescription}>{nextLesson.description}</ThemedText>
            </View>
            <ThemedText style={styles.nudgeIcon}>{nextLesson.icon}</ThemedText>
          </TouchableOpacity>
        ) : (
          <View style={[styles.nudgeCard, { backgroundColor: cardBackground }]}>
            <View style={styles.nudgeLeft}>
              <ThemedText style={styles.nudgeLabel}>All Caught Up</ThemedText>
              <ThemedText style={styles.nudgeName}>All lessons complete!</ThemedText>
              <ThemedText style={styles.nudgeDescription}>Head to Play to keep your streak going.</ThemedText>
            </View>
            <ThemedText style={styles.nudgeIcon}>🎉</ThemedText>
          </View>
        )}

        <View style={styles.grid}>
          {PROGRESS_CIRCLES.map((label) => (
            <View key={label} style={styles.circleItem}>
              <View style={[styles.circle, { borderColor: getCircleBorderColor(label) }]}>
                <ThemedText style={styles.circlePercent}>{getCirclePercent(label)}</ThemedText>
              </View>
              <ThemedText style={styles.circleLabel}>{label}</ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spinner: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
    gap: 40,
  },
  header: {
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  streakBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
  },
  nudgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 18,
    gap: 12,
  },
  nudgeLeft: {
    flex: 1,
    gap: 4,
  },
  nudgeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0a7ea4',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nudgeName: {
    fontSize: 17,
    fontWeight: '700',
  },
  nudgeDescription: {
    fontSize: 13,
    opacity: 0.5,
    lineHeight: 18,
  },
  nudgeIcon: {
    fontSize: 36,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  circleItem: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  circle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circlePercent: {
    fontSize: 18,
    fontWeight: '700',
  },
  circleLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
