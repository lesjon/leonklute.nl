import ChessPiece, { ChessPieceType, PlayerColor } from './chess-pieces';
import ChessBoard, { rows, columns, Square, columnLetters, isSameLocation, SquareWithPiece } from './chess-board';
import Player from './player';

class MoveNode {
    move: Move;
    children: MoveNode[];
    constructor(move: Move) {
        this.move = move;
        this.children = [];
    }
    getMove() {
        return this.move;
    }
    getChildren() {
        return this.children;
    }
    addChild(moveNode: MoveNode) {
        this.children.push(moveNode);
    }
    getNextMainLine() {
        return this.children.at(0);
    }

    getMainLine() {
        const mainLine: Move[] = [this.move];
        let currentNode: MoveNode | undefined = this.getNextMainLine();
        while (currentNode) {
            mainLine.push(currentNode.move);
            currentNode = currentNode.getNextMainLine();
        }
        return mainLine;
    }
}

export interface Move extends Square {
    piece: ChessPiece;
    takes?: ChessPiece;
    enPassant?: EnPassant;
    castling?: Castling;
    promotion?: ChessPieceType;
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
        this.chessBoard = ChessGame.movePiece(this.chessBoard, move.from!, move);
        this.enPassant = ChessGame.computeEnPassent(move);
        this.turn = this.turn === 'w' ? 'b' : 'w';
        this.check = this.isInCheck(this.turn, this.chessBoard);
        if (this.check) {
            console.info('check');
        }
        this.updateCastling(move);
        const moveNode = new MoveNode(move);
        if (this.currentMoveNode) {
            this.currentMoveNode?.addChild(moveNode);
            this.currentMoveNode = moveNode;
        } else {
            this.moveTree.push(moveNode);
            this.currentMoveNode = moveNode;
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

    movePieceIfLegal(from: Square, to: Square) {
        if (!from.piece) {
            console.info('no piece');
            return false;
        }
        if (from.piece?.getColor() !== this.turn) {
            console.info('not your turn');
            return false;
        }
        const possibleMoves = this.getPossibleMovesFor(from, this.turn, this.chessBoard);
        const move: Move | undefined = possibleMoves.find(move => isSameLocation(move, to));
        
        if (!move) {
            console.info('not a possible move');
            return false;
        }
        console.info(`calculate if player (${this.turn}) is in check after his move: `, move);
        const newPosition = ChessGame.movePiece(this.chessBoard, move.from!, move);
        const check = this.isInCheck(this.turn, newPosition);
        if (check) {
            console.info('illegal cant be in check after move');
            return false;
        }
        if (move.enPassant?.squareToTake) {
            this.chessBoard.setPiece(move.enPassant.squareToTake, null);
        }
        if (!to.piece) {
            this.move(move);
            return true;
        } else if (from.piece.isOpponent(to.piece)) {
            this.move(move);
            return true;
        }
        return false;
    }

    getPossibleMovesFor(from: Square, playerColor: PlayerColor, chessBoard: ChessBoard): Move[] {
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
                if ((step.shortCastle || step.longCastle) && !this.isPossibleCastle(nextMove)) {
                    break;
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

    isPossibleCastle(move: Move): boolean {
        console.log('isPossibleCastle', move);
        if (move.piece.hasMoved()) {
            console.log('move.piece.hasMoved()');
            return false;
        }
        if (!move.shortCastle && !move.longCastle) {
            console.log('!move.shortCastle && !move.longCastle');
            return false;
        }
        const kingSquare = this.chessBoard.getKing(move.piece.getColor());
        if (!kingSquare) {
            throw new Error('No king found');
        }
        console.log('kingSquare', kingSquare, this.castling);
        return this.checkCastlingFor(move, kingSquare);
    }

    checkCastlingFor(move: Move, kingSquare: SquareWithPiece): boolean {
        const rookType = kingSquare.piece.getColor() === 'w' ? ChessPieceType.whiteRook : ChessPieceType.blackRook;
        const unmovedRooks = this.chessBoard.getPieces(rookType)
            .filter(square => !square.piece.hasMoved());
        if (unmovedRooks.length === 0) {
            console.log('unmovedRooks.length', unmovedRooks.length);
            return false;
        }
        if (this.castling.whiteShort && move.shortCastle) {
            if (!this.castling.whiteShort) {
                console.log('castling.whiteShort', this.castling.whiteShort);
                return false;
            }
            const rook = unmovedRooks.filter(rook => rook.column > kingSquare.column).at(0);
            if (!rook) {
                console.log('rook', rook);
                return false;
            }
            for (let col = kingSquare.column + 1; col < rook.column; col++) {
                console.log(col);
                if (this.chessBoard.getPiece({ row: kingSquare.row, column: col })) {
                    console.log('this.chessBoard.getPiece({ row: kingSquare.row, column: col })', this.chessBoard.getPiece({ row: kingSquare.row, column: col }));
                    return false;
                }
            }
            return true;
        } else if (this.castling.whiteLong && move.longCastle) {
            if (!this.castling.whiteLong) {
                return false;
            }
            const rook = unmovedRooks.filter(rook => rook.column > kingSquare.column).at(0);
            if (!rook) {
                console.log('rook', rook);
                return false;
            }
            for (let col = kingSquare.column - 1; col > rook.column; col--) {
                console.log(col);
                if (this.chessBoard.getPiece({ row: kingSquare.row, column: col })) {
                    console.log('this.chessBoard.getPiece({ row: kingSquare.row, column: col })', this.chessBoard.getPiece({ row: kingSquare.row, column: col }));
                    return false;
                }
            }
            return true;
        }
        return false;
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


    getAllMoves(color: PlayerColor, chessBoard: ChessBoard): Move[] {
        const squares = chessBoard.getAllSquares();
        const moves: Move[] = [];
        squares.forEach(square => {
            this.getPossibleMovesFor(square, color, chessBoard).forEach(move => {
                moves.push(move);
            });
        });
        return moves;
    }

    isInCheck(turn: PlayerColor, chessBoard: ChessBoard): boolean {
        console.log('computeCheck', chessBoard, turn);
        let moves = this.getAllMoves(turn === 'w' ? 'b' : 'w', chessBoard);
        console.log('moves', moves);
        const king = chessBoard.getKing(turn);
        console.log('king', king);
        if (!king) {
            return false;
        }
        moves = moves.filter(move => isSameLocation(move, king));
        const check = moves.length > 0;
        return check
    }
}
