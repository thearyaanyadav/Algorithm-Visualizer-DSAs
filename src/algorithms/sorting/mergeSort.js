/* ============================================================
   MERGE SORT — Generator
   
   Recursive divide-and-conquer. Uses a helper to yield frames
   from within the recursive calls.
   ============================================================ */

/**
 * @param {number[]} arr
 * @yields {{ type: string, indices: number[], codeLine: number }}
 */
export function* mergeSort(arr) {
    yield* mergeSortHelper(arr, 0, arr.length - 1);

    // Mark everything sorted
    for (let i = 0; i < arr.length; i++) {
        yield { type: 'sorted', indices: [i], codeLine: 0 };
    }

    yield { type: 'done' };
}

function* mergeSortHelper(arr, left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    yield { type: 'compare', indices: [left, mid, right], codeLine: 2 };

    yield* mergeSortHelper(arr, left, mid);
    yield* mergeSortHelper(arr, mid + 1, right);
    yield* merge(arr, left, mid, right);
}

function* merge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
        yield { type: 'compare', indices: [left + i, mid + 1 + j], codeLine: 5 };

        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }
        yield { type: 'swap', indices: [k], codeLine: 5 };
        k++;
    }

    while (i < leftArr.length) {
        arr[k] = leftArr[i];
        yield { type: 'swap', indices: [k], codeLine: 5 };
        i++;
        k++;
    }

    while (j < rightArr.length) {
        arr[k] = rightArr[j];
        yield { type: 'swap', indices: [k], codeLine: 5 };
        j++;
        k++;
    }
}
