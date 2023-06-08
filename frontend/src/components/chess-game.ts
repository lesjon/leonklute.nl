import ChessPiece, { PlayerColor } from './chess-pieces';
import ChessBoard, { rows, columns, Square, columnLetters, isSameLocation } from './chess-board';
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

export default class ChessGame {
    turn: PlayerColor = 'w';
    castling = 'KQkq';
    enPassant = new EnPassant('-');
    halfMove = '0';
    fullMove = '1';
    check = false;
    chessBoard: ChessBoard = new ChessBoard(8, 8);
    whitePlayer?: Player;
    blackPlayer?: Player;

    moveTree: MoveNode[] = [];
    currentMoveNode: MoveNode | undefined = undefined;

    constructor(fen?: string) {
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
        this.movePiece(move.from!, move);
        const moveNode = new MoveNode(move);
        if (this.currentMoveNode) {
            this.currentMoveNode?.addChild(moveNode);
            this.currentMoveNode = moveNode;
        } else {
            this.moveTree.push(moveNode);
            this.currentMoveNode = moveNode;
        }
    }

    movePiece(from: Square, to: Square) {
        const piece = this.getPieceAt(from.row, from.column);
        piece?.setMoved();
        this.chessBoard.setSquare({ row: from.row, column: from.column, piece: null });
        this.chessBoard.setPiece({ row: to.row, column: to.column }, piece);
        this.computeEnPassent(from, to, piece);
        this.turn = this.turn === 'w' ? 'b' : 'w';
        this.computeCheck();
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
        const possibleMoves = this.getPossibleMovesFor(from);
        const move: Move | undefined = possibleMoves.find(move => isSameLocation(move, to));
        if (!move) {
            console.info('not a possible move');
            return false;
        }
        move?.enPassant?.takeCallBack?.();

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
                const nextMove: Move = { row: from.row + ((i + 1) * step.row), column: from.column + ((i + 1) * step.column), piece: piece, from };
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

    getAllSquares(): Square[] {
        const squares: Square[] = [];
        rows.forEach(row => {
            columns.forEach(column => {
                squares.push({ row, column, piece: this.getPieceAt(row, column) });
            });
        });
        return squares;
    }

    getAllMoves(color?: PlayerColor): Move[] {
        const squares = this.getAllSquares();
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
        const king = this.getKing();
        if (!king) {
            return;
        }
        moves = moves.filter(move => isSameLocation(move, king));
        this.check = moves.length > 0;
        if (this.check) {
            console.info('check');
        }
    }

    getKing() {
        const kingToFind = this.turn === 'w' ? 'K' : 'k';
        return this.getAllSquares().find(square => square.piece?.getFenKey() === kingToFind);

    }
    isWithinBoard(square: Square) {
        return square.row > 0 && square.row < 9 && square.column > 0 && square.column < 9;
    }
}

interface Move extends Square {
    piece: ChessPiece;
    enPassant?: EnPassant;
    from?: Square;
}


export class EnPassant implements Square {
    row: number;
    column: number;
    takeCallBack?: () => void;

    constructor(enPassentFen: string, takeCallBack?: () => void) {
        this.takeCallBack = takeCallBack;
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
