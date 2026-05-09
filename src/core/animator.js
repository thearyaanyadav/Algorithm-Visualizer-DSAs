/* ============================================================
   ANIMATOR — Async generator-based animation engine
   
   Consumes generator functions that yield visual "frames".
   Supports play, pause, step, reset, and dynamic speed.
   ============================================================ */

import { getState, setState, subscribe } from './state.js';

class Animator {
    constructor() {
        this.generator = null;
        this.onFrame = null;
        this.onComplete = null;
        this.onReset = null;
        this.rafId = null;
        this.lastFrameTime = 0;
        this.done = false;

        // Listen for speed changes in real time
        subscribe('isPlaying', (playing) => {
            if (playing && !this.done) {
                this._run();
            } else {
                this._stop();
            }
        });
    }

    /**
     * Load a new generator and callbacks.
     * @param {GeneratorFunction} generatorFn - The algorithm generator function  
     * @param {Array} data - Data to pass to the generator
     * @param {Function} onFrame - Called with each yielded frame
     * @param {Function} onComplete - Called when the generator finishes
     * @param {Function} onReset - Called when reset is triggered
     */
    load(generatorFn, data, onFrame, onComplete, onReset) {
        this._stop();
        this.done = false;
        this.generator = generatorFn(data);
        this.onFrame = onFrame;
        this.onComplete = onComplete;
        this.onReset = onReset;
        setState('isPlaying', false);
    }

    /**
     * Start / resume automatic playback.
     */
    play() {
        if (this.done || !this.generator) return;
        setState('isPlaying', true);
    }

    /**
     * Pause playback.
     */
    pause() {
        setState('isPlaying', false);
    }

    /**
     * Toggle between play and pause.
     */
    toggle() {
        if (getState('isPlaying')) {
            this.pause();
        } else {
            this.play();
        }
    }

    /**
     * Advance exactly one frame.
     */
    step() {
        if (this.done || !this.generator) return;
        this.pause();
        this._advance();
    }

    /**
     * Reset the animation. Caller is responsible for reinitializing data.
     */
    reset() {
        this._stop();
        this.generator = null;
        this.done = false;
        setState('isPlaying', false);
        if (this.onReset) this.onReset();
    }

    /**
     * Compute delay between frames based on the speed slider (1–100).
     * Speed 1 → ~500ms, Speed 50 → ~30ms, Speed 100 → ~1ms
     */
    _getDelay() {
        const speed = getState('speed');
        // Exponential curve: slower speeds feel more spread out
        return Math.max(1, Math.round(500 * Math.pow(0.96, speed)));
    }

    /**
     * Internal: advance the generator by one step.
     */
    _advance() {
        if (!this.generator) return;

        const result = this.generator.next();
        if (result.done) {
            this.done = true;
            setState('isPlaying', false);
            if (this.onComplete) this.onComplete();
            return;
        }

        if (this.onFrame) {
            this.onFrame(result.value);
        }
    }

    /**
     * Internal: animation loop using requestAnimationFrame + delay.
     */
    _run() {
        this._stop();

        const loop = (timestamp) => {
            if (!getState('isPlaying') || this.done) return;

            const elapsed = timestamp - this.lastFrameTime;
            const delay = this._getDelay();

            if (elapsed >= delay) {
                this._advance();
                this.lastFrameTime = timestamp;
            }

            if (!this.done && getState('isPlaying')) {
                this.rafId = requestAnimationFrame(loop);
            }
        };

        this.rafId = requestAnimationFrame(loop);
    }

    /**
     * Internal: cancel the animation frame loop.
     */
    _stop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }
}

// Singleton instance
export const animator = new Animator();
