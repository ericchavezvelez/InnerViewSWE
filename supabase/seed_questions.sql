-- ================================================================
-- SEED: InnerViewSWE Play Questions (53 questions)
-- Run this in the Supabase SQL Editor.
-- Safe to re-run — all inserts use ON CONFLICT (id) DO NOTHING.
--
-- UUID legend:
--   bbbbbbbb-...-000000000001–10  existing topics (schema.sql)
--   bbbbbbbb-...-000000000011–18  new topics added here
--   cccccccc-...-000000000001–4   existing categories (schema.sql)
--   dddddddd-...-000000000001–3   existing lessons (schema.sql)
--   dddddddd-...-000000000004–13  new lessons added here
--   ffffffff-...-000000000001–53  the 53 play questions
-- ================================================================


-- ================================================================
-- 1. Additional Topics
-- ================================================================

INSERT INTO topics (id, name, display_order) VALUES
  ('bbbbbbbb-0000-0000-0000-000000000011', 'Strings',  11),
  ('bbbbbbbb-0000-0000-0000-000000000012', 'Tree',     12),
  ('bbbbbbbb-0000-0000-0000-000000000013', 'Big O',    13),
  ('bbbbbbbb-0000-0000-0000-000000000014', 'Sorting',  14),
  ('bbbbbbbb-0000-0000-0000-000000000015', 'Stack',    15),
  ('bbbbbbbb-0000-0000-0000-000000000016', 'Graph',    16),
  ('bbbbbbbb-0000-0000-0000-000000000017', 'Heap',     17),
  ('bbbbbbbb-0000-0000-0000-000000000018', 'Trie',     18)
ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 2. Additional Lessons — Data Structures
-- ================================================================

INSERT INTO lessons (id, category_id, title, description, display_order, xp_reward) VALUES
  ('dddddddd-0000-0000-0000-000000000004',
   'cccccccc-0000-0000-0000-000000000001',
   'Trees & Binary Trees',
   'BST traversals, insertion, and tree-based problem patterns',
   4, 20),

  ('dddddddd-0000-0000-0000-000000000005',
   'cccccccc-0000-0000-0000-000000000001',
   'Stacks & Queues',
   'LIFO and FIFO structures: monotonic stacks, bracket matching, BFS queues',
   5, 15),

  ('dddddddd-0000-0000-0000-000000000006',
   'cccccccc-0000-0000-0000-000000000001',
   'Heaps & Priority Queues',
   'Min/max heaps: k-th largest, merge k lists, streaming median',
   6, 25),

  ('dddddddd-0000-0000-0000-000000000007',
   'cccccccc-0000-0000-0000-000000000001',
   'Tries',
   'Prefix trees for autocomplete, spell-check, and IP routing',
   7, 20)
ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 3. Additional Lessons — Algorithms
-- ================================================================

INSERT INTO lessons (id, category_id, title, description, display_order, xp_reward) VALUES
  ('dddddddd-0000-0000-0000-000000000008',
   'cccccccc-0000-0000-0000-000000000002',
   'Big O & Complexity',
   'Time and space complexity analysis: O(1), O(log n), O(n), O(n²)',
   1, 10),

  ('dddddddd-0000-0000-0000-000000000009',
   'cccccccc-0000-0000-0000-000000000002',
   'Sorting Algorithms',
   'Merge sort, quicksort, heapsort: trade-offs and guarantees',
   2, 20),

  ('dddddddd-0000-0000-0000-000000000010',
   'cccccccc-0000-0000-0000-000000000002',
   'Recursion & Backtracking',
   'Base cases, call stacks, generating combinations and subsets',
   3, 20),

  ('dddddddd-0000-0000-0000-000000000011',
   'cccccccc-0000-0000-0000-000000000002',
   'Graph Traversal',
   'DFS, BFS, cycle detection, connected components, Dijkstra, Bellman-Ford',
   4, 25),

  ('dddddddd-0000-0000-0000-000000000012',
   'cccccccc-0000-0000-0000-000000000002',
   'Dynamic Programming',
   'Memoization, tabulation, knapsack, word break, and classic DP patterns',
   5, 30),

  ('dddddddd-0000-0000-0000-000000000013',
   'cccccccc-0000-0000-0000-000000000002',
   'Binary Search Patterns',
   'Classic binary search, rotated arrays, and binary search on answer',
   6, 20)
ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 4. Questions — HashMaps & HashSets (lesson dddddddd-...-0002)
-- ================================================================

-- Q1 · HashMap · swe_1
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000001',
  'dddddddd-0000-0000-0000-000000000002',
  'bbbbbbbb-0000-0000-0000-000000000001',
  'multiple_choice_conceptual',
  'What is the average time complexity of a lookup in a hash map?',
  '{"options": [{"id": "a", "text": "O(n)"}, {"id": "b", "text": "O(log n)"}, {"id": "c", "text": "O(1)"}, {"id": "d", "text": "O(n²)"}], "correct_option_id": "c"}',
  'A hash function maps a key directly to a bucket index, so lookup skips any scanning — it''s a direct address calculation. Collisions can degrade this to O(n) in the worst case, but a good hash function keeps that rare.',
  'swe_1', 5, 10
) ON CONFLICT (id) DO NOTHING;

-- Q10 · HashMap · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000010',
  'dddddddd-0000-0000-0000-000000000002',
  'bbbbbbbb-0000-0000-0000-000000000001',
  'multiple_choice_conceptual',
  'What causes a hash collision?',
  '{"options": [{"id": "a", "text": "Two keys that are equal"}, {"id": "b", "text": "Two different keys that map to the same bucket"}, {"id": "c", "text": "A key with a null value"}, {"id": "d", "text": "A hash function that returns negative numbers"}], "correct_option_id": "b"}',
  'A collision happens when two distinct keys produce the same hash index. This is resolved via chaining (a linked list at each bucket) or open addressing (probing for the next empty slot). Equal keys don''t collide — they map to the same entry intentionally.',
  'swe_2', 10, 20
) ON CONFLICT (id) DO NOTHING;

