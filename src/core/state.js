/* ============================================================
   STATE — Simple reactive state management
   
   Tracks global app state (current algo, speed, size, theme)
   and notifies subscribers when values change.
   ============================================================ */

const listeners = new Map();
const state = {
    currentCategory: null,
    currentAlgorithm: null,
    speed: 50,
    size: 50,
    isPlaying: false,
    theme: localStorage.getItem('algovis-theme') || 'dark',
    infoPanelOpen: true,
    codePanelOpen: true,
    comparisons: 0,
    swaps: 0,
};

/**
 * Get a state value by key.
 * @param {string} key
 * @returns {*}
 */
export function getState(key) {
    return state[key];
}

/**
 * Set a state value and notify all listeners for that key.
 * @param {string} key
 * @param {*} value
 */
export function setState(key, value) {
    if (state[key] === value) return;
    state[key] = value;

    const callbacks = listeners.get(key);
    if (callbacks) {
        callbacks.forEach((cb) => cb(value));
    }
}

/**
 * Subscribe to changes on a specific state key.
 * Returns an unsubscribe function.
 * @param {string} key
 * @param {Function} callback
 * @returns {Function} unsubscribe
 */
export function subscribe(key, callback) {
    if (!listeners.has(key)) {
        listeners.set(key, new Set());
    }
    listeners.get(key).add(callback);

    return () => {
        listeners.get(key).delete(callback);
    };
}

/**
 * Reset stats counters (comparisons, swaps).
 */
export function resetStats() {
    setState('comparisons', 0);
    setState('swaps', 0);
}
