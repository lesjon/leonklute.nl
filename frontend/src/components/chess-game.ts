import ChessBoard, { columnLetters, columns, isSameLocation, rows, Square, SquareWithPiece } from './chess-board';
import Move, { Castling, EnPassant } from './chess-move';
import { chessPieceFromType, ChessPieceType, PlayerColor } from './chess-pieces';
import MoveTree, {MoveNode} from './move-tree';
import Player from './player';

export class CastlingState {
    whiteShort?: Castling;
    whiteLong?: Castling;
    blackShort?: Castling;
    blackLong?: Castling;
    constructor(whiteShort?: Castling, whiteLong?: Castling, blackShort?: Castling, blackLong?: Castling) {
        this.whiteShort = whiteShort;
        this.whiteLong = whiteLong;
        this.blackShort = blackShort;
        this.blackLong = blackLong;
    }
}


export default class ChessGame{
    turn: PlayerColor = 'w';
    castling?: CastlingState;
    enPassant = new EnPassant('-');
    halfMove = '0';
    fullMove = '1';
    check = false;
    chessBoard: ChessBoard = new ChessBoard(8, 8);
    whitePlayer?: Player;
    blackPlayer?: Player;
    winner?: Player;

    moveTree: MoveTree = new MoveTree();

    constructor() {
        this.blackPlayer = new Player('black', 1, 'NB');
        this.whitePlayer = new Player('white', 0);
    }

    getPieceAt(row: number, column: number) {
        return this.chessBoard.getPiece({ row, column });
    }

    move(move: Move) {
        if (move.castling) {
            const kingMovedChessBoard = ChessGame.movePiece(this.chessBoard, move.castling.kingMove.from!, move.castling.kingMove);
            this.chessBoard = ChessGame.movePiece(kingMovedChessBoard, move.castling.rookMove.from!, move.castling.rookMove);
        } else {
            this.chessBoard = ChessGame.movePiece(this.chessBoard, move.from!, move);
        }
        if (move.promotion) {
            this.chessBoard.setPiece(move, move.promotion);
        }
        this.enPassant = ChessGame.computeEnPassent(move);
        this.turn = this.turn === 'w' ? 'b' : 'w';
        this.check = this.isInCheck(this.turn, this.chessBoard);
        if (this.check) {
            move.check = true;
            if (this.getAllMoves(this.turn, this.chessBoard, true).length === 0) {
                move.checkmate = true;
                this.winner = this.turn === 'w' ? this.blackPlayer : this.whitePlayer;
            }
        }
        this.updateCastling(move);
    }

    moveBack() {
        const currentMoveNode = this.moveTree.getCurrentNode();
        if (!currentMoveNode) {
            return;
        }
        const move = currentMoveNode.getMove();
        if (move.castling) {
            this.reverseCastling(move);
        } else {
            this.chessBoard = ChessGame.movePiece(this.chessBoard, move, move.from!);
        }
        if (move.promotion) {
            this.chessBoard.setPiece(move.from!, move.piece);
        }
        if (move.takes) {
            if (move.enPassant?.squareToTake) {
                this.chessBoard.setPiece(move.enPassant.squareToTake, move.takes);
            } else {
                this.chessBoard.setPiece(move, move.takes);
            }
        }
        this.turn = this.turn === 'w' ? 'b' : 'w';
        this.moveTree.stepBack();
    }

    canMoveBack() {
        return this.moveTree.canStepBack();
    }

    canMoveForward() {
        return this.moveTree.canStepForward();
    }

    moveForward() {
        const nextMove = this.moveTree.stepForward()
        if (!nextMove) {
            return;
        }
        const move = nextMove.move;
        this.move(move);
    }


