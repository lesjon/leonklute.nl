import ChessBoard from "./chess-board";
import ChessGame, { CastlingState, EnPassant } from "./chess-game";
import { ChessPieceFromFen, FENpieces, PlayerColor } from "./chess-pieces";

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
                    return ChessPieceFromFen(cell as FENpieces);
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
                    return cell.getFenKey();
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