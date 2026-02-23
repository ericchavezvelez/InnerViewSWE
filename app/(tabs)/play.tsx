import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

const PLACEHOLDER_QUESTION =
  'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to the target.';

const PLACEHOLDER_ANSWERS = [
  'Use a hash map to store complements as you iterate',
  'Sort the array first, then use two pointers',
  'Use nested loops to check every pair',
  'Use a binary search for each element',
];

export default function PlayScreen() {
  const cardBackground = useThemeColor({ light: '#f2f2f7', dark: '#1c1c1e' }, 'background');
  const answerBackground = useThemeColor({ light: '#ffffff', dark: '#2c2c2e' }, 'background');

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Badges */}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, styles.typeBadge]}>
            <ThemedText style={styles.badgeText}>Multiple Choice</ThemedText>
          </View>
          <View style={[styles.badge, styles.difficultyBadge]}>
            <ThemedText style={styles.badgeText}>SWE1</ThemedText>
          </View>
        </View>

        {/* Question */}
        <View style={[styles.questionCard, { backgroundColor: cardBackground }]}>
          <ThemedText style={styles.questionText}>{PLACEHOLDER_QUESTION}</ThemedText>
        </View>

        {/* Answer Choices */}
        <View style={styles.answerList}>
          {PLACEHOLDER_ANSWERS.map((answer, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.answerRow, { backgroundColor: answerBackground }]}
              onPress={() => {}}>
              <View style={styles.answerIndex}>
                <ThemedText style={styles.answerIndexText}>
                  {String.fromCharCode(65 + index)}
                </ThemedText>
              </View>
              <ThemedText style={styles.answerText}>{answer}</ThemedText>
            </TouchableOpacity>
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
    gap: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  typeBadge: {
    backgroundColor: '#e8f4f8',
  },
  difficultyBadge: {
    backgroundColor: '#e8f5e9',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0a7ea4',
  },
  questionCard: {
    borderRadius: 20,
    padding: 24,
  },
  questionText: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '500',
  },
  answerList: {
    gap: 12,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 14,
    padding: 16,
  },
  answerIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerIndexText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  answerText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});
