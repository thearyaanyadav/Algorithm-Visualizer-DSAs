/* ============================================================
   ALGO INFO — Central metadata store
   
   Contains name, descriptions (simple + formal), complexity,
   pseudocode, and tags for every supported algorithm.
   ============================================================ */

export const categories = [
    {
        id: 'sorting',
        name: 'Sorting',
        icon: '⇅',
        algorithms: [
            'bubble-sort', 'selection-sort', 'insertion-sort',
            'merge-sort', 'quick-sort', 'heap-sort',
        ],
    },
    {
        id: 'searching',
        name: 'Searching',
        icon: '⌕',
        algorithms: ['linear-search', 'binary-search'],
    },
    {
        id: 'graph',
        name: 'Graph',
        icon: '◉',
        algorithms: ['bfs-graph', 'dfs-graph', 'dijkstra'],
    },
    {
        id: 'pathfinding',
        name: 'Pathfinding',
        icon: '⬡',
        algorithms: ['a-star', 'bfs-path'],
    },
    {
        id: 'data-structures',
        name: 'Data Structures',
        icon: '☰',
        algorithms: ['stack', 'queue', 'bst', 'linked-list'],
    },
];

export const algorithms = {
    // ============ SORTING ============

    'bubble-sort': {
        name: 'Bubble Sort',
        category: 'sorting',
        simpleExplanation:
            'Imagine you have a row of numbered cards and you want to put them in order. You start at the beginning and compare the first two cards — if the left one is bigger, you swap them. Then you move one step right and compare the next two. You keep doing this all the way to the end of the row. After one full pass, the largest card has "bubbled up" to the very end, like a bubble rising in water. You repeat this process over and over, and each time through, one more card lands in its correct spot. Eventually, everything is sorted. It\'s simple to understand, but slow for big lists because you have to keep scanning through the whole thing.',
        formalDefinition:
            'Bubble Sort is an in-place, stable comparison sort that operates by repeatedly traversing the array, comparing adjacent elements, and swapping them if they are in the wrong order. Each complete pass guarantees that the next largest unsorted element is placed in its correct final position. The algorithm terminates early if a pass completes with no swaps, indicating the array is already sorted. It has O(n²) average and worst-case time complexity and O(1) auxiliary space.',
        timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
        spaceComplexity: 'O(1)',
        stable: true,
        inPlace: true,
        pseudocode: [
            'for i = 0 to n - 1',
            '  for j = 0 to n - i - 2',
            '    if arr[j] > arr[j + 1]',
            '      swap(arr[j], arr[j + 1])',
        ],
    },

    'selection-sort': {
        name: 'Selection Sort',
        category: 'sorting',
        simpleExplanation:
            'Think of it this way: you look through your entire list and find the absolute smallest item. You take it and put it first. Then you look through everything that\'s left, find the next smallest, and put it second. You keep repeating — each time scanning the remaining unsorted portion to find the minimum and placing it at the next position. It\'s straightforward and always does the same amount of work no matter what the input looks like, which makes it predictable but not very fast for large lists.',
        formalDefinition:
            'Selection Sort is an in-place comparison sort that divides the input array into a sorted prefix and an unsorted suffix. On each iteration, it scans the unsorted region to locate the element with the minimum value, then swaps it with the leftmost unsorted element, extending the sorted region by one. It performs exactly n−1 swaps in all cases. Time complexity is O(n²) for best, average, and worst cases. It is not stable because the swap can change the relative order of equal elements.',
        timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
        spaceComplexity: 'O(1)',
        stable: false,
        inPlace: true,
        pseudocode: [
            'for i = 0 to n - 1',
            '  minIdx = i',
            '  for j = i + 1 to n',
            '    if arr[j] < arr[minIdx]',
            '      minIdx = j',
            '  swap(arr[i], arr[minIdx])',
        ],
    },

    'insertion-sort': {
        name: 'Insertion Sort',
        category: 'sorting',
        simpleExplanation:
            'Picture how you sort playing cards in your hand. You pick up one card at a time and slide it into the right spot among the cards you\'re already holding. That\'s Insertion Sort. You go through the array from left to right. For each new element, you compare it against everything to its left and shift bigger elements over to make room, then drop it into the correct position. It\'s fast for small lists or lists that are almost sorted, and it doesn\'t need any extra memory. It\'s one of the most natural sorting methods.',
        formalDefinition:
            'Insertion Sort is a stable, in-place comparison sort that builds the final sorted array incrementally. It iterates from index 1 to n−1, and for each element (the "key"), shifts all preceding elements that are greater than the key one position to the right, then inserts the key into the vacated position. Best-case time is O(n) when the input is already sorted. Average and worst-case time complexity is O(n²). It is adaptive — performance improves with partially sorted input.',
        timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
        spaceComplexity: 'O(1)',
        stable: true,
        inPlace: true,
        pseudocode: [
            'for i = 1 to n',
            '  key = arr[i]',
            '  j = i - 1',
            '  while j >= 0 and arr[j] > key',
            '    arr[j + 1] = arr[j]',
            '    j = j - 1',
            '  arr[j + 1] = key',
        ],
    },

    'merge-sort': {
        name: 'Merge Sort',
        category: 'sorting',
        simpleExplanation:
            'The idea is "divide and conquer." You split your list in half, sort each half separately, and then merge them back together. Splitting a list in half is easy. Merging two already-sorted halves is also easy — you just keep picking the smaller of the two front elements. The trick is that you keep splitting until each piece is just one element (which is always sorted by itself), and then you merge your way back up. It\'s reliably fast and always takes the same amount of time, but it needs extra memory to hold the temporary halves while merging.',
        formalDefinition:
            'Merge Sort is a stable, divide-and-conquer comparison sort. It recursively splits the array into two halves until each subarray contains a single element, then merges adjacent subarrays in sorted order using a temporary buffer. The merge operation takes O(n) time, and the recursion depth is O(log n), yielding O(n log n) time complexity in all cases (best, average, worst). It requires O(n) auxiliary space for the merge buffer. It is not in-place but guarantees stability.',
        timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
        spaceComplexity: 'O(n)',
        stable: true,
        inPlace: false,
        pseudocode: [
            'mergeSort(arr, left, right)',
            '  if left < right',
            '    mid = (left + right) / 2',
            '    mergeSort(arr, left, mid)',
            '    mergeSort(arr, mid + 1, right)',
            '    merge(arr, left, mid, right)',
        ],
    },

    'quick-sort': {
        name: 'Quick Sort',
        category: 'sorting',
        simpleExplanation:
            'You pick one element as a "pivot" (here we use the last element). Then you rearrange the array so that everything smaller than the pivot goes to the left and everything larger goes to the right. The pivot is now in its final correct position. Then you repeat the same process on the left portion and the right portion, independently. Each time you do this, at least one more element lands in its correct spot. On average it\'s extremely fast — faster than Merge Sort in practice because of low overhead — but in rare worst cases (like an already sorted list with a bad pivot choice) it can slow down.',
        formalDefinition:
            'Quick Sort is an in-place, unstable, divide-and-conquer comparison sort. It selects a pivot element and partitions the array such that all elements less than or equal to the pivot precede it, and all elements greater follow it (Lomuto partition scheme). It then recursively sorts the two partitions. Average-case time complexity is O(n log n) with O(log n) stack space. Worst-case is O(n²) when the pivot consistently produces maximally unbalanced partitions. Randomized pivot selection or median-of-three mitigates this.',
        timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
        spaceComplexity: 'O(log n)',
        stable: false,
        inPlace: true,
        pseudocode: [
            'quickSort(arr, low, high)',
            '  if low < high',
            '    pivotIdx = partition(arr, low, high)',
            '    quickSort(arr, low, pivotIdx - 1)',
            '    quickSort(arr, pivotIdx + 1, high)',
            '',
            'partition(arr, low, high)',
            '  pivot = arr[high]',
            '  i = low - 1',
            '  for j = low to high - 1',
            '    if arr[j] <= pivot',
            '      i++; swap(arr[i], arr[j])',
            '  swap(arr[i + 1], arr[high])',
            '  return i + 1',
        ],
    },

    'heap-sort': {
        name: 'Heap Sort',
        category: 'sorting',
        simpleExplanation:
            'First, you rearrange the array into a "max-heap" — a special structure where every parent is bigger than its children, so the largest element is always at the top. Then you take that top element (the max), swap it with the last element in the array, and shrink the heap by one. Now the last position has the correct value. You fix the heap again (called "heapifying"), grab the next max, put it in its spot, and repeat. Each time you extract the maximum, the sorted portion at the end grows. It\'s always O(n log n) and doesn\'t need extra memory, but it\'s not stable.',
        formalDefinition:
            'Heap Sort is an in-place, unstable comparison sort that leverages the binary max-heap data structure. Phase one builds a max-heap from the array in O(n) time using bottom-up heapification. Phase two repeatedly extracts the maximum element (root of the heap), swaps it with the last unsorted element, reduces the heap size by one, and restores the heap invariant via sift-down in O(log n) time. Overall time complexity is O(n log n) in all cases. Space complexity is O(1) since the heap is built within the input array itself.',
        timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
        spaceComplexity: 'O(1)',
        stable: false,
        inPlace: true,
        pseudocode: [
            'heapSort(arr)',
            '  buildMaxHeap(arr)',
            '  for i = n - 1 downto 1',
            '    swap(arr[0], arr[i])',
            '    heapify(arr, 0, i)',
            '',
            'heapify(arr, i, n)',
            '  largest = i',
            '  left = 2i + 1, right = 2i + 2',
            '  if left < n and arr[left] > arr[largest]',
            '    largest = left',
            '  if right < n and arr[right] > arr[largest]',
            '    largest = right',
            '  if largest ≠ i',
            '    swap(arr[i], arr[largest])',
            '    heapify(arr, largest, n)',
        ],
    },

    // ============ SEARCHING ============

    'linear-search': {
        name: 'Linear Search',
        category: 'searching',
        simpleExplanation:
            'This is the most basic way to find something. You start at the beginning of the list and check each element one by one: "Is this the one I\'m looking for?" If it matches, you\'re done. If not, move to the next one. If you reach the end without finding it, the item isn\'t in the list. It works on any list — sorted or not — but it can be slow for very large lists because in the worst case you have to check every single element.',
        formalDefinition:
            'Linear Search (Sequential Search) is a search algorithm that iterates through each element of a collection sequentially, comparing each element with the target value. It returns the index of the first matching element or indicates that the element is not present. Time complexity is O(1) best case (target is the first element), O(n) average and worst case. It requires O(1) auxiliary space. It makes no assumptions about the ordering of the input and works on any iterable data structure.',
        timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
        spaceComplexity: 'O(1)',
        stable: true,
        inPlace: true,
        pseudocode: [
            'linearSearch(arr, target)',
            '  for i = 0 to n - 1',
            '    if arr[i] == target',
            '      return i',
            '  return -1',
        ],
    },

    'binary-search': {
        name: 'Binary Search',
        category: 'searching',
        simpleExplanation:
            'Binary Search only works on a sorted list, but it\'s dramatically faster than Linear Search. Here\'s the idea: look at the middle element. If it\'s the one you want, done. If the target is smaller, you know it has to be in the left half — so ignore the entire right half. If the target is larger, ignore the left half. Now repeat on the remaining half. Each step throws away half the remaining elements, so even for a million items, you need at most about 20 checks. That\'s the power of cutting things in half repeatedly.',
        formalDefinition:
            'Binary Search is a search algorithm for sorted arrays that operates by repeatedly bisecting the search interval. It compares the target value with the middle element of the current interval: if they match, the search succeeds; if the target is less, it recurses on the left subinterval; if greater, on the right. This halving yields O(log n) time complexity for average and worst cases, with O(1) best case when the target is at the midpoint. It requires O(1) auxiliary space for the iterative implementation. The input must be sorted for correctness.',
        timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
        spaceComplexity: 'O(1)',
        stable: true,
        inPlace: true,
        pseudocode: [
            'binarySearch(arr, target)',
            '  low = 0, high = n - 1',
            '  while low <= high',
            '    mid = (low + high) / 2',
            '    if arr[mid] == target',
            '      return mid',
            '    else if arr[mid] < target',
            '      low = mid + 1',
            '    else',
            '      high = mid - 1',
            '  return -1',
        ],
    },

    // ============ GRAPH ============

    'bfs-graph': {
        name: 'Breadth-First Search',
        category: 'graph',
        simpleExplanation:
            'Imagine you\'re standing at one spot in a network and you want to explore outward. BFS explores layer by layer — first you visit all the places that are exactly 1 step away. Then all the places 2 steps away. Then 3 steps away. And so on. You use a queue (a "first come, first served" line) to keep track of which place to visit next. This guarantees that you discover things in order of their distance from the start, which is why BFS naturally finds the shortest path in a graph where all edges have equal weight.',
        formalDefinition:
            'Breadth-First Search is a graph traversal algorithm that explores vertices level by level from a source vertex. It maintains a FIFO queue of frontier vertices and a set of visited vertices. At each step, it dequeues the front vertex, processes it, and enqueues all unvisited neighbors. This ensures vertices are discovered in non-decreasing order of their distance from the source. Time complexity is O(V + E) where V is the number of vertices and E is the number of edges. Space complexity is O(V) for the queue and visited set. It finds shortest paths in unweighted graphs.',
        timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
        spaceComplexity: 'O(V)',
        stable: true,
        inPlace: false,
        pseudocode: [
            'BFS(graph, start)',
            '  queue = [start]',
            '  visited = {start}',
            '  while queue is not empty',
            '    node = queue.dequeue()',
            '    for each neighbor of node',
            '      if neighbor not in visited',
            '        visited.add(neighbor)',
            '        queue.enqueue(neighbor)',
        ],
    },

    'dfs-graph': {
        name: 'Depth-First Search',
        category: 'graph',
        simpleExplanation:
            'Instead of exploring layer by layer like BFS, DFS goes as deep as it can along one path before backtracking. Think of exploring a maze: you pick a direction, keep walking until you hit a dead end, then backtrack to the last fork and try a different path. You use a stack (or recursion) to remember where to backtrack to. DFS is great for tasks like detecting cycles, topological sorting, and solving puzzles. It doesn\'t guarantee the shortest path, but it\'s simple to implement and uses less memory than BFS on deep graphs.',
        formalDefinition:
            'Depth-First Search is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses a LIFO stack (explicit or via the call stack in recursive implementations) to track the current path. Starting from a source vertex, it visits an unvisited neighbor, pushes it onto the stack, and recurses. When no unvisited neighbors remain, it backtracks. Time complexity is O(V + E). Space complexity is O(V) for the stack and visited set (O(V) stack frames in the worst case for recursive implementation). Applications include topological sort, cycle detection, connected components, and solving constraint satisfaction problems.',
        timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
        spaceComplexity: 'O(V)',
        stable: true,
        inPlace: false,
        pseudocode: [
            'DFS(graph, start)',
            '  stack = [start]',
            '  visited = {}',
            '  while stack is not empty',
            '    node = stack.pop()',
            '    if node not in visited',
            '      visited.add(node)',
            '      for each neighbor of node',
            '        stack.push(neighbor)',
        ],
    },

    'dijkstra': {
        name: "Dijkstra's Algorithm",
        category: 'graph',
        simpleExplanation:
            'Dijkstra\'s finds the shortest path from one starting point to every other point in a weighted graph (where edges have different costs/distances). It works by always expanding the closest unvisited node first. You keep a running table of "best known distance from start" for every node. When you visit a node, you check all its neighbors — if going through this node gives a shorter path to a neighbor than what was known before, you update the distance. By always picking the cheapest unvisited node next, you guarantee that once you visit a node, you\'ve found the shortest path to it. It does not work with negative edge weights.',
        formalDefinition:
            'Dijkstra\'s Algorithm is a single-source shortest-path algorithm for weighted graphs with non-negative edge weights. It maintains a set of finalized vertices and a priority queue (min-heap) of tentative distances. At each step, the vertex with the minimum tentative distance is extracted, finalized, and its outgoing edges are relaxed — updating the tentative distances of neighboring vertices if a shorter path is found. Time complexity is O((V + E) log V) with a binary heap, or O(V² + E) with a simple array. Space complexity is O(V). Correctness relies on the greedy property that the minimum tentative distance is always the true shortest distance (which fails for negative weights).',
        timeComplexity: { best: 'O(V + E log V)', average: 'O(V + E log V)', worst: 'O(V²)' },
        spaceComplexity: 'O(V)',
        stable: true,
        inPlace: false,
        pseudocode: [
            "Dijkstra(graph, source)",
            '  dist[source] = 0, all others = ∞',
            '  pq = [(0, source)]',
            '  while pq is not empty',
            '    (d, u) = pq.extractMin()',
            '    for each neighbor v of u',
            '      if dist[u] + w(u,v) < dist[v]',
            '        dist[v] = dist[u] + w(u,v)',
            '        pq.insert((dist[v], v))',
        ],
    },

    // ============ PATHFINDING ============

    'a-star': {
        name: 'A* Pathfinding',
        category: 'pathfinding',
        simpleExplanation:
            'A* is like a smarter version of Dijkstra\'s. Instead of blindly expanding the closest node, A* uses a "heuristic" — an educated guess of how far each node is from the goal (here we use Manhattan distance: how many horizontal + vertical steps). Each node gets a score: f = g + h, where g is the actual distance traveled so far and h is the estimated distance to the goal. A* always expands the node with the lowest f score. This means it focuses its search toward the goal instead of expanding in all directions equally. It\'s guaranteed to find the shortest path as long as the heuristic never overestimates.',
        formalDefinition:
            'A* is an informed best-first search algorithm that finds the least-cost path from a start node to a goal node. It evaluates nodes using f(n) = g(n) + h(n), where g(n) is the exact cost from start to n, and h(n) is an admissible heuristic estimating the cost from n to the goal. Admissibility (h never overestimates) guarantees optimality. A* maintains an open set (priority queue ordered by f) and a closed set. It expands the node with minimum f, relaxes edges, and terminates when the goal is expanded. With a consistent heuristic, no node is expanded more than once. Time and space complexity are O(b^d) in the worst case, where b is the branching factor and d is the depth, but the heuristic typically prunes the search space significantly compared to uninformed algorithms.',
        timeComplexity: { best: 'O(E)', average: 'O(E log V)', worst: 'O(E log V)' },
        spaceComplexity: 'O(V)',
        stable: true,
        inPlace: false,
        pseudocode: [
            'A*(grid, start, end)',
            '  openSet = {start}',
            '  gScore[start] = 0',
            '  fScore[start] = heuristic(start, end)',
            '  while openSet is not empty',
            '    current = node with min fScore',
            '    if current == end: reconstruct path',
            '    for each neighbor of current',
            '      tentative_g = gScore[current] + 1',
            '      if tentative_g < gScore[neighbor]',
            '        gScore[neighbor] = tentative_g',
            '        fScore[neighbor] = g + h(neighbor, end)',
            '        openSet.add(neighbor)',
        ],
    },

    'bfs-path': {
        name: 'BFS Pathfinding',
        category: 'pathfinding',
        simpleExplanation:
            'BFS Pathfinding applies Breadth-First Search to a grid to find the shortest route between two points, treating every step (up, down, left, right) as having equal cost. It starts from the start cell and fans out in all directions evenly — visiting all cells 1 step away, then 2, then 3, and so on. It\'s guaranteed to find the shortest path because it visits every cell at distance d before any cell at distance d+1. However, unlike A*, it\'s "blind" — it has no sense of direction toward the goal, so it explores a lot of unnecessary cells. You can see this in the visualization: it fills out in all directions, not just toward the end.',
        formalDefinition:
            'BFS Pathfinding is an application of Breadth-First Search to grid-based or graph-based pathfinding problems. It treats the grid as an unweighted graph where each cell is a vertex and edges connect orthogonally adjacent non-wall cells. Using a FIFO queue, it explores cells in order of their distance from the source, recording each cell\'s parent to enable path reconstruction. Upon reaching the target cell, the path is traced back through the parent pointers. It guarantees the shortest path in terms of number of steps. Time and space complexity are O(V + E), where V is the number of cells and E is the number of adjacencies. It is an uninformed algorithm — it does not use a heuristic.',
        timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
        spaceComplexity: 'O(V)',
        stable: true,
        inPlace: false,
        pseudocode: [
            'BFS_Path(grid, start, end)',
            '  queue = [start]',
            '  visited = {start}',
            '  parent = {}',
            '  while queue is not empty',
            '    cell = queue.dequeue()',
            '    if cell == end: reconstruct path',
            '    for each neighbor of cell',
            '      if neighbor is valid and not visited',
            '        visited.add(neighbor)',
            '        parent[neighbor] = cell',
            '        queue.enqueue(neighbor)',
        ],
    },

    // ============ DATA STRUCTURES ============

    'stack': {
        name: 'Stack',
        category: 'data-structures',
        simpleExplanation:
            'A Stack works exactly like a stack of plates in a cafeteria. You can only put a new plate on top (push), and you can only take a plate off the top (pop). You can\'t grab one from the middle. This means the last thing you added is always the first thing that comes out — that\'s called LIFO: Last In, First Out. Stacks are used everywhere: your browser\'s back button is a stack of pages, Ctrl+Z undo is a stack of actions, and function calls in any programming language use a call stack to track which function to return to.',
        formalDefinition:
            'A Stack is an abstract data type (ADT) that follows the Last-In-First-Out (LIFO) principle. It supports two primary operations: push (insert an element onto the top) and pop (remove and return the top element), both in O(1) time. Additional operations include peek/top (read the top element without removing it) and isEmpty. The stack can be implemented using a dynamic array (amortized O(1) push) or a linked list (O(1) push/pop). It is fundamental to expression evaluation, syntax parsing, DFS traversal, backtracking algorithms, and managing function call frames in program execution.',
        timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
        spaceComplexity: 'O(n)',
        stable: true,
        inPlace: true,
        pseudocode: [
            'push(element)',
            '  top++',
            '  stack[top] = element',
            '',
            'pop()',
            '  if top == -1: underflow',
            '  element = stack[top]',
            '  top--',
            '  return element',
        ],
    },

    'queue': {
        name: 'Queue',
        category: 'data-structures',
        simpleExplanation:
            'A Queue works like a line at a store. The first person who gets in line is the first person who gets served — that\'s FIFO: First In, First Out. New items join at the back (enqueue) and items leave from the front (dequeue). You can\'t skip the line. Queues are used for scheduling tasks (like a printer queue), handling requests in a web server, BFS traversal in graphs, and any situation where you need to process things in the order they arrived.',
        formalDefinition:
            'A Queue is an abstract data type (ADT) that follows the First-In-First-Out (FIFO) principle. It supports two primary operations: enqueue (insert an element at the rear) and dequeue (remove and return the front element), both in O(1) time. It can be implemented using a circular array (fixed capacity, O(1) operations) or a linked list (dynamic capacity, O(1) operations with head and tail pointers). Variants include the priority queue (elements dequeued by priority rather than arrival order), double-ended queue (deque, insertion/removal at both ends), and blocking queue (thread-safe for producer-consumer patterns).',
        timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
        spaceComplexity: 'O(n)',
        stable: true,
        inPlace: true,
        pseudocode: [
            'enqueue(element)',
            '  rear++',
            '  queue[rear] = element',
            '',
            'dequeue()',
            '  if front > rear: underflow',
            '  element = queue[front]',
            '  front++',
            '  return element',
        ],
    },

    'bst': {
        name: 'Binary Search Tree',
        category: 'data-structures',
        simpleExplanation:
            'A Binary Search Tree (BST) is a tree-shaped structure where each "node" holds a value and has up to two children: a left child and a right child. The rule is simple: everything in the left subtree is smaller than the node, and everything in the right subtree is larger. This makes finding a value fast — at each node, you just decide "go left" or "go right," cutting the possibilities roughly in half each time (similar to Binary Search). You can also insert and delete while maintaining this rule. However, if you insert already-sorted data, the tree becomes a lopsided chain and loses its speed advantage.',
        formalDefinition:
            'A Binary Search Tree is a rooted binary tree where each node stores a key (and optionally a value) satisfying the BST invariant: for every node N, all keys in the left subtree of N are less than N\'s key, and all keys in the right subtree are greater. Search, insertion, and deletion all operate in O(h) time, where h is the tree\'s height. For a balanced BST, h = O(log n), yielding O(log n) operations. In the worst case (degenerate/skewed tree), h = O(n). Self-balancing variants (AVL trees, Red-Black trees) guarantee O(log n) height. In-order traversal of a BST produces elements in sorted order.',
        timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
        spaceComplexity: 'O(n)',
        stable: true,
        inPlace: false,
        pseudocode: [
            'insert(node, value)',
            '  if node is null',
            '    return new Node(value)',
            '  if value < node.value',
            '    node.left = insert(node.left, value)',
            '  else',
            '    node.right = insert(node.right, value)',
            '  return node',
        ],
    },

    'linked-list': {
        name: 'Linked List',
        category: 'data-structures',
        simpleExplanation:
            'A Linked List is like a chain of boxes where each box holds some data and a pointer (arrow) to the next box. Unlike an array, the boxes don\'t have to be next to each other in memory — they\'re connected only through these pointers. This makes inserting or removing a box from the middle very fast (just redirect the arrows), but finding a specific box is slow because you have to follow the chain from the beginning. There\'s no way to jump directly to, say, the 50th element — you have to walk through all 49 before it. Arrays are the opposite: random access is fast, but inserting in the middle requires shifting everything.',
        formalDefinition:
            'A Linked List is a linear data structure consisting of a sequence of nodes, where each node contains a data field and a reference (pointer) to the next node. The first node is referenced by a head pointer. In a singly linked list, traversal is unidirectional; doubly linked lists add a previous pointer for bidirectional traversal. Insertion and deletion at a known position are O(1) (given a pointer to the node), but search is O(n) since elements cannot be indexed directly. Linked lists provide dynamic size (no pre-allocation) and efficient insertion/deletion compared to arrays, at the cost of O(n) random access and additional memory overhead for pointers.',
        timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
        spaceComplexity: 'O(n)',
        stable: true,
        inPlace: true,
        pseudocode: [
            'insertAt(position, value)',
            '  newNode = new Node(value)',
            '  if position == 0',
            '    newNode.next = head',
            '    head = newNode',
            '  else',
            '    current = head',
            '    for i = 0 to position - 2',
            '      current = current.next',
            '    newNode.next = current.next',
            '    current.next = newNode',
        ],
    },
};
