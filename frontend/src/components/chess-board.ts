import ChessPiece, { ChessPieceType, PlayerColor } from './chess-pieces';

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
    piece?: ChessPiece | null;
}

// function to test whether a square is in the same location as another square
export function isSameLocation(lhs: Square, rhs: Square) {
    return lhs.row === rhs.row && lhs.column === rhs.column;
}


export default class ChessBoard {
    squares: (ChessPiece | null)[][]
    constructor(width: number, height: number) {
        this.squares = Array.from({ length: height }, () => Array.from({ length: width }, () => null))
    }

    setBoard(squares: (ChessPiece | null)[][]) {
        this.squares = squares;
    }

    getBoard() {
        return this.squares;
    }

    getPiece(square: Square) {
        return this.squares[square.row - 1][square.column - 1];
    }

    setSquare(square: Square) {
        this.squares[square.row - 1][square.column - 1] = square.piece ?? null;
    }

    setPiece(square: Square, piece: ChessPiece | null) {
        this.squares[square.row - 1][square.column - 1] = piece;
    }

    clone(): ChessBoard {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    getAllSquares(): Square[] {
        const squares: Square[] = [];
        rows.forEach(row => {
            columns.forEach(column => {
                squares.push({ row, column, piece: this.squares[row-1][column-1] });
            });
        });
        return squares;
    }

    getPieces(pieceType: ChessPieceType): Square[] {
        return this.getAllSquares()
            .filter(square => square.piece)
            .filter(square => square.piece?.getType() === pieceType);
    }

    getKing(color?: PlayerColor): Square | undefined {
        const kingToFind = color === 'w' ? ChessPieceType.whiteKing : ChessPieceType.blackKing;
        return this.getPieces(kingToFind).find(square => square.piece?.getType() === kingToFind);
    }

    isWithinBoard(square: Square) {
        return square.row > 0 && square.row < 9 && square.column > 0 && square.column < 9;
    }
}
