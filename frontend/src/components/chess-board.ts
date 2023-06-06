
// define rows as 1 to 8
export const rows = Array.from({ length: 8 }, (_, i) => i + 1);
// define columns as a to h
export const columns = Array.from({ length: 8 }, (_, i) => i + 1);

export interface Square {
    row: number;
    column: number;
    piece?: string;
}

// function to test whether a square is in the same location as another square
export function isSameLocation(square1: Square, square2: Square) {
    return square1.row === square2.row && square1.column === square2.column;
}