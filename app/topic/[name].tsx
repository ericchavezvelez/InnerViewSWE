import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';

type Answer = {
  id: string;
  is_correct: boolean;
  created_at: string;
  topics: { name: string };
};

export default function TopicDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  const cardBackground = useThemeColor({ light: '#f2f2f7', dark: '#1c1c1e' }, 'background');
  const rowBackground = useThemeColor({ light: '#ffffff', dark: '#2c2c2e' }, 'background');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user.id) { setLoading(false); return; }
      supabase
        .from('user_responses')
        .select('id, is_correct, created_at, topics!inner(name)')
        .eq('user_id', session.user.id)
        .eq('topics.name', name)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setAnswers((data as unknown as Answer[]) ?? []);
          setLoading(false);
        });
    });
  }, [name]);

  const correct = answers.filter((a) => a.is_correct).length;
  const total = answers.length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Formats a UTC timestamp into a readable local date + time string
  function formatDate(ts: string): string {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
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
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backText}>← Progress</ThemedText>
        </TouchableOpacity>

        {/* Header */}
        <ThemedText type="title">{name}</ThemedText>

        {/* Accuracy card */}
        <View style={[styles.accuracyCard, { backgroundColor: cardBackground }]}>
          <View style={styles.accuracyRow}>
            <View style={styles.accuracyStat}>
              <ThemedText style={[styles.accuracyValue, { color: accuracy >= 70 ? '#4caf50' : '#f44336' }]}>
                {accuracy}%
              </ThemedText>
              <ThemedText style={styles.accuracyLabel}>Accuracy</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.accuracyStat}>
              <ThemedText style={styles.accuracyValue}>{correct}</ThemedText>
              <ThemedText style={styles.accuracyLabel}>Correct</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.accuracyStat}>
              <ThemedText style={styles.accuracyValue}>{total}</ThemedText>
              <ThemedText style={styles.accuracyLabel}>Attempts</ThemedText>
            </View>
          </View>

          {total > 0 && (
            <View style={styles.barContainer}>
              <View style={[styles.barFill, { flex: correct, backgroundColor: '#4caf50' }]} />
              {total - correct > 0 && (
                <View style={[styles.barFill, { flex: total - correct, backgroundColor: '#f44336' }]} />
              )}
            </View>
          )}
        </View>

        {/* Attempt history */}
        <View style={styles.section}>
          <ThemedText type="subtitle">History</ThemedText>
          {answers.length === 0 ? (
            <ThemedText style={styles.emptyText}>
              No attempts yet. Head to the Play tab to answer {name} questions.
            </ThemedText>
          ) : (
            <View style={styles.historyList}>
              {answers.map((a) => (
                <View key={a.id} style={[styles.historyRow, { backgroundColor: rowBackground }]}>
                  <View style={[styles.resultDot, { backgroundColor: a.is_correct ? '#4caf50' : '#f44336' }]} />
                  <ThemedText style={styles.historyDate}>{formatDate(a.created_at)}</ThemedText>
                  <ThemedText style={[styles.historyResult, { color: a.is_correct ? '#4caf50' : '#f44336' }]}>
                    {a.is_correct ? 'Correct' : 'Wrong'}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
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
  accuracyCard: {
    borderRadius: 16,
    paddingVertical: 20,
    overflow: 'hidden',
  },
  accuracyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accuracyStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#8e8e9333',
  },
  accuracyValue: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
  },
  accuracyLabel: {
    fontSize: 12,
    opacity: 0.5,
    fontWeight: '500',
  },
  barContainer: {
    flexDirection: 'row',
    height: 6,
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 3,
    overflow: 'hidden',
    gap: 2,
  },
  barFill: {
    borderRadius: 3,
  },
  section: {
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.5,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  historyList: {
    gap: 8,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  historyDate: {
    flex: 1,
    fontSize: 14,
    opacity: 0.6,
  },
  historyResult: {
    fontSize: 14,
    fontWeight: '600',
  },
});
