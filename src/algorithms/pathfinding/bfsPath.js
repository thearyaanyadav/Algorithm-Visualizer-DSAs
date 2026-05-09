/* ============================================================
   BFS PATHFINDING — Generator
   
   Breadth-first search on a 2D grid. Guaranteed shortest
   unweighted path.
   ============================================================ */

/**
 * @param {{ grid: number[][], start: [number, number], end: [number, number] }} data
 * @yields {{ type: string, row: number, col: number, codeLine: number }}
 */
export function* bfsPath({ grid, start, end }) {
    const rows = grid.length;
    const cols = grid[0].length;
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;

    const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
    const parent = Array.from({ length: rows }, () => new Array(cols).fill(null));

    const queue = [{ row: startRow, col: startCol }];
    visited[startRow][startCol] = true;

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    while (queue.length > 0) {
        const { row, col } = queue.shift();

        yield { type: 'visit', row, col, codeLine: 5 };

        // Found the end — reconstruct path
        if (row === endRow && col === endCol) {
            let cr = row;
            let cc = col;
            while (parent[cr][cc] !== null) {
                yield { type: 'path', row: cr, col: cc, codeLine: 6 };
                const prev = parent[cr][cc];
                cr = prev[0];
                cc = prev[1];
            }
            yield { type: 'path', row: startRow, col: startCol, codeLine: 6 };
            yield { type: 'done', found: true };
            return;
        }

        for (const [dr, dc] of directions) {
            const nr = row + dr;
            const nc = col + dc;

            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (grid[nr][nc] === 1) continue;
            if (visited[nr][nc]) continue;

            visited[nr][nc] = true;
            parent[nr][nc] = [row, col];
            queue.push({ row: nr, col: nc });
            yield { type: 'frontier', row: nr, col: nc, codeLine: 10 };
        }
    }

    yield { type: 'done', found: false };
}