-- Q36 · HashMap · swe_1
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000036',
  'dddddddd-0000-0000-0000-000000000002',
  'bbbbbbbb-0000-0000-0000-000000000001',
  'multiple_choice_conceptual',
  'How do you find duplicates in an unsorted array in O(n) time?',
  '{"options": [{"id": "a", "text": "Sort the array and scan for adjacent duplicates"}, {"id": "b", "text": "Use nested loops to compare every pair"}, {"id": "c", "text": "Use a hash set — add each element and check if it already exists"}, {"id": "d", "text": "Use binary search for each element"}], "correct_option_id": "c"}',
  'A hash set provides O(1) average lookup and insert. As you iterate, check if the element is already in the set — if yes, it''s a duplicate. Sorting would be O(n log n); nested loops O(n²). The set approach is the optimal single-pass solution.',
  'swe_1', 5, 30
) ON CONFLICT (id) DO NOTHING;

-- Q45 · HashMap · swe_3
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000045',
  'dddddddd-0000-0000-0000-000000000002',
  'bbbbbbbb-0000-0000-0000-000000000001',
  'multiple_choice_conceptual',
  'How would you implement an LRU (Least Recently Used) cache with O(1) get and put?',
  '{"options": [{"id": "a", "text": "Array with timestamps for each entry"}, {"id": "b", "text": "HashMap only — evict the smallest key"}, {"id": "c", "text": "HashMap + doubly linked list"}, {"id": "d", "text": "Min-heap ordered by access time"}], "correct_option_id": "c"}',
  'A HashMap gives O(1) key lookup. A doubly linked list maintains access order — on get/put, move the node to the front; on eviction, remove from the tail. The map stores key → node pointers so list moves are O(1). This is the canonical LRU design.',
  'swe_3', 15, 40
) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 5. Questions — Arrays & Strings (lesson dddddddd-...-0001)
-- ================================================================

-- Q2 · Array · swe_1
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000002',
  'dddddddd-0000-0000-0000-000000000001',
  'bbbbbbbb-0000-0000-0000-000000000002',
  'multiple_choice_conceptual',
  'Which approach finds two numbers in an array that add up to a target most efficiently?',
  '{"options": [{"id": "a", "text": "Nested loops to check every pair"}, {"id": "b", "text": "Sort the array, then use two pointers"}, {"id": "c", "text": "Hash map to store complements as you iterate"}, {"id": "d", "text": "Binary search for each element"}], "correct_option_id": "c"}',
  'As you iterate, store each number''s complement (target - num) in a hash map. If the current number exists as a complement, you''re done. One pass, O(n) time vs O(n²) for nested loops.',
  'swe_1', 5, 1
) ON CONFLICT (id) DO NOTHING;

-- Q3 · Strings · swe_1
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000003',
  'dddddddd-0000-0000-0000-000000000001',
  'bbbbbbbb-0000-0000-0000-000000000011',
  'multiple_choice_conceptual',
  'What does it mean for two strings to be anagrams?',
  '{"options": [{"id": "a", "text": "They have the same length"}, {"id": "b", "text": "They contain the same characters in any order"}, {"id": "c", "text": "They are mirror images of each other"}, {"id": "d", "text": "They share the same prefix"}], "correct_option_id": "b"}',
  'Anagrams are rearrangements of the same characters — "listen" and "silent" are anagrams. Same length is necessary but not sufficient; the character frequencies must match exactly.',
  'swe_1', 5, 2
) ON CONFLICT (id) DO NOTHING;

-- Q11 · Array · swe_1
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000011',
  'dddddddd-0000-0000-0000-000000000001',
  'bbbbbbbb-0000-0000-0000-000000000002',
  'multiple_choice_conceptual',
  'What is the time complexity of accessing an element by index in an array?',
  '{"options": [{"id": "a", "text": "O(n)"}, {"id": "b", "text": "O(log n)"}, {"id": "c", "text": "O(n²)"}, {"id": "d", "text": "O(1)"}], "correct_option_id": "d"}',
  'Arrays store elements in contiguous memory. Given the base address and element size, any index computes directly as: base + index × size. This is a single arithmetic operation — O(1) regardless of array length.',
  'swe_1', 5, 3
) ON CONFLICT (id) DO NOTHING;

-- Q13 · Strings · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000013',
  'dddddddd-0000-0000-0000-000000000001',
  'bbbbbbbb-0000-0000-0000-000000000011',
  'multiple_choice_conceptual',
  'What is the most efficient way to check if a string is a palindrome?',
  '{"options": [{"id": "a", "text": "Reverse the string and compare with the original"}, {"id": "b", "text": "Use two pointers starting from both ends moving inward"}, {"id": "c", "text": "Sort the characters and compare"}, {"id": "d", "text": "Check every substring recursively"}], "correct_option_id": "b"}',
  'Two pointers (left at start, right at end) compare characters and move inward until they meet. This is O(n) time and O(1) space — no extra string allocation. Reversing also works but requires O(n) extra space.',
  'swe_2', 10, 4
) ON CONFLICT (id) DO NOTHING;

-- Q23 · Sliding Window · swe_1
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000023',
  'dddddddd-0000-0000-0000-000000000001',
  'bbbbbbbb-0000-0000-0000-000000000004',
  'multiple_choice_conceptual',
  'Which technique is best for finding the maximum sum subarray of size k?',
  '{"options": [{"id": "a", "text": "Binary search"}, {"id": "b", "text": "Sliding window"}, {"id": "c", "text": "Two pointers"}, {"id": "d", "text": "Recursion"}], "correct_option_id": "b"}',
  'A sliding window keeps a running sum of the current k elements. When sliding right, subtract the element leaving the window and add the element entering. This avoids recomputing the sum from scratch each time — O(n) vs O(nk).',
  'swe_1', 5, 5
) ON CONFLICT (id) DO NOTHING;

-- Q25 · Strings · swe_1
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000025',
  'dddddddd-0000-0000-0000-000000000001',
  'bbbbbbbb-0000-0000-0000-000000000011',
  'multiple_choice_conceptual',
  'What is the most common approach to find the longest substring without repeating characters?',
  '{"options": [{"id": "a", "text": "Sort the string first"}, {"id": "b", "text": "Sliding window with a set"}, {"id": "c", "text": "Nested loops"}, {"id": "d", "text": "Recursion with memoization"}], "correct_option_id": "b"}',
  'A sliding window with a set tracks which characters are in the current window. When a duplicate is detected, shrink from the left until it''s removed. This gives O(n) time — each character is added and removed at most once.',
  'swe_1', 5, 6
) ON CONFLICT (id) DO NOTHING;

