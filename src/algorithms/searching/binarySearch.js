/* ============================================================
   BINARY SEARCH — Generator
   ============================================================ */

/**
 * @param {{ arr: number[], target: number }} data
 * @yields {{ type: string, indices: number[], low: number, mid: number, high: number, codeLine: number }}
 */
export function* binarySearch({ arr, target }) {
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        yield { type: 'range', low, mid, high, codeLine: 3 };

        if (arr[mid] === target) {
            yield { type: 'found', indices: [mid], codeLine: 4 };
            yield { type: 'done', foundIndex: mid };
            return;
        }

        if (arr[mid] < target) {
            // Eliminate left half
            yield { type: 'eliminate', from: low, to: mid, codeLine: 6 };
            low = mid + 1;
        } else {
            // Eliminate right half  
            yield { type: 'eliminate', from: mid, to: high, codeLine: 8 };
            high = mid - 1;
        }
    }

    yield { type: 'done', foundIndex: -1 };
}
