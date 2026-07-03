export type LessonMeta = {
  name: string;
  description: string;
  icon: string;
  available: boolean;
};

export const DATA_STRUCTURES: LessonMeta[] = [
  { name: 'Arrays',       description: 'Index-based collections with O(1) random access',    icon: '📋', available: true  },
  { name: 'HashMaps',     description: 'Key-value pairs with O(1) average lookup',            icon: '🗂️', available: true  },
  { name: 'Strings',      description: 'Character sequences and common manipulation patterns', icon: '📝', available: true  },
  { name: 'LinkedLists',  description: 'Nodes connected by pointers, O(n) access',            icon: '🔗', available: true  },
  { name: 'Trees',        description: 'Hierarchical structures and traversal strategies',     icon: '🌳', available: true  },
  { name: 'Stacks',       description: 'LIFO structure with push and pop operations',          icon: '📚', available: false },
  { name: 'Heaps',        description: 'Priority queue via complete binary tree',              icon: '🏔️', available: false },
  { name: 'Tries',        description: 'Prefix tree for efficient string search',              icon: '🌿', available: false },
];

export const ALGORITHMS: LessonMeta[] = [
  { name: 'Sorting',             description: 'Bubble, merge, and quicksort algorithms',          icon: '🔢', available: true  },
  { name: 'Binary Search',       description: 'O(log n) search strategy on sorted arrays',        icon: '🔍', available: true  },
  { name: 'DFS / BFS',           description: 'Depth-first and breadth-first graph traversals',   icon: '🗺️', available: true  },
  { name: 'Dynamic Programming', description: 'Overlapping subproblems solved with memoization',  icon: '🧩', available: true  },
  { name: 'Two Pointers',        description: 'Efficient traversal with dual index technique',    icon: '👆', available: false },
  { name: 'Sliding Window',      description: 'Fixed-size subarray optimization pattern',         icon: '🪟', available: false },
  { name: 'Recursion',           description: 'Self-referential calls with base case termination', icon: '🔄', available: false },
  { name: 'Graphs',              description: 'Vertices and edges representing relationships',    icon: '📊', available: false },
];
