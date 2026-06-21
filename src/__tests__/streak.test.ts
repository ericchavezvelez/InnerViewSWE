/**
 * Test Suite: Home Tab Utility Functions
 * Requirements covered: streak counter and weekly count on Home tab
 *
 * Equivalence partitioning classes (computeStreak):
 *   - No activity (empty array) → 0
 *   - Activity today only → 1
 *   - Activity yesterday only → 1
 *   - Consecutive days including today → n
 *   - Consecutive days ending yesterday → n
 *   - Gap in activity → counts only most recent streak
 *   - Duplicate entries on same day → counted as 1 day
 *
 * Equivalence partitioning classes (computeWeeklyCount):
 *   - No activity → 0
 *   - All activity within 7 days → full count
 *   - Mix of recent and old activity → only recent counted
 */

import { computeStreak, computeWeeklyCount } from '@/src/lib/homeUtils';

// Generates an ISO timestamp N days ago from today
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// ─── computeStreak ────────────────────────────────────────────────────────────

describe('computeStreak()', () => {
  it('returns 0 for an empty activity array', () => {
    expect(computeStreak([])).toBe(0);
  });

  it('returns 1 when there is only activity today', () => {
    expect(computeStreak([daysAgo(0)])).toBe(1);
  });

  it('returns 1 when there is only activity yesterday', () => {
    expect(computeStreak([daysAgo(1)])).toBe(1);
  });

  it('returns 0 when the last activity was 2 or more days ago', () => {
    expect(computeStreak([daysAgo(2)])).toBe(0);
  });

  it('returns correct streak for consecutive days including today', () => {
    const activity = [daysAgo(0), daysAgo(1), daysAgo(2)];
    expect(computeStreak(activity)).toBe(3);
  });

  it('returns correct streak for consecutive days ending yesterday', () => {
    const activity = [daysAgo(1), daysAgo(2), daysAgo(3)];
    expect(computeStreak(activity)).toBe(3);
  });

  it('counts only the most recent consecutive streak when there is a gap', () => {
    // Active today and yesterday, gap, then active 5 days ago
    const activity = [daysAgo(0), daysAgo(1), daysAgo(5)];
    expect(computeStreak(activity)).toBe(2);
  });

  it('deduplicates multiple entries on the same day', () => {
    // 3 entries today should count as 1 day
    const activity = [daysAgo(0), daysAgo(0), daysAgo(0)];
    expect(computeStreak(activity)).toBe(1);
  });

  it('returns 0 when activity exists but none within the last 2 days', () => {
    // Scattered history with no recent activity — streak should be broken
    const activity = [daysAgo(3), daysAgo(5), daysAgo(10), daysAgo(14)];
    expect(computeStreak(activity)).toBe(0);
  });

  it('handles a long consecutive streak correctly', () => {
    const activity = Array.from({ length: 14 }, (_, i) => daysAgo(i));
    expect(computeStreak(activity)).toBe(14);
  });

  it('does not count future dates as part of streak', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const activity = [tomorrow.toISOString(), daysAgo(0), daysAgo(1)];
    expect(computeStreak(activity)).toBe(2);
  });
});

// ─── computeWeeklyCount ───────────────────────────────────────────────────────

describe('computeWeeklyCount()', () => {
  it('returns 0 for an empty activity array', () => {
    expect(computeWeeklyCount([])).toBe(0);
  });

  it('counts all entries when all are within the last 7 days', () => {
    const activity = [daysAgo(0), daysAgo(2), daysAgo(6)];
    expect(computeWeeklyCount(activity)).toBe(3);
  });

  it('excludes entries older than 7 days', () => {
    const activity = [daysAgo(0), daysAgo(3), daysAgo(8), daysAgo(14)];
    expect(computeWeeklyCount(activity)).toBe(2);
  });

  it('returns 0 when all entries are older than 7 days', () => {
    const activity = [daysAgo(8), daysAgo(10), daysAgo(20)];
    expect(computeWeeklyCount(activity)).toBe(0);
  });

  it('counts multiple entries on the same day independently', () => {
    // Unlike streak, weekly count is a raw answer count — not deduplicated
    const activity = [daysAgo(0), daysAgo(0), daysAgo(0)];
    expect(computeWeeklyCount(activity)).toBe(3);
  });
});