-- Q29 · Two Pointers · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000029',
  'dddddddd-0000-0000-0000-000000000001',
  'bbbbbbbb-0000-0000-0000-000000000003',
  'multiple_choice_conceptual',
  'The two-pointer technique works best when the input array is:',
  '{"options": [{"id": "a", "text": "Unsorted with duplicates"}, {"id": "b", "text": "Sorted or when pointers represent a window"}, {"id": "c", "text": "Stored in a hash map"}, {"id": "d", "text": "Circular"}], "correct_option_id": "b"}',
  'On a sorted array, two pointers converging from both ends can reason about sums — move left pointer right to increase the sum, right pointer left to decrease it. Without sorting, you can''t make directional decisions and the technique breaks down.',
  'swe_2', 10, 7
) ON CONFLICT (id) DO NOTHING;

-- Q51 · Array · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000051',
  'dddddddd-0000-0000-0000-000000000001',
  'bbbbbbbb-0000-0000-0000-000000000002',
  'multiple_choice_conceptual',
  'What is the time complexity of finding the longest consecutive sequence in an unsorted array?',
  '{"options": [{"id": "a", "text": "O(n log n) using sorting"}, {"id": "b", "text": "O(n²) using nested loops"}, {"id": "c", "text": "O(n) using a hash set"}, {"id": "d", "text": "O(log n) using binary search"}], "correct_option_id": "c"}',
  'Put all elements in a hash set. For each number n where n-1 is NOT in the set (it''s a sequence start), count how long the streak n, n+1, n+2... goes. Each element is visited at most twice total — O(n). Sorting would work but is O(n log n).',
  'swe_2', 10, 8
) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 6. Questions — Linked Lists (lesson dddddddd-...-0003)
-- ================================================================

-- Q6 · Linked List · swe_1
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000006',
  'dddddddd-0000-0000-0000-000000000003',
  'bbbbbbbb-0000-0000-0000-000000000005',
  'multiple_choice_conceptual',
  'What is the time complexity of inserting a node at the head of a singly linked list?',
  '{"options": [{"id": "a", "text": "O(n)"}, {"id": "b", "text": "O(log n)"}, {"id": "c", "text": "O(n²)"}, {"id": "d", "text": "O(1)"}], "correct_option_id": "d"}',
  'Head insertion only requires two pointer updates: new_node.next = head, then head = new_node. No traversal needed — it''s always constant time regardless of list length.',
  'swe_1', 5, 1
) ON CONFLICT (id) DO NOTHING;

-- Q14 · Linked List · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000014',
  'dddddddd-0000-0000-0000-000000000003',
  'bbbbbbbb-0000-0000-0000-000000000005',
  'multiple_choice_conceptual',
  'How can you detect a cycle in a linked list efficiently?',
  '{"options": [{"id": "a", "text": "Store all visited nodes in a set"}, {"id": "b", "text": "Reverse the list and check if it equals the original"}, {"id": "c", "text": "Use two pointers, one fast and one slow (Floyd''s algorithm)"}, {"id": "d", "text": "Count the total number of nodes"}], "correct_option_id": "c"}',
  'Floyd''s cycle detection uses a slow pointer (1 step) and fast pointer (2 steps). If a cycle exists, the fast pointer laps the slow one and they meet inside the cycle. O(n) time, O(1) space — better than a set which uses O(n) space.',
  'swe_2', 10, 2
) ON CONFLICT (id) DO NOTHING;

-- Q35 · Linked List · swe_1
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000035',
  'dddddddd-0000-0000-0000-000000000003',
  'bbbbbbbb-0000-0000-0000-000000000005',
  'multiple_choice_conceptual',
  'What is the most efficient way to reverse a singly linked list in-place?',
  '{"options": [{"id": "a", "text": "Copy nodes into an array, then relink in reverse"}, {"id": "b", "text": "Iterate with three pointers: prev, curr, next"}, {"id": "c", "text": "Use a stack to reverse the values"}, {"id": "d", "text": "Recursively swap node values"}], "correct_option_id": "b"}',
  'Three pointers (prev = null, curr = head, next) let you reverse each link as you traverse: save next, point curr.next to prev, advance both. One pass, O(n) time, O(1) space — no extra data structures needed.',
  'swe_1', 5, 3
) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 7. Questions — Trees & Binary Trees (lesson dddddddd-...-0004)
-- ================================================================

-- Q4 · Tree · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000004',
  'dddddddd-0000-0000-0000-000000000004',
  'bbbbbbbb-0000-0000-0000-000000000012',
  'multiple_choice_conceptual',
  'Which traversal visits nodes of a binary search tree in ascending order?',
  '{"options": [{"id": "a", "text": "Pre-order"}, {"id": "b", "text": "Post-order"}, {"id": "c", "text": "Level-order"}, {"id": "d", "text": "In-order"}], "correct_option_id": "d"}',
  'In-order traversal visits left subtree → root → right subtree. In a BST, left children are always smaller and right children are always larger, so this naturally produces sorted ascending output.',
  'swe_2', 10, 1
) ON CONFLICT (id) DO NOTHING;

-- Q8 · Tree · swe_2  (BFS uses a queue — question is about data structure, tagged under Trees)
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000008',
  'dddddddd-0000-0000-0000-000000000004',
  'bbbbbbbb-0000-0000-0000-000000000012',
  'multiple_choice_conceptual',
  'What data structure is typically used to implement a breadth-first search (BFS)?',
  '{"options": [{"id": "a", "text": "Stack"}, {"id": "b", "text": "Queue"}, {"id": "c", "text": "Heap"}, {"id": "d", "text": "Set"}], "correct_option_id": "b"}',
  'BFS explores nodes level by level. A queue (FIFO) processes nodes in the order they were discovered, ensuring all nodes at depth d are visited before any at depth d+1. A stack would give DFS behavior instead.',
  'swe_2', 10, 2
) ON CONFLICT (id) DO NOTHING;

