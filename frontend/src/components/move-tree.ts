import Move from './chess-move';

export default class MoveTree {
    root?: MoveNode;
    path: MoveNode[];
    constructor(root?: MoveNode) {
        this.root = root;
        this.path = root ? [root] : [];
    }

    getRoot() {
        return this.root;
    }

    getCurrentNode() {
        return this.path.at(-1);
    }

    stepBack() {
        this.path.pop();
        return this.getCurrentNode();
    }

    canStepForward() {
        return this.getNextMove() !== undefined;
    }

    stepForward() {
        const nextNode = this.getNextMove();
        if (nextNode) {
            this.path.push(nextNode);
        }
        return this.getCurrentNode();
    }

    addNextMove(move: Move) {
        if (!this.root) {
            this.root = new MoveNode(move, '1');
            this.path.push(this.root);
            return;
        }
        const currentNode = this.getCurrentNode();
        if (!currentNode) {
            const rootNode = new MoveNode(move, '1');
            this.root = rootNode;
            this.path.push(rootNode);
            return;
        }
        this.path.push(currentNode.addNextMove(move));
        return this.getCurrentNode();
    }

    getPath() {
        return this.path;
    }

    getMainLine() {
        const mainLine: MoveNode[] = [];
        let currentNode = this.root;
        while (currentNode) {
            mainLine.push(currentNode);
            currentNode = currentNode.getNextMove();
        }
        return mainLine;
    }

    getNextMoves() : MoveNode[] {
        const currentNode = this.getCurrentNode();
        if (!currentNode) {
            return [];
        }
        return currentNode.getChildren();
    }

    getNextMove() {
        const currentNode = this.getCurrentNode();
        if (!currentNode) return this.root;
        return currentNode.getNextMove();
    }

    cansStepForward() {
        return this.getNextMove() !== undefined;
    }

    canStepBack() {
        return this.path.length > 0;
    }
}

export class MoveNode {
    id: string;
    move: Move;
    children: MoveNode[];
    constructor(move: Move, id: string) {
        this.id = id;
        this.move = move;
        this.children = [];
    }

    getChildren() {
        return this.children;
    }

    getMove() {
        return this.move;
    }

    getNumberOfLines() {
        return this.children.length;
    }

    createNextMoveIndex() {
        const getNumberOfLines = this.getNumberOfLines();
        if (getNumberOfLines === 0) {
            const lastIndexOfDot = this.id.lastIndexOf('.');
            let idInt = parseInt(this.id.substring(lastIndexOfDot + 1));
            idInt++;
            return this.id.substring(0, lastIndexOfDot + 1) + idInt;
        }
        return this.id + new Array(getNumberOfLines).join('.') + '1';
    }

    addNextMove(move: Move) {
        const newId = this.createNextMoveIndex();
        const moveNode = new MoveNode(move, newId);
        this.children.push(moveNode);
        return moveNode;
    }

    getNextMove() {
        return this.children.at(0);
    }
}
