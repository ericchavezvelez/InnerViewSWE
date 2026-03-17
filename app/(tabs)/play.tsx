import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

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
  {
    id: '6',
    topic: 'LinkedLists',
    difficulty: 'SWE1',
    question: 'What is the time complexity of inserting a node at the head of a singly linked list?',
    answers: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctIndex: 3,
  },
  {
    id: '7',
    topic: 'Sorting',
    difficulty: 'SWE2',
    question: 'Which sorting algorithm has an average time complexity of O(n log n) and is commonly used in standard libraries?',
    answers: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'],
    correctIndex: 2,
  },
  {
    id: '8',
    topic: 'Trees',
    difficulty: 'SWE2',
    question: 'What data structure is typically used to implement a breadth-first search (BFS)?',
    answers: ['Stack', 'Queue', 'Heap', 'Set'],
    correctIndex: 1,
  },
  {
    id: '9',
    topic: 'Big O',
    difficulty: 'SWE1',
    question: 'What is the space complexity of a recursive function that calls itself n times?',
    answers: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctIndex: 2,
  },
  {
    id: '10',
    topic: 'HashMaps',
    difficulty: 'SWE2',
    question: 'What causes a hash collision?',
    answers: [
      'Two keys that are equal',
      'Two different keys that map to the same bucket',
      'A key with a null value',
      'A hash function that returns negative numbers',
    ],
    correctIndex: 1,
  },
  {
    id: '11',
    topic: 'Arrays',
    difficulty: 'SWE1',
    question: 'What is the time complexity of accessing an element by index in an array?',
    answers: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctIndex: 3,
  },
  {
    id: '12',
    topic: 'Dynamic Programming',
    difficulty: 'SWE3',
    question: 'What is the key characteristic that makes a problem suitable for dynamic programming?',
    answers: [
      'It can be solved greedily',
      'It has overlapping subproblems and optimal substructure',
      'It requires sorting the input first',
      'It can only be solved recursively',
    ],
    correctIndex: 1,
  },
  {
    id: '13',
    topic: 'Strings',
    difficulty: 'SWE2',
    question: 'What is the most efficient way to check if a string is a palindrome?',
    answers: [
      'Reverse the string and compare with the original',
      'Use two pointers starting from both ends moving inward',
      'Sort the characters and compare',
      'Check every substring recursively',
    ],
    correctIndex: 1,
  },
  {
    id: '14',
    topic: 'LinkedLists',
    difficulty: 'SWE2',
    question: 'How can you detect a cycle in a linked list efficiently?',
    answers: [
      'Store all visited nodes in a set',
      'Reverse the list and check if it equals the original',
      'Use two pointers, one fast and one slow (Floyd\'s algorithm)',
      'Count the total number of nodes',
    ],
    correctIndex: 2,
  },
  {
    id: '15',
    topic: 'Binary Search',
    difficulty: 'SWE2',
    question: 'Binary search requires the input array to be:',
    answers: ['Unsorted', 'Sorted', 'Filled with unique values', 'Stored in a hash map'],
    correctIndex: 1,
  },
  {
    id: '16',
    topic: 'Dynamic Programming',
    difficulty: 'SWE3',
    question: 'Which technique avoids recomputing subproblems by storing their results?',
    answers: ['Recursion', 'Memoization', 'Greedy', 'Backtracking'],
    correctIndex: 1,
  },
  {
    id: '17',
    topic: 'Trees',
    difficulty: 'SWE3',
    question: 'What is the worst-case time complexity of inserting into an unbalanced binary search tree?',
    answers: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 2,
  },
  {
    id: '18',
    topic: 'DFS / BFS',
    difficulty: 'SWE3',
    question: 'Which graph traversal is best suited for finding the shortest path in an unweighted graph?',
    answers: ['DFS', 'BFS', 'Dijkstra\'s', 'Bellman-Ford'],
    correctIndex: 1,
  },
  {
    id: '19',
    topic: 'Dynamic Programming',
    difficulty: 'SWE3',
    question: 'What is the time complexity of the classic 0/1 knapsack dynamic programming solution?',
    answers: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n × W) where W is the capacity'],
    correctIndex: 3,
  },
  {
    id: '20',
    topic: 'Sorting',
    difficulty: 'SWE3',
    question: 'Why is quicksort\'s worst-case O(n²) but average case O(n log n)?',
    answers: [
      'It depends on the size of the input',
      'Poor pivot selection causes maximally unbalanced partitions',
      'It performs extra comparisons on sorted arrays',
      'It uses O(n) extra space in the worst case',
    ],
    correctIndex: 1,
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffles a question's answers and updates correctIndex to match the new position
function shuffleAnswers(q: Question): Question {
  const correct = q.answers[q.correctIndex];
  const answers = shuffle(q.answers);
  return { ...q, answers, correctIndex: answers.indexOf(correct) };
}

const SESSION_SIZES = [5, 10, 15];
const DIFFICULTIES = ['All', 'SWE1', 'SWE2', 'SWE3'] as const;
type DifficultyFilter = typeof DIFFICULTIES[number];

export default function PlayScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionSize, setSessionSize] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('All');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);

  const cardBackground = useThemeColor({ light: '#f2f2f7', dark: '#1c1c1e' }, 'background');
  const answerBackground = useThemeColor({ light: '#ffffff', dark: '#2c2c2e' }, 'background');
  const correctBackground = useThemeColor({ light: '#e8f5e9', dark: '#1b3a1e' }, 'background');
  const wrongBackground = useThemeColor({ light: '#fdecea', dark: '#3a1a1a' }, 'background');

  const celebrationScale = useSharedValue(1);
  const celebrationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
  }));

  // Bounces the perfect score title when a flawless session ends
  useEffect(() => {
    if (sessionComplete && score === questions.length && questions.length > 0) {
      celebrationScale.value = withSequence(
        withTiming(0.8, { duration: 80 }),
        withSpring(1.15, { damping: 5, stiffness: 200 }),
        withSpring(1, { damping: 10 }),
      );
    }
  }, [sessionComplete]);

  // Fetches the current user's ID once on mount so answers can be saved to Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user.id ?? null);
    });
  }, []);

  const question = questions[currentIndex];
  const isAnswered = selectedIndex !== null;
  const isLastQuestion = currentIndex === questions.length - 1;

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

  // Initializes a new session with the chosen number of questions, filtered by difficulty
  function handleStartSession(size: number) {
    setSessionSize(size);
    const pool = difficulty === 'All' ? QUESTIONS : QUESTIONS.filter((q) => q.difficulty === difficulty);
    setQuestions(shuffle(pool).slice(0, Math.min(size, pool.length)).map(shuffleAnswers));
    setCurrentIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setWrongAnswers([]);
    setSessionComplete(false);
  }

  // Returns to the size picker so the user can start a fresh session
  function handlePlayAgain() {
    setSessionSize(null);
    setQuestions([]);
  }

  if (sessionSize === null) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.pickerContent}>
          <ThemedText type="title">Let's Play</ThemedText>

          <View style={styles.difficultySection}>
            <ThemedText style={styles.pickerSubtitle}>Difficulty</ThemedText>
            <View style={styles.difficultyButtons}>
              {DIFFICULTIES.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.difficultyButton,
                    difficulty === d && styles.difficultyButtonActive,
                    difficulty === d && d !== 'All' && { backgroundColor: difficultyStyles[d].badge.backgroundColor },
                  ]}
                  onPress={() => setDifficulty(d)}>
                  <ThemedText
                    style={[
                      styles.difficultyButtonText,
                      difficulty === d && styles.difficultyButtonTextActive,
                      difficulty === d && d !== 'All' && { color: (difficultyStyles[d].text as { color: string }).color },
                    ]}>
                    {d}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.difficultySection}>
            <ThemedText style={styles.pickerSubtitle}>Questions</ThemedText>
            <View style={styles.pickerButtons}>
              {SESSION_SIZES.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={styles.pickerButton}
                  onPress={() => handleStartSession(size)}>
                  <ThemedText style={styles.pickerButtonNumber}>{size}</ThemedText>
                  <ThemedText style={styles.pickerButtonLabel}>questions</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ThemedView>
    );
  }

  if (sessionComplete) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.summaryContent}>
          <Animated.View style={score === questions.length ? celebrationStyle : undefined}>
            <ThemedText type="title">
              {score === questions.length ? 'Perfect! 🎉' : 'Session Complete'}
            </ThemedText>
          </Animated.View>

          <View style={styles.scoreCard}>
            <ThemedText style={[styles.scoreNumber, { color: score / questions.length >= 0.6 ? '#4caf50' : '#f44336' }]}>
              {score} / {questions.length}
            </ThemedText>
            <ThemedText style={styles.scoreLabel}>
              {Math.round((score / questions.length) * 100)}% Correct
            </ThemedText>
          </View>

          {wrongAnswers.length > 0 && (
            <View style={styles.missedSection}>
              <ThemedText style={styles.missedHeading}>Review</ThemedText>
              {wrongAnswers.map((w, i) => (
                <View key={i} style={[styles.missedCard, { backgroundColor: cardBackground }]}>
                  <ThemedText style={styles.missedTopic}>{w.topic}</ThemedText>
                  <ThemedText style={styles.missedQuestion}>{w.question}</ThemedText>
                  <View style={styles.missedRow}>
                    <ThemedText style={styles.missedWrong}>✗ {w.selected}</ThemedText>
                  </View>
                  <View style={styles.missedRow}>
                    <ThemedText style={styles.missedCorrect}>✓ {w.correct}</ThemedText>
                  </View>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
            <ThemedText style={styles.playAgainText}>Play Again</ThemedText>
          </TouchableOpacity>
        </ScrollView>
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
              {currentIndex + 1} / {questions.length}
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

const difficultyStyles: Record<string, { badge: { backgroundColor: string }; text: { fontSize: number; fontWeight: '600'; color: string } }> = {
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
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
  missedSection: {
    width: '100%',
    gap: 12,
  },
  missedHeading: {
    fontSize: 18,
    fontWeight: '700',
  },
  missedCard: {
    borderRadius: 14,
    padding: 16,
    gap: 8,
    width: '100%',
  },
  missedTopic: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0a7ea4',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  missedQuestion: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  missedRow: {
    flexDirection: 'row',
  },
  missedWrong: {
    fontSize: 13,
    color: '#f44336',
    lineHeight: 20,
  },
  missedCorrect: {
    fontSize: 13,
    color: '#4caf50',
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
  pickerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 28,
  },
  pickerSubtitle: {
    fontSize: 16,
    opacity: 0.5,
    fontWeight: '500',
  },
  pickerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  pickerButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#0a7ea4',
    gap: 4,
  },
  pickerButtonNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0a7ea4',
    lineHeight: 36,
  },
  pickerButtonLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0a7ea4',
    opacity: 0.7,
  },
  difficultySection: {
    width: '100%',
    gap: 12,
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#8e8e9344',
  },
  difficultyButtonActive: {
    borderColor: 'transparent',
  },
  difficultyButtonText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.4,
  },
  difficultyButtonTextActive: {
    opacity: 1,
  },
});
