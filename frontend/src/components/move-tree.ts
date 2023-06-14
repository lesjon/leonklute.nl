import Move from "./chess-move";

export default class MoveNode {
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
