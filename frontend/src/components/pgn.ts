import ChessGame, { Result } from './chess-game';
import San, { SanFormat } from './san';


export default class Pgn {
    san = San.create(SanFormat.Short);

    parseGamge(game: ChessGame) {
        let pgn = '';
        const gameDetails = game.gameDetails;
        pgn += Pgn.createTag('Event', gameDetails.event ?? 'Unknown');
        pgn += Pgn.createTag('Site', gameDetails.site ?? 'Unknown');
        pgn += Pgn.createTag('Date', Pgn.parseDate(gameDetails.dateTime) );
        pgn += Pgn.createTag('Round', gameDetails.round ?? '?');
        pgn += Pgn.createTag('White', game.whitePlayer?.name ?? 'white');
        pgn += Pgn.createTag('Black', game.blackPlayer?.name ?? 'black');
        pgn += Pgn.createTag('Result', Pgn.parseResult(game.result) ?? '*');
        pgn += Pgn.createTag('TimeControl', gameDetails.timeControl)
        pgn += Pgn.createTag('Termination', gameDetails.termination);
        pgn += Pgn.createTag('Annotator', gameDetails.annotator);
        pgn += Pgn.createTag('PlyCount', gameDetails.plyCount?.toString());
        pgn += Pgn.createTag('Mode', gameDetails.mode);
        pgn += Pgn.createTag('FEN', gameDetails.fen);
        pgn += '\n';
        let moveNumber = 1;
        for (const moveNode of game.moveTree.getMainLine()) {
            if (moveNode.move.piece?.getColor() === 'w') {
                pgn += `${moveNumber}. `;
                moveNumber++;
            }
            pgn += this.san.formatMove(moveNode.move);
            pgn += ' ';
        }

        return pgn;
    }

    private static createTag(tag: string, value?: string) {
        if (!value) {
            return '';
        }
        return `[${tag} "${value}"]\n`;
    }

    private static parseResult(result: Result) {
        if (result.whiteScore === 0 && result.blackScore === 0) {
            return '*';
        }
        if (result.whiteScore === 0.5 && result.blackScore === 0.5) {
            return '1/2-1/2';
        }
        return result.whiteScore + '-' + result.blackScore;
    }

    private static parseDate(date?: Date) {
        if (!date) {
            return '????.??.??';
        }
        return `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`;
    }
}