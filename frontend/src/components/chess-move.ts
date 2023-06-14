import { Square, columnLetters } from "./chess-board";
import ChessPiece from "./chess-pieces";

export default interface Move extends Square {
    piece: ChessPiece;
    takes?: ChessPiece;
    enPassant?: EnPassant;
    castling?: Castling;
    promotion?: ChessPiece;
    from?: Square;
    check?: boolean;
    checkmate?: boolean;
    shortCastle?: boolean;
    longCastle?: boolean;
}

export class EnPassant implements Square {
    row: number;
    column: number;
    squareToTake?: Square;

    constructor(enPassentFen: string, squareToTake?: Square) {
        this.squareToTake = squareToTake;
        const column = enPassentFen[0];
        const row = enPassentFen[1];
        this.row = Number(row);
        const colNumber: number = columnLetters[column as keyof typeof columnLetters];
        this.column = colNumber;
    }

    toFen() {
        if (this.row && this.column) {
            return `${columnLetters[this.column]}${this.row}`;
        }
        return '-';
    }
}

export class Castling {
    rookMove: Move;
    kingMove: Move;
    constructor(kingMove: Move, rookMove: Move) {
        this.kingMove = kingMove;
        this.rookMove = rookMove;
    }
}