/**
 * Unit Tests: Progress stat computation
 *
 * Pure logic — no network, no UI, no Supabase. Tests the two functions
 * that sit between raw user_responses rows and what the progress tab renders.
 *
 * Equivalence partitioning:
 *   EC1 — formatAccuracy: exact (100%), rounded down (33%), rounded up (67%), zero (0%)
 *   EC2 — computeTopicStats: fewer than 3 topics, exactly 3, more than 3
 *   EC3 — computeTopicStats: empty input
 */

import { computeTopicStats, formatAccuracy, type TopicStat } from '../lib/progressUtils';

// ─── formatAccuracy() ─────────────────────────────────────────────────────────

describe('formatAccuracy()', () => {
  it('returns 100% when all answers are correct', () => {
    expect(formatAccuracy({ topic: 'Trees', correct: 3, total: 3 })).toBe('100%');
  });

  it('rounds down to 33% for 1 of 3 correct', () => {
    expect(formatAccuracy({ topic: 'Trees', correct: 1, total: 3 })).toBe('33%');
  });

  it('rounds up to 67% for 2 of 3 correct', () => {
    expect(formatAccuracy({ topic: 'Trees', correct: 2, total: 3 })).toBe('67%');
  });

  it('returns 0% when no answers are correct', () => {
    expect(formatAccuracy({ topic: 'Trees', correct: 0, total: 4 })).toBe('0%');
  });
});

// ─── computeTopicStats() ──────────────────────────────────────────────────────

describe('computeTopicStats()', () => {
  it('returns empty best and worst for an empty input', () => {
    const { best, worst } = computeTopicStats([]);
    expect(best).toHaveLength(0);
    expect(worst).toHaveLength(0);
  });

  it('groups rows by topic and counts correct answers', () => {
    const rows = [
      { is_correct: true,  topic: 'HashMap' },
      { is_correct: false, topic: 'HashMap' },
      { is_correct: true,  topic: 'HashMap' },
    ];
    const { best } = computeTopicStats(rows);
    expect(best[0]).toEqual({ topic: 'HashMap', correct: 2, total: 3 });
  });

  it('sorts topics by accuracy descending so best is first', () => {
    const rows = [
      { is_correct: true,  topic: 'Trees' },   // 1/1 = 100%
      { is_correct: true,  topic: 'Graphs' },
      { is_correct: false, topic: 'Graphs' },  // 1/2 = 50%
    ];
    const { best } = computeTopicStats(rows);
    expect(best[0].topic).toBe('Trees');
    expect(best[1].topic).toBe('Graphs');
  });

  it('caps best at 3 topics even when more are available', () => {
    const rows = [
      { is_correct: true, topic: 'A' },
      { is_correct: true, topic: 'B' },
      { is_correct: true, topic: 'C' },
      { is_correct: true, topic: 'D' },
    ];
    const { best } = computeTopicStats(rows);
    expect(best).toHaveLength(3);
  });

  it('caps worst at 3 topics even when more are available', () => {
    const rows = [
      { is_correct: false, topic: 'A' },
      { is_correct: false, topic: 'B' },
      { is_correct: false, topic: 'C' },
      { is_correct: false, topic: 'D' },
    ];
    const { worst } = computeTopicStats(rows);
    expect(worst).toHaveLength(3);
  });

  it('returns worst topics in ascending accuracy order (weakest first)', () => {
    const rows = [
      { is_correct: true,  topic: 'A' },  // 100%
      { is_correct: true,  topic: 'B' },
      { is_correct: false, topic: 'B' },  // 50%
      { is_correct: false, topic: 'C' },  // 0%
    ];
    const { worst } = computeTopicStats(rows);
    expect(worst[0].topic).toBe('C');
    expect(worst[1].topic).toBe('B');
  });

  it('returns all topics when fewer than 3 exist', () => {
    const rows = [
      { is_correct: true,  topic: 'Trees' },
      { is_correct: false, topic: 'Sorting' },
    ];
    const { best, worst } = computeTopicStats(rows);
    expect(best).toHaveLength(2);
    expect(worst).toHaveLength(2);
  });
});
