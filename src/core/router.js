/* ============================================================
   ROUTER — Hash-based SPA router
   
   Maps URL hashes like #/sorting/bubble-sort to the correct
   visualizer + algorithm pair. Keeps browser back/forward working.
   ============================================================ */

import { setState } from './state.js';

const routes = new Map();
let currentCleanup = null;

/**
 * Register a route handler.
 * @param {string} path - Route path, e.g. '/sorting/bubble-sort'
 * @param {Function} handler - Function to call when route matches. 
 *                             Should return a cleanup function (or null).
 */
export function registerRoute(path, handler) {
    routes.set(path, handler);
}

/**
 * Navigate to a specific route programmatically.
 * @param {string} path
 */
export function navigate(path) {
    window.location.hash = path;
}

/**
 * Get the current route path (without the leading #).
 * @returns {string}
 */
export function getCurrentRoute() {
    return window.location.hash.slice(1) || '/';
}

/**
 * Initialize the router. Call once on app startup.
 */
export function initRouter() {
    const handleRoute = () => {
        const path = getCurrentRoute();

        // Clean up previous route
        if (currentCleanup) {
            currentCleanup();
            currentCleanup = null;
        }

        // Extract category and algorithm from path
        const parts = path.split('/').filter(Boolean);
        if (parts.length >= 2) {
            setState('currentCategory', parts[0]);
            setState('currentAlgorithm', parts[1]);
        }

        // Find and execute route handler
        const handler = routes.get(path);
        if (handler) {
            currentCleanup = handler() || null;
        } else if (routes.has('/')) {
            // Fall back to home
            currentCleanup = routes.get('/')() || null;
        }
    };

    window.addEventListener('hashchange', handleRoute);

    // Handle initial route on page load
    handleRoute();
}
