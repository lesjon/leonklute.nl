import { pieceToFen } from "./fen";

export type PlayerColor = 'w' | 'b';

export enum ChessPieceType {
    whiteKing,
    whiteQueen,
    whiteRook,
    whiteBishop,
    whiteKnight,
    whitePawn,
    blackKing,
    blackQueen,
    blackRook,
    blackBishop,
    blackKnight,
    blackPawn,
}

const whitePieces = new Set([ChessPieceType.whiteKing, ChessPieceType.whiteQueen, ChessPieceType.whiteRook, ChessPieceType.whiteBishop, ChessPieceType.whiteKnight, ChessPieceType.whitePawn])
export const isWhite = (piece: ChessPieceType) => whitePieces.has(piece);

export const type2FullName = (pieceType: ChessPieceType) => {
    switch (pieceType) {
        case ChessPieceType.whiteKing:
            return 'king_white';
        case ChessPieceType.whiteQueen:
            return 'queen_white';
        case ChessPieceType.whiteRook:
            return 'rook_white';
        case ChessPieceType.whiteBishop:
            return 'bishop_white';
        case ChessPieceType.whiteKnight:
            return 'knight_white';
        case ChessPieceType.whitePawn:
            return 'pawn_white';
        case ChessPieceType.blackKing:
            return 'king_black';
        case ChessPieceType.blackQueen:
            return 'queen_black';
        case ChessPieceType.blackRook:
            return 'rook_black';
        case ChessPieceType.blackBishop:
            return 'bishop_black';
        case ChessPieceType.blackKnight:
            return 'knight_black';
        case ChessPieceType.blackPawn:
            return 'pawn_black';
        default:
            return 'empty';
    }
}

interface ChessPieceStep {
    row: number;
    column: number;
    limit?: number;
    requiresTake?: boolean;
    excludesTake?: boolean;
    allowsEnPassant?: boolean;
    shortCastle?: boolean;
    longCastle?: boolean;
    canPromote?: boolean;
    promotion?: ChessPieceType;
}

export default interface ChessPiece {
    getFullName(): string;
    getType(): ChessPieceType;
    getColor(): PlayerColor;
    isOpponent(piece: ChessPiece): boolean;
    getChessPieceSteps(): ChessPieceStep[];
    hasMoved(): boolean;
    setMoved(moved?: boolean): void;
    toFen(): string;
    clone(): ChessPiece;
}

export const chessPieceFromType = (pieceType: ChessPieceType): ChessPiece => {
    switch (pieceType) {
        case ChessPieceType.whiteKing:
            return new King(pieceType);
        case ChessPieceType.whiteQueen:
            return new Queen(pieceType);
        case ChessPieceType.whiteRook:
            return new Rook(pieceType);
        case ChessPieceType.whiteBishop:
            return new Bishop(pieceType);
        case ChessPieceType.whiteKnight:
            return new Knight(pieceType);
        case ChessPieceType.whitePawn:
            return new Pawn(pieceType);
        case ChessPieceType.blackKing:
            return new King(pieceType);
        case ChessPieceType.blackQueen:
            return new Queen(pieceType);
        case ChessPieceType.blackRook:
            return new Rook(pieceType);
        case ChessPieceType.blackBishop:
            return new Bishop(pieceType);
        case ChessPieceType.blackKnight:
            return new Knight(pieceType);
        case ChessPieceType.blackPawn:
            return new Pawn(pieceType);
    }
}

abstract class ChessPieceBase implements ChessPiece {
    fullName: string;
    pieceType: ChessPieceType;
    color: PlayerColor;
    moved = false;
    constructor(pieceType: ChessPieceType) {
        this.fullName = type2FullName(pieceType);
        this.pieceType = pieceType;
        this.color = isWhite(pieceType) ? 'w' : 'b';
    }
    getFullName(): string {
        return this.fullName;
    }
    getType(): ChessPieceType {
        return this.pieceType;
    }
    getColor(): PlayerColor {
        return this.color;
    }
    isOpponent(piece: ChessPiece): boolean {
        return this.color !== piece.getColor();
    }
    hasMoved(): boolean {
        return this.moved;
    }
    setMoved(moved?: boolean) {
        this.moved = moved ?? true;
    }
    abstract getChessPieceSteps(): ChessPieceStep[];

