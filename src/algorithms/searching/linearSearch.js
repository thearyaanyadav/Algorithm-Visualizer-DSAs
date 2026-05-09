/* ============================================================
   LINEAR SEARCH — Generator
   ============================================================ */

/**
 * @param {{ arr: number[], target: number }} data
 * @yields {{ type: string, indices: number[], codeLine: number }}
 */
export function* linearSearch({ arr, target }) {
    for (let i = 0; i < arr.length; i++) {
        yield { type: 'current', indices: [i], codeLine: 1 };

        if (arr[i] === target) {
            yield { type: 'found', indices: [i], codeLine: 2 };
            yield { type: 'done', foundIndex: i };
            return;
        }

        yield { type: 'eliminated', indices: [i], codeLine: 1 };
    }

    yield { type: 'done', foundIndex: -1 };
}
