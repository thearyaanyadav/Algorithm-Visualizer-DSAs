/* ============================================================
   GRID VISUALIZER — Interactive pathfinding grid
   ============================================================ */

import { getState, resetStats } from '../core/state.js';
import { animator } from '../core/animator.js';
import { updateInfoPanel, updateCodePanel } from '../components/infoPanel.js';
import { astar } from '../algorithms/pathfinding/astar.js';
import { bfsPath } from '../algorithms/pathfinding/bfsPath.js';

const algoMap = { 'a-star': astar, 'bfs-path': bfsPath };
const ROWS = 25, COLS = 45;

let grid = [], startPos = [10, 5], endPos = [10, 39];
let container = null, cellElements = [];
let isMouseDown = false, drawMode = 'wall';

function createGrid() {
    grid = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
}

function renderGrid() {
    if (!container) return;
    container.innerHTML = '';

    const gridEl = document.createElement('div');
    gridEl.className = 'pathfinding-grid';
    gridEl.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
    gridEl.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;
    gridEl.style.width = '100%';
    gridEl.style.height = '100%';
    cellElements = [];

    for (let r = 0; r < ROWS; r++) {
        cellElements[r] = [];
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            if (r === startPos[0] && c === startPos[1]) cell.classList.add('start');
            else if (r === endPos[0] && c === endPos[1]) cell.classList.add('end');
            else if (grid[r][c] === 1) cell.classList.add('wall');
            gridEl.appendChild(cell);
            cellElements[r][c] = cell;
        }
    }
    container.appendChild(gridEl);

    const controls = document.createElement('div');
    controls.className = 'graph-controls';
    controls.innerHTML = `
    <button class="ds-btn secondary" id="grid-clear-walls">Clear Walls</button>
    <button class="ds-btn secondary" id="grid-clear-path">Clear Path</button>
    <button class="ds-btn secondary" id="grid-maze">Generate Maze</button>
    <span style="font-size:0.7rem;color:var(--text-tertiary);align-self:center">Click: walls · Drag green/red: move start/end</span>
  `;
    container.appendChild(controls);
    setupGridInteractions(gridEl);

    document.getElementById('grid-clear-walls')?.addEventListener('click', () => { animator.reset(); createGrid(); renderGrid(); });
    document.getElementById('grid-clear-path')?.addEventListener('click', () => { animator.reset(); clearPathCells(); });
    document.getElementById('grid-maze')?.addEventListener('click', () => { animator.reset(); generateMaze(); renderGrid(); });
}

function setupGridInteractions(gridEl) {
    gridEl.addEventListener('mousedown', (e) => {
        const cell = e.target; if (!cell.classList.contains('grid-cell')) return;
        isMouseDown = true;
        const r = +cell.dataset.row, c = +cell.dataset.col;
        if (r === startPos[0] && c === startPos[1]) drawMode = 'start';
        else if (r === endPos[0] && c === endPos[1]) drawMode = 'end';
        else { drawMode = 'wall'; toggleWall(r, c); }
    });
    gridEl.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        const cell = e.target; if (!cell.classList.contains('grid-cell')) return;
        const r = +cell.dataset.row, c = +cell.dataset.col;
        if (drawMode === 'start' && grid[r][c] !== 1 && !(r === endPos[0] && c === endPos[1])) {
            cellElements[startPos[0]][startPos[1]].classList.remove('start');
            startPos = [r, c]; cell.classList.add('start');
        } else if (drawMode === 'end' && grid[r][c] !== 1 && !(r === startPos[0] && c === startPos[1])) {
            cellElements[endPos[0]][endPos[1]].classList.remove('end');
            endPos = [r, c]; cell.classList.add('end');
        } else if (drawMode === 'wall') toggleWall(r, c);
    });
    document.addEventListener('mouseup', () => { isMouseDown = false; drawMode = 'wall'; });
}

function toggleWall(r, c) {
    if ((r === startPos[0] && c === startPos[1]) || (r === endPos[0] && c === endPos[1])) return;
    grid[r][c] = grid[r][c] === 1 ? 0 : 1;
    cellElements[r][c].classList.toggle('wall', grid[r][c] === 1);
    cellElements[r][c].classList.remove('visited', 'frontier', 'path');
}

function clearPathCells() {
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++)
        cellElements[r][c].classList.remove('visited', 'frontier', 'path');
}

function generateMaze() {
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) grid[r][c] = 1;
    const visited = Array.from({ length: ROWS }, () => new Array(COLS).fill(false));
    const stack = [[1, 1]]; grid[1][1] = 0; visited[1][1] = true;
    const dirs = [[0, 2], [2, 0], [0, -2], [-2, 0]];
    while (stack.length > 0) {
        const [cr, cc] = stack[stack.length - 1];
        const shuffled = dirs.slice().sort(() => Math.random() - 0.5);
        let moved = false;
        for (const [dr, dc] of shuffled) {
            const nr = cr + dr, nc = cc + dc;
            if (nr > 0 && nr < ROWS - 1 && nc > 0 && nc < COLS - 1 && !visited[nr][nc]) {
                visited[nr][nc] = true; grid[nr][nc] = 0; grid[cr + dr / 2][cc + dc / 2] = 0;
                stack.push([nr, nc]); moved = true; break;
            }
        }
        if (!moved) stack.pop();
    }
    grid[startPos[0]][startPos[1]] = 0; grid[endPos[0]][endPos[1]] = 0;
}

function handleFrame(frame) {
    if (frame.type === 'done') return;
    const { row, col, type } = frame;
    if (row === undefined || col === undefined || !cellElements[row]?.[col]) return;
    if ((row === startPos[0] && col === startPos[1]) || (row === endPos[0] && col === endPos[1])) return;
    if (type === 'visit') { cellElements[row][col].classList.add('visited'); cellElements[row][col].classList.remove('frontier'); }
    else if (type === 'frontier' && !cellElements[row][col].classList.contains('visited')) cellElements[row][col].classList.add('frontier');
    else if (type === 'path') { cellElements[row][col].classList.add('path'); cellElements[row][col].classList.remove('visited', 'frontier'); }
    if (frame.codeLine !== undefined) {
        document.querySelectorAll('#code-content .code-line').forEach((l, i) => l.classList.toggle('active', i === frame.codeLine));
    }
}

export function initGridVisualizer(algoId) {
    container = document.getElementById('vis-canvas');
    const algoFn = algoMap[algoId];
    if (!container || !algoFn) return;
    createGrid(); renderGrid(); resetStats();

    const loadAlgo = () => {
        clearPathCells(); resetStats();
        animator.load(algoFn, { grid: grid.map(r => [...r]), start: startPos, end: endPos }, handleFrame, () => { }, () => { clearPathCells(); loadAlgo(); });
    };
    loadAlgo();
    updateInfoPanel(algoId); updateCodePanel(algoId);
    return () => { };
}
