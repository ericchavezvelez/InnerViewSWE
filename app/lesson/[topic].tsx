import { StyleSheet, View, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LessonDetailScreen() {
  const { topic } = useLocalSearchParams<{ topic: string }>();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={styles.backText}>‹ Lessons</ThemedText>
          </TouchableOpacity>
          <ThemedText type="title">{topic}</ThemedText>
          <ThemedText style={styles.subtitle}>Lesson content coming soon</ThemedText>
        </View>

        <View style={styles.placeholder}>
          <ThemedText style={styles.placeholderIcon}>🚧</ThemedText>
          <ThemedText style={styles.placeholderTitle}>Under Construction</ThemedText>
          <ThemedText style={styles.placeholderBody}>
            This lesson is being written. In the meantime, head to the Play tab to practice {topic} questions.
          </ThemedText>
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
    gap: 8,
  },
  backButton: {
    marginBottom: 4,
  },
  backText: {
    fontSize: 16,
    color: '#0a7ea4',
    fontWeight: '500',
  },
  subtitle: {
    opacity: 0.5,
    fontSize: 15,
  },
  placeholder: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 48,
  },
  placeholderIcon: {
    fontSize: 48,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  placeholderBody: {
    fontSize: 15,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 22,
  },
});