-- Q17 · Tree · swe_3
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000017',
  'dddddddd-0000-0000-0000-000000000004',
  'bbbbbbbb-0000-0000-0000-000000000012',
  'multiple_choice_conceptual',
  'What is the worst-case time complexity of inserting into an unbalanced binary search tree?',
  '{"options": [{"id": "a", "text": "O(1)"}, {"id": "b", "text": "O(log n)"}, {"id": "c", "text": "O(n)"}, {"id": "d", "text": "O(n log n)"}], "correct_option_id": "c"}',
  'If you insert already-sorted data into a BST without balancing, every new node becomes the rightmost (or leftmost) child — the tree degenerates into a linked list. Insertion then requires traversing all n nodes: O(n).',
  'swe_3', 15, 3
) ON CONFLICT (id) DO NOTHING;

-- Q49 · Tree · swe_3
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000049',
  'dddddddd-0000-0000-0000-000000000004',
  'bbbbbbbb-0000-0000-0000-000000000012',
  'multiple_choice_conceptual',
  'Which traversal order is most natural for serializing and deserializing a binary tree?',
  '{"options": [{"id": "a", "text": "In-order"}, {"id": "b", "text": "Post-order"}, {"id": "c", "text": "Pre-order (root first)"}, {"id": "d", "text": "Level-order only"}], "correct_option_id": "c"}',
  'Pre-order visits root before children, so during deserialization you always know the root value before its subtrees — making reconstruction straightforward. In-order alone is ambiguous without extra info. Level-order (BFS) also works and is used in LeetCode''s standard format.',
  'swe_3', 15, 4
) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 8. Questions — Stacks & Queues (lesson dddddddd-...-0005)
-- ================================================================

-- Q21 · Stack · swe_1
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000021',
  'dddddddd-0000-0000-0000-000000000005',
  'bbbbbbbb-0000-0000-0000-000000000015',
  'multiple_choice_conceptual',
  'Which principle does a stack follow?',
  '{"options": [{"id": "a", "text": "First In, First Out"}, {"id": "b", "text": "Last In, First Out"}, {"id": "c", "text": "Random Access"}, {"id": "d", "text": "Priority Order"}], "correct_option_id": "b"}',
  'A stack is LIFO — like a stack of plates. The last item pushed is the first one popped. This makes stacks natural for problems involving reversal, backtracking, or tracking the most recent state (e.g. undo, call stack, DFS).',
  'swe_1', 5, 1
) ON CONFLICT (id) DO NOTHING;

-- Q26 · Stack · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000026',
  'dddddddd-0000-0000-0000-000000000005',
  'bbbbbbbb-0000-0000-0000-000000000015',
  'multiple_choice_conceptual',
  'Which data structure is most natural for checking balanced parentheses?',
  '{"options": [{"id": "a", "text": "Queue"}, {"id": "b", "text": "Stack"}, {"id": "c", "text": "Hash map"}, {"id": "d", "text": "Linked list"}], "correct_option_id": "b"}',
  'Push each opening bracket onto a stack. For each closing bracket, check if the top of the stack is the matching opener and pop it. If the stack is empty at the end, the brackets are balanced. The LIFO property naturally handles nesting.',
  'swe_2', 10, 2
) ON CONFLICT (id) DO NOTHING;

-- Q41 · Stack · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000041',
  'dddddddd-0000-0000-0000-000000000005',
  'bbbbbbbb-0000-0000-0000-000000000015',
  'multiple_choice_conceptual',
  'What data structure is used to solve "next greater element" problems efficiently?',
  '{"options": [{"id": "a", "text": "Min-heap"}, {"id": "b", "text": "Monotonic stack"}, {"id": "c", "text": "Queue"}, {"id": "d", "text": "Hash map"}], "correct_option_id": "b"}',
  'A monotonic stack maintains elements in increasing or decreasing order. For "next greater element," iterate right to left, popping elements from the stack that are ≤ current. The stack top (if any) is the next greater. O(n) — each element is pushed and popped at most once.',
  'swe_2', 10, 3
) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 9. Questions — Heaps & Priority Queues (lesson dddddddd-...-0006)
-- ================================================================

-- Q28 · Heap · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000028',
  'dddddddd-0000-0000-0000-000000000006',
  'bbbbbbbb-0000-0000-0000-000000000017',
  'multiple_choice_conceptual',
  'In a min-heap, where is the smallest element always found?',
  '{"options": [{"id": "a", "text": "At a leaf node"}, {"id": "b", "text": "At the last position"}, {"id": "c", "text": "At the root"}, {"id": "d", "text": "In sorted order throughout"}], "correct_option_id": "c"}',
  'The min-heap property guarantees every parent is ≤ its children. The root has no parent to constrain it from above, so it must be the global minimum. This is what makes heaps efficient for priority queues — O(1) to peek the min.',
  'swe_2', 10, 1
) ON CONFLICT (id) DO NOTHING;

-- Q33 · Heap · swe_3
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000033',
  'dddddddd-0000-0000-0000-000000000006',
  'bbbbbbbb-0000-0000-0000-000000000017',
  'multiple_choice_conceptual',
  'What is the time complexity of building a heap from an unsorted array of n elements?',
  '{"options": [{"id": "a", "text": "O(n log n)"}, {"id": "b", "text": "O(n²)"}, {"id": "c", "text": "O(n)"}, {"id": "d", "text": "O(log n)"}], "correct_option_id": "c"}',
  'Floyd''s heapify algorithm starts from the last internal node and sifts down toward the root. Most nodes are near the bottom (small height), so they do little work. The math works out to O(n) total — better than inserting elements one by one at O(n log n).',
  'swe_3', 15, 2
) ON CONFLICT (id) DO NOTHING;

-- Q40 · Heap · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000040',
  'dddddddd-0000-0000-0000-000000000006',
  'bbbbbbbb-0000-0000-0000-000000000017',
  'multiple_choice_conceptual',
  'You need to find the k-th largest element in an unsorted array. What''s the most efficient approach?',
  '{"options": [{"id": "a", "text": "Sort the array and return index n-k"}, {"id": "b", "text": "Use a min-heap of size k"}, {"id": "c", "text": "Use BFS on the array"}, {"id": "d", "text": "Binary search for the answer"}], "correct_option_id": "b"}',
  'Maintain a min-heap of the k largest elements seen so far. For each new element, if it''s larger than the heap''s min (root), replace the root and re-heapify. After the full pass, the root is the k-th largest. O(n log k) — better than O(n log n) sorting when k is small.',
  'swe_2', 10, 3
) ON CONFLICT (id) DO NOTHING;

