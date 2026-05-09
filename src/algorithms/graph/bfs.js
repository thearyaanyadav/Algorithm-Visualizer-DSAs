/* ============================================================
   BFS — Graph Breadth-First Search Generator
   ============================================================ */

/**
 * @param {{ adjacencyList: Map<string, string[]>, startNode: string }} data
 * @yields {{ type: string, node: string, codeLine: number }}
 */
export function* bfsGraph({ adjacencyList, startNode }) {
    const visited = new Set();
    const queue = [startNode];
    visited.add(startNode);

    yield { type: 'visit', node: startNode, codeLine: 2 };

    while (queue.length > 0) {
        const node = queue.shift();
        yield { type: 'process', node, codeLine: 4 };

        const neighbors = adjacencyList.get(node) || [];
        for (const neighbor of neighbors) {
            yield { type: 'check-edge', from: node, to: neighbor, codeLine: 5 };

            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
                yield { type: 'visit', node: neighbor, codeLine: 7 };
            }
        }
    }

    yield { type: 'done' };
}
