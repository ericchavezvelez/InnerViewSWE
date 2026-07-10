import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';

type TopicStat = { topic: string; correct: number; total: number };

export default function AllTopicsScreen() {
  const [topics, setTopics] = useState<TopicStat[]>([]);
  const [loading, setLoading] = useState(true);

  const rowBackground = useThemeColor({ light: '#ffffff', dark: '#2c2c2e' }, 'background');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user.id) { setLoading(false); return; }
      supabase
        .from('user_responses')
        .select('is_correct, topics(name)')
        .eq('user_id', session.user.id)
        .then(({ data }) => {
          if (data && data.length > 0) {
            const statsMap: Record<string, { correct: number; total: number }> = {};
            for (const row of data as unknown as { is_correct: boolean; topics: { name: string } }[]) {
              const topic = row.topics?.name;
              if (!topic) continue;
              if (!statsMap[topic]) statsMap[topic] = { correct: 0, total: 0 };
              statsMap[topic].total += 1;
              if (row.is_correct) statsMap[topic].correct += 1;
            }
            const sorted = Object.entries(statsMap)
              .map(([topic, s]) => ({ topic, ...s }))
              .sort((a, b) => b.correct / b.total - a.correct / a.total);
            setTopics(sorted);
          }
          setLoading(false);
        });
    });
  }, []);

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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backText}>← Progress</ThemedText>
        </TouchableOpacity>

        <ThemedText type="title">All Topics</ThemedText>

        {topics.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyIcon}>🎯</ThemedText>
            <ThemedText style={styles.emptyTitle}>No data yet</ThemedText>
            <ThemedText style={styles.emptyBody}>
              Play some questions in the Play tab and your topic breakdown will appear here.
            </ThemedText>
          </View>
        )}

        <View style={styles.topicList}>
          {topics.map((stat) => {
            const accuracy = Math.round((stat.correct / stat.total) * 100);
            return (
              <TouchableOpacity
                key={stat.topic}
                style={[styles.topicRow, { backgroundColor: rowBackground }]}
                onPress={() => router.push({ pathname: '/topic/[name]', params: { name: stat.topic } } as any)}>
                <View style={styles.topicInfo}>
                  <ThemedText style={styles.topicName}>{stat.topic}</ThemedText>
                  <ThemedText style={styles.topicAttempts}>{stat.total} attempt{stat.total !== 1 ? 's' : ''}</ThemedText>
                </View>
                <ThemedText style={[styles.topicAccuracy, { color: accuracy >= 70 ? '#4caf50' : '#f44336' }]}>
                  {accuracy}%
                </ThemedText>
                <ThemedText style={styles.topicChevron}>›</ThemedText>
              </TouchableOpacity>
            );
          })}
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
    gap: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 15,
    color: '#0a7ea4',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  emptyBody: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: 'center',
    lineHeight: 20,
  },
  topicList: {
    gap: 8,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  topicInfo: {
    gap: 2,
  },
  topicName: {
    fontSize: 16,
    fontWeight: '500',
  },
  topicAttempts: {
    fontSize: 12,
    opacity: 0.4,
    fontWeight: '500',
  },
  topicAccuracy: {
    fontSize: 16,
    fontWeight: '700',
  },
  topicChevron: {
    fontSize: 18,
    opacity: 0.3,
    marginLeft: 4,
  },
});
