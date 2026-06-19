export type TopicStat = { topic: string; correct: number; total: number };

type ResponseRow = { is_correct: boolean; topic: string };

export function computeTopicStats(rows: ResponseRow[]): { best: TopicStat[]; worst: TopicStat[] } {
  const statsMap: Record<string, { correct: number; total: number }> = {};
  for (const row of rows) {
    if (!statsMap[row.topic]) statsMap[row.topic] = { correct: 0, total: 0 };
    statsMap[row.topic].total += 1;
    if (row.is_correct) statsMap[row.topic].correct += 1;
  }
  const sorted = Object.entries(statsMap)
    .map(([topic, s]) => ({ topic, ...s }))
    .sort((a, b) => b.correct / b.total - a.correct / a.total);
  return {
    best: sorted.slice(0, 3),
    worst: sorted.slice(-3).reverse(),
  };
}

export function formatAccuracy(stat: TopicStat): string {
  return `${Math.round((stat.correct / stat.total) * 100)}%`;
}
