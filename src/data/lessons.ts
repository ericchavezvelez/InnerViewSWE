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

  HashMaps: {
    topic: 'HashMaps',
    tagline: 'The go-to structure for turning O(n²) solutions into O(n).',
    sections: [
      {
        type: 'intro',
        content:
          'A HashMap (also called a hash table or dictionary) stores key-value pairs. It uses a hash function to convert a key into an array index, giving you O(1) average-case lookup, insertion, and deletion. This makes it one of the most powerful tools in an interview setting.',
      },
      {
        type: 'concept',
        title: 'Time Complexities',
        body:
          'Lookup by key: O(1) average, O(n) worst case (hash collision)\nInsert: O(1) average\nDelete: O(1) average\nIterate over all entries: O(n)\n\nWorst case collisions are rare in practice and ignored in most interview analysis.',
      },
      {
        type: 'concept',
        title: 'When to Reach for a HashMap',
        body:
          'Frequency counting — count how many times each element appears.\n\nComplement lookup — store values you\'ve already seen so you can check for a match in O(1) instead of scanning again.\n\nGrouping — group items by a computed key (e.g. anagram grouping by sorted characters).\n\nCaching / memoization — store results of expensive calls keyed by their inputs.',
      },
      {
        type: 'code',
        label: 'Frequency Count — find first non-repeating character',
        content:
`function firstUnique(s: string): string {
  const freq: Record<string, number> = {};

  for (const ch of s) {
    freq[ch] = (freq[ch] ?? 0) + 1;
  }

  for (const ch of s) {
    if (freq[ch] === 1) return ch;
  }

  return '';
}`,
      },
      {
        type: 'tip',
        content:
          'Whenever you see "find a pair", "find a duplicate", or "group by property" in a problem — a HashMap is almost always the right first instinct. It trades memory for speed.',
      },
      {
        type: 'quiz',
        question: 'What is the average time complexity of looking up a value by key in a HashMap?',
        options: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'],
        correctIndex: 2,
        explanation:
          'HashMaps use a hash function to map keys directly to memory positions, giving O(1) average lookup. Worst case is O(n) due to collisions, but this is rare with a good hash function.',
      },
    ],
  },
};
