/* ============================================================
   INSERTION SORT — Generator
   ============================================================ */

/**
 * @param {number[]} arr
 * @yields {{ type: string, indices: number[], codeLine: number }}
 */
export function* insertionSort(arr) {
    const n = arr.length;

    yield { type: 'sorted', indices: [0], codeLine: 0 };

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;

        yield { type: 'compare', indices: [i], codeLine: 1 };

        while (j >= 0 && arr[j] > key) {
            yield { type: 'compare', indices: [j, j + 1], codeLine: 3 };
            arr[j + 1] = arr[j];
            yield { type: 'swap', indices: [j, j + 1], codeLine: 4 };
            j--;
        }

        arr[j + 1] = key;
        yield { type: 'sorted', indices: [j + 1], codeLine: 6 };
    }

    // Mark everything sorted
    for (let i = 0; i < n; i++) {
        yield { type: 'sorted', indices: [i], codeLine: 0 };
    }

    yield { type: 'done' };
}
