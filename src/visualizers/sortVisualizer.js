/* ============================================================
   SORT VISUALIZER
   
   Renders an array as color-coded vertical bars. Handles
   compare, swap, sorted, pivot, and minimum frame types
   from any sorting algorithm generator.
   ============================================================ */

import { getState, setState, subscribe, resetStats } from '../core/state.js';
import { animator } from '../core/animator.js';
import { updateInfoPanel, updateCodePanel } from '../components/infoPanel.js';

// Algorithm imports
import { bubbleSort } from '../algorithms/sorting/bubbleSort.js';
import { selectionSort } from '../algorithms/sorting/selectionSort.js';
import { insertionSort } from '../algorithms/sorting/insertionSort.js';
import { mergeSort } from '../algorithms/sorting/mergeSort.js';
import { quickSort } from '../algorithms/sorting/quickSort.js';
import { heapSort } from '../algorithms/sorting/heapSort.js';

const algoMap = {
    'bubble-sort': bubbleSort,
    'selection-sort': selectionSort,
    'insertion-sort': insertionSort,
    'merge-sort': mergeSort,
    'quick-sort': quickSort,
    'heap-sort': heapSort,
};

let currentArray = [];
let barElements = [];
let sortedIndices = new Set();
let container = null;
let statsBar = null;

/**
 * Generate a random array of the given size.
 */
function generateArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
}

/**
 * Render bars into the DOM.
 */
function renderBars() {
    if (!container) return;

    container.innerHTML = '';
    sortedIndices.clear();

    const barsContainer = document.createElement('div');
    barsContainer.className = 'sort-bars-container';

    barElements = currentArray.map((value) => {
        const bar = document.createElement('div');
        bar.className = 'sort-bar';
        bar.style.height = `${value}%`;
        barsContainer.appendChild(bar);
        return bar;
    });

    container.appendChild(barsContainer);

    // Add stats bar
    if (!statsBar) {
        statsBar = document.createElement('div');
        statsBar.className = 'stats-bar';
        statsBar.innerHTML = `
      <div class="stat-item">
        <span class="stat-label">Comparisons</span>
        <span class="stat-value" id="stat-comparisons">0</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Swaps</span>
        <span class="stat-value" id="stat-swaps">0</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Array Size</span>
        <span class="stat-value" id="stat-size">${currentArray.length}</span>
      </div>
    `;
        // Insert after vis-container
        const mainContent = document.getElementById('main-content');
        const codePanel = document.getElementById('code-panel');
        mainContent.insertBefore(statsBar, codePanel);
    }
    updateStats();
}

/**
 * Update the stats display.
 */
function updateStats() {
    const compEl = document.getElementById('stat-comparisons');
    const swapEl = document.getElementById('stat-swaps');
    const sizeEl = document.getElementById('stat-size');
    if (compEl) compEl.textContent = getState('comparisons');
    if (swapEl) swapEl.textContent = getState('swaps');
    if (sizeEl) sizeEl.textContent = currentArray.length;
}

/**
 * Clear all bar states (comparing, swapping, etc.)
 */
function clearBarStates() {
    barElements.forEach((bar, i) => {
        bar.classList.remove('comparing', 'swapping', 'pivot', 'minimum');
        if (sortedIndices.has(i)) {
            bar.classList.add('sorted');
        }
    });
}

/**
 * Handle an animation frame from the sorting generator.
 */
function handleFrame(frame) {
    if (frame.type === 'done') return;

    clearBarStates();

    // Update bar heights to reflect current array state
    barElements.forEach((bar, i) => {
        bar.style.height = `${currentArray[i]}%`;
    });

    switch (frame.type) {
        case 'compare':
            setState('comparisons', getState('comparisons') + 1);
            frame.indices.forEach((i) => {
                if (barElements[i]) barElements[i].classList.add('comparing');
            });
            break;

        case 'swap':
            setState('swaps', getState('swaps') + 1);
            frame.indices.forEach((i) => {
                if (barElements[i]) barElements[i].classList.add('swapping');
            });
            break;

        case 'sorted':
            frame.indices.forEach((i) => {
                sortedIndices.add(i);
                if (barElements[i]) barElements[i].classList.add('sorted');
            });
            break;

        case 'pivot':
            frame.indices.forEach((i) => {
                if (barElements[i]) barElements[i].classList.add('pivot');
            });
            break;

        case 'minimum':
            frame.indices.forEach((i) => {
                if (barElements[i]) barElements[i].classList.add('minimum');
            });
            break;
    }

    updateStats();

    // Update pseudocode highlight
    if (frame.codeLine !== undefined) {
        highlightCodeLine(frame.codeLine);
    }
}

/**
 * Highlight a specific pseudocode line.
 */
function highlightCodeLine(lineIndex) {
    const codeLines = document.querySelectorAll('#code-content .code-line');
    codeLines.forEach((line, i) => {
        line.classList.toggle('active', i === lineIndex);
    });
}

/**
 * Called when the algorithm finishes.
 */
function handleComplete() {
    // Mark all bars as sorted
    barElements.forEach((bar) => {
        bar.classList.remove('comparing', 'swapping', 'pivot', 'minimum');
        bar.classList.add('sorted');
    });
    updateStats();
}

/**
 * Initialize the sort visualizer for a specific algorithm.
 * @param {string} algoId - Algorithm identifier (e.g., 'bubble-sort')
 * @returns {Function} cleanup function
 */
export function initSortVisualizer(algoId) {
    container = document.getElementById('vis-canvas');
    const algoFn = algoMap[algoId];
    if (!container || !algoFn) return;

    const size = getState('size');
    currentArray = generateArray(size);
    resetStats();
    renderBars();

    // Load the algorithm into the animator
    const arrCopy = [...currentArray];
    currentArray = arrCopy;
    animator.load(algoFn, arrCopy, handleFrame, handleComplete, () => {
        // Reset callback
        currentArray = generateArray(getState('size'));
        resetStats();
        renderBars();
        // Reload the generator
        const newArr = [...currentArray];
        currentArray = newArr;
        animator.load(algoFn, newArr, handleFrame, handleComplete, null);
    });

    // Update info panel
    updateInfoPanel(algoId);
    updateCodePanel(algoId);

    // Listen for size changes
    const unsubSize = subscribe('size', (newSize) => {
        animator.reset();
        currentArray = generateArray(newSize);
        resetStats();
        renderBars();
        const newArr = [...currentArray];
        currentArray = newArr;
        animator.load(algoFn, newArr, handleFrame, handleComplete, null);
    });

    return () => {
        unsubSize();
        if (statsBar && statsBar.parentNode) {
            statsBar.parentNode.removeChild(statsBar);
            statsBar = null;
        }
    };
}
