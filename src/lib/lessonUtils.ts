import { type QuizQuestion } from '@/src/data/lessons';

export function pickRandomQuestion(questions: QuizQuestion[]): QuizQuestion {
  if (questions.length === 0) {
    throw new Error('pickRandomQuestion called with an empty array');
  }
  return questions[Math.floor(Math.random() * questions.length)];
}
