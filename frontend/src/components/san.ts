import { columnLetters } from './chess-board';
import Move from './chess-move';
import ChessPiece, { ChessPieceType } from './chess-pieces';

export enum SanFormat {
    FigurineShort,
    Short,
    FigurineLong,
    Long,
    Coordinate,
}

export default class SanFormatter {
    static create(format: SanFormat): SanFormatter {
        switch (format) {
            case SanFormat.Long:
                return new LongSanFormatter();
            case SanFormat.Short:
                return new ShortSanFormatter();
            case SanFormat.FigurineShort:
                return new ShortFigurineSanFormatter();
            case SanFormat.FigurineLong:
                return new LongFigurineSanFormatter();
            case SanFormat.Coordinate:
                return new CoordinateSanFormatter();
            default:
                return new ShortSanFormatter();
        }
    }

    fromSymbol(move: Move): string {
        const piece = move.piece;
        const pawnTakes = piece.toFen().toLowerCase() === 'p' && move.takes && move.from;
        if (pawnTakes && move.from) {
            return columnLetters[move.from.column];
        }
        return '';
    }

    pieceSymbol(piece: ChessPiece): string {
        switch (piece.getType()) {
            case ChessPieceType.whitePawn:
            case ChessPieceType.blackPawn:
                return '';
            case ChessPieceType.whiteKnight:
            case ChessPieceType.blackKnight:
                return 'N';
            case ChessPieceType.whiteBishop:
            case ChessPieceType.blackBishop:
                return 'B';
            case ChessPieceType.whiteRook:
            case ChessPieceType.blackRook:
                return 'R';
            case ChessPieceType.whiteQueen:
            case ChessPieceType.blackQueen:
                return 'Q';
            case ChessPieceType.whiteKing:
            case ChessPieceType.blackKing:
                return 'K';
            default:
                return '';
        };
    }
    checkSymbol(move: Move): string {
        if (move.check) {
            return move.checkmate ? '#' : '+';
        }
        return '';
    }
    takeSymbol(move: Move): string {
        return move.takes ? 'x' : '';
    }
    formatMove(move?: Move): string {
        if (!move) {
            return '';
        }
        const castle = this.formatCastle(move);
        if (castle.length > 0) {
            return castle;
        }
        return this.pieceSymbol(move.piece) + this.fromSymbol(move) + this.takeSymbol(move) +
            columnLetters[move.column] + move.row + this.formatPromotion(move) + this.checkSymbol(move);
    }

    formatCastle(move: Move): string {
        if (move.shortCastle) { return 'O-O' + this.checkSymbol(move); }
        if (move.longCastle) { return 'O-O-O' + this.checkSymbol(move); }
        return '';
    }

    formatPromotion(move: Move): string {
        if (move.promotion) {
            return '=' + this.pieceSymbol(move.promotion);
        }
        return '';
    }
}


class ShortSanFormatter extends SanFormatter {
}

class ShortFigurineSanFormatter extends ShortSanFormatter {
    override pieceSymbol(piece: ChessPiece): string {
        switch (piece.getType()) {
            case ChessPieceType.whitePawn:
            case ChessPieceType.blackPawn:
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
}

class LongSanFormatter extends SanFormatter {

    override fromSymbol(move: Move) {
        let symbol = '';
        if (!move.from) {
            return symbol;
        }
        symbol += columnLetters[move.from.column];
        symbol += move.from.row;
        return symbol;
    }

    override takeSymbol(move: Move) {
        return move.takes ? 'x'+ this.pieceSymbol(move.takes) : '';
    }
}

class LongFigurineSanFormatter extends LongSanFormatter {
    override pieceSymbol(piece: ChessPiece) {
        switch (piece.getType()) {
            case ChessPieceType.whitePawn:
                return '♙'
            case ChessPieceType.blackPawn:
                return '♟︎';
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
}

class CoordinateSanFormatter extends LongSanFormatter {
    override pieceSymbol() {
        return '';
    }

    override takeSymbol() {
        return '';
    }

    override formatPromotion(move: Move) {
        switch(move.promotion?.getType()) {
            case ChessPieceType.whiteKnight:
            case ChessPieceType.blackKnight:
                return 'n';
            case ChessPieceType.whiteBishop:
            case ChessPieceType.blackBishop:
                return 'b';
            case ChessPieceType.whiteRook:
            case ChessPieceType.blackRook:
                return 'r';
            case ChessPieceType.whiteQueen:
            case ChessPieceType.blackQueen:
                return 'q';
            default:
                return '';
        }
    }

    override checkSymbol() {
        return '';
    }
}