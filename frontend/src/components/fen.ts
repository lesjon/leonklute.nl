import ChessBoard from './chess-board';
import ChessGame, { CastlingState } from './chess-game';
import Move, { Castling, EnPassant } from './chess-move';
import { ChessPieceType, PlayerColor, chessPieceFromType } from './chess-pieces';


const fenToPiece = (fen: string): ChessPieceType | null => {
    switch (fen) {
        case 'K': return ChessPieceType.whiteKing;
        case 'Q': return ChessPieceType.whiteQueen;
        case 'R': return ChessPieceType.whiteRook;
        case 'B': return ChessPieceType.whiteBishop;
        case 'N': return ChessPieceType.whiteKnight;
        case 'P': return ChessPieceType.whitePawn;
        case 'k': return ChessPieceType.blackKing;
        case 'q': return ChessPieceType.blackQueen;
        case 'r': return ChessPieceType.blackRook;
        case 'b': return ChessPieceType.blackBishop;
        case 'n': return ChessPieceType.blackKnight;
        case 'p': return ChessPieceType.blackPawn;
        default: return null;
    }
};
export const pieceToFen = (type: ChessPieceType) => {
    switch (type) {
        case ChessPieceType.whiteKing: return 'K';
        case ChessPieceType.whiteQueen: return 'Q';
        case ChessPieceType.whiteRook: return 'R';
        case ChessPieceType.whiteBishop: return 'B';
        case ChessPieceType.whiteKnight: return 'N';
        case ChessPieceType.whitePawn: return 'P';
        case ChessPieceType.blackKing: return 'k';
        case ChessPieceType.blackQueen: return 'q';
        case ChessPieceType.blackRook: return 'r';
        case ChessPieceType.blackBishop: return 'b';
        case ChessPieceType.blackKnight: return 'n';
        case ChessPieceType.blackPawn: return 'p';
    }
};


export default class Fen {
    static start_position_fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    static fenParser(fen: string): ChessGame {
        const fenArray = fen.split(' ');
        const board = fenArray[0];
        const game: ChessGame = new ChessGame();
        game.turn = fenArray[1] as PlayerColor;
        game.enPassant = new EnPassant(fenArray[3]);
        game.halfMove = parseInt(fenArray[4]);
        game.fullMove = parseInt(fenArray[5]);
        const boardArray = board.split('/').reverse();
        const chessBoard = new ChessBoard(8, 8);
        const board2DArray = boardArray.map(row => {
            const rowArray = row.split('');
            const row2DArray = rowArray.map(cell => {
                if (isNaN(Number(cell))) {
                    const type = fenToPiece(cell);
                    if (type === null) {
                        throw new Error(`Invalid piece type: ${cell}`);
                    }
                    return chessPieceFromType(type);
                } else {
                    return Array.from({ length: Number(cell) }, () => null);
                }
            });
            return row2DArray.flat();
        });
        chessBoard.setBoard(board2DArray);
        game.castling = this.castlingFromFen(fenArray[2], chessBoard);
        game.chessBoard = chessBoard;
        game.gameDetails.fen = fen;
        return game;
    }


    static toFen(game: ChessGame): string {
        const boardArray = game.chessBoard.getBoard().map(row => {
            const rowArray = row.map(cell => {
                if (cell) {
                    return cell.toFen();
                } else {
                    return '1';
                }
            });
            return rowArray.join('').replace(/1+/g, match => match.length.toString());
        });
        const board = boardArray.reverse().join('/');

        const castling = this.castlingFen(game.castling);
        return `${board} ${game.turn} ${castling} ${game.enPassant.toFen()} ${game.halfMove} ${game.fullMove}`;
    }

    static castlingFen(castlingState?: CastlingState) {
        let castling = '';
        if (!castlingState) {
            return '-';
        }
        if (castlingState.whiteShort?.allowed) {
            castling += 'K';
        }
        if (castlingState.whiteLong?.allowed) {
            castling += 'Q';
        }
        if (castlingState.blackShort?.allowed) {
            castling += 'k';
        }
        if (castlingState.blackLong?.allowed) {
            castling += 'q';
        }
        return castling || '-';
    }

    static castlingFromFen(castlingFen: string, ChessBoard: ChessBoard) {
        let whiteShort;
        let whiteLong;
        let blackShort;
        let blackLong;

        const whiteKing = ChessBoard.getPieces(ChessPieceType.whiteKing).at(0);
        const blackKing = ChessBoard.getPieces(ChessPieceType.blackKing).at(0);
        if (!whiteKing || !blackKing) {
            throw new Error('Invalid castling state; missing a king:' + { whiteKing, blackKing });
        }
        const whiteRooks = ChessBoard.getPieces(ChessPieceType.whiteRook);
        const blackRooks = ChessBoard.getPieces(ChessPieceType.blackRook);
        if (castlingFen.includes('K')) {
            const rooks = whiteRooks.filter(rook => rook.column > whiteKing.column);
            const rook = rooks.at(0);
            if (!rook) {
                console.error('Invalid castling state; no appropriate rook found');
            } else {
                const rookMove: Move = { from: { row: rook.row, column: rook.column }, row: rook.row, column: 6, piece: rook.piece };
                const kingMove: Move = { from: { row: whiteKing.row, column: whiteKing.column }, row: whiteKing.row, column: 7, piece: whiteKing.piece };
                whiteShort = new Castling(kingMove, rookMove, true)
            }

        }
        if (castlingFen.includes('Q')) {
            const rooks = whiteRooks.filter(rook => rook.column < whiteKing.column);
            const rook = rooks.at(0);
            if (!rook) {
                console.error('Invalid castling state; no appropriate rook found');
            } else {
                const rookMove: Move = { from: { row: rook.row, column: rook.column }, row: rook.row, column: 4, piece: rook.piece };
                const kingMove: Move = { from: { row: whiteKing.row, column: whiteKing.column }, row: whiteKing.row, column: 3, piece: whiteKing.piece };
                whiteLong = new Castling(kingMove, rookMove, true);
            }
        }
        if (castlingFen.includes('k')) {
            const rooks = blackRooks.filter(rook => rook.column > blackKing.column);
            const rook = rooks.at(0);
            if (!rook) {
                console.error('Invalid castling state; no appropriate rook found');
            } else {
                const rookMove: Move = { from: { row: rook.row, column: rook.column }, row: rook.row, column: 6, piece: rook.piece };
                const kingMove: Move = { from: { row: blackKing.row, column: blackKing.column }, row: blackKing.row, column: 7, piece: blackKing.piece };
                blackShort = new Castling(kingMove, rookMove, true)
            }

        }
        if (castlingFen.includes('q')) {
            const rooks = blackRooks.filter(rook => rook.column < blackKing.column);
            const rook = rooks.at(0);
            if (!rook) {
                console.error('Invalid castling state; no appropriate rook found');
            } else {
                const rookMove: Move = { from: { row: rook.row, column: rook.column }, row: rook.row, column: 4, piece: rook.piece };
                const kingMove: Move = { from: { row: blackKing.row, column: blackKing.column }, row: blackKing.row, column: 3, piece: blackKing.piece };
                blackLong = new Castling(kingMove, rookMove, true);
            }
        }
        return new CastlingState(whiteShort, whiteLong, blackShort, blackLong);
    }
    static gameFromStartPosition(): ChessGame {
        return Fen.fenParser(Fen.start_position_fen);
    }
}