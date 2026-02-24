import { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';

const PROGRESS_CIRCLES = ['Algorithms', 'Data Structures', 'Lessons', 'Big O'];

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

  const circleBorder = useThemeColor({ light: '#d1d1d6', dark: '#3a3a3c' }, 'background');
  const streakBackground = useThemeColor({ light: '#fff3e0', dark: '#2c1a00' }, 'background');

  // Refetches user data every time the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUsername(session?.user?.user_metadata?.username ?? '');
        if (!session?.user.id) return;

        supabase
          .from('user_answers')
          .select('topic, is_correct')
          .eq('user_id', session.user.id)
          .then(({ data }) => {
            if (!data) return;
            const stats: TopicStats = {};
            for (const row of data) {
              const category = TOPIC_TO_CATEGORY[row.topic] ?? row.topic;
              if (!stats[category]) stats[category] = { correct: 0, total: 0 };
              stats[category].total += 1;
              if (row.is_correct) stats[category].correct += 1;
            }
            setTopicStats(stats);
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

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title">Welcome back, {username}!</ThemedText>
          <View style={[styles.streakBadge, { backgroundColor: streakBackground }]}>
            <ThemedText style={styles.streakText}>🔥 7 Day Streak</ThemedText>
          </View>
        </View>

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
  content: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
    gap: 40,
  },
  header: {
    gap: 12,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  circleItem: {
    alignItems: 'center',
    gap: 10,
    width: '42%',
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
