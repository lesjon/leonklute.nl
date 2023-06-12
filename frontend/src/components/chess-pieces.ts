
export type PlayerColor = 'w' | 'b';

export enum FENpieces {
    whiteKing = 'K',
    whiteQueen = 'Q',
    whiteRook = 'R',
    whiteBishop = 'B',
    whiteKnight = 'N',
    whitePawn = 'P',
    blackKing = 'k',
    blackQueen = 'q',
    blackRook = 'r',
    blackBishop = 'b',
    blackKnight = 'n',
    blackPawn = 'p',
}

export const fen2FullName = (fen: string) => {
    switch (fen) {
        case FENpieces.whiteKing:
            return 'king_white';
        case FENpieces.whiteQueen:
            return 'queen_white';
        case FENpieces.whiteRook:
            return 'rook_white';
        case FENpieces.whiteBishop:
            return 'bishop_white';
        case FENpieces.whiteKnight:
            return 'knight_white';
        case FENpieces.whitePawn:
            return 'pawn_white';
        case FENpieces.blackKing:
            return 'king_black';
        case FENpieces.blackQueen:
            return 'queen_black';
        case FENpieces.blackRook:
            return 'rook_black';
        case FENpieces.blackBishop:
            return 'bishop_black';
        case FENpieces.blackKnight:
            return 'knight_black';
        case FENpieces.blackPawn:
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
}

export default interface ChessPiece {
    getFullName(): string;
    getFenKey(): string;
    getColor(): string;
    isOpponent(piece: ChessPiece): boolean;
    getChessPieceSteps(): ChessPieceStep[];
    hasMoved(): boolean;
    setMoved(): void;
}

export const ChessPieceFromFen = (fenKey: FENpieces): ChessPiece | null => {
    switch (fenKey) {
        case FENpieces.whiteKing:
            return new King(fenKey);
        case FENpieces.whiteQueen:
            return new Queen(fenKey);
        case FENpieces.whiteRook:
            return new Rook(fenKey);
        case FENpieces.whiteBishop:
            return new Bishop(fenKey);
        case FENpieces.whiteKnight:
            return new Knight(fenKey);
        case FENpieces.whitePawn:
            return new Pawn(fenKey);
        case FENpieces.blackKing:
            return new King(fenKey);
        case FENpieces.blackQueen:
            return new Queen(fenKey);
        case FENpieces.blackRook:
            return new Rook(fenKey);
        case FENpieces.blackBishop:
            return new Bishop(fenKey);
        case FENpieces.blackKnight:
            return new Knight(fenKey);
        case FENpieces.blackPawn:
            return new Pawn(fenKey);
        default:
            return null;
    }
}

abstract class ChessPieceBase implements ChessPiece {
    fullName: string;
    fenKey: string;
    color: PlayerColor;
    moved = false;
    constructor(fenKey: string) {
        this.fullName = fen2FullName(fenKey);
        this.fenKey = fenKey;
        this.color = fenKey === fenKey.toUpperCase() ? 'w' : 'b';
    }
    getFullName(): string {
        return this.fullName;
    }
    getFenKey(): string {
        return this.fenKey;
    }
    getColor(): string {
        return this.color;
    }
    isOpponent(piece: ChessPiece): boolean {
        return this.color !== piece.getColor();
    }
    hasMoved(): boolean {
        return this.moved;
    }
    setMoved() {
        this.moved = true;
    }
    abstract getChessPieceSteps(): ChessPieceStep[];
}

class Rook extends ChessPieceBase {
    constructor(fenKey: string) {
        super(fenKey);
    }

    getChessPieceSteps(): ChessPieceStep[] {
        return [{ row: 0, column: 1 }, { row: 1, column: 0 }, { row: 0, column: -1 }, { row: -1, column: 0 }];
    }
}
class King extends ChessPieceBase {
    constructor(fenKey: string) {
        super(fenKey);
    }
    getChessPieceSteps(): ChessPieceStep[] {
        const castling: ChessPieceStep[] = [{ row: 0, column: 2, limit: 1, shortCastle: true, excludesTake: true }, { row: 0, column: -2, limit: 1, longCastle: true, excludesTake: true }];
        return [...castling, { row: 0, column: 1, limit: 1 }, { row: -1, column: 1, limit: 1 }, { row: -1, column: 0, limit: 1 }, { row: -1, column: -1, limit: 1 }, { row: 0, column: -1, limit: 1 }, { row: 1, column: -1, limit: 1 }, { row: 1, column: 0, limit: 1 }, { row: 1, column: 1, limit: 1 }];
    }
}
class Queen extends ChessPieceBase {
    constructor(fenKey: string) {
        super(fenKey);
    }
    getChessPieceSteps(): ChessPieceStep[] {
        return [{ row: 0, column: 1 }, { row: -1, column: 1 }, { row: -1, column: 0 }, { row: -1, column: -1 }, { row: 0, column: -1 }, { row: 1, column: -1 }, { row: 1, column: 0 }, { row: 1, column: 1 }];
    }
}
class Knight extends ChessPieceBase {
    constructor(fenKey: string) {
        super(fenKey);
    }
    getChessPieceSteps(): ChessPieceStep[] {
        return [{ row: 2, column: -1, limit: 1 }, { row: 1, column: -2, limit: 1 }, { row: -1, column: -2, limit: 1 }, { row: -2, column: -1, limit: 1 }, { row: -2, column: 1, limit: 1 }, { row: -1, column: 2, limit: 1 }, { row: 1, column: 2, limit: 1 }, { row: 2, column: 1, limit: 1 }];
    }
}

class Bishop extends ChessPieceBase {
    constructor(fenKey: string) {
        super(fenKey);
    }
    getChessPieceSteps(): ChessPieceStep[] {
        return [{ row: 1, column: -1}, { row: -1, column: -1 }, { row: -1, column: 1 }, { row: 1, column: 1}];
    }
}

class Pawn extends ChessPieceBase {
    constructor(fenKey: string) {
        super(fenKey);
    }

    getChessPieceSteps(): ChessPieceStep[] {
        const direction = this.color === 'w' ? 1 : -1;
        
        return [{ row: direction, column: 0, limit: this.moved ? 1 : 2, excludesTake: true }, { row: direction, column: 1, limit: 1, requiresTake: true, allowsEnPassant: true }, { row: direction, column: -1, limit: 1, requiresTake: true, allowsEnPassant: true }];
    }
}