    movePieceIfLegal(moveToValidate: Move) {
        const from: Square = moveToValidate.from ?? { row: 0, column: 0 };
        const to: Move = moveToValidate;
        if (!from.piece) {
            return false;
        }
        if (from.piece?.getColor() !== this.turn) {
            return false;
        }
        const possibleMoves = this.getPossibleMovesFor(from, this.turn, this.chessBoard, true);
        const validatedMove: Move | undefined = possibleMoves.find(move => isSameLocation(move, to));
        if (!validatedMove) {
            return false;
        }
        validatedMove.promotion = moveToValidate.promotion;
        if (validatedMove.enPassant?.squareToTake) {
            this.chessBoard.setPiece(validatedMove.enPassant.squareToTake, null);
        }
        if (!to.takes) {
            this.move(validatedMove);
            this.moveTree.addNextMove(validatedMove);
            return true;
        } else if (from.piece.isOpponent(to.takes)) {
            this.move(validatedMove);
            this.moveTree.addNextMove(validatedMove);
            return true;
        }
        return false;
    }

    getPossibleMovesFor(from: Square, playerColor: PlayerColor, chessBoard: ChessBoard, checkCheck: boolean, excludeCastling?: boolean): Move[] {
        const possibleMoves: Move[] = [];
        const piece = chessBoard.getPiece(from);
        playerColor = playerColor;
        if (!piece) {
            return possibleMoves;
        }
        if (piece.getColor() !== playerColor) {
            return possibleMoves;
        }

        piece.getChessPieceSteps().forEach(step => {
            const maxDistance = Math.max(rows.length, columns.length);
            for (let i = 0; i < (step.limit || maxDistance); i++) {
                const nextMove: Move = {
                    row: from.row + ((i + 1) * step.row), column: from.column + ((i + 1) * step.column),
                    piece: piece, from,
                    shortCastle: step.shortCastle, longCastle: step.longCastle
                };
                if (!chessBoard.isWithinBoard(nextMove)) {
                    break;
                }
                const attackedPiece = chessBoard.getPiece(nextMove);
                if (attackedPiece && step.excludesTake) {
                    break;
                }
                if (attackedPiece && !piece.isOpponent(attackedPiece)) {
                    break;
                }
                const enPassant: EnPassant = this.enPassant;
                const canEnPassant = isSameLocation(enPassant, nextMove);
                if (canEnPassant && step.allowsEnPassant) {
                    nextMove.enPassant = enPassant;
                    nextMove.takes = enPassant.squareToTake?.piece ?? undefined;
                }
                if (!(attackedPiece || canEnPassant) && step.requiresTake) {
                    break;
                }
                if ((step.shortCastle || step.longCastle) ) {
                    if (excludeCastling) {
                        break;
                    }
                    const castling = this.getOptionalCastling(nextMove);
                    if (!castling) {
                        break;
                    }
                    nextMove.castling = castling;
                }
                if (step.promotion && this.isPromotion(nextMove)) {
                    nextMove.promotion = chessPieceFromType(step.promotion) ?? undefined;
                } else if (step.promotion && !this.isPromotion(nextMove)) {
                    break;
                }
                if (checkCheck) {
                    const newPosition = ChessGame.movePiece(this.chessBoard, nextMove.from!, nextMove);
                    if (nextMove.promotion) {
                        newPosition.setPiece(nextMove, nextMove.promotion);
                    }
                    const check = this.isInCheck(this.turn, newPosition);
                    nextMove.check = this.isInCheck(this.turn === 'w' ? 'b' : 'w', newPosition);
                    if (check) {
                        continue;
                    }
                }
                possibleMoves.push(nextMove);
                if (attackedPiece) {
                    nextMove.takes = attackedPiece;
                    break;
                }
            }
        });

        return possibleMoves;
    }

    getPossibleMovesExcludingCastlingFor(from: Square, playerColor: PlayerColor, chessBoard: ChessBoard, checkCheck: boolean): Move[] {
        return this.getPossibleMovesFor(from, playerColor, chessBoard, checkCheck, true);
    }

    isInCheck(turn: PlayerColor, chessBoard: ChessBoard): boolean {
        let moves = this.getAllMovesExcludingCastling(turn === 'w' ? 'b' : 'w', chessBoard, false);
        const king = chessBoard.getKing(turn);
        if (!king) {
            return false;
        }
        moves = moves.filter(move => isSameLocation(move, king));
        const check = moves.length > 0;
        return check
    }

