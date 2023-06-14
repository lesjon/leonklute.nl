import ChessPiece, { ChessPieceFromType as chessPieceFromType, ChessPieceType, PlayerColor } from './chess-pieces';
import ChessBoard, { rows, columns, Square, columnLetters, isSameLocation, SquareWithPiece } from './chess-board';
import Player from './player';

class MoveNode {
    id: string;
    move: Move;
    parent?: MoveNode;
    children: MoveNode[];
    constructor(move: Move, id: string, parent?: MoveNode) {
        this.id = id;
        this.move = move;
        this.children = [];
        this.parent = parent;
    }
    getMove() {
        return this.move;
    }
    getNextMoves() {
        return this.children;
    }
    addNextMoveNode(moveNode: MoveNode) {
        moveNode.parent = this;
        this.children.push(moveNode);
    }

    getNumberOfLines() {
        return this.children.length;
    }

    private createNextMoveIndex() {
        const getNumberOfLines = this.getNumberOfLines();
        if (getNumberOfLines === 0) {
            const lastIndexOfDot = this.id.lastIndexOf('.');
            let idInt = parseInt(this.id.substring(lastIndexOfDot + 1));
            idInt++;
            return this.id.substring(0, lastIndexOfDot + 1) + idInt;
        }
        return this.id + new Array(this.getNumberOfLines).join('.') + '1';
    }


    addNextMove(move: Move) {
        const newId = this.createNextMoveIndex();
        const moveNode = new MoveNode(move, newId, this);
        this.children.push(moveNode);
        return moveNode;
    }

    getNextMove() {
        return this.children.at(0);
    }

    getMainLine() {
        const mainLine: MoveNode[] = [this];
        let currentNode: MoveNode | undefined = this.getNextMove();
        while (currentNode) {
            mainLine.push(currentNode);
            currentNode = currentNode.getNextMove();
        }
        return mainLine;
    }

    getPrevious() {
        return this.parent;
    }
}

export interface Move extends Square {
    piece: ChessPiece;
    takes?: ChessPiece;
    enPassant?: EnPassant;
    castling?: Castling;
    promotion?: ChessPiece;
    from?: Square;
    check?: boolean;
    checkmate?: boolean;
    shortCastle?: boolean;
    longCastle?: boolean;
}

export class EnPassant implements Square {
    row: number;
    column: number;
    squareToTake?: Square;

