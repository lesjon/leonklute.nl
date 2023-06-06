import { ChessPiece, ChessPieceFromFen, FENpieces, isOpponentFen } from './chess-pieces';
import { rows, columns, Square, columnLetters } from './chess-board';



export default class ChessGame {
    start_position_fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    turn = 'w';
    castling = 'KQkq';
    enPassant = '-';
    halfMove = '0';
    fullMove = '1';
    board2DArray: (ChessPiece | null)[][] = Array.from(rows, () => Array.from(columns, () => null));

    constructor(fen?: string) {
        if (fen) {
            this.board2DArray = this.fenParser(fen);
        } else {
            this.newGame();
        }
    }

    newGame() {
        this.board2DArray = this.fenParser(this.start_position_fen);
    }


    getPieceAt(row: number, column: number) {
        return this.board2DArray[row - 1][column - 1];
    }

    fenParser(fen: string) {
        const fenArray = fen.split(' ');
        const board = fenArray[0];
        this.turn = fenArray[1];
        this.castling = fenArray[2];
        this.enPassant = fenArray[3];
        this.halfMove = fenArray[4];
        this.fullMove = fenArray[5];
        const boardArray = board.split('/').reverse();
        const board2DArray = boardArray.map(row => {
            const rowArray = row.split('');
            const row2DArray = rowArray.map(cell => {
                if (isNaN(Number(cell))) {
                    return ChessPieceFromFen(cell as FENpieces);
                } else {
                    return Array.from({ length: Number(cell) }, () => null);
                }
            });
            return row2DArray.flat();
        });
        return board2DArray;
    }

    movePiece(from: Square, to: Square) {
        const piece = this.getPieceAt(from.row, from.column);
        this.board2DArray[from.row - 1][from.column - 1] = null;
        this.board2DArray[to.row - 1][to.column - 1] = piece;
        const rowDelta = to.row - from.row;
        if (piece?.getFenKey().toLowerCase() === 'p') {
            switch (rowDelta) {
                case 2:
                    this.enPassant = `${columnLetters[to.column]}${to.row - 1}`;
                    break;
                case -2:
                    this.enPassant = `${columnLetters[to.column]}${to.row + 1}`;
                    break;
                default:
                    this.enPassant = '-';
            }
        } else {
            this.enPassant = '-';
        }
        this.turn = this.turn === 'w' ? 'b' : 'w';
    }

    movePieceIfLegal(from: Square, to: Square, enPassant?: Square) {
        if (!from.piece) {
            return false;
        }
        if (ChessPieceFromFen(from.piece)?.getColor() !== this.turn) {
        }

        if (!to.piece) {
            this.movePiece(from, to);
            return true;
        } else if (isOpponentFen(from.piece, to.piece)) {
            this.movePiece(from, to);
            return true;
        }
        return false;
    }
}

export class EnPassant implements Square {
    row: number;
    column: number;
    constructor(enPassentFen: string) {
        console.log({ enPassentFen })
        const column = enPassentFen[0];
        const row = enPassentFen[1];
        this.row = Number(row);
        const colNumber: number = columnLetters[column as keyof typeof columnLetters];
        this.column = colNumber;
    }
}