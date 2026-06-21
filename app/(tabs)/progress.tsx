import { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';
import { type TopicStat, computeTopicStats, formatAccuracy } from '@/src/lib/progressUtils';
import { type UserResponseRow } from '@/src/lib/types';

export default function ProgressScreen() {
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [bestTopics, setBestTopics] = useState<TopicStat[]>([]);
  const [worstTopics, setWorstTopics] = useState<TopicStat[]>([]);
  const [loading, setLoading] = useState(true);

  const cardBackground = useThemeColor({ light: '#f2f2f7', dark: '#1c1c1e' }, 'background');
  const topicBackground = useThemeColor({ light: '#ffffff', dark: '#2c2c2e' }, 'background');

  // Refetches and recomputes all stats every time the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setCorrectCount(0);
      setTotalCount(0);
      setBestTopics([]);
      setWorstTopics([]);
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session?.user.id) { setLoading(false); return; }

        supabase
          .from('user_responses')
          .select('is_correct, topics(name)')
          .eq('user_id', session.user.id)
          .then(({ data }) => {
            if (data && data.length > 0) {
              const rows = data as unknown as UserResponseRow[];
              setCorrectCount(rows.filter((r) => r.is_correct).length);
              setTotalCount(rows.length);

              const topicRows = rows.map((r) => ({
                is_correct: r.is_correct,
                topic: r.topics.name,
              }));
              const { best, worst } = computeTopicStats(topicRows);
              setBestTopics(best);
              setWorstTopics(worst);
            }
            setLoading(false);
          });
      });
    }, [])
  );

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
        <ThemedText type="title">Progress</ThemedText>

        {/* Donut chart */}
        <View style={[styles.chartContainer, { backgroundColor: cardBackground }]}>
          <View style={[styles.chartRing, totalCount === 0 && styles.chartRingEmpty]}>
            <View style={[styles.chartInner, { backgroundColor: cardBackground }]} />
            {totalCount === 0 ? (
              <ThemedText style={styles.chartEmptyText}>Play to{'\n'}see stats</ThemedText>
            ) : (
              <>
                <ThemedText style={styles.chartScore}>{correctCount}</ThemedText>
                <ThemedText style={styles.chartDivider}>/ {totalCount}</ThemedText>
              </>
            )}
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
                  onPress={() => router.push({ pathname: '/topic/[name]', params: { name: stat.topic } } as any)}>
                  <ThemedText style={styles.topicText}>{stat.topic}</ThemedText>
                  <ThemedText style={styles.topicAccuracy}>{formatAccuracy(stat)}</ThemedText>
                  <ThemedText style={styles.topicChevron}>›</ThemedText>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        {/* Worst Topics — hidden if all topics share the same accuracy as the best */}
        {worstTopics.length > 0 && worstTopics[0].correct / worstTopics[0].total !== bestTopics[0]?.correct / bestTopics[0]?.total && (
        <View style={styles.section}>
          <ThemedText type="subtitle">Worst Topics</ThemedText>
          <View style={styles.topicList}>
            {worstTopics.map((stat) => (
              <TouchableOpacity
                key={stat.topic}
                style={[styles.topicRow, { backgroundColor: topicBackground }]}
                onPress={() => router.push({ pathname: '/topic/[name]', params: { name: stat.topic } } as any)}>
                <ThemedText style={styles.topicText}>{stat.topic}</ThemedText>
                <ThemedText style={styles.topicAccuracy}>{formatAccuracy(stat)}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        )}

        {/* All Topics */}
        <TouchableOpacity
          style={[styles.allTopicsButton, totalCount === 0 && styles.allTopicsDisabled]}
          onPress={() => router.push('/all-topics' as any)}
          disabled={totalCount === 0}>
          <ThemedText style={[styles.allTopicsText, totalCount === 0 && styles.allTopicsTextDisabled]}>
            All Topics
          </ThemedText>
        </TouchableOpacity>
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
  chartRingEmpty: {
    borderColor: '#8e8e93',
  },
  chartEmptyText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.5,
    textAlign: 'center',
    lineHeight: 20,
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
    flex: 1,
  },
  topicAccuracy: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0a7ea4',
    minWidth: 44,
    textAlign: 'right',
  },
  topicChevron: {
    fontSize: 18,
    opacity: 0.3,
    marginLeft: 4,
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
  allTopicsDisabled: {
    borderColor: '#8e8e93',
    opacity: 0.4,
  },
  allTopicsTextDisabled: {
    color: '#8e8e93',
  },
});
