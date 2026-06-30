/**
 * Test Suite: Lesson Utility Functions
 * Requirements covered: quiz pool random question selection
 *
 * Equivalence partitioning classes (pickRandomQuestion):
 *   - Single-question pool → always returns that question
 *   - Multi-question pool → returns a question from the pool
 *   - Multi-question pool → all questions are reachable over many calls
 *   - Empty array → throws an error
 *
 * Boundary values:
 *   - Pool of exactly 1 question
 *   - Pool of exactly 2 questions (smallest non-trivial case)
 */

import { pickRandomQuestion } from '@/src/lib/lessonUtils';
import { type QuizQuestion } from '@/src/data/lessons';

function makeQuestion(id: number): QuizQuestion {
  return {
    question: `Question ${id}`,
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 0,
    explanation: `Explanation ${id}`,
  };
}

// ─── pickRandomQuestion ───────────────────────────────────────────────────────

describe('pickRandomQuestion', () => {
  it('returns the only question when the pool has one entry', () => {
    const q = makeQuestion(1);
    expect(pickRandomQuestion([q])).toBe(q);
  });

  it('returns a question that exists in the pool', () => {
    const pool = [makeQuestion(1), makeQuestion(2), makeQuestion(3)];
    const picked = pickRandomQuestion(pool);
    expect(pool).toContain(picked);
  });

  it('returns the correct object reference, not a copy', () => {
    const pool = [makeQuestion(1), makeQuestion(2)];
    const picked = pickRandomQuestion(pool);
    expect(picked === pool[0] || picked === pool[1]).toBe(true);
  });

  it('reaches every question in a two-item pool over many calls', () => {
    const pool = [makeQuestion(1), makeQuestion(2)];
    const seen = new Set<QuizQuestion>();

    for (let i = 0; i < 200; i++) {
      seen.add(pickRandomQuestion(pool));
    }

    expect(seen.size).toBe(2);
  });

  it('reaches every question in a four-item pool over many calls', () => {
    const pool = [makeQuestion(1), makeQuestion(2), makeQuestion(3), makeQuestion(4)];
    const seen = new Set<QuizQuestion>();

    for (let i = 0; i < 400; i++) {
      seen.add(pickRandomQuestion(pool));
    }

    expect(seen.size).toBe(4);
  });

  it('throws when called with an empty array', () => {
    expect(() => pickRandomQuestion([])).toThrow();
  });

  it('never returns undefined', () => {
    const pool = [makeQuestion(1), makeQuestion(2), makeQuestion(3)];

    for (let i = 0; i < 50; i++) {
      expect(pickRandomQuestion(pool)).toBeDefined();
    }
  });
});
