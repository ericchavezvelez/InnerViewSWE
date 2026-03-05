import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';

type Question = {
  id: string;
  topic: string;
  difficulty: 'SWE1' | 'SWE2' | 'SWE3';
  question: string;
  answers: string[];
  correctIndex: number;
};

type WrongAnswer = {
  question: string;
  topic: string;
  selected: string;
  correct: string;
};

const QUESTIONS: Question[] = [
  {
    id: '1',
    topic: 'HashMaps',
    difficulty: 'SWE1',
    question: 'What is the average time complexity of a lookup in a hash map?',
    answers: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
    correctIndex: 2,
  },
  {
    id: '2',
    topic: 'Arrays',
    difficulty: 'SWE1',
    question:
      'Which approach finds two numbers in an array that add up to a target most efficiently?',
    answers: [
      'Nested loops to check every pair',
      'Sort the array, then use two pointers',
      'Hash map to store complements as you iterate',
      'Binary search for each element',
    ],
    correctIndex: 2,
  },
  {
    id: '3',
    topic: 'Strings',
    difficulty: 'SWE1',
    question: 'What does it mean for two strings to be anagrams?',
    answers: [
      'They have the same length',
      'They contain the same characters in any order',
      'They are mirror images of each other',
      'They share the same prefix',
    ],
    correctIndex: 1,
  },
  {
    id: '4',
    topic: 'Trees',
    difficulty: 'SWE2',
    question: 'Which traversal visits nodes of a binary search tree in ascending order?',
    answers: ['Pre-order', 'Post-order', 'Level-order', 'In-order'],
    correctIndex: 3,
  },
  {
    id: '5',
    topic: 'Big O',
    difficulty: 'SWE1',
    question: 'What is the time complexity of binary search on a sorted array?',
    answers: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correctIndex: 2,
  },
];

