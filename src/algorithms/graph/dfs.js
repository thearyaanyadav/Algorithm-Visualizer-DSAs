/* ============================================================
   DFS — Graph Depth-First Search Generator
   ============================================================ */

/**
 * @param {{ adjacencyList: Map<string, string[]>, startNode: string }} data
 * @yields {{ type: string, node: string, codeLine: number }}
 */
export function* dfsGraph({ adjacencyList, startNode }) {
    const visited = new Set();
    const stack = [startNode];

    while (stack.length > 0) {
        const node = stack.pop();

        if (visited.has(node)) continue;

        visited.add(node);
        yield { type: 'visit', node, codeLine: 5 };

        const neighbors = adjacencyList.get(node) || [];
        // Reverse to maintain left-to-right order
        for (let i = neighbors.length - 1; i >= 0; i--) {
            const neighbor = neighbors[i];
            yield { type: 'check-edge', from: node, to: neighbor, codeLine: 7 };

            if (!visited.has(neighbor)) {
                stack.push(neighbor);
                yield { type: 'frontier', node: neighbor, codeLine: 8 };
            }
        }
    }

    yield { type: 'done' };
}
