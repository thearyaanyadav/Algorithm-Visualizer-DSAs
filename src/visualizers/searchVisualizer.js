/* ============================================================
   SEARCH VISUALIZER
   
   Renders an array as indexed blocks for searching algorithms.
   Supports current, found, eliminated, and range markers.
   ============================================================ */

import { getState, setState, subscribe, resetStats } from '../core/state.js';
import { animator } from '../core/animator.js';
import { updateInfoPanel, updateCodePanel } from '../components/infoPanel.js';
import { linearSearch } from '../algorithms/searching/linearSearch.js';
import { binarySearch } from '../algorithms/searching/binarySearch.js';

const algoMap = {
    'linear-search': linearSearch,
    'binary-search': binarySearch,
};

let currentArray = [];
let blockElements = [];
let target = null;
let container = null;
let eliminatedIndices = new Set();

/**
 * Generate a sorted array of unique values.
 */
function generateSortedArray(size) {
    const arr = [];
    let val = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < size; i++) {
        arr.push(val);
        val += Math.floor(Math.random() * 5) + 1;
    }
    return arr;
}

/**
 * Pick a target — sometimes in the array, sometimes not.
 */
function pickTarget(arr) {
    // 80% chance of picking an existing element
    if (Math.random() < 0.8) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    return Math.floor(Math.random() * (arr[arr.length - 1] + 10));
}

function renderBlocks() {
    if (!container) return;

    container.innerHTML = '';
    eliminatedIndices.clear();

    // Target indicator
    const targetBar = document.createElement('div');
    targetBar.className = 'stats-bar';
    targetBar.style.position = 'absolute';
    targetBar.style.top = '12px';
    targetBar.style.left = '50%';
    targetBar.style.transform = 'translateX(-50%)';
    targetBar.style.background = 'var(--bg-secondary)';
    targetBar.style.border = '1px solid var(--border-primary)';
    targetBar.style.borderRadius = '8px';
    targetBar.style.padding = '6px 16px';
    targetBar.style.zIndex = '5';
    targetBar.innerHTML = `
    <div class="stat-item">
      <span class="stat-label">Searching for</span>
      <span class="stat-value" style="color: var(--accent); font-size: 0.9rem;">${target}</span>
    </div>
  `;
    container.appendChild(targetBar);

    const blocksContainer = document.createElement('div');
    blocksContainer.className = 'search-blocks-container';

    blockElements = currentArray.map((value, index) => {
        const block = document.createElement('div');
        block.className = 'search-block';
        block.innerHTML = `<div>${value}</div>`;
        block.setAttribute('data-index', index);
        blocksContainer.appendChild(block);
        return block;
    });

    container.appendChild(blocksContainer);
}

function handleFrame(frame) {
    if (frame.type === 'done') return;

    // Clear active states but keep eliminated
    blockElements.forEach((block, i) => {
        block.classList.remove('current', 'found', 'low-marker', 'high-marker', 'mid-marker');
        if (eliminatedIndices.has(i)) {
            block.classList.add('eliminated');
        }
    });

    switch (frame.type) {
        case 'current':
            setState('comparisons', getState('comparisons') + 1);
            frame.indices.forEach((i) => {
                if (blockElements[i]) blockElements[i].classList.add('current');
            });
            break;

        case 'found':
            frame.indices.forEach((i) => {
                if (blockElements[i]) {
                    blockElements[i].classList.remove('eliminated', 'current');
                    blockElements[i].classList.add('found');
                }
            });
            break;

        case 'eliminated':
            frame.indices.forEach((i) => {
                eliminatedIndices.add(i);
                if (blockElements[i]) blockElements[i].classList.add('eliminated');
            });
            break;

        case 'range':
            setState('comparisons', getState('comparisons') + 1);
            if (blockElements[frame.low]) blockElements[frame.low].classList.add('low-marker');
            if (blockElements[frame.high]) blockElements[frame.high].classList.add('high-marker');
            if (blockElements[frame.mid]) blockElements[frame.mid].classList.add('mid-marker');
            break;

        case 'eliminate':
            for (let i = frame.from; i <= frame.to; i++) {
                eliminatedIndices.add(i);
                if (blockElements[i]) blockElements[i].classList.add('eliminated');
            }
            break;
    }

    // Highlight pseudocode line
    if (frame.codeLine !== undefined) {
        const codeLines = document.querySelectorAll('#code-content .code-line');
        codeLines.forEach((line, i) => line.classList.toggle('active', i === frame.codeLine));
    }
}

function handleComplete() {
    // Nothing extra needed
}

/**
 * Initialize search visualizer.
 */
export function initSearchVisualizer(algoId) {
    container = document.getElementById('vis-canvas');
    const algoFn = algoMap[algoId];
    if (!container || !algoFn) return;

    const size = Math.min(getState('size'), 30); // Cap for readability
    currentArray = generateSortedArray(size);
    target = pickTarget(currentArray);
    resetStats();
    renderBlocks();

    animator.load(algoFn, { arr: [...currentArray], target }, handleFrame, handleComplete, () => {
        currentArray = generateSortedArray(Math.min(getState('size'), 30));
        target = pickTarget(currentArray);
        resetStats();
        renderBlocks();
        animator.load(algoFn, { arr: [...currentArray], target }, handleFrame, handleComplete, null);
    });

    // Update info + code panels
    updateInfoPanel(algoId);
    updateCodePanel(algoId);

    const unsubSize = subscribe('size', (newSize) => {
        animator.reset();
        currentArray = generateSortedArray(Math.min(newSize, 30));
        target = pickTarget(currentArray);
        resetStats();
        renderBlocks();
        animator.load(algoFn, { arr: [...currentArray], target }, handleFrame, handleComplete, null);
    });

    return () => {
        unsubSize();
    };
}
