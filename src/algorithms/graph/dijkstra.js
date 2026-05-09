/* ============================================================
   DIJKSTRA'S ALGORITHM — Generator
   
   Finds shortest paths from a source node. Uses a simple
   priority queue (sorted array) for clarity.
   ============================================================ */

/**
 * @param {{ adjacencyList: Map<string, {node: string, weight: number}[]>, startNode: string }} data
 * @yields {{ type: string, node: string, codeLine: number, distances?: Object }}
 */
export function* dijkstra({ adjacencyList, startNode }) {
    const distances = {};
    const previous = {};
    const visited = new Set();

    // Initialize all distances to infinity
    for (const node of adjacencyList.keys()) {
        distances[node] = Infinity;
        previous[node] = null;
    }
    distances[startNode] = 0;

    // Simple priority queue using sorted array
    const pq = [{ node: startNode, dist: 0 }];

    yield { type: 'init', node: startNode, distances: { ...distances }, codeLine: 1 };

    while (pq.length > 0) {
        // Get node with minimum distance
        pq.sort((a, b) => a.dist - b.dist);
        const { node: current } = pq.shift();

        if (visited.has(current)) continue;
        visited.add(current);

        yield { type: 'visit', node: current, distances: { ...distances }, codeLine: 4 };

        const neighbors = adjacencyList.get(current) || [];
        for (const { node: neighbor, weight } of neighbors) {
            if (visited.has(neighbor)) continue;

            yield { type: 'check-edge', from: current, to: neighbor, weight, codeLine: 5 };

            const newDist = distances[current] + weight;
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                previous[neighbor] = current;
                pq.push({ node: neighbor, dist: newDist });
                yield { type: 'update', node: neighbor, distance: newDist, distances: { ...distances }, codeLine: 7 };
            }
        }
    }

    yield { type: 'done', distances, previous };
}
