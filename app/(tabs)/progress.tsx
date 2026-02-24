import { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';

type TopicStat = { topic: string; correct: number; total: number };

export default function ProgressScreen() {
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [bestTopics, setBestTopics] = useState<TopicStat[]>([]);
  const [worstTopics, setWorstTopics] = useState<TopicStat[]>([]);

  const cardBackground = useThemeColor({ light: '#f2f2f7', dark: '#1c1c1e' }, 'background');
  const topicBackground = useThemeColor({ light: '#ffffff', dark: '#2c2c2e' }, 'background');

  // Refetches and recomputes all stats every time the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session?.user.id) return;

        supabase
          .from('user_answers')
          .select('topic, is_correct')
          .eq('user_id', session.user.id)
          .then(({ data }) => {
            if (!data || data.length === 0) return;

            const correct = data.filter((r) => r.is_correct).length;
            setCorrectCount(correct);
            setTotalCount(data.length);

            // Group answers by topic and compute per-topic accuracy
            const statsMap: Record<string, { correct: number; total: number }> = {};
            for (const row of data) {
              if (!statsMap[row.topic]) statsMap[row.topic] = { correct: 0, total: 0 };
              statsMap[row.topic].total += 1;
              if (row.is_correct) statsMap[row.topic].correct += 1;
            }

            // Sort by accuracy desc — top 3 = best, bottom 3 = worst
            const sorted = Object.entries(statsMap)
              .map(([topic, s]) => ({ topic, ...s }))
              .sort((a, b) => b.correct / b.total - a.correct / a.total);

            setBestTopics(sorted.slice(0, 3));
            setWorstTopics(sorted.slice(-3).reverse());
          });
      });
    }, [])
  );

  // Converts a topic's correct/total into a rounded percentage string
  function formatAccuracy(stat: TopicStat): string {
    return `${Math.round((stat.correct / stat.total) * 100)}%`;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Progress</ThemedText>

        {/* Donut chart */}
        <View style={[styles.chartContainer, { backgroundColor: cardBackground }]}>
          <View style={styles.chartRing}>
            <View style={[styles.chartInner, { backgroundColor: cardBackground }]} />
            <ThemedText style={styles.chartScore}>{correctCount}</ThemedText>
            <ThemedText style={styles.chartDivider}>/ {totalCount}</ThemedText>
          </View>
          <ThemedText style={styles.chartLabel}>Overall Score</ThemedText>
        </View>

        {/* Best Topics */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Best Topics</ThemedText>
          <View style={styles.topicList}>
            {bestTopics.length === 0 ? (
              <ThemedText style={styles.emptyText}>
                Play some questions to see your best topics.
              </ThemedText>
            ) : (
              bestTopics.map((stat) => (
                <TouchableOpacity
                  key={stat.topic}
                  style={[styles.topicRow, { backgroundColor: topicBackground }]}
                  onPress={() => {}}>
                  <ThemedText style={styles.topicText}>{stat.topic}</ThemedText>
                  <ThemedText style={styles.topicAccuracy}>{formatAccuracy(stat)}</ThemedText>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        {/* Worst Topics */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Worst Topics</ThemedText>
          <View style={styles.topicList}>
            {worstTopics.length === 0 ? (
              <ThemedText style={styles.emptyText}>
                Play some questions to see your worst topics.
              </ThemedText>
            ) : (
              worstTopics.map((stat) => (
                <TouchableOpacity
                  key={stat.topic}
                  style={[styles.topicRow, { backgroundColor: topicBackground }]}
                  onPress={() => {}}>
                  <ThemedText style={styles.topicText}>{stat.topic}</ThemedText>
                  <ThemedText style={styles.topicAccuracy}>{formatAccuracy(stat)}</ThemedText>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        {/* All Topics */}
        <TouchableOpacity style={styles.allTopicsButton} onPress={() => {}}>
          <ThemedText style={styles.allTopicsText}>All Topics</ThemedText>
        </TouchableOpacity>
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
  chartContainer: {
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 32,
    gap: 16,
  },
  chartRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 16,
    borderColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartInner: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  chartScore: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  chartDivider: {
    fontSize: 12,
    opacity: 0.5,
  },
  chartLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
  },
  section: {
    gap: 12,
  },
  topicList: {
    gap: 8,
  },
  topicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  topicText: {
    fontSize: 16,
    fontWeight: '500',
  },
  topicAccuracy: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0a7ea4',
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.5,
    fontStyle: 'italic',
  },
  allTopicsButton: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  allTopicsText: {
    color: '#0a7ea4',
    fontWeight: '600',
    fontSize: 16,
  },
});
