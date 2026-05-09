/* ============================================================
   A* PATHFINDING — Generator
   
   A* search with Manhattan distance heuristic on a 2D grid.
   ============================================================ */

/**
 * @param {{ grid: number[][], start: [number, number], end: [number, number] }} data
 * @yields {{ type: string, row: number, col: number, codeLine: number }}
 */
export function* astar({ grid, start, end }) {
    const rows = grid.length;
    const cols = grid[0].length;
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;

    // Heuristic: Manhattan distance
    const heuristic = (r, c) => Math.abs(r - endRow) + Math.abs(c - endCol);

    // Track costs and parents
    const gScore = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
    const fScore = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
    const cameFrom = Array.from({ length: rows }, () => new Array(cols).fill(null));

    gScore[startRow][startCol] = 0;
    fScore[startRow][startCol] = heuristic(startRow, startCol);

    // Open set as a simple array (for readability over performance)
    const openSet = [{ row: startRow, col: startCol }];
    const closedSet = new Set();

    const key = (r, c) => `${r},${c}`;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    while (openSet.length > 0) {
        // Find node with lowest fScore
        openSet.sort((a, b) => fScore[a.row][a.col] - fScore[b.row][b.col]);
        const current = openSet.shift();
        const { row, col } = current;

        yield { type: 'visit', row, col, codeLine: 5 };

        // Reached the goal — reconstruct path
        if (row === endRow && col === endCol) {
            let cr = row;
            let cc = col;
            while (cameFrom[cr][cc] !== null) {
                yield { type: 'path', row: cr, col: cc, codeLine: 6 };
                const prev = cameFrom[cr][cc];
                cr = prev[0];
                cc = prev[1];
            }
            yield { type: 'path', row: startRow, col: startCol, codeLine: 6 };
            yield { type: 'done', found: true };
            return;
        }

        closedSet.add(key(row, col));

        for (const [dr, dc] of directions) {
            const nr = row + dr;
            const nc = col + dc;

            // Bounds check, wall check, closed check
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (grid[nr][nc] === 1) continue;
            if (closedSet.has(key(nr, nc))) continue;

            const tentativeG = gScore[row][col] + 1;

            if (tentativeG < gScore[nr][nc]) {
                cameFrom[nr][nc] = [row, col];
                gScore[nr][nc] = tentativeG;
                fScore[nr][nc] = tentativeG + heuristic(nr, nc);

                // Add to open set if not already there
                if (!openSet.some((n) => n.row === nr && n.col === nc)) {
                    openSet.push({ row: nr, col: nc });
                    yield { type: 'frontier', row: nr, col: nc, codeLine: 11 };
                }
            }
        }
    }

    yield { type: 'done', found: false };
}
