import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { LESSONS, type Section } from '@/src/data/lessons';

export default function LessonDetailScreen() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const lesson = LESSONS[topic ?? ''];

  const codeBackground   = useThemeColor({ light: '#1c1c1e', dark: '#000000' }, 'background');
  const codeHeaderBackground = useThemeColor({ light: '#2c2c2e', dark: '#1a1a1a' }, 'background');
  const tipBackground    = useThemeColor({ light: '#e8f4fd', dark: '#0d2d44' }, 'background');
  const conceptBackground = useThemeColor({ light: '#f2f2f7', dark: '#2c2c2e' }, 'background');

  // Renders one section based on its type
  function renderSection(section: Section, index: number) {
    switch (section.type) {
      case 'intro':
        return (
          <ThemedText key={index} style={styles.intro}>
            {section.content}
          </ThemedText>
        );

      case 'concept':
        return (
          <View key={index} style={[styles.conceptCard, { backgroundColor: conceptBackground }]}>
            <ThemedText style={styles.conceptTitle}>{section.title}</ThemedText>
            <ThemedText style={styles.conceptBody}>{section.body}</ThemedText>
          </View>
        );

      case 'code':
        return (
          <View key={index} style={styles.codeBlock}>
            <View style={[styles.codeHeader, { backgroundColor: codeHeaderBackground }]}>
              <View style={styles.codeDots}>
                <View style={[styles.codeDot, { backgroundColor: '#ff5f57' }]} />
                <View style={[styles.codeDot, { backgroundColor: '#febc2e' }]} />
                <View style={[styles.codeDot, { backgroundColor: '#28c840' }]} />
              </View>
              <ThemedText style={styles.codeLabel}>{section.label}</ThemedText>
            </View>
            <View style={[styles.codeContent, { backgroundColor: codeBackground }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <ThemedText style={styles.codeText}>{section.content}</ThemedText>
              </ScrollView>
            </View>
          </View>
        );

      case 'tip':
        return (
          <View key={index} style={[styles.tipCard, { backgroundColor: tipBackground }]}>
            <ThemedText style={styles.tipIcon}>💡</ThemedText>
            <ThemedText style={styles.tipText}>{section.content}</ThemedText>
          </View>
        );

      case 'quiz':
        return <QuizSection key={index} section={section} />;
    }
  }

  if (!lesson) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={styles.backText}>‹ Lessons</ThemedText>
          </TouchableOpacity>
          <ThemedText type="title">{topic}</ThemedText>
          <View style={styles.placeholder}>
            <ThemedText style={styles.placeholderIcon}>🚧</ThemedText>
            <ThemedText style={styles.placeholderTitle}>Under Construction</ThemedText>
            <ThemedText style={styles.placeholderBody}>
              This lesson is being written. Head to the Play tab to practice {topic} questions in the meantime.
            </ThemedText>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={styles.backText}>‹ Lessons</ThemedText>
          </TouchableOpacity>
          <ThemedText type="title">{lesson.topic}</ThemedText>
          <ThemedText style={styles.tagline}>{lesson.tagline}</ThemedText>
        </View>

        {lesson.sections.map(renderSection)}
      </ScrollView>
    </ThemedView>
  );
}

// Isolated component so each quiz question manages its own answer state
function QuizSection({ section }: { section: Extract<Section, { type: 'quiz' }> }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  const correctBackground = useThemeColor({ light: '#e8f5e9', dark: '#1b3a1f' }, 'background');
  const wrongBackground   = useThemeColor({ light: '#fdecea', dark: '#3a1a1a' }, 'background');
  const defaultBackground = useThemeColor({ light: '#f2f2f7', dark: '#2c2c2e' }, 'background');
  const explanationBackground = useThemeColor({ light: '#f2f2f7', dark: '#2c2c2e' }, 'background');

  function getOptionBackground(index: number) {
    if (!answered) return defaultBackground;
    if (index === section.correctIndex) return correctBackground;
    if (index === selected) return wrongBackground;
    return defaultBackground;
  }

  return (
    <View style={styles.quizCard}>
      <ThemedText style={styles.quizLabel}>Practice Question</ThemedText>
      <ThemedText style={styles.quizQuestion}>{section.question}</ThemedText>
      <View style={styles.quizOptions}>
        {section.options.map((option, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.quizOption, { backgroundColor: getOptionBackground(i) }]}
            onPress={() => { if (!answered) setSelected(i); }}
            disabled={answered}>
            <ThemedText style={styles.quizOptionLetter}>
              {['A', 'B', 'C', 'D'][i]}
            </ThemedText>
            <ThemedText style={styles.quizOptionText}>{option}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      {answered && (
        <View style={[styles.explanation, { backgroundColor: explanationBackground }]}>
          <ThemedText style={styles.explanationLabel}>
            {selected === section.correctIndex ? '✓ Correct' : '✗ Incorrect'}
          </ThemedText>
          <ThemedText style={styles.explanationText}>{section.explanation}</ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 48,
    gap: 24,
  },
  header: { gap: 6 },
  backButton: { marginBottom: 4 },
  backText: { fontSize: 16, color: '#0a7ea4', fontWeight: '500' },
  tagline: { fontSize: 15, opacity: 0.5, lineHeight: 22 },

  intro: { fontSize: 15, lineHeight: 24, opacity: 0.8 },

  conceptCard: { borderRadius: 12, padding: 16, gap: 8 },
  conceptTitle: { fontSize: 15, fontWeight: '700' },
  conceptBody: { fontSize: 14, lineHeight: 22, opacity: 0.75 },

  codeBlock: { gap: 0, borderRadius: 12, overflow: 'hidden' },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  codeDots: { flexDirection: 'row', gap: 6 },
  codeDot: { width: 10, height: 10, borderRadius: 5 },
  codeLabel: { fontSize: 12, fontWeight: '500', color: '#8e8e93' },
  codeContent: { padding: 16 },
  codeText: { fontFamily: Platform.select({ ios: 'Courier New', android: 'monospace' }), fontSize: 13, color: '#a8ff78', lineHeight: 22 },

  tipCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    alignItems: 'flex-start',
  },
  tipIcon: { fontSize: 18 },
  tipText: { flex: 1, fontSize: 14, lineHeight: 22, opacity: 0.8 },

  quizCard: { gap: 12 },
  quizLabel: { fontSize: 13, fontWeight: '700', color: '#0a7ea4', textTransform: 'uppercase', letterSpacing: 0.5 },
  quizQuestion: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
  quizOptions: { gap: 8 },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  quizOptionLetter: { fontSize: 14, fontWeight: '700', opacity: 0.5, width: 18 },
  quizOptionText: { fontSize: 15, flex: 1 },
  explanation: { borderRadius: 12, padding: 16, gap: 6 },
  explanationLabel: { fontSize: 14, fontWeight: '700' },
  explanationText: { fontSize: 14, lineHeight: 22, opacity: 0.75 },

  placeholder: { alignItems: 'center', gap: 12, paddingVertical: 48 },
  placeholderIcon: { fontSize: 48 },
  placeholderTitle: { fontSize: 18, fontWeight: '700' },
  placeholderBody: { fontSize: 15, opacity: 0.6, textAlign: 'center', lineHeight: 22 },
});
