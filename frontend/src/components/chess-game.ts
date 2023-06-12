import ChessPiece, { ChessPieceType, PlayerColor } from './chess-pieces';
import ChessBoard, { rows, columns, Square, columnLetters, isSameLocation, SquareWithPiece } from './chess-board';
import Player from './player';
import { C } from 'app/dist/spa/assets/index.7ad02204';

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

export class CastlingState {
    whiteShort = true;
    whiteLong = true;
    blackShort = true;
    blackLong = true;
    constructor(whiteShort?: boolean, whiteLong?: boolean, blackShort?: boolean, blackLong?: boolean) {
        this.whiteShort = whiteShort ?? true;
        this.whiteLong = whiteLong ?? true;
        this.blackShort = blackShort ?? true;
        this.blackLong = blackLong ?? true;
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
        const newPosition = ChessGame.movePiece(this.chessBoard, move.from!, move);
        this.enPassant = ChessGame.computeEnPassent(move);
        this.turn = this.turn === 'w' ? 'b' : 'w';
        this.computeCheck();
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
        const possibleMoves = this.getPossibleMovesFor(from);
        const move: Move | undefined = possibleMoves.find(move => isSameLocation(move, to));
        if (!move) {
            console.info('not a possible move');
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

    getPossibleMovesFor(from: Square, playerColor?: PlayerColor): Move[] {
        const possibleMoves: Move[] = [];
        const piece = this.getPieceAt(from.row, from.column);
        playerColor = playerColor || this.turn;
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
                if (!this.chessBoard.isWithinBoard(nextMove)) {
                    break;
                }
                const attackedPiece = this.getPieceAt(nextMove.row, nextMove.column);
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
                console.log('nextMove', nextMove)
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
        const isWhiteKing = move.piece.getColor() === 'w';
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
            this.castling.whiteShort = false;
            this.castling.whiteLong = false;
        } else if (move.piece.getType() === ChessPieceType.blackKing) {
            this.castling.blackShort = false;
            this.castling.blackLong = false;
        } else if (move.piece.getType() === ChessPieceType.whiteRook && move.from?.column < whiteKing?.column) {
            this.castling.whiteLong = false;
        } else if (move.piece.getType() === ChessPieceType.whiteRook && move.from?.column > whiteKing?.column) {
            this.castling.whiteShort = false;
        } else if (move.piece.getType() === ChessPieceType.blackRook && move.from?.column < blackKing?.column) {
            this.castling.blackLong = false;
        } else if (move.piece.getType() === ChessPieceType.blackRook && move.from?.column > blackKing?.column) {
            this.castling.blackShort = false;
        }
    }


    getAllMoves(color?: PlayerColor): Move[] {
        const squares = this.chessBoard.getAllSquares();
        const moves: Move[] = [];
        squares.forEach(square => {
            this.getPossibleMovesFor(square, color).forEach(move => {
                moves.push(move);
            });
        });
        return moves;
    }

    computeCheck() {
        let moves = this.getAllMoves(this.turn === 'w' ? 'b' : 'w');
        const king = this.chessBoard.getKing(this.turn);
        if (!king) {
            return;
        }
        moves = moves.filter(move => isSameLocation(move, king));
        this.check = moves.length > 0;
        if (this.check) {
            console.info('check');
        }
    }
}

export interface Move extends Square {
    piece: ChessPiece;
    takes?: ChessPiece;
    enPassant?: EnPassant;
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
