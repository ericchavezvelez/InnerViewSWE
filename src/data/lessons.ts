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

  Sorting: {
    topic: 'Sorting',
    tagline: 'Ordering data efficiently — the foundation of many algorithms.',
    sections: [
      {
        type: 'intro',
        content:
          'Sorting arranges elements in a defined order (usually ascending). It is rarely the end goal in interviews — but it unlocks faster algorithms. A sorted array lets you binary search in O(log n), use two pointers in O(n), and eliminate duplicates trivially. Knowing which sort to use and why matters more than memorizing implementations.',
      },
      {
        type: 'concept',
        title: 'Algorithm Comparison',
        body:
          'Bubble Sort — O(n²) time, O(1) space. Simple but slow. Only useful for teaching.\n\nMerge Sort — O(n log n) time, O(n) space. Stable sort. Guaranteed performance on any input. Good for linked lists.\n\nQuick Sort — O(n log n) average, O(n²) worst case, O(log n) space. Fastest in practice due to cache efficiency. Most language built-in sorts use a variant of this.\n\nBuilt-in (.sort()) — use this in interviews unless asked to implement. JavaScript\'s Array.sort() is O(n log n) and stable in modern engines.',
      },
      {
        type: 'concept',
        title: 'When Sorting Unlocks a Better Solution',
        body:
          'Two Sum variant — sort first, then use two pointers instead of a HashMap.\n\nAnagram detection — sort both strings; equal strings are anagrams.\n\nMeeting rooms / interval problems — sort by start time, then scan linearly.\n\nK closest points — sort by distance, take the first K.',
      },
      {
        type: 'code',
        label: 'Merge Sort — O(n log n) divide and conquer',
        content:
`function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
      },
      {
        type: 'tip',
        content:
          'In an interview, always reach for the built-in sort first and state its complexity. Only implement from scratch if explicitly asked. Interviewers care more about how you use sorting to simplify a problem than whether you can write merge sort from memory.',
      },
      {
        type: 'quiz',
        question: 'What is the time complexity of Merge Sort in all cases?',
        options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(log n)'],
        correctIndex: 2,
        explanation:
          'Merge Sort always divides the array in half (log n levels) and merges every element at each level (n work per level), giving O(n log n) in best, average, and worst case — unlike Quick Sort which can degrade to O(n²).',
      },
    ],
  },

  'DFS / BFS': {
    topic: 'DFS / BFS',
    tagline: 'Two strategies for exploring every node in a graph or tree.',
    sections: [
      {
        type: 'intro',
        content:
          'Depth-First Search (DFS) and Breadth-First Search (BFS) are the two fundamental ways to traverse a graph or tree. DFS dives as deep as possible before backtracking. BFS explores all neighbors at the current depth before going deeper. Choosing the right one depends on what you\'re looking for.',
      },
      {
        type: 'concept',
        title: 'DFS vs BFS — When to Use Each',
        body:
          'Use DFS when:\n  • You need to explore all paths (permutations, combinations)\n  • You are doing cycle detection\n  • The solution is likely deep in the tree\n  • You want a recursive implementation\n\nUse BFS when:\n  • You need the shortest path in an unweighted graph\n  • You need level-by-level processing\n  • The solution is likely close to the root\n  • You want to avoid deep recursion stack overflow',
      },
      {
        type: 'concept',
        title: 'Implementation Patterns',
        body:
          'DFS — use the call stack (recursion) or an explicit stack (iterative). Mark nodes visited before recursing to avoid infinite loops in graphs.\n\nBFS — always use a queue. Enqueue the start node, then loop: dequeue a node, process it, enqueue its unvisited neighbors. Mark visited when enqueuing, not when processing.',
      },
      {
        type: 'code',
        label: 'BFS — shortest path in unweighted graph',
        content:
`function bfs(graph: Map<number, number[]>, start: number): Map<number, number> {
  const dist = new Map<number, number>();
  const queue: number[] = [start];
  dist.set(start, 0);

  while (queue.length > 0) {
    const node = queue.shift()!;
    for (const neighbor of graph.get(node) ?? []) {
      if (!dist.has(neighbor)) {
        dist.set(neighbor, dist.get(node)! + 1);
        queue.push(neighbor);
      }
    }
  }

  return dist;
}`,
      },
      {
        type: 'tip',
        content:
          'The most common DFS mistake is forgetting to mark a node as visited before recursing, causing infinite loops on graphs with cycles. On trees you can skip the visited check since there are no cycles by definition.',
      },
      {
        type: 'quiz',
        question: 'Which algorithm guarantees the shortest path in an unweighted graph?',
        options: ['DFS', 'BFS', 'Both equally', 'Neither'],
        correctIndex: 1,
        explanation:
          'BFS explores nodes level by level, so the first time it reaches a node it has taken the fewest possible edges to get there. DFS may find a path but has no guarantee it is the shortest.',
      },
    ],
  },

  Strings: {
    topic: 'Strings',
    tagline: 'Character sequences with more depth than they first appear.',
    sections: [
      {
        type: 'intro',
        content:
          'Strings are sequences of characters. In most languages they are immutable — operations like concatenation or slicing create a new string rather than modifying the original. This makes naive string manipulation surprisingly expensive, and knowing when to use a character array or StringBuilder instead is a key interview skill.',
      },
      {
        type: 'concept',
        title: 'Key Operations and Costs',
        body:
          'Access character by index: O(1)\nLength: O(1)\nSubstring / slice: O(n) — creates a new string\nConcatenation in a loop: O(n²) — each + creates a new string and copies all characters\nSplit / join: O(n)\n\nAlways prefer building strings with an array and joining at the end when concatenating many pieces.',
      },
      {
        type: 'concept',
        title: 'Common Patterns',
        body:
          'Two Pointers — check palindromes, reverse in place, or match characters from both ends.\n\nSliding Window — longest substring without repeating characters, minimum window substring.\n\nCharacter Frequency Map — anagram detection, grouping by character count. Since there are only 26 letters, a fixed-size array of length 26 is often faster than a HashMap.\n\nReverse / Rotate — many problems reduce to reversing substrings in a specific order.',
      },
      {
        type: 'code',
        label: 'Valid palindrome — two pointer O(n)',
        content:
`function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }

  return true;
}`,
      },
      {
        type: 'tip',
        content:
          'When a string problem feels like an array problem — it usually is one. Treat each character as an element, and reach for the same patterns: two pointers, sliding window, or frequency map. The main difference is that strings are immutable, so mutations require converting to an array first.',
      },
      {
        type: 'quiz',
        question: 'What is the time complexity of concatenating n strings together one by one using the + operator?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
        correctIndex: 2,
        explanation:
          'Each + creates a new string and copies all existing characters. The first copy is 1 char, the second is 2, and so on — totalling 1 + 2 + ... + n = O(n²). The fix is to collect parts in an array and call .join("") once at the end.',
      },
    ],
  },

  'Dynamic Programming': {
    topic: 'Dynamic Programming',
    tagline: 'Solve complex problems by breaking them into overlapping subproblems.',
    sections: [
      {
        type: 'intro',
        content:
          'Dynamic Programming (DP) solves problems by breaking them into smaller subproblems, solving each once, and storing the result so it is never recomputed. It applies when a problem has two properties: overlapping subproblems (the same sub-calculation appears multiple times) and optimal substructure (the optimal solution is built from optimal solutions to subproblems).',
      },
      {
        type: 'concept',
        title: 'Two Approaches',
        body:
          'Top-down (Memoization) — write the natural recursive solution, then add a cache. If the answer for a given input is already in the cache, return it immediately. Easy to reason about; starts from the original problem and works down.\n\nBottom-up (Tabulation) — build a table starting from the smallest subproblems and fill it up to the answer. No recursion, no call stack risk. Usually faster in practice due to no function call overhead.',
      },
      {
        type: 'concept',
        title: 'Identifying a DP Problem',
        body:
          'Look for these signals:\n  • "How many ways to..."\n  • "Maximum / minimum value of..."\n  • "Can you reach / achieve..."\n  • Choices at each step that affect future options\n\nStart by defining what dp[i] represents, write the recurrence relation, identify base cases, then decide top-down or bottom-up.',
      },
      {
        type: 'code',
        label: 'Climbing stairs — bottom-up O(n)',
        content:
`// Count ways to reach the nth step taking 1 or 2 steps at a time
function climbStairs(n: number): number {
  if (n <= 2) return n;

  const dp = new Array(n + 1);
  dp[1] = 1;
  dp[2] = 2;

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}`,
      },
      {
        type: 'tip',
        content:
          'Before writing any code, define dp[i] in plain English. If you cannot state clearly what dp[i] represents, you are not ready to code yet. A precise definition makes the recurrence relation and base cases obvious.',
      },
      {
        type: 'quiz',
        question: 'What does memoization mean in the context of dynamic programming?',
        options: [
          'Sorting subproblems before solving them',
          'Caching the result of each subproblem so it is only computed once',
          'Solving subproblems in reverse order',
          'Dividing the problem into non-overlapping subproblems',
        ],
        correctIndex: 1,
        explanation:
          'Memoization stores the result of each subproblem in a cache (usually a map or array). Before computing, you check the cache — if the answer is there, return it immediately. This turns exponential recursion into polynomial time.',
      },
    ],
  },
};
