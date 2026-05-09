/* ============================================================
   QUICK SORT — Generator
   
   Lomuto partition scheme with last element as pivot.
   ============================================================ */

/**
 * @param {number[]} arr
 * @yields {{ type: string, indices: number[], codeLine: number }}
 */
export function* quickSort(arr) {
    yield* quickSortHelper(arr, 0, arr.length - 1);

    // Mark everything sorted
    for (let i = 0; i < arr.length; i++) {
        yield { type: 'sorted', indices: [i], codeLine: 0 };
    }

    yield { type: 'done' };
}

function* quickSortHelper(arr, low, high) {
    if (low >= high) {
        if (low === high) {
            yield { type: 'sorted', indices: [low], codeLine: 0 };
        }
        return;
    }

    // Partition
    const pivot = arr[high];
    yield { type: 'pivot', indices: [high], codeLine: 7 };

    let i = low - 1;

    for (let j = low; j < high; j++) {
        yield { type: 'compare', indices: [j, high], codeLine: 9 };

        if (arr[j] <= pivot) {
            i++;
            if (i !== j) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                yield { type: 'swap', indices: [i, j], codeLine: 11 };
            }
        }
    }

    // Place pivot in correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    const pivotIdx = i + 1;
    yield { type: 'swap', indices: [pivotIdx, high], codeLine: 12 };
    yield { type: 'sorted', indices: [pivotIdx], codeLine: 13 };

    // Recurse on partitions
    yield* quickSortHelper(arr, low, pivotIdx - 1);
    yield* quickSortHelper(arr, pivotIdx + 1, high);
}
