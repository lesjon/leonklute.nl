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

export interface SquareWithPiece extends Square {
    piece: ChessPiece;
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
        const newBoard = new ChessBoard(this.squares.length, this.squares[0].length);
        newBoard.setBoard(this.squares.map(row => row.map(cell => cell ? cell.clone() : null)));
        return newBoard;
    }

    getAllSquares(): Square[] {
        const squares: Square[] = [];
        rows.forEach(row => {
            columns.forEach(column => {
                squares.push({ row, column, piece: this.squares[row - 1][column - 1] });
            });
        });
        return squares;
    }

    getPieces(pieceType: ChessPieceType): SquareWithPiece[] {
        return this.getAllSquares()
            .filter(square => square.piece)
            .filter(square => square.piece?.getType() === pieceType) as SquareWithPiece[];
    }

    getKing(color?: PlayerColor): SquareWithPiece | undefined {
        const kingToFind = color === 'w' ? ChessPieceType.whiteKing : ChessPieceType.blackKing;
        return this.getPieces(kingToFind).at(0);
    }

    isWithinBoard(square: Square) {
        return rows.includes(square.row) && columns.includes(square.column);
    }
}
