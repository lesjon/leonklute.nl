
// define rows as 1 to 8
export const rows = Array.from({ length: 8 }, (_, i) => i + 1);
// define columns as a to h
export const columns = Array.from({ length: 8 }, (_, i) => i + 1);

export interface Square {
    row: number;
    column: number;
    piece?: string;
}

export enum columnLetters {
    a = 0,
    b = 1,
    c = 2,
    d = 3,
    e = 4,
    f = 5,
    g = 6,
    h = 7
}

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


export default class ChessGame{
    start_position_fen ='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    turn = 'w';
    castling = 'KQkq';
    enPassant = '-';
    halfMove = '0';
    fullMove = '1';
    board2DArray: (string| null)[][] = Array.from({length: 8}, (_, i) => Array.from({length: 8}, (_, j) => null));

    constructor(fen?: string){
        if (fen){
            this.board2DArray = this.fenParser(fen);
        } else {
            this.board2DArray = this.fenParser(this.start_position_fen);
        }
    }
    
    getPieceAt(row: number, column: number){
        return this.board2DArray[row-1][column-1];
    }

    fenParser(fen: string){
        const fenArray = fen.split(' ');
        const board = fenArray[0];
        this.turn = fenArray[1];
        this.castling = fenArray[2];
        this.enPassant = fenArray[3];
        this.halfMove = fenArray[4];
        this.fullMove = fenArray[5];
        const boardArray = board.split('/');
        const board2DArray = boardArray.map(row => {
            const rowArray = row.split('');
            const row2DArray = rowArray.map(cell => {
                if (isNaN(Number(cell))){
                    return cell;
                } else {
                    return Array.from({length: Number(cell)}, (_, i) => null);
                }
            });
            return row2DArray.flat();
        });
        return board2DArray;
    }

    movePiece(from: Square, to: Square){
        const piece = this.getPieceAt(from.row, from.column);
        this.board2DArray[from.row-1][from.column-1] = null;
        this.board2DArray[to.row-1][to.column-1] = piece;
    }
}