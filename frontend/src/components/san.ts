import { C } from "app/dist/spa/assets/index.7ad02204";
import { columnLetters } from "./chess-board";
import { Move } from "./chess-game";
import { ChessPieceType } from "./chess-pieces";

export enum SanFormat {
    Long = 'long',
    Short = 'short',
    Figurine = 'figurine',
    Coordinate = 'coordinate',
}

export default class San {
    format: SanFormat;

    constructor(fmt?: SanFormat) {
        this.format = fmt || SanFormat.Short;
    }

    fromSymbol(move: Move) {
        const piece = move.piece;
        const pawnTakes = piece.toFen().toLowerCase() === 'p' && move.takes && move.from ;
        if (pawnTakes && move.from) {
            return columnLetters[move.from.column];
        }
        return '';
    }

    pieceSymbol(move: Move) {
        const piece = move.piece;
        switch (piece.getType()) {
            case ChessPieceType.whitePawn:
            case ChessPieceType.blackPawn:
                if (move.takes && move.from) { return columnLetters[move.from?.column]; }
                return '';
            case ChessPieceType.whiteKnight:
                return '♘';
            case ChessPieceType.whiteBishop:
                return '♗';
            case ChessPieceType.whiteRook:
                return '♖';
            case ChessPieceType.whiteQueen:
                return '♕';
            case ChessPieceType.whiteKing:
                return '♔';
            case ChessPieceType.blackKnight:
                return '♞';
            case ChessPieceType.blackBishop:
                return '♝';
            case ChessPieceType.blackRook:
                return '♜';
            case ChessPieceType.blackQueen:
                return '♛';
            case ChessPieceType.blackKing:
                return '♚';
            default:
                return '';
        };
    }
    checkSymbol(move: Move) {
        if (move.check) {
            return move.checkmate ? '#' : '+';
        }
        return '';
    }
    takeSymbol(move: Move) {
        return move.takes ? 'x' : '';
    }
    formatMove(move?: Move) {
        if (!move) {
            return '';
        }
        return this.fromSymbol(move) + this.pieceSymbol(move) + this.takeSymbol(move) +
            columnLetters[move.column] + move.row + this.checkSymbol(move);
    }
}