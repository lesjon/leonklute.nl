import ChessBoard from "./chess-board";
import ChessGame, { CastlingState, EnPassant } from "./chess-game";
import { ChessPieceFromType, ChessPieceType, PlayerColor } from "./chess-pieces";


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
        const game = new ChessGame();
        game.turn = fenArray[1] as PlayerColor;
        game.castling = new CastlingState(fenArray[2]);
        game.enPassant = new EnPassant(fenArray[3]);
        game.halfMove = fenArray[4];
        game.fullMove = fenArray[5];
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
                    return ChessPieceFromType(type);
                } else {
                    return Array.from({ length: Number(cell) }, () => null);
                }
            });
            return row2DArray.flat();
        });
        chessBoard.setBoard(board2DArray);
        game.chessBoard = chessBoard;
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
            return rowArray.join('').replace(/1+/g, (match, p1) => match.length.toString());
        });
        const board = boardArray.reverse().join('/');

        const castling = this.castlingFen(game.castling);
        return `${board} ${game.turn} ${castling} ${game.enPassant.toFen()} ${game.halfMove} ${game.fullMove}`;
    }

    static castlingFen(castlingState: CastlingState) {
        let castling = '';
        if (castlingState.whiteShort) {
            castling += 'K';
        }
        if (castlingState.whiteLong) {
            castling += 'Q';
        }
        if (castlingState.blackShort) {
            castling += 'k';
        }
        if (castlingState.blackLong) {
            castling += 'q';
        }
        return castling || '-';
    }
    static gameFromStartPosition(): ChessGame {
        return Fen.fenParser(Fen.start_position_fen);
    }
}