-- Q46 · Heap · swe_3
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000046',
  'dddddddd-0000-0000-0000-000000000006',
  'bbbbbbbb-0000-0000-0000-000000000017',
  'multiple_choice_conceptual',
  'What data structure lets you find the median of a stream of numbers in O(log n) per insert?',
  '{"options": [{"id": "a", "text": "A sorted array"}, {"id": "b", "text": "A single min-heap"}, {"id": "c", "text": "Two heaps: a max-heap for the lower half and a min-heap for the upper half"}, {"id": "d", "text": "A balanced BST"}], "correct_option_id": "c"}',
  'Keep the smaller half in a max-heap and the larger half in a min-heap, balanced in size. The median is the top of the larger heap (odd count) or the average of both tops (even count). Each insert is O(log n) for heap push/pop; median is O(1).',
  'swe_3', 15, 4
) ON CONFLICT (id) DO NOTHING;

-- Q48 · Heap · swe_3
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000048',
  'dddddddd-0000-0000-0000-000000000006',
  'bbbbbbbb-0000-0000-0000-000000000017',
  'multiple_choice_conceptual',
  'What is the most efficient way to merge k sorted linked lists of total n elements?',
  '{"options": [{"id": "a", "text": "Concatenate all lists, then sort — O(n log n)"}, {"id": "b", "text": "Merge lists two at a time — O(nk)"}, {"id": "c", "text": "Use a min-heap of size k to always extract the global minimum — O(n log k)"}, {"id": "d", "text": "BFS across all lists simultaneously"}], "correct_option_id": "c"}',
  'Put the head of each list into a min-heap. Repeatedly extract the minimum, add it to the result, and push the extracted node''s next pointer into the heap. O(n log k) — each of n elements is pushed/popped once, and heap operations cost O(log k).',
  'swe_3', 15, 5
) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 10. Questions — Tries (lesson dddddddd-...-0007)
-- ================================================================

-- Q32 · Trie · swe_3
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000032',
  'dddddddd-0000-0000-0000-000000000007',
  'bbbbbbbb-0000-0000-0000-000000000018',
  'multiple_choice_conceptual',
  'What is a trie most commonly used for?',
  '{"options": [{"id": "a", "text": "Storing key-value pairs with O(1) lookup"}, {"id": "b", "text": "Efficient prefix-based string search and autocomplete"}, {"id": "c", "text": "Sorting a list of integers"}, {"id": "d", "text": "Balancing a binary search tree"}], "correct_option_id": "b"}',
  'A trie stores strings character by character in a tree. Words sharing a prefix share the same path from the root. This makes prefix lookups O(L) where L is prefix length — ideal for autocomplete, spell-check, and IP routing tables.',
  'swe_3', 15, 1
) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 11. Questions — Big O & Complexity (lesson dddddddd-...-0008)
-- ================================================================

-- Q5 · Big O · swe_1
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000005',
  'dddddddd-0000-0000-0000-000000000008',
  'bbbbbbbb-0000-0000-0000-000000000013',
  'multiple_choice_conceptual',
  'What is the time complexity of binary search on a sorted array?',
  '{"options": [{"id": "a", "text": "O(1)"}, {"id": "b", "text": "O(n)"}, {"id": "c", "text": "O(log n)"}, {"id": "d", "text": "O(n log n)"}], "correct_option_id": "c"}',
  'Binary search halves the search space each step. Starting with n elements: n → n/2 → n/4 → ... → 1. That''s log₂(n) steps. Each step is O(1), so total is O(log n).',
  'swe_1', 5, 1
) ON CONFLICT (id) DO NOTHING;

-- Q9 · Big O · swe_1
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000009',
  'dddddddd-0000-0000-0000-000000000008',
  'bbbbbbbb-0000-0000-0000-000000000013',
  'multiple_choice_conceptual',
  'What is the space complexity of a recursive function that calls itself n times?',
  '{"options": [{"id": "a", "text": "O(1)"}, {"id": "b", "text": "O(log n)"}, {"id": "c", "text": "O(n)"}, {"id": "d", "text": "O(n²)"}], "correct_option_id": "c"}',
  'Each recursive call adds a new stack frame. With n calls, n frames are live simultaneously on the call stack before any return — that''s O(n) space. This is why deep recursion can cause stack overflows.',
  'swe_1', 5, 2
) ON CONFLICT (id) DO NOTHING;

-- Q24 · Big O · swe_1
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000024',
  'dddddddd-0000-0000-0000-000000000008',
  'bbbbbbbb-0000-0000-0000-000000000013',
  'multiple_choice_conceptual',
  'An algorithm that runs in O(1) space means:',
  '{"options": [{"id": "a", "text": "It runs in constant time"}, {"id": "b", "text": "It uses no memory at all"}, {"id": "c", "text": "It uses a fixed amount of memory regardless of input size"}, {"id": "d", "text": "It only works on arrays of size 1"}], "correct_option_id": "c"}',
  'O(1) space means the algorithm uses a constant amount of extra memory — a fixed number of variables — no matter how large the input is. It doesn''t mean zero memory; the input itself still exists, but no extra data structures are allocated that scale with input size.',
  'swe_1', 5, 3
) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 12. Questions — Sorting Algorithms (lesson dddddddd-...-0009)
-- ================================================================

-- Q7 · Sorting · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000007',
  'dddddddd-0000-0000-0000-000000000009',
  'bbbbbbbb-0000-0000-0000-000000000014',
  'multiple_choice_conceptual',
  'Which sorting algorithm has an average time complexity of O(n log n) and is commonly used in standard libraries?',
  '{"options": [{"id": "a", "text": "Bubble Sort"}, {"id": "b", "text": "Insertion Sort"}, {"id": "c", "text": "Merge Sort"}, {"id": "d", "text": "Selection Sort"}], "correct_option_id": "c"}',
  'Merge sort divides the array in half recursively (log n levels), then merges sorted halves in O(n) per level — guaranteed O(n log n) in all cases. It''s also stable, making it a common choice in standard library implementations.',
  'swe_2', 10, 1
) ON CONFLICT (id) DO NOTHING;

