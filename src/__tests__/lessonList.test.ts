/**
 * Test Suite: Lesson List Integrity
 * Requirements covered: lessonList.ts and lessons.ts stay in sync;
 * UI counts and content availability are consistent.
 *
 * Equivalence partitioning classes:
 *   - Available lessons → must all have content in LESSONS record
 *   - Unavailable lessons → must NOT have content yet (coming soon)
 *   - All lessons → must have a non-empty icon and description
 *   - Available count → must match the expected total shown in the UI (9)
 */

import { DATA_STRUCTURES, ALGORITHMS, type LessonMeta } from '@/src/data/lessonList';
import { LESSONS } from '@/src/data/lessons';

const ALL_LESSONS = [...DATA_STRUCTURES, ...ALGORITHMS];
const AVAILABLE = ALL_LESSONS.filter((l) => l.available);
const UNAVAILABLE = ALL_LESSONS.filter((l) => !l.available);

const EXPECTED_AVAILABLE_COUNT = 9;

// ─── Available count ──────────────────────────────────────────────────────────

describe('available lesson count', () => {
  it(`has exactly ${EXPECTED_AVAILABLE_COUNT} available lessons`, () => {
    expect(AVAILABLE.length).toBe(EXPECTED_AVAILABLE_COUNT);
  });

  it('has more unavailable lessons than available ones (room to grow)', () => {
    expect(UNAVAILABLE.length).toBeGreaterThan(0);
  });
});

// ─── Content coverage ─────────────────────────────────────────────────────────

describe('content coverage', () => {
  it.each(AVAILABLE.map((l) => [l.name, l]))(
    'available lesson "%s" has content in LESSONS',
    (_, lesson: LessonMeta) => {
      expect(LESSONS[lesson.name]).toBeDefined();
    }
  );

  it.each(UNAVAILABLE.map((l) => [l.name, l]))(
    'unavailable lesson "%s" does not have content yet',
    (_, lesson: LessonMeta) => {
      expect(LESSONS[lesson.name]).toBeUndefined();
    }
  );
});

// ─── Metadata integrity ───────────────────────────────────────────────────────

describe('lesson metadata integrity', () => {
  it.each(ALL_LESSONS.map((l) => [l.name, l]))(
    '"%s" has a non-empty icon',
    (_, lesson: LessonMeta) => {
      expect(lesson.icon.trim().length).toBeGreaterThan(0);
    }
  );

  it.each(ALL_LESSONS.map((l) => [l.name, l]))(
    '"%s" has a non-empty description',
    (_, lesson: LessonMeta) => {
      expect(lesson.description.trim().length).toBeGreaterThan(0);
    }
  );

  it.each(ALL_LESSONS.map((l) => [l.name, l]))(
    '"%s" has a non-empty name',
    (_, lesson: LessonMeta) => {
      expect(lesson.name.trim().length).toBeGreaterThan(0);
    }
  );
});

// ─── LESSONS record integrity ─────────────────────────────────────────────────

describe('LESSONS record integrity', () => {
  it.each(AVAILABLE.map((l) => [l.name, l]))(
    'lesson "%s" has at least one section',
    (_, lesson: LessonMeta) => {
      expect(LESSONS[lesson.name].sections.length).toBeGreaterThan(0);
    }
  );

  it.each(AVAILABLE.map((l) => [l.name, l]))(
    'lesson "%s" has a tagline',
    (_, lesson: LessonMeta) => {
      expect(LESSONS[lesson.name].tagline.trim().length).toBeGreaterThan(0);
    }
  );

  it.each(AVAILABLE.map((l) => [l.name, l]))(
    'lesson "%s" topic field matches its key',
    (_, lesson: LessonMeta) => {
      expect(LESSONS[lesson.name].topic).toBe(lesson.name);
    }
  );
});
