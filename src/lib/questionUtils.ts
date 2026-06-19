export type SupabaseRow = {
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

export type Question = {
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

export const LEVEL_MAP = { swe_1: 'SWE1', swe_2: 'SWE2', swe_3: 'SWE3' } as const;

export function mapToQuestion(row: SupabaseRow): Question {
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
