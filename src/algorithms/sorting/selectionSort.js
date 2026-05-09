/* ============================================================
   SELECTION SORT — Generator
   ============================================================ */

/**
 * @param {number[]} arr
 * @yields {{ type: string, indices: number[], codeLine: number }}
 */
export function* selectionSort(arr) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        yield { type: 'minimum', indices: [minIdx], codeLine: 1 };

        for (let j = i + 1; j < n; j++) {
            yield { type: 'compare', indices: [j, minIdx], codeLine: 3 };

            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                yield { type: 'minimum', indices: [minIdx], codeLine: 4 };
            }
        }

        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            yield { type: 'swap', indices: [i, minIdx], codeLine: 5 };
        }

        yield { type: 'sorted', indices: [i], codeLine: 0 };
    }

    yield { type: 'sorted', indices: [arr.length - 1], codeLine: 0 };
    yield { type: 'done' };
}
