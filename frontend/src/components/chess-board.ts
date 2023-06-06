import { FENpieces } from "./chess-pieces";

// define rows as 1 to 8
export const rows = Array.from({ length: 8 }, (_, i) => i + 1);
// define columns as a to h
export const columns = Array.from({ length: 8 }, (_, i) => i + 1);

export enum columnLetters {
    a = 1,
    b = 2,
    c = 3,
    d = 4,
    e = 5,
    f = 6,
    g = 7,
    h = 8
}

export interface Square {
    row: number;
    column: number;
    piece?: FENpieces;
}

// function to test whether a square is in the same location as another square
export function isSameLocation(square1: Square, square2: Square) {
    return square1.row === square2.row && square1.column === square2.column;
}