import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';

type Question = {
  id: string;
  topic: string;
  difficulty: 'SWE1' | 'SWE2' | 'SWE3';
  question: string;
  answers: string[];
  correctIndex: number;
  explanation: string;
};

type WrongAnswer = {
  question: string;
  topic: string;
  selected: string;
  correct: string;
};

const QUESTIONS: Question[] = [
  {
    id: '1',
    topic: 'HashMaps',
    difficulty: 'SWE1',
    question: 'What is the average time complexity of a lookup in a hash map?',
    answers: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
    correctIndex: 2,
    explanation: 'A hash function maps a key directly to a bucket index, so lookup skips any scanning — it\'s a direct address calculation. Collisions can degrade this to O(n) in the worst case, but a good hash function keeps that rare.',
  },
  {
    id: '2',
    topic: 'Arrays',
    difficulty: 'SWE1',
    question: 'Which approach finds two numbers in an array that add up to a target most efficiently?',
    answers: [
      'Nested loops to check every pair',
      'Sort the array, then use two pointers',
      'Hash map to store complements as you iterate',
      'Binary search for each element',
    ],
    correctIndex: 2,
    explanation: 'As you iterate, store each number\'s complement (target - num) in a hash map. If the current number exists as a complement, you\'re done. One pass, O(n) time vs O(n²) for nested loops.',
  },
  {
    id: '3',
    topic: 'Strings',
    difficulty: 'SWE1',
    question: 'What does it mean for two strings to be anagrams?',
    answers: [
      'They have the same length',
      'They contain the same characters in any order',
      'They are mirror images of each other',
      'They share the same prefix',
    ],
    correctIndex: 1,
    explanation: 'Anagrams are rearrangements of the same characters — "listen" and "silent" are anagrams. Same length is necessary but not sufficient; the character frequencies must match exactly.',
  },
  {
    id: '4',
    topic: 'Trees',
    difficulty: 'SWE2',
    question: 'Which traversal visits nodes of a binary search tree in ascending order?',
    answers: ['Pre-order', 'Post-order', 'Level-order', 'In-order'],
    correctIndex: 3,
    explanation: 'In-order traversal visits left subtree → root → right subtree. In a BST, left children are always smaller and right children are always larger, so this naturally produces sorted ascending output.',
  },
  {
    id: '5',
    topic: 'Big O',
    difficulty: 'SWE1',
    question: 'What is the time complexity of binary search on a sorted array?',
    answers: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correctIndex: 2,
    explanation: 'Binary search halves the search space each step. Starting with n elements: n → n/2 → n/4 → ... → 1. That\'s log₂(n) steps. Each step is O(1), so total is O(log n).',
  },
  {
    id: '6',
    topic: 'LinkedLists',
    difficulty: 'SWE1',
    question: 'What is the time complexity of inserting a node at the head of a singly linked list?',
    answers: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctIndex: 3,
    explanation: 'Head insertion only requires two pointer updates: new_node.next = head, then head = new_node. No traversal needed — it\'s always constant time regardless of list length.',
  },
  {
    id: '7',
    topic: 'Sorting',
    difficulty: 'SWE2',
    question: 'Which sorting algorithm has an average time complexity of O(n log n) and is commonly used in standard libraries?',
    answers: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'],
    correctIndex: 2,
    explanation: 'Merge sort divides the array in half recursively (log n levels), then merges sorted halves in O(n) per level — guaranteed O(n log n) in all cases. It\'s also stable, making it a common choice in standard library implementations.',
  },
  {
    id: '8',
    topic: 'Trees',
    difficulty: 'SWE2',
    question: 'What data structure is typically used to implement a breadth-first search (BFS)?',
    answers: ['Stack', 'Queue', 'Heap', 'Set'],
    correctIndex: 1,
    explanation: 'BFS explores nodes level by level. A queue (FIFO) processes nodes in the order they were discovered, ensuring all nodes at depth d are visited before any at depth d+1. A stack would give DFS behavior instead.',
  },
  {
    id: '9',
    topic: 'Big O',
    difficulty: 'SWE1',
    question: 'What is the space complexity of a recursive function that calls itself n times?',
    answers: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctIndex: 2,
    explanation: 'Each recursive call adds a new stack frame. With n calls, n frames are live simultaneously on the call stack before any return — that\'s O(n) space. This is why deep recursion can cause stack overflows.',
  },
  {
    id: '10',
    topic: 'HashMaps',
    difficulty: 'SWE2',
    question: 'What causes a hash collision?',
    answers: [
      'Two keys that are equal',
      'Two different keys that map to the same bucket',
      'A key with a null value',
      'A hash function that returns negative numbers',
    ],
    correctIndex: 1,
    explanation: 'A collision happens when two distinct keys produce the same hash index. This is resolved via chaining (a linked list at each bucket) or open addressing (probing for the next empty slot). Equal keys don\'t collide — they map to the same entry intentionally.',
  },
  {
    id: '11',
    topic: 'Arrays',
    difficulty: 'SWE1',
    question: 'What is the time complexity of accessing an element by index in an array?',
    answers: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctIndex: 3,
    explanation: 'Arrays store elements in contiguous memory. Given the base address and element size, any index computes directly as: base + index × size. This is a single arithmetic operation — O(1) regardless of array length.',
  },
  {
    id: '12',
    topic: 'Dynamic Programming',
    difficulty: 'SWE3',
    question: 'What is the key characteristic that makes a problem suitable for dynamic programming?',
    answers: [
      'It can be solved greedily',
      'It has overlapping subproblems and optimal substructure',
      'It requires sorting the input first',
      'It can only be solved recursively',
    ],
    correctIndex: 1,
    explanation: 'Overlapping subproblems means the same sub-computations recur (e.g. fib(3) called many times in naive Fibonacci). Optimal substructure means the optimal solution is built from optimal sub-solutions. Without both, DP won\'t help.',
  },
  {
    id: '13',
    topic: 'Strings',
    difficulty: 'SWE2',
    question: 'What is the most efficient way to check if a string is a palindrome?',
    answers: [
      'Reverse the string and compare with the original',
      'Use two pointers starting from both ends moving inward',
      'Sort the characters and compare',
      'Check every substring recursively',
    ],
    correctIndex: 1,
    explanation: 'Two pointers (left at start, right at end) compare characters and move inward until they meet. This is O(n) time and O(1) space — no extra string allocation. Reversing also works but requires O(n) extra space.',
  },
  {
    id: '14',
    topic: 'LinkedLists',
    difficulty: 'SWE2',
    question: 'How can you detect a cycle in a linked list efficiently?',
    answers: [
      'Store all visited nodes in a set',
      'Reverse the list and check if it equals the original',
      'Use two pointers, one fast and one slow (Floyd\'s algorithm)',
      'Count the total number of nodes',
    ],
    correctIndex: 2,
    explanation: 'Floyd\'s cycle detection uses a slow pointer (1 step) and fast pointer (2 steps). If a cycle exists, the fast pointer laps the slow one and they meet inside the cycle. O(n) time, O(1) space — better than a set which uses O(n) space.',
  },
  {
    id: '15',
    topic: 'Binary Search',
    difficulty: 'SWE2',
    question: 'Binary search requires the input array to be:',
    answers: ['Unsorted', 'Sorted', 'Filled with unique values', 'Stored in a hash map'],
    correctIndex: 1,
    explanation: 'Binary search works by comparing the target to the midpoint and eliminating the half that can\'t contain it. This logic only holds if elements are ordered — on an unsorted array, eliminating a half is invalid and will produce wrong results.',
  },
  {
    id: '16',
    topic: 'Dynamic Programming',
    difficulty: 'SWE3',
    question: 'Which technique avoids recomputing subproblems by storing their results?',
    answers: ['Recursion', 'Memoization', 'Greedy', 'Backtracking'],
    correctIndex: 1,
    explanation: 'Memoization caches the result of each subproblem on first computation and returns the cached value on repeat calls. It turns exponential recursion (like naive Fibonacci\'s O(2ⁿ)) into O(n) by eliminating redundant work.',
  },
  {
    id: '17',
    topic: 'Trees',
    difficulty: 'SWE3',
    question: 'What is the worst-case time complexity of inserting into an unbalanced binary search tree?',
    answers: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 2,
    explanation: 'If you insert already-sorted data into a BST without balancing, every new node becomes the rightmost (or leftmost) child — the tree degenerates into a linked list. Insertion then requires traversing all n nodes: O(n).',
  },
  {
    id: '18',
    topic: 'DFS / BFS',
    difficulty: 'SWE3',
    question: 'Which graph traversal is best suited for finding the shortest path in an unweighted graph?',
    answers: ['DFS', 'BFS', 'Dijkstra\'s', 'Bellman-Ford'],
    correctIndex: 1,
    explanation: 'BFS explores nodes level by level (by hop count). The first time it reaches a node is guaranteed to be via the fewest edges. DFS might find a path but not the shortest. Dijkstra\'s is for weighted graphs — unnecessary overhead here.',
  },
  {
    id: '19',
    topic: 'Dynamic Programming',
    difficulty: 'SWE3',
    question: 'What is the time complexity of the classic 0/1 knapsack dynamic programming solution?',
    answers: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n × W) where W is the capacity'],
    correctIndex: 3,
    explanation: 'The DP table has n rows (items) and W columns (capacity values). Filling each cell is O(1), so total work is O(n × W). This is pseudo-polynomial — fast when W is small, but slow if W is very large.',
  },
  {
    id: '20',
    topic: 'Sorting',
    difficulty: 'SWE3',
    question: 'Why is quicksort\'s worst-case O(n²) but average case O(n log n)?',
    answers: [
      'It depends on the size of the input',
      'Poor pivot selection causes maximally unbalanced partitions',
      'It performs extra comparisons on sorted arrays',
      'It uses O(n) extra space in the worst case',
    ],
    correctIndex: 1,
    explanation: 'If the pivot is always the min or max (e.g., picking first element on already-sorted data), each partition produces one empty half and one of size n-1. That\'s n partitions of decreasing size: O(n²). Random or median-of-three pivot selection avoids this.',
  },
  {
    id: '21',
    topic: 'Stacks',
    difficulty: 'SWE1',
    question: 'Which principle does a stack follow?',
    answers: ['First In, First Out', 'Last In, First Out', 'Random Access', 'Priority Order'],
    correctIndex: 1,
    explanation: 'A stack is LIFO — like a stack of plates. The last item pushed is the first one popped. This makes stacks natural for problems involving reversal, backtracking, or tracking the most recent state (e.g. undo, call stack, DFS).',
  },
  {
    id: '22',
    topic: 'Recursion',
    difficulty: 'SWE1',
    question: 'What prevents a recursive function from running forever?',
    answers: ['A loop counter', 'A base case', 'A return type', 'A try/catch block'],
    correctIndex: 1,
    explanation: 'A base case is the condition where the function stops calling itself and returns a direct result. Without it, the function recurses infinitely, eventually exhausting the call stack and causing a stack overflow error.',
  },
  {
    id: '23',
    topic: 'Arrays',
    difficulty: 'SWE1',
    question: 'Which technique is best for finding the maximum sum subarray of size k?',
    answers: ['Binary search', 'Sliding window', 'Two pointers', 'Recursion'],
    correctIndex: 1,
    explanation: 'A sliding window keeps a running sum of the current k elements. When sliding right, subtract the element leaving the window and add the element entering. This avoids recomputing the sum from scratch each time — O(n) vs O(nk).',
  },
  {
    id: '24',
    topic: 'Big O',
    difficulty: 'SWE1',
    question: 'An algorithm that runs in O(1) space means:',
    answers: [
      'It runs in constant time',
      'It uses no memory at all',
      'It uses a fixed amount of memory regardless of input size',
      'It only works on arrays of size 1',
    ],
    correctIndex: 2,
    explanation: 'O(1) space means the algorithm uses a constant amount of extra memory — a fixed number of variables — no matter how large the input is. It doesn\'t mean zero memory; the input itself still exists, but no extra data structures are allocated that scale with input size.',
  },
  {
    id: '25',
    topic: 'Strings',
    difficulty: 'SWE1',
    question: 'What is the most common approach to find the longest substring without repeating characters?',
    answers: ['Sort the string first', 'Sliding window with a set', 'Nested loops', 'Recursion with memoization'],
    correctIndex: 1,
    explanation: 'A sliding window with a set tracks which characters are in the current window. When a duplicate is detected, shrink from the left until it\'s removed. This gives O(n) time — each character is added and removed at most once.',
  },
  {
    id: '26',
    topic: 'Stacks',
    difficulty: 'SWE2',
    question: 'Which data structure is most natural for checking balanced parentheses?',
    answers: ['Queue', 'Stack', 'Hash map', 'Linked list'],
    correctIndex: 1,
    explanation: 'Push each opening bracket onto a stack. For each closing bracket, check if the top of the stack is the matching opener and pop it. If the stack is empty at the end, the brackets are balanced. The LIFO property naturally handles nesting.',
  },
  {
    id: '27',
    topic: 'Graphs',
    difficulty: 'SWE2',
    question: 'Which representation is generally more space-efficient for sparse graphs?',
    answers: ['Adjacency matrix', 'Adjacency list', 'Edge list', 'Incidence matrix'],
    correctIndex: 1,
    explanation: 'An adjacency matrix always uses O(V²) space — even for graphs with few edges. An adjacency list uses O(V + E), which is much smaller when E << V². For sparse graphs (few edges), the list wins decisively.',
  },
  {
    id: '28',
    topic: 'Heaps',
    difficulty: 'SWE2',
    question: 'In a min-heap, where is the smallest element always found?',
    answers: ['At a leaf node', 'At the last position', 'At the root', 'In sorted order throughout'],
    correctIndex: 2,
    explanation: 'The min-heap property guarantees every parent is ≤ its children. The root has no parent to constrain it from above, so it must be the global minimum. This is what makes heaps efficient for priority queues — O(1) to peek the min.',
  },
  {
    id: '29',
    topic: 'Arrays',
    difficulty: 'SWE2',
    question: 'The two-pointer technique works best when the input array is:',
    answers: ['Unsorted with duplicates', 'Sorted or when pointers represent a window', 'Stored in a hash map', 'Circular'],
    correctIndex: 1,
    explanation: 'On a sorted array, two pointers converging from both ends can reason about sums — move left pointer right to increase the sum, right pointer left to decrease it. Without sorting, you can\'t make directional decisions and the technique breaks down.',
  },
  {
    id: '30',
    topic: 'Recursion',
    difficulty: 'SWE2',
    question: 'What is the time complexity of the naive recursive Fibonacci solution?',
    answers: ['O(n)', 'O(n log n)', 'O(2ⁿ)', 'O(log n)'],
    correctIndex: 2,
    explanation: 'fib(n) calls fib(n-1) and fib(n-2), each of which branches again. The call tree is a binary tree of height n — roughly 2ⁿ nodes total. fib(3) alone is recomputed dozens of times for large n. Memoization reduces this to O(n).',
  },
  {
    id: '31',
    topic: 'Graphs',
    difficulty: 'SWE3',
    question: 'What does Dijkstra\'s algorithm find?',
    answers: [
      'The minimum spanning tree of a graph',
      'The shortest path from a source to all other nodes in a weighted graph',
      'All connected components in a graph',
      'The longest path between two nodes',
    ],
    correctIndex: 1,
    explanation: 'Dijkstra\'s uses a min-heap to greedily relax edges from the lowest-cost unvisited node. It computes shortest distances from one source to all reachable nodes in O((V + E) log V). It requires non-negative edge weights — use Bellman-Ford for negative edges.',
  },
  {
    id: '32',
    topic: 'Tries',
    difficulty: 'SWE3',
    question: 'What is a trie most commonly used for?',
    answers: [
      'Storing key-value pairs with O(1) lookup',
      'Efficient prefix-based string search and autocomplete',
      'Sorting a list of integers',
      'Balancing a binary search tree',
    ],
    correctIndex: 1,
    explanation: 'A trie stores strings character by character in a tree. Words sharing a prefix share the same path from the root. This makes prefix lookups O(L) where L is prefix length — ideal for autocomplete, spell-check, and IP routing tables.',
  },
  {
    id: '33',
    topic: 'Heaps',
    difficulty: 'SWE3',
    question: 'What is the time complexity of building a heap from an unsorted array of n elements?',
    answers: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
    correctIndex: 2,
    explanation: 'Floyd\'s heapify algorithm starts from the last internal node and sifts down toward the root. Most nodes are near the bottom (small height), so they do little work. The math works out to O(n) total — better than inserting elements one by one at O(n log n).',
  },
  {
    id: '34',
    topic: 'DFS / BFS',
    difficulty: 'SWE1',
    question: 'Which algorithm would you use to check if a path exists between two nodes in an unweighted graph?',
    answers: ['Binary search', 'DFS or BFS', 'Merge sort', 'Dijkstra\'s'],
    correctIndex: 1,
    explanation: 'Both DFS and BFS traverse all reachable nodes from a source. If you reach the target during traversal, a path exists. For simple reachability (not shortest path), either works — DFS with a visited set is slightly simpler to implement recursively.',
  },
  {
    id: '35',
    topic: 'LinkedLists',
    difficulty: 'SWE1',
    question: 'What is the most efficient way to reverse a singly linked list in-place?',
    answers: [
      'Copy nodes into an array, then relink in reverse',
      'Iterate with three pointers: prev, curr, next',
      'Use a stack to reverse the values',
      'Recursively swap node values',
    ],
    correctIndex: 1,
    explanation: 'Three pointers (prev = null, curr = head, next) let you reverse each link as you traverse: save next, point curr.next to prev, advance both. One pass, O(n) time, O(1) space — no extra data structures needed.',
  },
  {
    id: '36',
    topic: 'HashMaps',
    difficulty: 'SWE1',
    question: 'How do you find duplicates in an unsorted array in O(n) time?',
    answers: [
      'Sort the array and scan for adjacent duplicates',
      'Use nested loops to compare every pair',
      'Use a hash set — add each element and check if it already exists',
      'Use binary search for each element',
    ],
    correctIndex: 2,
    explanation: 'A hash set provides O(1) average lookup and insert. As you iterate, check if the element is already in the set — if yes, it\'s a duplicate. Sorting would be O(n log n); nested loops O(n²). The set approach is the optimal single-pass solution.',
  },
  {
    id: '37',
    topic: 'Sorting',
    difficulty: 'SWE2',
    question: 'Which sorting algorithm is both stable and guarantees O(n log n) in all cases?',
    answers: ['Quicksort', 'Heapsort', 'Merge Sort', 'Timsort'],
    correctIndex: 2,
    explanation: 'Merge sort always divides in half (log n levels) and merges in O(n) per level — O(n log n) worst case, guaranteed. It\'s also stable (equal elements maintain original order). Quicksort can degrade to O(n²); heapsort is not stable.',
  },
  {
    id: '38',
    topic: 'Recursion',
    difficulty: 'SWE2',
    question: 'Which algorithmic pattern would you use to generate all subsets of a set?',
    answers: ['Greedy', 'Backtracking', 'Divide and Conquer', 'Dynamic Programming'],
    correctIndex: 1,
    explanation: 'Backtracking explores all possibilities by making a choice, recursing, then undoing the choice (backtracking). For subsets, at each element you choose to include it or not, giving 2ⁿ subsets. It\'s the standard pattern for "generate all valid combinations."',
  },
  {
    id: '39',
    topic: 'DFS / BFS',
    difficulty: 'SWE2',
    question: 'Given a grid of 1s and 0s, what\'s the best approach to count the number of islands (connected groups of 1s)?',
    answers: [
      'Sort the grid cells and count transitions',
      'DFS or BFS from each unvisited land cell, marking visited cells',
      'Use a hash map to group adjacent cells',
      'Binary search each row for 1s',
    ],
    correctIndex: 1,
    explanation: 'For each unvisited "1" cell, launch a DFS/BFS that marks all connected "1" cells as visited. Each launch = one island. Total time is O(m × n) — every cell is visited at most once. This is the standard connected-components pattern.',
  },
  {
    id: '40',
    topic: 'Heaps',
    difficulty: 'SWE2',
    question: 'You need to find the k-th largest element in an unsorted array. What\'s the most efficient approach?',
    answers: [
      'Sort the array and return index n-k',
      'Use a min-heap of size k',
      'Use BFS on the array',
      'Binary search for the answer',
    ],
    correctIndex: 1,
    explanation: 'Maintain a min-heap of the k largest elements seen so far. For each new element, if it\'s larger than the heap\'s min (root), replace the root and re-heapify. After the full pass, the root is the k-th largest. O(n log k) — better than O(n log n) sorting when k is small.',
  },
  {
    id: '41',
    topic: 'Stacks',
    difficulty: 'SWE2',
    question: 'What data structure is used to solve "next greater element" problems efficiently?',
    answers: ['Min-heap', 'Monotonic stack', 'Queue', 'Hash map'],
    correctIndex: 1,
    explanation: 'A monotonic stack maintains elements in increasing or decreasing order. For "next greater element," iterate right to left, popping elements from the stack that are ≤ current. The stack top (if any) is the next greater. O(n) — each element is pushed and popped at most once.',
  },
  {
    id: '42',
    topic: 'Binary Search',
    difficulty: 'SWE2',
    question: 'A sorted array is rotated at an unknown pivot. How do you find a target value efficiently?',
    answers: [
      'Linear scan the whole array',
      'Modified binary search checking which half is sorted',
      'Sort it again, then binary search',
      'Use a hash map for O(1) lookup',
    ],
    correctIndex: 1,
    explanation: 'At each midpoint, one half must be cleanly sorted. Check if the target falls in the sorted half — if yes, search there; otherwise search the other half. This keeps O(log n) time by always eliminating half the array each step.',
  },
  {
    id: '43',
    topic: 'Dynamic Programming',
    difficulty: 'SWE2',
    question: 'What is the time complexity of computing Fibonacci(n) with memoization?',
    answers: ['O(2ⁿ)', 'O(n log n)', 'O(n)', 'O(log n)'],
    correctIndex: 2,
    explanation: 'With memoization, each Fibonacci value from 0 to n is computed exactly once and cached. Every subsequent call hits the cache in O(1). So you do n computations total — O(n) time and O(n) space for the cache.',
  },
  {
    id: '44',
    topic: 'Graphs',
    difficulty: 'SWE2',
    question: 'How do you detect a cycle in a directed graph?',
    answers: [
      'Check if any node has more than one incoming edge',
      'DFS with a "currently in recursion stack" visited set',
      'Count total edges — if edges ≥ nodes, there\'s a cycle',
      'BFS and check if any node is revisited',
    ],
    correctIndex: 1,
    explanation: 'DFS with two sets — globally visited and currently-in-stack — detects directed cycles. If DFS reaches a node already in the current recursion stack, you\'ve found a back edge (cycle). A node can be visited globally without forming a cycle if it was already fully explored in another path.',
  },
  {
    id: '45',
    topic: 'HashMaps',
    difficulty: 'SWE3',
    question: 'How would you implement an LRU (Least Recently Used) cache with O(1) get and put?',
    answers: [
      'Array with timestamps for each entry',
      'HashMap only — evict the smallest key',
      'HashMap + doubly linked list',
      'Min-heap ordered by access time',
    ],
    correctIndex: 2,
    explanation: 'A HashMap gives O(1) key lookup. A doubly linked list maintains access order — on get/put, move the node to the front; on eviction, remove from the tail. The map stores key → node pointers so list moves are O(1). This is the canonical LRU design.',
  },
  {
    id: '46',
    topic: 'Heaps',
    difficulty: 'SWE3',
    question: 'What data structure lets you find the median of a stream of numbers in O(log n) per insert?',
    answers: [
      'A sorted array',
      'A single min-heap',
      'Two heaps: a max-heap for the lower half and a min-heap for the upper half',
      'A balanced BST',
    ],
    correctIndex: 2,
    explanation: 'Keep the smaller half in a max-heap and the larger half in a min-heap, balanced in size. The median is the top of the larger heap (odd count) or the average of both tops (even count). Each insert is O(log n) for heap push/pop; median is O(1).',
  },
  {
    id: '47',
    topic: 'Dynamic Programming',
    difficulty: 'SWE3',
    question: 'Which approach solves the "word break" problem — can a string be segmented into dictionary words?',
    answers: [
      'Greedy — always match the longest word first',
      'BFS from start to end of string',
      'DP — for each index, check if any valid word ends there',
      'Sort the dictionary and binary search for prefixes',
    ],
    correctIndex: 2,
    explanation: 'Define dp[i] = true if s[0..i] can be segmented. For each index i, check all j < i where dp[j] is true and s[j..i] is in the dictionary. Greedy fails because a longer match early can block a valid segmentation later. DP explores all possibilities efficiently.',
  },
  {
    id: '48',
    topic: 'Heaps',
    difficulty: 'SWE3',
    question: 'What is the most efficient way to merge k sorted linked lists of total n elements?',
    answers: [
      'Concatenate all lists, then sort — O(n log n)',
      'Merge lists two at a time — O(nk)',
      'Use a min-heap of size k to always extract the global minimum — O(n log k)',
      'BFS across all lists simultaneously',
    ],
    correctIndex: 2,
    explanation: 'Put the head of each list into a min-heap. Repeatedly extract the minimum, add it to the result, and push the extracted node\'s next pointer into the heap. O(n log k) — each of n elements is pushed/popped once, and heap operations cost O(log k).',
  },
  {
    id: '49',
    topic: 'Trees',
    difficulty: 'SWE3',
    question: 'Which traversal order is most natural for serializing and deserializing a binary tree?',
    answers: ['In-order', 'Post-order', 'Pre-order (root first)', 'Level-order only'],
    correctIndex: 2,
    explanation: 'Pre-order visits root before children, so during deserialization you always know the root value before its subtrees — making reconstruction straightforward. In-order alone is ambiguous without extra info. Level-order (BFS) also works and is used in LeetCode\'s standard format.',
  },
  {
    id: '50',
    topic: 'Graphs',
    difficulty: 'SWE3',
    question: 'Which algorithm finds the shortest path in a graph with negative edge weights (no negative cycles)?',
    answers: ['Dijkstra\'s', 'BFS', 'Bellman-Ford', 'DFS'],
    correctIndex: 2,
    explanation: 'Bellman-Ford relaxes all edges V-1 times, which is enough to propagate shortest paths in any acyclic path. Unlike Dijkstra\'s, it handles negative weights correctly. It also detects negative cycles if any edge can still be relaxed after V-1 passes.',
  },
  {
    id: '51',
    topic: 'Arrays',
    difficulty: 'SWE2',
    question: 'What is the time complexity of finding the longest consecutive sequence in an unsorted array?',
    answers: ['O(n log n) using sorting', 'O(n²) using nested loops', 'O(n) using a hash set', 'O(log n) using binary search'],
    correctIndex: 2,
    explanation: 'Put all elements in a hash set. For each number n where n-1 is NOT in the set (it\'s a sequence start), count how long the streak n, n+1, n+2... goes. Each element is visited at most twice total — O(n). Sorting would work but is O(n log n).',
  },
  {
    id: '52',
    topic: 'Recursion',
    difficulty: 'SWE2',
    question: 'What is "divide and conquer" and which algorithm is a classic example?',
    answers: [
      'Solve greedily at each step — Dijkstra\'s is an example',
      'Split the problem in half, solve each half, combine — Merge Sort is an example',
      'Store subproblem results — Fibonacci DP is an example',
      'Try all possibilities and backtrack — N-Queens is an example',
    ],
    correctIndex: 1,
    explanation: 'Divide and conquer splits the problem into independent subproblems, solves them recursively, then combines the results. Merge sort is the textbook example: split array in half (divide), sort each half (conquer), merge (combine). Binary search is another classic example.',
  },
  {
    id: '53',
    topic: 'Binary Search',
    difficulty: 'SWE3',
    question: 'You need to find the minimum capacity to ship packages within D days. What technique applies?',
    answers: [
      'Greedy — always ship as many packages as possible each day',
      'Binary search on the answer (search the capacity space)',
      'DP — build up optimal day-by-day assignments',
      'BFS across possible day splits',
    ],
    correctIndex: 1,
    explanation: 'The answer (capacity) lies in a range [max_weight, total_weight]. Binary search this range: for each candidate capacity, simulate the days needed in O(n). If feasible in ≤ D days, try lower; otherwise try higher. This "binary search on answer" pattern applies to many optimization problems.',
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffles a question's answers and updates correctIndex to match the new position
function shuffleAnswers(q: Question): Question {
  const correct = q.answers[q.correctIndex];
  const answers = shuffle(q.answers);
  return { ...q, answers, correctIndex: answers.indexOf(correct) };
}

const SESSION_SIZES = [5, 10, 15];
const DIFFICULTIES = ['All', 'SWE1', 'SWE2', 'SWE3'] as const;
type DifficultyFilter = typeof DIFFICULTIES[number];

export default function PlayScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionSize, setSessionSize] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('All');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);

  const cardBackground = useThemeColor({ light: '#f2f2f7', dark: '#1c1c1e' }, 'background');
  const answerBackground = useThemeColor({ light: '#ffffff', dark: '#2c2c2e' }, 'background');
  const correctBackground = useThemeColor({ light: '#e8f5e9', dark: '#1b3a1e' }, 'background');
  const wrongBackground = useThemeColor({ light: '#fdecea', dark: '#3a1a1a' }, 'background');

  const celebrationScale = useSharedValue(1);
  const celebrationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
  }));

  // Bounces the perfect score title when a flawless session ends
  useEffect(() => {
    if (sessionComplete && score === questions.length && questions.length > 0) {
      celebrationScale.value = withSequence(
        withTiming(0.8, { duration: 80 }),
        withSpring(1.15, { damping: 5, stiffness: 200 }),
        withSpring(1, { damping: 10 }),
      );
    }
  }, [sessionComplete]);

  // Fetches the current user's ID once on mount so answers can be saved to Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user.id ?? null);
    });
  }, []);

  const question = questions[currentIndex];
  const isAnswered = selectedIndex !== null;
  const isLastQuestion = currentIndex === questions.length - 1;

  // Green for correct, red for wrong, default otherwise
  function getAnswerBackground(index: number) {
    if (!isAnswered) return answerBackground;
    if (index === question.correctIndex) return correctBackground;
    if (index === selectedIndex) return wrongBackground;
    return answerBackground;
  }

  // Adds a colored border to the correct and selected answers after submission
  function getAnswerBorder(index: number) {
    if (!isAnswered) return {};
    if (index === question.correctIndex) return { borderWidth: 1.5, borderColor: '#4caf50' };
    if (index === selectedIndex) return { borderWidth: 1.5, borderColor: '#f44336' };
    return {};
  }

  // Hides the circle border when it's being filled with green/red so colors don't mix
  function getIndexCircleColor(index: number) {
    if (!isAnswered) return '#0a7ea4';
    if (index === question.correctIndex || index === selectedIndex) return 'transparent';
    return '#0a7ea4';
  }

  // Fills the answer index circle green for correct, red for wrong
  function getIndexFill(index: number) {
    if (!isAnswered) return 'transparent';
    if (index === question.correctIndex) return '#4caf50';
    if (index === selectedIndex) return '#f44336';
    return 'transparent';
  }

  // Switches the letter text to white when its circle is filled so it stays readable
  function getIndexTextColor(index: number) {
    if (!isAnswered) return '#0a7ea4';
    if (index === question.correctIndex || index === selectedIndex) return '#fff';
    return '#0a7ea4';
  }

  // Records the selected answer, updates score/wrong list, and saves the result to Supabase
  async function handleSelectAnswer(index: number) {
    if (isAnswered) return;
    setSelectedIndex(index);
    const isCorrect = index === question.correctIndex;

    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setWrongAnswers((prev) => [
        ...prev,
        {
          question: question.question,
          topic: question.topic,
          selected: question.answers[index],
          correct: question.answers[question.correctIndex],
        },
      ]);
    }

    if (userId) {
      await supabase.from('user_answers').insert({
        user_id: userId,
        topic: question.topic,
        is_correct: isCorrect,
      });
    }
  }

  // Advances to the next question or ends the session on the last one
  function handleNext() {
    if (isLastQuestion) {
      setSessionComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedIndex(null);
    }
  }

  // Initializes a new session with the chosen number of questions, filtered by difficulty
  function handleStartSession(size: number) {
    setSessionSize(size);
    const pool = difficulty === 'All' ? QUESTIONS : QUESTIONS.filter((q) => q.difficulty === difficulty);
    setQuestions(shuffle(pool).slice(0, Math.min(size, pool.length)).map(shuffleAnswers));
    setCurrentIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setWrongAnswers([]);
    setSessionComplete(false);
  }

  // Returns to the size picker so the user can start a fresh session
  function handlePlayAgain() {
    setSessionSize(null);
    setQuestions([]);
  }

  if (sessionSize === null) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.pickerContent}>
          <ThemedText type="title">Let's Play</ThemedText>

          <View style={styles.difficultySection}>
            <ThemedText style={styles.pickerSubtitle}>Difficulty</ThemedText>
            <View style={styles.difficultyButtons}>
              {DIFFICULTIES.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.difficultyButton,
                    difficulty === d && styles.difficultyButtonActive,
                    difficulty === d && d !== 'All' && { backgroundColor: difficultyStyles[d].badge.backgroundColor },
                  ]}
                  onPress={() => setDifficulty(d)}>
                  <ThemedText
                    style={[
                      styles.difficultyButtonText,
                      difficulty === d && styles.difficultyButtonTextActive,
                      difficulty === d && d !== 'All' && { color: (difficultyStyles[d].text as { color: string }).color },
                    ]}>
                    {d}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.difficultySection}>
            <View style={styles.questionsSectionHeader}>
              <ThemedText style={styles.pickerSubtitle}>Questions</ThemedText>
              <ThemedText style={styles.availableCount}>
                {difficulty === 'All' ? QUESTIONS.length : QUESTIONS.filter((q) => q.difficulty === difficulty).length} available
              </ThemedText>
            </View>
            <View style={styles.pickerButtons}>
              {SESSION_SIZES.map((size) => {
                const pool = difficulty === 'All' ? QUESTIONS.length : QUESTIONS.filter((q) => q.difficulty === difficulty).length;
                const unavailable = size > pool;
                return (
                  <TouchableOpacity
                    key={size}
                    style={[styles.pickerButton, unavailable && styles.pickerButtonDimmed]}
                    onPress={() => handleStartSession(size)}
                    disabled={unavailable}>
                    <ThemedText style={[styles.pickerButtonNumber, unavailable && styles.pickerButtonNumberDimmed]}>{size}</ThemedText>
                    <ThemedText style={[styles.pickerButtonLabel, unavailable && styles.pickerButtonNumberDimmed]}>questions</ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ThemedView>
    );
  }

  if (sessionComplete) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.summaryContent}>
          <Animated.View style={score === questions.length ? celebrationStyle : undefined}>
            <ThemedText type="title">
              {score === questions.length ? 'Perfect! 🎉' : 'Session Complete'}
            </ThemedText>
          </Animated.View>

          <View style={styles.scoreCard}>
            <ThemedText style={[styles.scoreNumber, { color: score / questions.length >= 0.6 ? '#4caf50' : '#f44336' }]}>
              {score} / {questions.length}
            </ThemedText>
            <ThemedText style={styles.scoreLabel}>
              {Math.round((score / questions.length) * 100)}% Correct
            </ThemedText>
          </View>

          {wrongAnswers.length > 0 && (
            <View style={styles.missedSection}>
              <ThemedText style={styles.missedHeading}>Review</ThemedText>
              {wrongAnswers.map((w, i) => (
                <View key={i} style={[styles.missedCard, { backgroundColor: cardBackground }]}>
                  <ThemedText style={styles.missedTopic}>{w.topic}</ThemedText>
                  <ThemedText style={styles.missedQuestion}>{w.question}</ThemedText>
                  <View style={styles.missedRow}>
                    <ThemedText style={styles.missedWrong}>✗ {w.selected}</ThemedText>
                  </View>
                  <View style={styles.missedRow}>
                    <ThemedText style={styles.missedCorrect}>✓ {w.correct}</ThemedText>
                  </View>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
            <ThemedText style={styles.playAgainText}>Play Again</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Badges */}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, styles.typeBadge]}>
            <ThemedText style={styles.badgeText}>Multiple Choice</ThemedText>
          </View>
          <View style={[styles.badge, difficultyStyles[question.difficulty].badge]}>
            <ThemedText style={difficultyStyles[question.difficulty].text}>{question.difficulty}</ThemedText>
          </View>
          <View style={styles.progressBadge}>
            <ThemedText style={styles.progressText}>
              {currentIndex + 1} / {questions.length}
            </ThemedText>
          </View>
        </View>

        {/* Question */}
        <View style={[styles.questionCard, { backgroundColor: cardBackground }]}>
          <ThemedText style={styles.topicLabel}>{question.topic}</ThemedText>
          <ThemedText style={styles.questionText}>{question.question}</ThemedText>
        </View>

        {/* Answer Choices */}
        <View style={styles.answerList}>
          {question.answers.map((answer, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.answerRow,
                { backgroundColor: getAnswerBackground(index) },
                getAnswerBorder(index),
                isAnswered && index !== question.correctIndex && index !== selectedIndex
                  ? { opacity: 0.5 }
                  : {},
              ]}
              onPress={() => handleSelectAnswer(index)}
              disabled={isAnswered}>
              <View
                style={[
                  styles.answerIndex,
                  {
                    borderColor: getIndexCircleColor(index),
                    backgroundColor: getIndexFill(index),
                  },
                ]}>
                <ThemedText
                  style={[styles.answerIndexText, { color: getIndexTextColor(index) }]}>
                  {String.fromCharCode(65 + index)}
                </ThemedText>
              </View>
              <ThemedText style={styles.answerText}>{answer}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Explanation — shown after a wrong answer */}
        {isAnswered && selectedIndex !== question.correctIndex && (
          <View style={styles.explanationCard}>
            <ThemedText style={styles.explanationLabel}>✦ Why?</ThemedText>
            <ThemedText style={styles.explanationText}>
              {question.explanation}
            </ThemedText>
          </View>
        )}

        {/* Next Button */}
        {isAnswered && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <ThemedText style={styles.nextButtonText}>
              {isLastQuestion ? 'Finish' : 'Next'}
            </ThemedText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const difficultyStyles: Record<string, { badge: { backgroundColor: string }; text: { fontSize: number; fontWeight: '600'; color: string } }> = {
  SWE1: { badge: { backgroundColor: '#e8f5e9' }, text: { fontSize: 13, fontWeight: '600', color: '#4caf50' } },
  SWE2: { badge: { backgroundColor: '#fff3e0' }, text: { fontSize: 13, fontWeight: '600', color: '#ff9500' } },
  SWE3: { badge: { backgroundColor: '#fdecea' }, text: { fontSize: 13, fontWeight: '600', color: '#f44336' } },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
    gap: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  typeBadge: {
    backgroundColor: '#e8f4f8',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0a7ea4',
  },
  progressBadge: {
    marginLeft: 'auto',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.5,
  },
  questionCard: {
    borderRadius: 20,
    padding: 24,
    gap: 10,
  },
  topicLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0a7ea4',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  questionText: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '500',
  },
  answerList: {
    gap: 12,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 14,
    padding: 16,
  },
  answerIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerIndexText: {
    fontSize: 14,
    fontWeight: '700',
  },
  answerText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  nextButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  summaryContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
    gap: 28,
  },
  scoreCard: {
    alignItems: 'center',
    gap: 8,
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
  },
  scoreLabel: {
    fontSize: 16,
    opacity: 0.5,
    fontWeight: '600',
  },
  missedSection: {
    width: '100%',
    gap: 12,
  },
  missedHeading: {
    fontSize: 18,
    fontWeight: '700',
  },
  missedCard: {
    borderRadius: 14,
    padding: 16,
    gap: 8,
    width: '100%',
  },
  missedTopic: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0a7ea4',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  missedQuestion: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  missedRow: {
    flexDirection: 'row',
  },
  missedWrong: {
    fontSize: 13,
    color: '#f44336',
    lineHeight: 20,
  },
  missedCorrect: {
    fontSize: 13,
    color: '#4caf50',
    lineHeight: 20,
  },
  playAgainButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: 'center',
  },
  playAgainText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  pickerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 28,
  },
  pickerSubtitle: {
    fontSize: 16,
    opacity: 0.5,
    fontWeight: '500',
  },
  pickerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  pickerButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#0a7ea4',
    gap: 4,
  },
  pickerButtonNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0a7ea4',
    lineHeight: 36,
  },
  pickerButtonLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0a7ea4',
    opacity: 0.7,
  },
  difficultySection: {
    width: '100%',
    gap: 12,
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#8e8e9344',
  },
  difficultyButtonActive: {
    borderColor: 'transparent',
  },
  difficultyButtonText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.4,
  },
  difficultyButtonTextActive: {
    opacity: 1,
  },
  questionsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availableCount: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.4,
  },
  pickerButtonDimmed: {
    borderColor: '#8e8e9333',
    opacity: 0.35,
  },
  pickerButtonNumberDimmed: {
    color: '#8e8e93',
  },
  explanationCard: {
    borderWidth: 1,
    borderColor: '#0a7ea433',
    borderRadius: 14,
    padding: 16,
    gap: 8,
    backgroundColor: '#0a7ea408',
  },
  explanationLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0a7ea4',
    letterSpacing: 0.4,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 21,
    opacity: 0.6,
  },
});
