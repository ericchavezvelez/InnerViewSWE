/**
 * Test Suite: Game Logic
 * Requirements covered: R4 (shuffle correctness), R5 (difficulty filter), R6 (session size)
 *
 * QA approach: these are pure unit tests — no network, no UI, no Supabase.
 * Each function is tested in isolation with known inputs and expected outputs.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

type Difficulty = 'SWE1' | 'SWE2' | 'SWE3';

type Question = {
  id: string;
  topic: string;
  difficulty: Difficulty;
  question: string;
  answers: string[];
  correctIndex: number;
  explanation: string;
};

// ─── Functions under test (extracted from play.tsx) ───────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleAnswers(q: Question): Question {
  const correct = q.answers[q.correctIndex];
  const answers = shuffle(q.answers);
  return { ...q, answers, correctIndex: answers.indexOf(correct) };
}

function filterByDifficulty(questions: Question[], difficulty: Difficulty | 'All'): Question[] {
  if (difficulty === 'All') return questions;
  return questions.filter((q) => q.difficulty === difficulty);
}

function buildSessionPool(questions: Question[], difficulty: Difficulty | 'All', size: number): Question[] {
  const pool = filterByDifficulty(questions, difficulty);
  return shuffle(pool).slice(0, Math.min(size, pool.length)).map(shuffleAnswers);
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makeQuestion = (id: string, difficulty: Difficulty, answers = ['A', 'B', 'C', 'D'], correctIndex = 0): Question => ({
  id,
  topic: 'HashMaps',
  difficulty,
  question: `Question ${id}`,
  answers,
  correctIndex,
  explanation: 'Explanation',
});

const MOCK_QUESTIONS: Question[] = [
  makeQuestion('1', 'SWE1'),
  makeQuestion('2', 'SWE1'),
  makeQuestion('3', 'SWE1'),
  makeQuestion('4', 'SWE2'),
  makeQuestion('5', 'SWE2'),
  makeQuestion('6', 'SWE3'),
];

// ─── shuffle() ────────────────────────────────────────────────────────────────

describe('shuffle()', () => {
  it('returns an array with the same number of elements', () => {
    const result = shuffle([1, 2, 3, 4, 5]);
    expect(result).toHaveLength(5);
  });

  it('contains all the original elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result.sort()).toEqual([...input].sort());
  });

  it('does not mutate the original array', () => {
    const input = [1, 2, 3];
    const copy = [...input];
    shuffle(input);
    expect(input).toEqual(copy);
  });

  it('returns an empty array when given an empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('returns a single-element array unchanged', () => {
    expect(shuffle([42])).toEqual([42]);
  });
});

// ─── shuffleAnswers() ─────────────────────────────────────────────────────────

describe('shuffleAnswers()', () => {
  it('keeps the correct answer text in the shuffled array', () => {
    const q = makeQuestion('1', 'SWE1', ['A', 'B', 'C', 'D'], 2);
    const shuffled = shuffleAnswers(q);
    expect(shuffled.answers[shuffled.correctIndex]).toBe('C');
  });

  it('returns all original answers', () => {
    const q = makeQuestion('1', 'SWE1', ['A', 'B', 'C', 'D'], 0);
    const shuffled = shuffleAnswers(q);
    expect(shuffled.answers.sort()).toEqual(['A', 'B', 'C', 'D']);
  });

  it('correctIndex is a valid index into the answers array', () => {
    const q = makeQuestion('1', 'SWE1', ['A', 'B', 'C', 'D'], 3);
    const shuffled = shuffleAnswers(q);
    expect(shuffled.correctIndex).toBeGreaterThanOrEqual(0);
    expect(shuffled.correctIndex).toBeLessThan(shuffled.answers.length);
  });

  it('does not change the number of answers', () => {
    const q = makeQuestion('1', 'SWE1', ['A', 'B', 'C', 'D'], 0);
    const shuffled = shuffleAnswers(q);
    expect(shuffled.answers).toHaveLength(4);
  });
});

// ─── filterByDifficulty() ─────────────────────────────────────────────────────

describe('filterByDifficulty()', () => {
  it('returns all questions when difficulty is "All"', () => {
    const result = filterByDifficulty(MOCK_QUESTIONS, 'All');
    expect(result).toHaveLength(6);
  });

  it('returns only SWE1 questions when filtered', () => {
    const result = filterByDifficulty(MOCK_QUESTIONS, 'SWE1');
    expect(result).toHaveLength(3);
    expect(result.every((q) => q.difficulty === 'SWE1')).toBe(true);
  });

  it('returns only SWE2 questions when filtered', () => {
    const result = filterByDifficulty(MOCK_QUESTIONS, 'SWE2');
    expect(result).toHaveLength(2);
    expect(result.every((q) => q.difficulty === 'SWE2')).toBe(true);
  });

  it('returns only SWE3 questions when filtered', () => {
    const result = filterByDifficulty(MOCK_QUESTIONS, 'SWE3');
    expect(result).toHaveLength(1);
    expect(result.every((q) => q.difficulty === 'SWE3')).toBe(true);
  });

  it('returns empty array when no questions match the difficulty', () => {
    const result = filterByDifficulty([], 'SWE1');
    expect(result).toHaveLength(0);
  });
});

// ─── buildSessionPool() ───────────────────────────────────────────────────────

describe('buildSessionPool()', () => {
  it('returns the requested number of questions when pool is large enough', () => {
    const result = buildSessionPool(MOCK_QUESTIONS, 'All', 5);
    expect(result).toHaveLength(5);
  });

  it('caps at pool size when requested size exceeds available questions', () => {
    // Only 1 SWE3 question available, requesting 5
    const result = buildSessionPool(MOCK_QUESTIONS, 'SWE3', 5);
    expect(result).toHaveLength(1);
  });

  it('returns 0 questions from an empty pool', () => {
    const result = buildSessionPool([], 'All', 5);
    expect(result).toHaveLength(0);
  });

  it('each question in the pool has a valid correctIndex', () => {
    const result = buildSessionPool(MOCK_QUESTIONS, 'All', 6);
    result.forEach((q) => {
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.answers.length);
    });
  });

  it('only returns questions matching the selected difficulty', () => {
    const result = buildSessionPool(MOCK_QUESTIONS, 'SWE2', 5);
    expect(result.every((q) => q.difficulty === 'SWE2')).toBe(true);
  });
});
