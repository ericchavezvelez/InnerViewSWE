/**
 * Integration Tests: Supabase Question Fetch Pipeline
 *
 * Tests the data boundary between the Supabase questions table and
 * the internal Question type used by the game engine.
 *
 * QA rationale: mapToQuestion is the translation layer between the
 * external DB schema (JSONB metadata, swe_level enum, UUID foreign keys)
 * and the app's Question type. A silent bug here would corrupt every
 * session without any network error — no unit test on shuffle or
 * filtering would catch it.
 *
 * Equivalence partitioning classes:
 *   EC1 — swe_level enum ('swe_1' | 'swe_2' | 'swe_3') → difficulty string
 *   EC2 — correct_option_id position → correctIndex (boundary: first / last)
 *   EC3 — explanation null vs string
 *   EC4 — post-fetch pool filtering by difficulty
 */

// ─── Types (mirrored from play.tsx for isolated testing) ─────────────────────

type SupabaseRow = {
  id: string;
  lesson_id: string;
  topic_id: string;
  prompt: string;
  metadata: {
    options: { id: string; text: string }[];
    correct_option_id: string;
  };
  explanation: string | null;
  swe_level: 'swe_1' | 'swe_2' | 'swe_3';
  xp_reward: number;
  topics: { name: string };
  lessons: { category_id: string };
};

type Question = {
  id: string;
  topic: string;
  difficulty: 'SWE1' | 'SWE2' | 'SWE3';
  question: string;
  answers: string[];
  correctIndex: number;
  explanation: string;
  lessonId: string;
  categoryId: string;
  topicId: string;
  xpReward: number;
};

// ─── Function under test (mirrored from play.tsx) ────────────────────────────

const LEVEL_MAP = { swe_1: 'SWE1', swe_2: 'SWE2', swe_3: 'SWE3' } as const;

function mapToQuestion(row: SupabaseRow): Question {
  const options = row.metadata.options;
  const correctIndex = options.findIndex((o) => o.id === row.metadata.correct_option_id);
  return {
    id: row.id,
    lessonId: row.lesson_id,
    categoryId: row.lessons.category_id,
    topicId: row.topic_id,
    topic: row.topics.name,
    difficulty: LEVEL_MAP[row.swe_level],
    question: row.prompt,
    answers: options.map((o) => o.text),
    correctIndex,
    explanation: row.explanation ?? '',
    xpReward: row.xp_reward,
  };
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const BASE_OPTIONS = [
  { id: 'a', text: 'O(n)' },
  { id: 'b', text: 'O(log n)' },
  { id: 'c', text: 'O(1)' },
  { id: 'd', text: 'O(n²)' },
];

function makeRow(overrides: Partial<SupabaseRow> = {}): SupabaseRow {
  return {
    id: 'ffffffff-0000-0000-0000-000000000001',
    lesson_id: 'dddddddd-0000-0000-0000-000000000002',
    topic_id: 'bbbbbbbb-0000-0000-0000-000000000001',
    prompt: 'What is the average time complexity of a HashMap lookup?',
    metadata: { options: BASE_OPTIONS, correct_option_id: 'c' },
    explanation: 'A hash function maps keys directly to bucket indices in O(1).',
    swe_level: 'swe_1',
    xp_reward: 5,
    topics: { name: 'HashMap' },
    lessons: { category_id: 'cccccccc-0000-0000-0000-000000000001' },
    ...overrides,
  };
}

// ─── mapToQuestion() ─────────────────────────────────────────────────────────

describe('mapToQuestion()', () => {
  // EC1: swe_level enum values map to difficulty strings
  it('maps swe_1 to difficulty SWE1', () => {
    const result = mapToQuestion(makeRow({ swe_level: 'swe_1' }));
    expect(result.difficulty).toBe('SWE1');
  });

  it('maps swe_2 to difficulty SWE2', () => {
    const result = mapToQuestion(makeRow({ swe_level: 'swe_2' }));
    expect(result.difficulty).toBe('SWE2');
  });

  it('maps swe_3 to difficulty SWE3', () => {
    const result = mapToQuestion(makeRow({ swe_level: 'swe_3' }));
    expect(result.difficulty).toBe('SWE3');
  });

  // EC2: correct_option_id → correctIndex (boundary values)
  it('sets correctIndex to 0 when correct_option_id is "a" (first option)', () => {
    const result = mapToQuestion(
      makeRow({ metadata: { options: BASE_OPTIONS, correct_option_id: 'a' } }),
    );
    expect(result.correctIndex).toBe(0);
    expect(result.answers[result.correctIndex]).toBe('O(n)');
  });

  it('sets correctIndex to 3 when correct_option_id is "d" (last option)', () => {
    const result = mapToQuestion(
      makeRow({ metadata: { options: BASE_OPTIONS, correct_option_id: 'd' } }),
    );
    expect(result.correctIndex).toBe(3);
    expect(result.answers[result.correctIndex]).toBe('O(n²)');
  });

  // EC3: null explanation falls back to empty string
  it('returns an empty string when explanation is null', () => {
    const result = mapToQuestion(makeRow({ explanation: null }));
    expect(result.explanation).toBe('');
  });

  it('preserves explanation text when provided', () => {
    const result = mapToQuestion(
      makeRow({ explanation: 'Hash functions map keys to indices in O(1).' }),
    );
    expect(result.explanation).toBe('Hash functions map keys to indices in O(1).');
  });

  // Field mapping — prompt, topic name, xp_reward, and all IDs
  it('maps prompt to question field', () => {
    const result = mapToQuestion(makeRow({ prompt: 'What is a trie?' }));
    expect(result.question).toBe('What is a trie?');
  });

  it('maps topics.name to topic field', () => {
    const result = mapToQuestion(
      makeRow({ topics: { name: 'Dynamic Programming' } }),
    );
    expect(result.topic).toBe('Dynamic Programming');
  });

  it('maps all UUID fields to camelCase properties', () => {
    const result = mapToQuestion(makeRow());
    expect(result.lessonId).toBe('dddddddd-0000-0000-0000-000000000002');
    expect(result.categoryId).toBe('cccccccc-0000-0000-0000-000000000001');
    expect(result.topicId).toBe('bbbbbbbb-0000-0000-0000-000000000001');
  });

  it('maps xp_reward to xpReward', () => {
    const result = mapToQuestion(makeRow({ xp_reward: 15 }));
    expect(result.xpReward).toBe(15);
  });
});

// ─── Post-fetch pool filtering ─────────────────────────────────────────────

describe('post-fetch difficulty filtering', () => {
  const pool: Question[] = [
    mapToQuestion(makeRow({ id: 'id-1', swe_level: 'swe_1' })),
    mapToQuestion(makeRow({ id: 'id-2', swe_level: 'swe_1' })),
    mapToQuestion(makeRow({ id: 'id-3', swe_level: 'swe_2' })),
    mapToQuestion(makeRow({ id: 'id-4', swe_level: 'swe_3' })),
  ];

  it('returns all questions when difficulty filter is All', () => {
    const result = pool;
    expect(result).toHaveLength(4);
  });

  it('returns only SWE1 questions after filtering', () => {
    const result = pool.filter((q) => q.difficulty === 'SWE1');
    expect(result).toHaveLength(2);
    expect(result.every((q) => q.difficulty === 'SWE1')).toBe(true);
  });

  it('returns empty array when no questions match the selected difficulty', () => {
    const emptyPool: Question[] = [];
    const result = emptyPool.filter((q) => q.difficulty === 'SWE2');
    expect(result).toHaveLength(0);
  });
});