-- Q20 · Sorting · swe_3
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000020',
  'dddddddd-0000-0000-0000-000000000009',
  'bbbbbbbb-0000-0000-0000-000000000014',
  'multiple_choice_conceptual',
  'Why is quicksort''s worst-case O(n²) but average case O(n log n)?',
  '{"options": [{"id": "a", "text": "It depends on the size of the input"}, {"id": "b", "text": "Poor pivot selection causes maximally unbalanced partitions"}, {"id": "c", "text": "It performs extra comparisons on sorted arrays"}, {"id": "d", "text": "It uses O(n) extra space in the worst case"}], "correct_option_id": "b"}',
  'If the pivot is always the min or max (e.g., picking first element on already-sorted data), each partition produces one empty half and one of size n-1. That''s n partitions of decreasing size: O(n²). Random or median-of-three pivot selection avoids this.',
  'swe_3', 15, 2
) ON CONFLICT (id) DO NOTHING;

-- Q37 · Sorting · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000037',
  'dddddddd-0000-0000-0000-000000000009',
  'bbbbbbbb-0000-0000-0000-000000000014',
  'multiple_choice_conceptual',
  'Which sorting algorithm is both stable and guarantees O(n log n) in all cases?',
  '{"options": [{"id": "a", "text": "Quicksort"}, {"id": "b", "text": "Heapsort"}, {"id": "c", "text": "Merge Sort"}, {"id": "d", "text": "Timsort"}], "correct_option_id": "c"}',
  'Merge sort always divides in half (log n levels) and merges in O(n) per level — O(n log n) worst case, guaranteed. It''s also stable (equal elements maintain original order). Quicksort can degrade to O(n²); heapsort is not stable.',
  'swe_2', 10, 3
) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 13. Questions — Recursion & Backtracking (lesson dddddddd-...-0010)
-- ================================================================

-- Q22 · Recursion · swe_1
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000022',
  'dddddddd-0000-0000-0000-000000000010',
  'bbbbbbbb-0000-0000-0000-000000000010',
  'multiple_choice_conceptual',
  'What prevents a recursive function from running forever?',
  '{"options": [{"id": "a", "text": "A loop counter"}, {"id": "b", "text": "A base case"}, {"id": "c", "text": "A return type"}, {"id": "d", "text": "A try/catch block"}], "correct_option_id": "b"}',
  'A base case is the condition where the function stops calling itself and returns a direct result. Without it, the function recurses infinitely, eventually exhausting the call stack and causing a stack overflow error.',
  'swe_1', 5, 1
) ON CONFLICT (id) DO NOTHING;

-- Q30 · Recursion · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000030',
  'dddddddd-0000-0000-0000-000000000010',
  'bbbbbbbb-0000-0000-0000-000000000010',
  'multiple_choice_conceptual',
  'What is the time complexity of the naive recursive Fibonacci solution?',
  '{"options": [{"id": "a", "text": "O(n)"}, {"id": "b", "text": "O(n log n)"}, {"id": "c", "text": "O(2ⁿ)"}, {"id": "d", "text": "O(log n)"}], "correct_option_id": "c"}',
  'fib(n) calls fib(n-1) and fib(n-2), each of which branches again. The call tree is a binary tree of height n — roughly 2ⁿ nodes total. fib(3) alone is recomputed dozens of times for large n. Memoization reduces this to O(n).',
  'swe_2', 10, 2
) ON CONFLICT (id) DO NOTHING;

-- Q38 · Recursion · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000038',
  'dddddddd-0000-0000-0000-000000000010',
  'bbbbbbbb-0000-0000-0000-000000000010',
  'multiple_choice_conceptual',
  'Which algorithmic pattern would you use to generate all subsets of a set?',
  '{"options": [{"id": "a", "text": "Greedy"}, {"id": "b", "text": "Backtracking"}, {"id": "c", "text": "Divide and Conquer"}, {"id": "d", "text": "Dynamic Programming"}], "correct_option_id": "b"}',
  'Backtracking explores all possibilities by making a choice, recursing, then undoing the choice (backtracking). For subsets, at each element you choose to include it or not, giving 2ⁿ subsets. It''s the standard pattern for "generate all valid combinations."',
  'swe_2', 10, 3
) ON CONFLICT (id) DO NOTHING;

-- Q52 · Recursion · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000052',
  'dddddddd-0000-0000-0000-000000000010',
  'bbbbbbbb-0000-0000-0000-000000000010',
  'multiple_choice_conceptual',
  'What is "divide and conquer" and which algorithm is a classic example?',
  '{"options": [{"id": "a", "text": "Solve greedily at each step — Dijkstra''s is an example"}, {"id": "b", "text": "Split the problem in half, solve each half, combine — Merge Sort is an example"}, {"id": "c", "text": "Store subproblem results — Fibonacci DP is an example"}, {"id": "d", "text": "Try all possibilities and backtrack — N-Queens is an example"}], "correct_option_id": "b"}',
  'Divide and conquer splits the problem into independent subproblems, solves them recursively, then combines the results. Merge sort is the textbook example: split array in half (divide), sort each half (conquer), merge (combine). Binary search is another classic example.',
  'swe_2', 10, 4
) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 14. Questions — Graph Traversal (lesson dddddddd-...-0011)
-- ================================================================

-- Q18 · BFS · swe_3
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000018',
  'dddddddd-0000-0000-0000-000000000011',
  'bbbbbbbb-0000-0000-0000-000000000008',
  'multiple_choice_conceptual',
  'Which graph traversal is best suited for finding the shortest path in an unweighted graph?',
  '{"options": [{"id": "a", "text": "DFS"}, {"id": "b", "text": "BFS"}, {"id": "c", "text": "Dijkstra''s"}, {"id": "d", "text": "Bellman-Ford"}], "correct_option_id": "b"}',
  'BFS explores nodes level by level (by hop count). The first time it reaches a node is guaranteed to be via the fewest edges. DFS might find a path but not the shortest. Dijkstra''s is for weighted graphs — unnecessary overhead here.',
  'swe_3', 15, 1
) ON CONFLICT (id) DO NOTHING;