    isPromotion(moveWithoutPromotion: Move) {
        if (!moveWithoutPromotion.from) {
            return false;
        }
        const piece = this.chessBoard.getPiece(moveWithoutPromotion.from);
        if (!piece) {
            return false;
        }
        if (piece.getType() !== ChessPieceType.whitePawn && piece.getType() !== ChessPieceType.blackPawn) {
            return false;
        }
        if (piece.getColor() === 'w' && moveWithoutPromotion.row !== rows[rows.length - 1]) {
            return false;
        }
        if (piece.getColor() === 'b' && moveWithoutPromotion.row !== rows[0]) {
            return false;
        }
        return true;
    }

    static movePiece(chessBoard: ChessBoard, from: Square, to: Square) {
        const newChessBoard = chessBoard.clone();
        const piece = newChessBoard.getPiece(from);
        piece?.setMoved();
        newChessBoard.setSquare({ row: from.row, column: from.column, piece: null });
        newChessBoard.setPiece({ row: to.row, column: to.column }, piece);
        return newChessBoard;
    }

    static computeEnPassent(move: Move) {
        const { from, row, column, piece } = move;
        let enPassant = new EnPassant('-');
        if (!from) {
            return enPassant;
        }
        const rowDelta = row - from.row;
        if (piece?.toFen().toLowerCase() === 'p') {
            switch (rowDelta) {
                case 2:
                    enPassant = new EnPassant(`${columnLetters[column]}${row - 1}`, move);
                    break;
                case -2:
                    enPassant = new EnPassant(`${columnLetters[column]}${row + 1}`, move);
                    break;
            }
        }
        return enPassant;
    }

    getOptionalCastling(move: Move): Castling | null {
        if (move.piece.hasMoved()) {
            return null;
        }
        if (!move.shortCastle && !move.longCastle) {
            return null;
        }
        const kingSquare = this.chessBoard.getKing(move.piece.getColor());
        if (!kingSquare) {
            return null;
        }
        return this.getOptionalCastlingForKing(move, kingSquare);
    }

    getOptionalCastlingForKing(move: Move, kingSquare: SquareWithPiece): Castling | null {
        if (!this.castling) {
            return null;
        }
        const rookType = kingSquare.piece.getColor() === 'w' ? ChessPieceType.whiteRook : ChessPieceType.blackRook;
        const long = kingSquare.piece.getColor() === 'w' ? this.castling.whiteLong : this.castling.blackLong;
        const short = kingSquare.piece.getColor() === 'w' ? this.castling.whiteShort : this.castling.blackShort;
        const unmovedRooks = this.chessBoard.getPieces(rookType)
            .filter(square => !square.piece.hasMoved());
        if (unmovedRooks.length === 0) {
            return null;
        }
        if (short && move.shortCastle) {
            const rook = unmovedRooks.filter(rook => rook.column > kingSquare.column).at(0);
            if (!rook) {
                return null;
            }
            if (this.isInCheck(move.piece.getColor(), this.chessBoard)) {
                return null;
            }
            for (let col = kingSquare.column + 1; col < rook.column; col++) {
                if (this.chessBoard.getPiece({ row: kingSquare.row, column: col })) {
                    return null;
                }
                const testCheckChessBoard = ChessGame.movePiece(this.chessBoard, { row: kingSquare.row, column: kingSquare.column }, { row: kingSquare.row, column: col });
                if (this.isInCheck(move.piece.getColor(), testCheckChessBoard)) {
                    return null;
                }
            }
            return short;
        } else if (long && move.longCastle) {
            const rook = unmovedRooks.filter(rook => rook.column < kingSquare.column).at(0);
            if (!rook) {
                return null;
            }
            if (this.check) {
                return null;
            }
            for (let col = rook.column + 1; col < kingSquare.column; col++) {
                if (this.chessBoard.getPiece({ row: kingSquare.row, column: col })) {
                    return null;
                }
                const testCheckChessBoard = ChessGame.movePiece(this.chessBoard, { row: kingSquare.row, column: kingSquare.column }, { row: kingSquare.row, column: col });
                if (this.isInCheck(move.piece.getColor(), testCheckChessBoard)) {
                    return null;
                }
            }
            return long;
        }
        return null;
    }

