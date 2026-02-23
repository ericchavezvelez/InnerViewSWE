import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

const BEST_TOPICS = ['HashMaps', 'Arrays', 'Strings'];
const WORST_TOPICS = ['DFS', 'Heaps', 'LinkedLists'];

export default function ProgressScreen() {
  const cardBackground = useThemeColor({ light: '#f2f2f7', dark: '#1c1c1e' }, 'background');
  const topicBackground = useThemeColor({ light: '#ffffff', dark: '#2c2c2e' }, 'background');

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Progress</ThemedText>

        {/* Donut chart placeholder */}
        <View style={[styles.chartContainer, { backgroundColor: cardBackground }]}>
          <View style={styles.chartRing}>
            <View style={[styles.chartInner, { backgroundColor: cardBackground }]} />
            <ThemedText style={styles.chartScore}>100</ThemedText>
            <ThemedText style={styles.chartDivider}>/ 120</ThemedText>
          </View>
          <ThemedText style={styles.chartLabel}>Overall Score</ThemedText>
        </View>

        {/* Best Topics */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Best Topics</ThemedText>
          <View style={styles.topicList}>
            {BEST_TOPICS.map((topic) => (
              <TouchableOpacity
                key={topic}
                style={[styles.topicRow, { backgroundColor: topicBackground }]}
                onPress={() => {}}>
                <ThemedText style={styles.topicText}>{topic}</ThemedText>
                <ThemedText style={styles.chevron}>›</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Worst Topics */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Worst Topics</ThemedText>
          <View style={styles.topicList}>
            {WORST_TOPICS.map((topic) => (
              <TouchableOpacity
                key={topic}
                style={[styles.topicRow, { backgroundColor: topicBackground }]}
                onPress={() => {}}>
                <ThemedText style={styles.topicText}>{topic}</ThemedText>
                <ThemedText style={styles.chevron}>›</ThemedText>
              </TouchableOpacity>
            ))}
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
  chevron: {
    fontSize: 20,
    opacity: 0.4,
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
