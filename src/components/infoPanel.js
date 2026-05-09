/* ============================================================
   INFO PANEL — Shared info & code panel renderer
   
   Used by all visualizers to display algorithm info and
   pseudocode in a consistent format.
   ============================================================ */

import { algorithms } from '../data/algoInfo.js';

/**
 * Update the info panel with algorithm details,
 * showing both the simple explanation and formal definition.
 * @param {string} algoId
 */
export function updateInfoPanel(algoId) {
    const info = algorithms[algoId];
    if (!info) return;

    const content = document.getElementById('info-content');
    if (!content) return;

    const getComplexityClass = (complexity) => {
        if (complexity.includes('log') || complexity === 'O(1)' || complexity === 'O(n)' || complexity === 'O(E)') return 'complexity-good';
        if (complexity.includes('n²') || complexity.includes('V²')) return 'complexity-bad';
        return 'complexity-ok';
    };

    // Build tags
    const tags = [];
    if ('stable' in info) {
        tags.push(`<span class="info-tag badge ${info.stable ? 'badge-stable' : 'badge-unstable'}">${info.stable ? 'Stable' : 'Unstable'}</span>`);
    }
    if ('inPlace' in info) {
        tags.push(`<span class="info-tag badge ${info.inPlace ? 'badge-inplace' : ''}">${info.inPlace ? 'In-Place' : 'Not In-Place'}</span>`);
    }

    content.innerHTML = `
    <h2 class="info-title">${info.name}</h2>
    ${tags.length ? `<div class="info-tags">${tags.join('')}</div>` : ''}

    <div class="info-section">
      <h4 class="info-section-title">Simply Put</h4>
      <p class="info-description">${info.simpleExplanation}</p>
    </div>

    <div class="info-section">
      <h4 class="info-section-title">Formal Definition</h4>
      <p class="info-description">${info.formalDefinition}</p>
    </div>

    <table class="info-complexity-table">
      <thead>
        <tr><th>Case</th><th>Time</th></tr>
      </thead>
      <tbody>
        <tr><td>Best</td><td class="${getComplexityClass(info.timeComplexity.best)}">${info.timeComplexity.best}</td></tr>
        <tr><td>Average</td><td class="${getComplexityClass(info.timeComplexity.average)}">${info.timeComplexity.average}</td></tr>
        <tr><td>Worst</td><td class="${getComplexityClass(info.timeComplexity.worst)}">${info.timeComplexity.worst}</td></tr>
        <tr><td>Space</td><td>${info.spaceComplexity}</td></tr>
      </tbody>
    </table>
  `;
}

/**
 * Update the code panel with pseudocode.
 * @param {string} algoId
 */
export function updateCodePanel(algoId) {
    const info = algorithms[algoId];
    if (!info) return;

    const codeContent = document.getElementById('code-content');
    if (!codeContent) return;

    codeContent.innerHTML = info.pseudocode
        .map((line) => `<span class="code-line">${escapeHtml(line)}</span>`)
        .join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
