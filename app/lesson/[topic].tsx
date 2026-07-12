import { useState, useMemo, useRef } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform, SafeAreaView, Animated } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPLETED_KEY = '@innerview:completed_lessons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { LESSONS, type Section, type QuizQuestion } from '@/src/data/lessons';
import { pickRandomQuestion } from '@/src/lib/lessonUtils';
import * as Haptics from 'expo-haptics';

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
        return <QuizSection key={index} section={section} topic={topic ?? ''} />;

      case 'quiz-pool':
        return <QuizPoolSection key={index} questions={section.questions} topic={topic ?? ''} />;
    }
  }

  if (!lesson) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView>
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.navBack}>
              <ThemedText style={styles.navBackText}>‹</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.navTitle} numberOfLines={1}>{topic}</ThemedText>
            <View style={styles.navSpacer} />
          </View>
        </SafeAreaView>
        <ScrollView contentContainerStyle={styles.content}>
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
      <SafeAreaView>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navBack}>
            <ThemedText style={styles.navBackText}>‹</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.navTitle} numberOfLines={1}>{lesson.topic}</ThemedText>
          <View style={styles.navSpacer} />
        </View>
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText style={styles.tagline}>{lesson.tagline}</ThemedText>
        {lesson.sections.map(renderSection)}
      </ScrollView>
    </ThemedView>
  );
}

// Isolated component so each quiz question manages its own answer state
function QuizSection({ section, topic }: { section: QuizQuestion; topic: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  const correctBackground = useThemeColor({ light: '#e8f5e9', dark: '#1b3a1f' }, 'background');
  const wrongBackground   = useThemeColor({ light: '#fdecea', dark: '#3a1a1a' }, 'background');
  const defaultBackground = useThemeColor({ light: '#f2f2f7', dark: '#2c2c2e' }, 'background');
  const explanationBackground = useThemeColor({ light: '#f2f2f7', dark: '#2c2c2e' }, 'background');

  // Animation values — one scale per option, one for the explanation card
  const optionScales = useRef(section.options.map(() => new Animated.Value(1))).current;
  const explanationAnim = useRef(new Animated.Value(0)).current;

  function getOptionBackground(index: number) {
    if (!answered) return defaultBackground;
    if (index === section.correctIndex) return correctBackground;
    if (index === selected) return wrongBackground;
    return defaultBackground;
  }

  async function markComplete() {
    const raw = await AsyncStorage.getItem(COMPLETED_KEY);
    const existing: string[] = raw ? JSON.parse(raw) : [];
    if (!existing.includes(topic)) {
      await AsyncStorage.setItem(COMPLETED_KEY, JSON.stringify([...existing, topic]));
    }
  }

  function getOptionBorder(index: number): string | undefined {
    if (!answered) return undefined;
    if (index === section.correctIndex) return '#4caf50';
    if (index === selected) return '#f44336';
    return undefined;
  }

  function handleSelect(i: number) {
    if (answered) return;
    setSelected(i);
    if (i === section.correctIndex) {
      markComplete();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    // Pulse the tapped option
    Animated.sequence([
      Animated.spring(optionScales[i], { toValue: 1.04, useNativeDriver: true, speed: 40, bounciness: 8 }),
      Animated.spring(optionScales[i], { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 4 }),
    ]).start();

    // Slide + fade the explanation card in
    Animated.spring(explanationAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 16,
      bounciness: 6,
    }).start();
  }

  return (
    <View style={styles.quizCard}>
      <ThemedText style={styles.quizLabel}>Practice Question</ThemedText>
      <ThemedText style={styles.quizQuestion}>{section.question}</ThemedText>
      <View style={styles.quizOptions}>
        {section.options.map((option, i) => (
          <Animated.View key={i} style={{ transform: [{ scale: optionScales[i] }] }}>
            <TouchableOpacity
              style={[
                styles.quizOption,
                { backgroundColor: getOptionBackground(i) },
                getOptionBorder(i) ? { borderWidth: 2, borderColor: getOptionBorder(i) } : styles.quizOptionDefaultBorder,
              ]}
              onPress={() => handleSelect(i)}
              disabled={answered}>
              <ThemedText style={styles.quizOptionLetter}>
                {['A', 'B', 'C', 'D'][i]}
              </ThemedText>
              <ThemedText style={styles.quizOptionText}>{option}</ThemedText>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      {answered && (
        <Animated.View
          style={[
            styles.explanation,
            { backgroundColor: explanationBackground },
            {
              opacity: explanationAnim,
              transform: [{ translateY: explanationAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
            },
          ]}>
          <ThemedText style={styles.explanationLabel}>
            {selected === section.correctIndex ? '✓ Correct' : '✗ Incorrect'}
          </ThemedText>
          <ThemedText style={styles.explanationText}>{section.explanation}</ThemedText>
        </Animated.View>
      )}
    </View>
  );
}

function QuizPoolSection({ questions, topic }: { questions: QuizQuestion[]; topic: string }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const picked = useMemo(() => pickRandomQuestion(questions), []);
  return <QuizSection section={picked} topic={topic} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#8e8e9333',
  },
  navBack: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBackText: {
    fontSize: 28,
    color: '#0a7ea4',
    lineHeight: 32,
  },
  navTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  navSpacer: { width: 44 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 24,
  },
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
  quizOptionDefaultBorder: {
    borderWidth: 2,
    borderColor: 'transparent',
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