    constructor(enPassentFen: string, squareToTake?: Square) {
        this.squareToTake = squareToTake;
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

export class Castling {
    rookMove: Move;
    kingMove: Move;
    constructor(kingMove: Move, rookMove: Move) {
        this.kingMove = kingMove;
        this.rookMove = rookMove;
    }
}

export class CastlingState {
    whiteShort: Castling | null;
    whiteLong: Castling | null;
    blackShort: Castling | null;
    blackLong: Castling | null;
    constructor(whiteShort?: Castling, whiteLong?: Castling, blackShort?: Castling, blackLong?: Castling) {
        this.whiteShort = whiteShort ?? null;
        this.whiteLong = whiteLong ?? null;
        this.blackShort = blackShort ?? null;
        this.blackLong = blackLong ?? null;
    }
}


export default class ChessGame {
    turn: PlayerColor = 'w';
    castling = new CastlingState();
    enPassant = new EnPassant('-');
    halfMove = '0';
    fullMove = '1';
    check = false;
    chessBoard: ChessBoard = new ChessBoard(8, 8);
    whitePlayer?: Player;
    blackPlayer?: Player;
    winner?: Player;

    moveTree: MoveNode[] = [];
    currentMoveNode: MoveNode | undefined = undefined;

    constructor() {
        this.blackPlayer = new Player('black');
        this.whitePlayer = new Player('white');
        this.blackPlayer.title = 'GM';
    }

    getMainLine() {
        return this.moveTree.at(0)?.getMainLine();
    }

    getCurrentMoveNode() {
        return this.currentMoveNode?.getMainLine().at(-1);
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
        if (this.currentMoveNode) {
            const nextMoveNode = this.currentMoveNode.addNextMove(move);
            this.currentMoveNode = nextMoveNode;
        } else {
            const root = new MoveNode(move, ".1");
            this.moveTree.push(root);
            this.currentMoveNode = root;
        }
    }

    private static movePiece(chessBoard: ChessBoard, from: Square, to: Square) {
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

    moveBack() {
        if (!this.currentMoveNode) {
            return;
        }
        const move = this.currentMoveNode.move;
        if (move.castling) {
            const kingMovedChessBoard = ChessGame.movePiece(this.chessBoard, move.castling.kingMove.from!, move.castling.kingMove);
            this.chessBoard = ChessGame.movePiece(kingMovedChessBoard, move.castling.rookMove.from!, move.castling.rookMove);
        } else {
            this.chessBoard = ChessGame.movePiece(this.chessBoard, move, move.from!);
        }
        if (move.promotion) {
            this.chessBoard.setPiece(move.from!, move.piece);
        }
        this.turn = this.turn === 'w' ? 'b' : 'w';
        this.currentMoveNode = this.currentMoveNode.getPrevious();
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
            return true;
        } else if (from.piece.isOpponent(to.takes)) {
            this.move(validatedMove);
            return true;
        }
        return false;
    }

    getPossibleMovesFor(from: Square, playerColor: PlayerColor, chessBoard: ChessBoard, checkCheck: boolean): Move[] {
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
                if ((step.shortCastle || step.longCastle)) {
                    const castling = this.getOptionalCastling(nextMove);
                    if (!castling) {
                        break;
                    }
                    nextMove.castling = castling;
                }
                if (step.promotion && this.isPromotion(nextMove)) {
                    nextMove.promotion = chessPieceFromType(step.promotion) ?? undefined;
                }else if (step.promotion && !this.isPromotion(nextMove)){
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
            for (let col = kingSquare.column + 1; col < rook.column; col++) {
                if (this.chessBoard.getPiece({ row: kingSquare.row, column: col })) {
                    return null;
                }
            }
            return short;
        } else if (long && move.longCastle) {
            const rook = unmovedRooks.filter(rook => rook.column < kingSquare.column).at(0);
            if (!rook) {
                return null;
            }
            for (let col = rook.column + 1; col < kingSquare.column; col++) {
                if (this.chessBoard.getPiece({ row: kingSquare.row, column: col })) {
                    return null;
                }
            }
            return long;
        }
        return null;
    }

    updateCastling(move: Move) {
        const whiteKing = this.chessBoard.getKing('w');
        const blackKing = this.chessBoard.getKing('b');
        if (move.piece.getType() === ChessPieceType.whiteKing) {
            this.castling.whiteShort = null;
            this.castling.whiteLong = null;
        } else if (move.piece.getType() === ChessPieceType.blackKing) {
            this.castling.blackShort = null;
            this.castling.blackLong = null;
        } else if (move.piece.getType() === ChessPieceType.whiteRook && whiteKing && move.from && move.from?.column < whiteKing?.column) {
            this.castling.whiteLong = null;
        } else if (move.piece.getType() === ChessPieceType.whiteRook && whiteKing && move.from && move.from?.column > whiteKing?.column) {
            this.castling.whiteShort = null;
        } else if (move.piece.getType() === ChessPieceType.blackRook && blackKing && move.from && move.from?.column < blackKing?.column) {
            this.castling.blackLong = null;
        } else if (move.piece.getType() === ChessPieceType.blackRook && blackKing && move.from && move.from?.column > blackKing?.column) {
            this.castling.blackShort = null;
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

    isInCheck(turn: PlayerColor, chessBoard: ChessBoard): boolean {
        let moves = this.getAllMoves(turn === 'w' ? 'b' : 'w', chessBoard, false);
        const king = chessBoard.getKing(turn);
        if (!king) {
            return false;
        }
        moves = moves.filter(move => isSameLocation(move, king));
        const check = moves.length > 0;
        return check
    }
}
