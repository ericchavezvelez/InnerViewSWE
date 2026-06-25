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

  LinkedLists: {
    topic: 'LinkedLists',
    tagline: 'Flexible node chains — O(1) inserts, but no random access.',
    sections: [
      {
        type: 'intro',
        content:
          'A linked list is a sequence of nodes where each node holds a value and a pointer to the next node. Unlike arrays, nodes are not stored in contiguous memory — so there is no index-based access. The trade-off is that insertions and deletions at known positions are O(1) since you only update pointers.',
      },
      {
        type: 'concept',
        title: 'Time Complexities',
        body:
          'Access by position: O(n) — must traverse from the head\nSearch: O(n)\nInsert / delete at head: O(1)\nInsert / delete at tail: O(1) with a tail pointer, O(n) without\nInsert / delete in middle: O(n) to find the position, then O(1) to update pointers',
      },
      {
        type: 'concept',
        title: 'Common Patterns',
        body:
          'Two Pointers (Fast & Slow) — use a slow pointer moving one step and a fast pointer moving two. Detects cycles (Floyd\'s algorithm) and finds the middle node.\n\nDummy Head Node — add a placeholder node before the real head to simplify edge cases when inserting or deleting at the front.\n\nIn-place Reversal — reverse a list by updating next pointers iteratively. Avoids extra space.',
      },
      {
        type: 'code',
        label: 'Reverse a linked list — iterative O(n)',
        content:
`function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;

  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  return prev;
}`,
      },
      {
        type: 'tip',
        content:
          'When solving linked list problems, draw the nodes and arrows on paper first. Most bugs come from losing a pointer before saving it — always store next before overwriting curr.next.',
      },
      {
        type: 'quiz',
        question: 'What is the time complexity of inserting a node at the head of a linked list?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctIndex: 3,
        explanation:
          'Inserting at the head only requires updating two pointers — the new node\'s next points to the old head, and the head pointer updates to the new node. No traversal needed, so it\'s O(1).',
      },
    ],
  },

  Trees: {
    topic: 'Trees',
    tagline: 'Hierarchical structures that power search, parsing, and more.',
    sections: [
      {
        type: 'intro',
        content:
          'A tree is a hierarchical data structure made of nodes. Each node has a value and zero or more child nodes. The top node is the root, nodes with no children are leaves, and every node except the root has exactly one parent. Binary trees — where each node has at most two children — are the most common in interviews.',
      },
      {
        type: 'concept',
        title: 'Binary Search Tree (BST) Properties',
        body:
          'For every node N:\n  • All values in the left subtree are less than N\n  • All values in the right subtree are greater than N\n\nThis ordering gives O(log n) search, insert, and delete on a balanced BST. An unbalanced BST degrades to O(n) in the worst case (a straight line of nodes).',
      },
      {
        type: 'concept',
        title: 'Traversal Orders',
        body:
          'Inorder (Left → Root → Right) — visits nodes in sorted ascending order on a BST.\n\nPreorder (Root → Left → Right) — useful for copying or serializing a tree.\n\nPostorder (Left → Right → Root) — useful for deleting a tree or evaluating expression trees.\n\nLevel Order (BFS) — visits nodes level by level using a queue. Used for shortest path problems.',
      },
      {
        type: 'code',
        label: 'Inorder traversal — recursive O(n)',
        content:
`function inorder(root: TreeNode | null): number[] {
  if (root === null) return [];

  return [
    ...inorder(root.left),
    root.val,
    ...inorder(root.right),
  ];
}`,
      },
      {
        type: 'tip',
        content:
          'Most tree problems have a clean recursive solution. At each node, ask: what do I need from my left subtree? What from my right? What do I return to my parent? Answer those three questions and the code almost writes itself.',
      },
      {
        type: 'quiz',
        question: 'In what order does an inorder traversal visit nodes on a valid Binary Search Tree?',
        options: [
          'Random order',
          'Descending (largest to smallest)',
          'Ascending (smallest to largest)',
          'Level by level',
        ],
        correctIndex: 2,
        explanation:
          'Inorder traversal visits Left → Root → Right. On a BST, the left subtree always holds smaller values and the right holds larger ones, so inorder produces values in ascending sorted order.',
      },
    ],
  },

  'Binary Search': {
    topic: 'Binary Search',
    tagline: 'Eliminate half the search space with every comparison.',
    sections: [
      {
        type: 'intro',
        content:
          'Binary search finds a target in a sorted array by repeatedly halving the search space. Instead of scanning every element (O(n)), it compares the target to the middle element and discards the half that cannot contain the answer — achieving O(log n). It is one of the most frequently tested algorithms in interviews.',
      },
      {
        type: 'concept',
        title: 'The Three-Part Template',
        body:
          'Every binary search follows the same skeleton:\n\n1. Set left = 0, right = array.length - 1\n2. While left <= right:\n   a. Compute mid = Math.floor((left + right) / 2)\n   b. If arr[mid] === target → found it\n   c. If arr[mid] < target → search right half (left = mid + 1)\n   d. If arr[mid] > target → search left half (right = mid - 1)\n3. Return -1 if not found\n\nMastering this template first, then adapting it, solves the vast majority of binary search problems.',
      },
      {
        type: 'concept',
        title: 'Beyond Simple Search',
        body:
          'Binary search appears in disguise in many problems:\n\nFind first / last occurrence — adjust the condition to keep searching after a match.\n\nSearch in rotated array — determine which half is sorted, then decide which side the target is on.\n\nBinary search on the answer — when the answer is a number in a range and you can check "is X possible?" in O(n), binary search on X gives O(n log n) overall.',
      },
      {
        type: 'code',
        label: 'Classic binary search — O(log n)',
        content:
`function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}`,
      },
      {
        type: 'tip',
        content:
          'Use Math.floor((left + right) / 2) rather than (left + right) / 2 to avoid a floating point result. In languages like Java/C++ you would write left + (right - left) / 2 to prevent integer overflow — good habit to mention in an interview even in JavaScript.',
      },
      {
        type: 'quiz',
        question: 'How many comparisons does binary search need at most to find a target in a sorted array of 1,024 elements?',
        options: ['1,024', '512', '10', '32'],
        correctIndex: 2,
        explanation:
          '1,024 = 2¹⁰, so binary search needs at most log₂(1,024) = 10 comparisons. Each step halves the remaining search space: 1024 → 512 → 256 → ... → 1.',
      },
    ],
  },
};