-- Q27 · Graph · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000027',
  'dddddddd-0000-0000-0000-000000000011',
  'bbbbbbbb-0000-0000-0000-000000000016',
  'multiple_choice_conceptual',
  'Which representation is generally more space-efficient for sparse graphs?',
  '{"options": [{"id": "a", "text": "Adjacency matrix"}, {"id": "b", "text": "Adjacency list"}, {"id": "c", "text": "Edge list"}, {"id": "d", "text": "Incidence matrix"}], "correct_option_id": "b"}',
  'An adjacency matrix always uses O(V²) space — even for graphs with few edges. An adjacency list uses O(V + E), which is much smaller when E << V². For sparse graphs (few edges), the list wins decisively.',
  'swe_2', 10, 2
) ON CONFLICT (id) DO NOTHING;

-- Q31 · Graph · swe_3
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000031',
  'dddddddd-0000-0000-0000-000000000011',
  'bbbbbbbb-0000-0000-0000-000000000016',
  'multiple_choice_conceptual',
  'What does Dijkstra''s algorithm find?',
  '{"options": [{"id": "a", "text": "The minimum spanning tree of a graph"}, {"id": "b", "text": "The shortest path from a source to all other nodes in a weighted graph"}, {"id": "c", "text": "All connected components in a graph"}, {"id": "d", "text": "The longest path between two nodes"}], "correct_option_id": "b"}',
  'Dijkstra''s uses a min-heap to greedily relax edges from the lowest-cost unvisited node. It computes shortest distances from one source to all reachable nodes in O((V + E) log V). It requires non-negative edge weights — use Bellman-Ford for negative edges.',
  'swe_3', 15, 3
) ON CONFLICT (id) DO NOTHING;

-- Q34 · DFS · swe_1
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000034',
  'dddddddd-0000-0000-0000-000000000011',
  'bbbbbbbb-0000-0000-0000-000000000007',
  'multiple_choice_conceptual',
  'Which algorithm would you use to check if a path exists between two nodes in an unweighted graph?',
  '{"options": [{"id": "a", "text": "Binary search"}, {"id": "b", "text": "DFS or BFS"}, {"id": "c", "text": "Merge sort"}, {"id": "d", "text": "Dijkstra''s"}], "correct_option_id": "b"}',
  'Both DFS and BFS traverse all reachable nodes from a source. If you reach the target during traversal, a path exists. For simple reachability (not shortest path), either works — DFS with a visited set is slightly simpler to implement recursively.',
  'swe_1', 5, 4
) ON CONFLICT (id) DO NOTHING;

-- Q39 · DFS · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000039',
  'dddddddd-0000-0000-0000-000000000011',
  'bbbbbbbb-0000-0000-0000-000000000007',
  'multiple_choice_conceptual',
  'Given a grid of 1s and 0s, what''s the best approach to count the number of islands (connected groups of 1s)?',
  '{"options": [{"id": "a", "text": "Sort the grid cells and count transitions"}, {"id": "b", "text": "DFS or BFS from each unvisited land cell, marking visited cells"}, {"id": "c", "text": "Use a hash map to group adjacent cells"}, {"id": "d", "text": "Binary search each row for 1s"}], "correct_option_id": "b"}',
  'For each unvisited "1" cell, launch a DFS/BFS that marks all connected "1" cells as visited. Each launch = one island. Total time is O(m × n) — every cell is visited at most once. This is the standard connected-components pattern.',
  'swe_2', 10, 5
) ON CONFLICT (id) DO NOTHING;

-- Q44 · Graph · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000044',
  'dddddddd-0000-0000-0000-000000000011',
  'bbbbbbbb-0000-0000-0000-000000000016',
  'multiple_choice_conceptual',
  'How do you detect a cycle in a directed graph?',
  '{"options": [{"id": "a", "text": "Check if any node has more than one incoming edge"}, {"id": "b", "text": "DFS with a \"currently in recursion stack\" visited set"}, {"id": "c", "text": "Count total edges — if edges ≥ nodes, there''s a cycle"}, {"id": "d", "text": "BFS and check if any node is revisited"}], "correct_option_id": "b"}',
  'DFS with two sets — globally visited and currently-in-stack — detects directed cycles. If DFS reaches a node already in the current recursion stack, you''ve found a back edge (cycle). A node can be visited globally without forming a cycle if it was already fully explored in another path.',
  'swe_2', 10, 6
) ON CONFLICT (id) DO NOTHING;

-- Q50 · Graph · swe_3
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000050',
  'dddddddd-0000-0000-0000-000000000011',
  'bbbbbbbb-0000-0000-0000-000000000016',
  'multiple_choice_conceptual',
  'Which algorithm finds the shortest path in a graph with negative edge weights (no negative cycles)?',
  '{"options": [{"id": "a", "text": "Dijkstra''s"}, {"id": "b", "text": "BFS"}, {"id": "c", "text": "Bellman-Ford"}, {"id": "d", "text": "DFS"}], "correct_option_id": "c"}',
  'Bellman-Ford relaxes all edges V-1 times, which is enough to propagate shortest paths in any acyclic path. Unlike Dijkstra''s, it handles negative weights correctly. It also detects negative cycles if any edge can still be relaxed after V-1 passes.',
  'swe_3', 15, 7
) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 15. Questions — Dynamic Programming (lesson dddddddd-...-0012)
-- ================================================================

-- Q12 · Dynamic Programming · swe_3
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000012',
  'dddddddd-0000-0000-0000-000000000012',
  'bbbbbbbb-0000-0000-0000-000000000009',
  'multiple_choice_conceptual',
  'What is the key characteristic that makes a problem suitable for dynamic programming?',
  '{"options": [{"id": "a", "text": "It can be solved greedily"}, {"id": "b", "text": "It has overlapping subproblems and optimal substructure"}, {"id": "c", "text": "It requires sorting the input first"}, {"id": "d", "text": "It can only be solved recursively"}], "correct_option_id": "b"}',
  'Overlapping subproblems means the same sub-computations recur (e.g. fib(3) called many times in naive Fibonacci). Optimal substructure means the optimal solution is built from optimal sub-solutions. Without both, DP won''t help.',
  'swe_3', 15, 1
) ON CONFLICT (id) DO NOTHING;

