import { Square, columns, rows } from './chess-board';
import { EnPassant } from './chess-game';


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
}

export interface ChessPiece {
    getFullName(): string;
    getFenKey(): string;
    getColor(): string;
    isOpponent(piece: ChessPiece): boolean;
    getPossibleMoves(position: Square, enPassant?: EnPassant): Square[];
    getChessPieceSteps(): ChessPieceStep[];
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

export function isOpponentFen(fromFen: FENpieces, toFen: FENpieces): boolean {
    const fromPiece = ChessPieceFromFen(fromFen);
    const toPiece = ChessPieceFromFen(toFen);
    if (!fromPiece || !toPiece) {
        return false;
    }
    return fromPiece?.isOpponent(toPiece);
}

abstract class ChessPieceBase implements ChessPiece {
    fullName: string;
    fenKey: string;
    color: string;
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
    getPossibleMoves(position: Square): Square[] {
        const possibleMoves: Square[] = [];
        this.getChessPieceSteps().forEach(step => {
            console.log('step', step);
            for (let i = 0; i < (step.limit || 8); i++) {
                possibleMoves.push({ row: position.row + ((i+1)*step.row), column: position.column + ((i+1)*step.column) });
            }
        });
        return possibleMoves;
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
        return [{ row: 0, column: 1, limit: 1 }, { row: -1, column: 1, limit: 1 }, { row: -1, column: 0, limit: 1 }, { row: -1, column: -1, limit: 1 }, { row: 0, column: -1, limit: 1 }, { row: 1, column: -1, limit: 1 }, { row: 1, column: 0, limit: 1 }, { row: 1, column: 1, limit: 1 }];
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

    computeEnPassant(position: Square, enPassant?: Square): Square | undefined {
        if (enPassant) {
            console.log('enPassant', enPassant);
            const adjacentColumn = position.column === enPassant.column + 1 || position.column === enPassant.column - 1;
            const correctRow = this.color === 'w' ? position.row === 5 : position.row === 4;
            if (adjacentColumn && correctRow) {
                return enPassant;
            }
        }
    }


    getPossibleMoves(position: Square, enPassant?: Square): Square[] {
        console.log('getPossibleMoves', position, enPassant);
        const possibleMoves: Square[] = [];
        const enPassantMove = this.computeEnPassant(position, enPassant);
        if (enPassantMove) {
            possibleMoves.push(enPassantMove);
        }

        if (this.color === 'w') {
            if (position.row === 2) {
                possibleMoves.push({ row: position.row + 2, column: position.column });
            }
            possibleMoves.push({ row: position.row + 1, column: position.column });
        } else {
            if (position.row === 7) {
                possibleMoves.push({ row: position.row - 2, column: position.column });
            }
            possibleMoves.push({ row: position.row - 1, column: position.column });
        }
        console.log('possibleMoves', possibleMoves);
        return possibleMoves;
    }

    getChessPieceSteps(): ChessPieceStep[] {
        return [{ row: 1, column: 0, limit: 1 }];
    }
}