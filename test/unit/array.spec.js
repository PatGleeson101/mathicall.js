import {array} from "../../build/mathicall.module.js";

describe("sum", () => {
    test("empty array -> 0", () => {
        expect(array.sum([])).toEqual(0);
    });

    test("non-empty array", () => {
        expect(array.sum([1, 2, 3, 4, 5])).toEqual(15);
    });
});

describe("min", () => {
    test("empty array -> undefined", () => {
        expect(array.min([])).toBeUndefined();
    });
    test("unsorted array", () => {
        expect(array.min([5, 1, 4, 2, 3])).toEqual(1);
    });
    test("ascending array", () => {
        expect(array.min([1, 2, 3, 4, 5], true)).toEqual(1);
    });
    test("descending array", () => {
        expect(array.min([5, 4, 3, 2, 1], true)).toEqual(1);
    });
});

describe("max", () => {
    test("empty array -> undefined", () => {
        expect(array.max([])).toBeUndefined();
    });
    test("unsorted array", () => {
        expect(array.max([5, 1, 4, 2, 3])).toEqual(5);
    });
    test("ascending array", () => {
        expect(array.max([1, 2, 3, 4, 5], true)).toEqual(5);
    });
    test("descending array", () => {
        expect(array.max([5, 4, 3, 2, 1], true)).toEqual(5);
    });
});

describe("prod", () => {
    test("empty array -> 1", () => {
        expect(array.prod([])).toEqual(1);
    });
    test("non-empty array", () => {
        expect(array.prod([1, 2, 3, 4, 5])).toEqual(120);
    });
});

describe("unique", () => {
    test("empty array", () => {
        expect(array.unique([])).toEqual(new Float64Array());
    });
    const ascSet = new Float64Array([1, 2, 3, 5, 6, 9]);
    const descSet = new Float64Array([9,6,5,3,2,1]);
    test("unsorted array -> ascending", () => {
        expect(array.unique([1, 3, 3, 5, 6, 3, 2, 9, 1, 1, 9])).toEqual(ascSet);
    });
    test("ascending array -> ascending", () => {
        expect(array.unique([1,1,1,2,3,3,3,5,6,9,9], true)).toEqual(ascSet);
    });
    test("descending array -> descending", () => {
        expect(array.unique([9,9,6,5,3,3,3,2,1,1,1], true)).toEqual(descSet);
    });
});

describe("sortUint8", () => {
    test("empty array", () => {
        expect(array.sortUint8(new Uint8Array())).toEqual(new Uint8Array());
    });
    const unsortedUint8Array = new Uint8Array(100);
    for (let i = 0; i < 100; i++) {
        unsortedUint8Array[i] = Math.floor( Math.random() * 20 );
    }
    const sortedUint8Array = unsortedUint8Array.slice().sort();
    test("non-empty array", () => {
        expect(array.sortUint8(unsortedUint8Array)).toEqual(sortedUint8Array);
    });
});

// Initialise array for count & indexOf tests
const unsortedArray = new Float64Array(10000);
for (let i = 0; i < 10000; i++) {
    const val = Math.random() * 100;
    unsortedArray[i] = (val === 51) ? 52 : val
}
const replacedIndices = [];
let i = 0;
while (i < 1000) {
    const index = Math.floor( Math.random() * 10000 );
    if (!replacedIndices.includes(index)) {
        replacedIndices.push(index);
        unsortedArray[index] = 51;
        i++;
    }
}

describe("count", () => {
    test("empty array", () => {
        expect(array.count([], 3)).toBe(0);
    });
    test("unsorted array", () => {
        expect(array.count(unsortedArray, 51)).toBe(1000);
    });
    const ascendingArray = unsortedArray.slice().sort();
    test("ascending array", () => {
        expect(array.count(ascendingArray, 51, true)).toBe(1000);
    });
    const descendingArray = ascendingArray.slice().reverse();
    test("descending array", () => {
        expect(array.count(descendingArray, 51, true)).toBe(1000);
    });
});

describe("indexOf", () => {
    test("empty array -> -1", () => {
        expect(array.indexOf([], 3)).toBe(-1);
    });
    test("unsorted array", () => {
        expect(array.indexOf(unsortedArray, 51)).toBe(array.min(replacedIndices));
    });

    const ascArray = new Float64Array(1000);
    for (let i = 0; i < 371; i++) {
        ascArray[i] = Math.random()*5;
    }
    ascArray[371] = 7
    for (let i = 372; i < 1000; i++) {
        ascArray[i] = 8 + Math.random()*5;
    }
    ascArray.sort();
    test("ascending contained", () => {
        expect(array.indexOf(ascArray, 7, true)).toBe(371);
    });
    const descArray = ascArray.slice().reverse();
    test("descending contained", () => {
        expect(array.indexOf(descArray, 7, true)).toBe(999-371);
    });
});


describe("union", () => {
    test("unsorted", () => {
        expect(array.union([1,3,2,7,8], [1,7,6,4,9])).toEqual(new Float64Array([1,2,3,4,6,7,8,9]));
    });
});
