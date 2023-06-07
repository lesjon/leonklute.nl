import ChessPiece, { ChessPieceFromFen, FENpieces } from './chess-pieces';
import ChessBoard, { rows, columns, Square, columnLetters, isSameLocation } from './chess-board';



export default class ChessGame {
    start_position_fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    turn = 'w';
    castling = 'KQkq';
    enPassant = new EnPassant('-');
    halfMove = '0';
    fullMove = '1';
    chessBoard: ChessBoard;

    constructor(fen?: string) {
        if (fen) {
            this.chessBoard = this.fenParser(fen);
        } else {
            this.chessBoard = this.getNewGame();
        }
    }

    public newGame() {
        this.chessBoard = this.getNewGame();
    }

    getNewGame() {
        return this.fenParser(this.start_position_fen);
    }

    getPieceAt(row: number, column: number) {
        return this.chessBoard.getPiece({ row, column });
    }

    fenParser(fen: string): ChessBoard {
        const fenArray = fen.split(' ');
        const board = fenArray[0];
        this.turn = fenArray[1];
        this.castling = fenArray[2];
        this.enPassant = new EnPassant(fenArray[3]);
        this.halfMove = fenArray[4];
        this.fullMove = fenArray[5];
        const boardArray = board.split('/').reverse();
        const chessBoard = new ChessBoard(8, 8);
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
        chessBoard.setBoard(board2DArray);
        return chessBoard;
    }

    toFen() {
        const boardArray = this.chessBoard.getBoard().map(row => {
            const rowArray = row.map(cell => {
                if (cell) {
                    return cell.getFenKey();
                } else {
                    return '1';
                }
            });
            //  TODO: sum 1s into a number
            return rowArray.join('');
        });
        const board = boardArray.reverse().join('/');
        return `${board} ${this.turn} ${this.castling} ${this.enPassant.toFen()} ${this.halfMove} ${this.fullMove}`;
    }

    movePiece(from: Square, to: Square) {
        const piece = this.getPieceAt(from.row, from.column);
        piece?.setMoved();
        this.chessBoard.setSquare({ row: from.row, column: from.column, piece: null });
        this.chessBoard.setPiece({ row: to.row, column: to.column }, piece);
        this.computeEnPassent(from, to, piece);
        this.turn = this.turn === 'w' ? 'b' : 'w';
    }

    computeEnPassent(from: Square, to: Square, piece: ChessPiece | null) {
        const rowDelta = to.row - from.row;
        this.enPassant = new EnPassant('-');
        if (piece?.getFenKey().toLowerCase() === 'p') {
            const removePawnCallback = () => this.chessBoard.setPiece(to, null);
            switch (rowDelta) {
                case 2:
                    this.enPassant = new EnPassant(`${columnLetters[to.column]}${to.row - 1}`, removePawnCallback);
                    break;
                case -2:
                    this.enPassant = new EnPassant(`${columnLetters[to.column]}${to.row + 1}`, removePawnCallback);
                    break;
            }
        }

    }

    movePieceIfLegal(from: Square, to: Square) {
        if (!from.piece) {
            console.info('no piece');
            return false;
        }
        if (from.piece?.getColor() !== this.turn) {
            console.info('not your turn');
            return false;
        }
        const possibleMoves = this.getPossibleMoves(from);
        const move: Move | undefined = possibleMoves.find(move => isSameLocation(move, to));
        if (!move) {
            console.info('not a possible move');
            return false;
        }
        move?.enPassant?.callBack?.();

        if (!to.piece) {
            this.movePiece(from, to);
            return true;
        } else if (from.piece.isOpponent(to.piece)) {
            this.movePiece(from, to);
            return true;
        }
        return false;
    }

    getPossibleMoves(from: Square): Move[] {
        const possibleMoves: Move[] = [];
        const piece = this.getPieceAt(from.row, from.column);
        if (!piece) {
            return possibleMoves;
        }
        if (piece.getColor() !== this.turn) {
            return possibleMoves;
        }

        piece.getChessPieceSteps().forEach(step => {
            const maxDistance = Math.max(rows.length, columns.length);
            for (let i = 0; i < (step.limit || maxDistance); i++) {
                const nextMove: Move = { row: from.row + ((i + 1) * step.row), column: from.column + ((i + 1) * step.column), piece: piece };
                if (!this.isWithinBoard(nextMove)) {
                    break;
                }
                const attackedPiece = this.getPieceAt(nextMove.row, nextMove.column);
                if (attackedPiece && step.excludesTake) {
                    break;
                }
                if (attackedPiece && !piece.isOpponent(attackedPiece)) {
                    break;
                }
                const enPassant = this.enPassant;
                const canEnPassant = isSameLocation(enPassant, nextMove);
                if (canEnPassant && step.allowsEnPassant) {
                    nextMove.enPassant = enPassant;
                }
                if (!(attackedPiece || canEnPassant) && step.requiresTake) {
                    break;
                }
                possibleMoves.push(nextMove);
                if (attackedPiece) {
                    break;
                }
            }
        });

        return possibleMoves;
    }
    isWithinBoard(square: Square) {
        return square.row > 0 && square.row < 9 && square.column > 0 && square.column < 9;
    }
}

interface Move extends Square {
    piece: ChessPiece;
    enPassant?: EnPassant;
}


export class EnPassant implements Square {
    row: number;
    column: number;
    callBack?: () => void;

    constructor(enPassentFen: string, callBack?: () => void) {
        this.callBack = callBack;
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
