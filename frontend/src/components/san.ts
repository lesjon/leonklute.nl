import { columnLetters } from "./chess-board";
import { Move } from "./chess-game";

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
        const panwTakes = piece.getFenKey().toLowerCase() === 'p' && move.takes && move.from ;
        if (panwTakes && move.from) {
            return columnLetters[move.from.column];
        }
        return '';
    }

    pieceSymbol(move: Move) {
        const piece = move.piece;
        switch (piece.getFenKey()) {
            case 'p':
            case 'P':
                if (move.takes && move.from) { return columnLetters[move.from?.column]; }
                return '';
            case 'N':
                return '♘';
            case 'B':
                return '♗';
            case 'R':
                return '♖';
            case 'Q':
                return '♕';
            case 'K':
                return '♔';
            case 'n':
                return '♞';
            case 'b':
                return '♝';
            case 'r':
                return '♜';
            case 'q':
                return '♛';
            case 'k':
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