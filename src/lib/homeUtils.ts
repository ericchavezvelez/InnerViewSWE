// Counts consecutive days with at least one answer, ending today or yesterday
export function computeStreak(createdAts: string[]): number {
  if (createdAts.length === 0) return 0;
  const uniqueDays = new Set(
    createdAts.map((ts) => new Date(ts).toLocaleDateString('en-CA'))
  );
  const checkDate = new Date();
  if (!uniqueDays.has(checkDate.toLocaleDateString('en-CA'))) {
    checkDate.setDate(checkDate.getDate() - 1);
  }
  let count = 0;
  while (uniqueDays.has(checkDate.toLocaleDateString('en-CA'))) {
    count += 1;
    checkDate.setDate(checkDate.getDate() - 1);
  }
  return count;
}

// Counts answers submitted within the last 7 days
export function computeWeeklyCount(createdAts: string[]): number {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return createdAts.filter((ts) => new Date(ts).getTime() >= weekAgo).length;
}