    updateCastling(move: Move) {
        if (!this.castling) {
            return;
        }
        const whiteKing = this.chessBoard.getKing('w');
        const blackKing = this.chessBoard.getKing('b');
        if (move.piece.getType() === ChessPieceType.whiteKing) {
            if (this.castling.whiteShort)
                this.castling.whiteShort.allowed = false;
            if (this.castling.whiteLong)
                this.castling.whiteLong.allowed = false;
        } else if (move.piece.getType() === ChessPieceType.blackKing) {
            if (this.castling.blackShort)
                this.castling.blackShort.allowed = false;
            if (this.castling.blackLong)
                this.castling.blackLong.allowed = false;
        } else if (move.piece.getType() === ChessPieceType.whiteRook && whiteKing && move.from && move.from?.column < whiteKing?.column) {
            if (this.castling.whiteLong)
                this.castling.whiteLong.allowed = false;
        } else if (move.piece.getType() === ChessPieceType.whiteRook && whiteKing && move.from && move.from?.column > whiteKing?.column) {
            if (this.castling.whiteShort)
                this.castling.whiteShort.allowed = false;
        } else if (move.piece.getType() === ChessPieceType.blackRook && blackKing && move.from && move.from?.column < blackKing?.column) {
            if (this.castling.blackLong)
                this.castling.blackLong.allowed = false;
        } else if (move.piece.getType() === ChessPieceType.blackRook && blackKing && move.from && move.from?.column > blackKing?.column) {
            if (this.castling.blackShort)
                this.castling.blackShort.allowed = false;
        }
    }

    reverseCastling(move: Move) {
        // TODO: reverse castling should reset all valid castling states, currently only reset the state of th performed castling
        if (!this.castling || !move.castling) {
            return;
        }
        const kingMovedChessBoard = ChessGame.movePiece(this.chessBoard, move.castling.kingMove, move.castling.kingMove.from!);
        this.chessBoard = ChessGame.movePiece(kingMovedChessBoard, move.castling.rookMove, move.castling.rookMove.from!);
        const color = move.piece.getColor();
        if (move.shortCastle) {
            if (color === 'w') {
                if (this.castling.whiteShort)
                    this.castling.whiteShort.allowed = true;
            } else {
                if (this.castling.blackShort)
                    this.castling.blackShort.allowed = true;
            }
        } else if (move.longCastle) {
            if (color === 'w') {
                if (this.castling.whiteLong)
                    this.castling.whiteLong.allowed = true;
            } else {
                if (this.castling.blackLong)
                    this.castling.blackLong.allowed = true;
            }
        }
    }

    getAllMoves(color: PlayerColor, chessBoard: ChessBoard, checkCheck: boolean): Move[] {
        const squares = chessBoard.getAllSquares();
        const moves: Move[] = [];
        squares.forEach(square => {
            this.getPossibleMovesFor(square, color, chessBoard, checkCheck).forEach(move => {
                moves.push(move);
            });
        });
        return moves;
    }

    /*
     * It is the same as getAllMoves, but it excludes castling
     * moves, needed to prevent exceeding call stack.
     */
    getAllMovesExcludingCastling(color: PlayerColor, chessBoard: ChessBoard, checkCheck: boolean): Move[] {
        const squares = chessBoard.getAllSquares();
        const moves: Move[] = [];
        squares.forEach(square => {
            this.getPossibleMovesExcludingCastlingFor(square, color, chessBoard, checkCheck).forEach(move => {
                moves.push(move);
            });
        });
        return moves;
    }
}
