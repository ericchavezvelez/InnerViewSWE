import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

const DATA_STRUCTURES = ['Arrays', 'LinkedLists', 'Trees', 'Graphs'];
const ALGORITHMS = ['Sorting', 'Binary Search', 'DFS / BFS', 'Dynamic Programming'];

export default function LessonsScreen() {
  const topicBackground = useThemeColor({ light: '#ffffff', dark: '#2c2c2e' }, 'background');

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title">Lessons</ThemedText>
          <View style={styles.wipBadge}>
            <ThemedText style={styles.wipText}>Work in Progress</ThemedText>
          </View>
        </View>

        {/* Data Structures */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Data Structures</ThemedText>
          <View style={styles.topicList}>
            {DATA_STRUCTURES.map((topic) => (
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

        {/* Algorithms */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Algorithms</ThemedText>
          <View style={styles.topicList}>
            {ALGORITHMS.map((topic) => (
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
    gap: 10,
  },
  wipBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff3e0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  wipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e65100',
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
});
