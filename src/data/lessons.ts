export type Section =
  | { type: 'intro';    content: string }
  | { type: 'concept';  title: string; body: string }
  | { type: 'code';     label: string; content: string }
  | { type: 'tip';      content: string }
  | { type: 'quiz';     question: string; options: string[]; correctIndex: number; explanation: string };

export type LessonContent = {
  topic: string;
  tagline: string;
  sections: Section[];
};

export const LESSONS: Record<string, LessonContent> = {
  Arrays: {
    topic: 'Arrays',
    tagline: 'The most fundamental data structure in programming.',
    sections: [
      {
        type: 'intro',
        content:
          'An array stores elements in contiguous memory locations. Because each element sits at a predictable offset from the start, you can jump directly to any index in constant time — no searching required.',
      },
      {
        type: 'concept',
        title: 'Time Complexities',
        body:
          'Access by index: O(1)\nSearch (unsorted): O(n)\nInsert / delete at end: O(1) amortized\nInsert / delete at middle: O(n) — requires shifting all subsequent elements',
      },
      {
        type: 'concept',
        title: 'Common Patterns',
        body:
          'Two Pointers — use a left and right pointer moving toward each other to avoid nested loops.\n\nSliding Window — maintain a fixed-size or variable window over the array to compute running results in O(n).\n\nPrefix Sum — precompute cumulative sums so any subarray sum can be answered in O(1).',
      },
      {
        type: 'code',
        label: 'Two Sum — HashMap approach O(n)',
        content:
`function twoSum(nums: number[], target: number): number[] {
  const seen: Record<number, number> = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (complement in seen) return [seen[complement], i];
    seen[nums[i]] = i;
  }
  return [];
}`,
      },
      {
        type: 'tip',
        content:
          'When a brute-force solution uses two nested loops (O(n²)), ask yourself: can a HashMap eliminate the inner loop? Arrays + HashMaps together solve a huge category of interview problems.',
      },
      {
        type: 'quiz',
        question: 'What is the time complexity of inserting an element at the beginning of an array?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctIndex: 2,
        explanation:
          'Inserting at the beginning requires shifting every existing element one position to the right, making it O(n). Only inserting at the end is O(1) amortized.',
      },
    ],
  },
};