-- Q16 · Dynamic Programming · swe_3
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000016',
  'dddddddd-0000-0000-0000-000000000012',
  'bbbbbbbb-0000-0000-0000-000000000009',
  'multiple_choice_conceptual',
  'Which technique avoids recomputing subproblems by storing their results?',
  '{"options": [{"id": "a", "text": "Recursion"}, {"id": "b", "text": "Memoization"}, {"id": "c", "text": "Greedy"}, {"id": "d", "text": "Backtracking"}], "correct_option_id": "b"}',
  'Memoization caches the result of each subproblem on first computation and returns the cached value on repeat calls. It turns exponential recursion (like naive Fibonacci''s O(2ⁿ)) into O(n) by eliminating redundant work.',
  'swe_3', 15, 2
) ON CONFLICT (id) DO NOTHING;

-- Q19 · Dynamic Programming · swe_3
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000019',
  'dddddddd-0000-0000-0000-000000000012',
  'bbbbbbbb-0000-0000-0000-000000000009',
  'multiple_choice_conceptual',
  'What is the time complexity of the classic 0/1 knapsack dynamic programming solution?',
  '{"options": [{"id": "a", "text": "O(n)"}, {"id": "b", "text": "O(n log n)"}, {"id": "c", "text": "O(n²)"}, {"id": "d", "text": "O(n × W) where W is the capacity"}], "correct_option_id": "d"}',
  'The DP table has n rows (items) and W columns (capacity values). Filling each cell is O(1), so total work is O(n × W). This is pseudo-polynomial — fast when W is small, but slow if W is very large.',
  'swe_3', 15, 3
) ON CONFLICT (id) DO NOTHING;

-- Q43 · Dynamic Programming · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000043',
  'dddddddd-0000-0000-0000-000000000012',
  'bbbbbbbb-0000-0000-0000-000000000009',
  'multiple_choice_conceptual',
  'What is the time complexity of computing Fibonacci(n) with memoization?',
  '{"options": [{"id": "a", "text": "O(2ⁿ)"}, {"id": "b", "text": "O(n log n)"}, {"id": "c", "text": "O(n)"}, {"id": "d", "text": "O(log n)"}], "correct_option_id": "c"}',
  'With memoization, each Fibonacci value from 0 to n is computed exactly once and cached. Every subsequent call hits the cache in O(1). So you do n computations total — O(n) time and O(n) space for the cache.',
  'swe_2', 10, 4
) ON CONFLICT (id) DO NOTHING;

-- Q47 · Dynamic Programming · swe_3
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000047',
  'dddddddd-0000-0000-0000-000000000012',
  'bbbbbbbb-0000-0000-0000-000000000009',
  'multiple_choice_conceptual',
  'Which approach solves the "word break" problem — can a string be segmented into dictionary words?',
  '{"options": [{"id": "a", "text": "Greedy — always match the longest word first"}, {"id": "b", "text": "BFS from start to end of string"}, {"id": "c", "text": "DP — for each index, check if any valid word ends there"}, {"id": "d", "text": "Sort the dictionary and binary search for prefixes"}], "correct_option_id": "c"}',
  'Define dp[i] = true if s[0..i] can be segmented. For each index i, check all j < i where dp[j] is true and s[j..i] is in the dictionary. Greedy fails because a longer match early can block a valid segmentation later. DP explores all possibilities efficiently.',
  'swe_3', 15, 5
) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 16. Questions — Binary Search Patterns (lesson dddddddd-...-0013)
-- ================================================================

-- Q15 · Binary Search · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000015',
  'dddddddd-0000-0000-0000-000000000013',
  'bbbbbbbb-0000-0000-0000-000000000006',
  'multiple_choice_conceptual',
  'Binary search requires the input array to be:',
  '{"options": [{"id": "a", "text": "Unsorted"}, {"id": "b", "text": "Sorted"}, {"id": "c", "text": "Filled with unique values"}, {"id": "d", "text": "Stored in a hash map"}], "correct_option_id": "b"}',
  'Binary search works by comparing the target to the midpoint and eliminating the half that can''t contain it. This logic only holds if elements are ordered — on an unsorted array, eliminating a half is invalid and will produce wrong results.',
  'swe_2', 10, 1
) ON CONFLICT (id) DO NOTHING;

-- Q42 · Binary Search · swe_2
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000042',
  'dddddddd-0000-0000-0000-000000000013',
  'bbbbbbbb-0000-0000-0000-000000000006',
  'multiple_choice_conceptual',
  'A sorted array is rotated at an unknown pivot. How do you find a target value efficiently?',
  '{"options": [{"id": "a", "text": "Linear scan the whole array"}, {"id": "b", "text": "Modified binary search checking which half is sorted"}, {"id": "c", "text": "Sort it again, then binary search"}, {"id": "d", "text": "Use a hash map for O(1) lookup"}], "correct_option_id": "b"}',
  'At each midpoint, one half must be cleanly sorted. Check if the target falls in the sorted half — if yes, search there; otherwise search the other half. This keeps O(log n) time by always eliminating half the array each step.',
  'swe_2', 10, 2
) ON CONFLICT (id) DO NOTHING;

-- Q53 · Binary Search · swe_3
INSERT INTO questions (id, lesson_id, topic_id, type, prompt, metadata, explanation, swe_level, xp_reward, display_order)
VALUES (
  'ffffffff-0000-0000-0000-000000000053',
  'dddddddd-0000-0000-0000-000000000013',
  'bbbbbbbb-0000-0000-0000-000000000006',
  'multiple_choice_conceptual',
  'You need to find the minimum capacity to ship packages within D days. What technique applies?',
  '{"options": [{"id": "a", "text": "Greedy — always ship as many packages as possible each day"}, {"id": "b", "text": "Binary search on the answer (search the capacity space)"}, {"id": "c", "text": "DP — build up optimal day-by-day assignments"}, {"id": "d", "text": "BFS across possible day splits"}], "correct_option_id": "b"}',
  'The answer (capacity) lies in a range [max_weight, total_weight]. Binary search this range: for each candidate capacity, simulate the days needed in O(n). If feasible in ≤ D days, try lower; otherwise try higher. This "binary search on answer" pattern applies to many optimization problems.',
  'swe_3', 15, 3
) ON CONFLICT (id) DO NOTHING;
