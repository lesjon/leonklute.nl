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

export interface ChessPiece {
    getFullName(): string;
    getFenKey(): string;
    getColor(): string;
    isOpponent(piece: ChessPiece): boolean;
    getPossibleMoves(position: Square, enPassant?: EnPassant): Square[];
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

abstract class ChessPieceBase implements ChessPiece{
    fullName: string;
    fenKey: string;
    color: string;
    constructor(fenKey: string){
        this.fullName = fen2FullName(fenKey);
        this.fenKey = fenKey;
        this.color = fenKey === fenKey.toUpperCase() ? 'white' : 'black';        
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
    abstract getPossibleMoves(position: Square): Square[];
}

function moveStraight(position: Square): Square[]{
    const possibleMoves: Square[] = [];
    possibleMoves.push(...Array.from(rows, (v) => ({row: v, column: position.column})));
    possibleMoves.push(...Array.from(columns, (v) => ({row: position.row, column: v})));
    return possibleMoves;
}

function moveDiagonally(position: Square): Square[]{
    const possibleMoves: Square[] = [];
    const rowsBack = Array.from(rows, (v, i) => -v);
    const allRows = [...rowsBack, ...rows];
    const columnsBack = Array.from(columns, (v, i) => -v);
    const allColumns = [...columnsBack, ...columns];
    for(let i = 0; i < allRows.length; i++){
        possibleMoves.push({row: position.row + allRows[i], column: position.column + allColumns[i]});
        possibleMoves.push({row: position.row + allRows[i], column: position.column - allColumns[i]});
    }
    return possibleMoves;
}

class Rook extends ChessPieceBase{
    getPossibleMoves(position: Square): Square[] {
        const possibleMoves = moveStraight(position);
        possibleMoves.filter(move => move === position)
        return possibleMoves;
    }

    constructor(fenKey: string){
        super(fenKey);
    }
}
class King extends ChessPieceBase{
    constructor(fenKey: string){
        super(fenKey);
    }
    getPossibleMoves(position: Square): Square[] {
        let possibleMoves: Square[] = [];
        const deltas = [-1, 0, 1];
        possibleMoves = Array.from(deltas, (v) => Array.from(deltas, (w) => ({row: position.row + v, column: position.column + w}))).flat();
        possibleMoves.filter(move => move === position)
        return possibleMoves;
    }
}
class Queen extends ChessPieceBase{
    constructor(fenKey: string){
        super(fenKey);
    }
    getPossibleMoves(position: Square): Square[] {
        const possibleMoves = moveStraight(position);
        possibleMoves.push(...moveDiagonally(position));
        possibleMoves.filter(move => move === position);
        return possibleMoves;
    }
}
class Knight extends ChessPieceBase{
    constructor(fenKey: string){
        super(fenKey);
    }
    getPossibleMoves(position: Square): Square[] {
        return [];
    }
}
class Bishop extends ChessPieceBase{
    constructor(fenKey: string){
        super(fenKey);
    }
    getPossibleMoves(position: Square): Square[] {
        const possibleMoves = moveDiagonally(position);
        possibleMoves.filter(move => move === position);
        return possibleMoves;
    }
}

class Pawn extends ChessPieceBase{
    constructor(fenKey: string){
        super(fenKey);
    }
    getPossibleMoves(position: Square, enPassant?: Square): Square[] {
        console.log('getPossibleMoves', position, enPassant);
        const possibleMoves: Square[] = [];
        if (enPassant){
            console.log('enPassant', enPassant);
            const adjacentColumn = position.column === enPassant.column + 1 || position.column === enPassant.column - 1;
            const correctRow = this.color === 'white' ? position.row === 4 : position.row === 5;
            if (adjacentColumn && correctRow){
                possibleMoves.push(enPassant);
            }
        }

        if(this.color === 'white'){
            if (position.row === 7) {
                possibleMoves.push({row: position.row - 2, column: position.column});
            }
            possibleMoves.push({row: position.row - 1, column: position.column});
        } else {
            if (position.row === 2) {
                possibleMoves.push({row: position.row + 2, column: position.column});
            }
            possibleMoves.push({row: position.row + 1, column: position.column});
        }
        console.log('possibleMoves', possibleMoves);
        return possibleMoves;
    }
}