    toFen(): string {
        return pieceToFen(this.pieceType);
    }

    clone(): ChessPiece {
        const newPiece = chessPieceFromType(this.pieceType);
        if (!newPiece) {
            throw new Error(`Invalid piece type: ${this.pieceType}`);
        }
        newPiece.setMoved(this.moved);
        return newPiece;
    }

}

class Rook extends ChessPieceBase {
    constructor(fenKey: ChessPieceType) {
        super(fenKey);
    }

    getChessPieceSteps(): ChessPieceStep[] {
        return [{ row: 0, column: 1 }, { row: 1, column: 0 }, { row: 0, column: -1 }, { row: -1, column: 0 }];
    }
}
class King extends ChessPieceBase {
    constructor(fenKey: ChessPieceType) {
        super(fenKey);
    }
    getChessPieceSteps(): ChessPieceStep[] {
        const castling: ChessPieceStep[] = [{ row: 0, column: 2, limit: 1, shortCastle: true, excludesTake: true }, { row: 0, column: -2, limit: 1, longCastle: true, excludesTake: true }];
        return [...castling, { row: 0, column: 1, limit: 1 }, { row: -1, column: 1, limit: 1 }, { row: -1, column: 0, limit: 1 }, { row: -1, column: -1, limit: 1 }, { row: 0, column: -1, limit: 1 }, { row: 1, column: -1, limit: 1 }, { row: 1, column: 0, limit: 1 }, { row: 1, column: 1, limit: 1 }];
    }
}
class Queen extends ChessPieceBase {
    constructor(fenKey: ChessPieceType) {
        super(fenKey);
    }
    getChessPieceSteps(): ChessPieceStep[] {
        return [{ row: 0, column: 1 }, { row: -1, column: 1 }, { row: -1, column: 0 }, { row: -1, column: -1 }, { row: 0, column: -1 }, { row: 1, column: -1 }, { row: 1, column: 0 }, { row: 1, column: 1 }];
    }
}
class Knight extends ChessPieceBase {
    constructor(fenKey: ChessPieceType) {
        super(fenKey);
    }
    getChessPieceSteps(): ChessPieceStep[] {
        return [{ row: 2, column: -1, limit: 1 }, { row: 1, column: -2, limit: 1 }, { row: -1, column: -2, limit: 1 }, { row: -2, column: -1, limit: 1 }, { row: -2, column: 1, limit: 1 }, { row: -1, column: 2, limit: 1 }, { row: 1, column: 2, limit: 1 }, { row: 2, column: 1, limit: 1 }];
    }
}

class Bishop extends ChessPieceBase {
    constructor(fenKey: ChessPieceType) {
        super(fenKey);
    }
    getChessPieceSteps(): ChessPieceStep[] {
        return [{ row: 1, column: -1 }, { row: -1, column: -1 }, { row: -1, column: 1 }, { row: 1, column: 1 }];
    }
}

class Pawn extends ChessPieceBase {
    constructor(fenKey: ChessPieceType) {
        super(fenKey);
    }

    getChessPieceSteps(): ChessPieceStep[] {
        const direction = this.color === 'w' ? 1 : -1;
        const whitePromotionOptions = [ChessPieceType.whiteQueen, ChessPieceType.whiteRook, ChessPieceType.whiteBishop, ChessPieceType.whiteKnight];
        const blackPromotionOptions = [ChessPieceType.blackQueen, ChessPieceType.blackRook, ChessPieceType.blackBishop, ChessPieceType.blackKnight];
        const promotionOptions = this.color === 'w' ? whitePromotionOptions : blackPromotionOptions;
        const takes: ChessPieceStep[] = [{ row: direction, column: 1, limit: 1, requiresTake: true, allowsEnPassant: true, canPromote: true }, { row: direction, column: -1, limit: 1, requiresTake: true, allowsEnPassant: true, canPromote: true }];

        const allStepsToGetPromotionOptions =  [...takes, { row: direction, column: 0, limit: this.moved ? 1 : 2, excludesTake: true, canPromote: true }];
        const allSteps = [];
        for (const step of allStepsToGetPromotionOptions) {
            allSteps.push(step);
            if (step.canPromote) {
                for (const promotion of promotionOptions) {
                    allSteps.push({ ...step, promotion });
                }
            }
        }
        return allSteps;
    }
}