export default function PlayScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);

  const cardBackground = useThemeColor({ light: '#f2f2f7', dark: '#1c1c1e' }, 'background');
  const answerBackground = useThemeColor({ light: '#ffffff', dark: '#2c2c2e' }, 'background');
  const correctBackground = useThemeColor({ light: '#e8f5e9', dark: '#1b3a1e' }, 'background');
  const wrongBackground = useThemeColor({ light: '#fdecea', dark: '#3a1a1a' }, 'background');

  // Fetches the current user's ID once on mount so answers can be saved to Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user.id ?? null);
    });
  }, []);

  const question = QUESTIONS[currentIndex];
  const isAnswered = selectedIndex !== null;
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;

  // Green for correct, red for wrong, default otherwise
  function getAnswerBackground(index: number) {
    if (!isAnswered) return answerBackground;
    if (index === question.correctIndex) return correctBackground;
    if (index === selectedIndex) return wrongBackground;
    return answerBackground;
  }

  // Adds a colored border to the correct and selected answers after submission
  function getAnswerBorder(index: number) {
    if (!isAnswered) return {};
    if (index === question.correctIndex) return { borderWidth: 1.5, borderColor: '#4caf50' };
    if (index === selectedIndex) return { borderWidth: 1.5, borderColor: '#f44336' };
    return {};
  }

  // Hides the circle border when it's being filled with green/red so colors don't mix
  function getIndexCircleColor(index: number) {
    if (!isAnswered) return '#0a7ea4';
    if (index === question.correctIndex || index === selectedIndex) return 'transparent';
    return '#0a7ea4';
  }

  // Fills the answer index circle green for correct, red for wrong
  function getIndexFill(index: number) {
    if (!isAnswered) return 'transparent';
    if (index === question.correctIndex) return '#4caf50';
    if (index === selectedIndex) return '#f44336';
    return 'transparent';
  }

  // Switches the letter text to white when its circle is filled so it stays readable
  function getIndexTextColor(index: number) {
    if (!isAnswered) return '#0a7ea4';
    if (index === question.correctIndex || index === selectedIndex) return '#fff';
    return '#0a7ea4';
  }

  // Records the selected answer, updates score/wrong list, and saves the result to Supabase
  async function handleSelectAnswer(index: number) {
    if (isAnswered) return;
    setSelectedIndex(index);
    const isCorrect = index === question.correctIndex;

    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setWrongAnswers((prev) => [
        ...prev,
        {
          question: question.question,
          topic: question.topic,
          selected: question.answers[index],
          correct: question.answers[question.correctIndex],
        },
      ]);
    }

    if (userId) {
      await supabase.from('user_answers').insert({
        user_id: userId,
        topic: question.topic,
        is_correct: isCorrect,
      });
    }
  }

  // Advances to the next question or ends the session on the last one
  function handleNext() {
    if (isLastQuestion) {
      setSessionComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedIndex(null);
    }
  }

  // Resets all session state to restart from question 1
  function handlePlayAgain() {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setWrongAnswers([]);
    setSessionComplete(false);
  }

  if (sessionComplete) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.summaryContent}>
          <ThemedText type="title">Session Complete</ThemedText>

          <View style={styles.scoreCard}>
            <ThemedText style={styles.scoreNumber}>
              {score} / {QUESTIONS.length}
            </ThemedText>
            <ThemedText style={styles.scoreLabel}>Correct</ThemedText>
          </View>

          {wrongAnswers.length > 0 && (
            <ThemedText style={styles.missedLabel}>
              {wrongAnswers.length} question{wrongAnswers.length > 1 ? 's' : ''} missed — review
              them in the Progress tab.
            </ThemedText>
          )}

          <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
            <ThemedText style={styles.playAgainText}>Play Again</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Badges */}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, styles.typeBadge]}>
            <ThemedText style={styles.badgeText}>Multiple Choice</ThemedText>
          </View>
          <View style={[styles.badge, difficultyStyles[question.difficulty].badge]}>
            <ThemedText style={difficultyStyles[question.difficulty].text}>{question.difficulty}</ThemedText>
          </View>
          <View style={styles.progressBadge}>
            <ThemedText style={styles.progressText}>
              {currentIndex + 1} / {QUESTIONS.length}
            </ThemedText>
          </View>
        </View>

        {/* Question */}
        <View style={[styles.questionCard, { backgroundColor: cardBackground }]}>
          <ThemedText style={styles.topicLabel}>{question.topic}</ThemedText>
          <ThemedText style={styles.questionText}>{question.question}</ThemedText>
        </View>

        {/* Answer Choices */}
        <View style={styles.answerList}>
          {question.answers.map((answer, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.answerRow,
                { backgroundColor: getAnswerBackground(index) },
                getAnswerBorder(index),
                isAnswered && index !== question.correctIndex && index !== selectedIndex
                  ? { opacity: 0.5 }
                  : {},
              ]}
              onPress={() => handleSelectAnswer(index)}
              disabled={isAnswered}>
              <View
                style={[
                  styles.answerIndex,
                  {
                    borderColor: getIndexCircleColor(index),
                    backgroundColor: getIndexFill(index),
                  },
                ]}>
                <ThemedText
                  style={[styles.answerIndexText, { color: getIndexTextColor(index) }]}>
                  {String.fromCharCode(65 + index)}
                </ThemedText>
              </View>
              <ThemedText style={styles.answerText}>{answer}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Button */}
        {isAnswered && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <ThemedText style={styles.nextButtonText}>
              {isLastQuestion ? 'Finish' : 'Next'}
            </ThemedText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const difficultyStyles: Record<string, { badge: object; text: object }> = {
  SWE1: { badge: { backgroundColor: '#e8f5e9' }, text: { fontSize: 13, fontWeight: '600', color: '#4caf50' } },
  SWE2: { badge: { backgroundColor: '#fff3e0' }, text: { fontSize: 13, fontWeight: '600', color: '#ff9500' } },
  SWE3: { badge: { backgroundColor: '#fdecea' }, text: { fontSize: 13, fontWeight: '600', color: '#f44336' } },
};

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
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  typeBadge: {
    backgroundColor: '#e8f4f8',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0a7ea4',
  },
  progressBadge: {
    marginLeft: 'auto',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.5,
  },
  questionCard: {
    borderRadius: 20,
    padding: 24,
    gap: 10,
  },
  topicLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0a7ea4',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerIndexText: {
    fontSize: 14,
    fontWeight: '700',
  },
  answerText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  nextButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  summaryContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 28,
  },
  scoreCard: {
    alignItems: 'center',
    gap: 8,
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
  },
  scoreLabel: {
    fontSize: 16,
    opacity: 0.5,
    fontWeight: '600',
  },
  missedLabel: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
  playAgainButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: 'center',
  },
  playAgainText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
