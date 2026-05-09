/* ============================================================
   BUBBLE SORT — Generator
   
   Classic O(n²) comparison sort. Yields frames for each
   comparison and swap so the visualizer can animate them.
   ============================================================ */

/**
 * Generator function for Bubble Sort.
 * @param {number[]} arr - Array to sort (mutated in place)
 * @yields {{ type: string, indices: number[], codeLine: number }}
 */
export function* bubbleSort(arr) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        for (let j = 0; j < n - i - 1; j++) {
            // Highlight the two elements being compared
            yield { type: 'compare', indices: [j, j + 1], codeLine: 2 };

            if (arr[j] > arr[j + 1]) {
                // Swap
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
                yield { type: 'swap', indices: [j, j + 1], codeLine: 3 };
            }
        }

        // Mark the last unsorted element as sorted
        yield { type: 'sorted', indices: [n - i - 1], codeLine: 0 };

        // Early exit if no swaps occurred — array is already sorted
        if (!swapped) break;
    }

    // Mark all remaining elements as sorted
    for (let i = 0; i < n; i++) {
        yield { type: 'sorted', indices: [i], codeLine: 0 };
    }

    yield { type: 'done' };
}
