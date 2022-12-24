import { readFileSync } from "fs";
import { Board } from "../../utils";

const rawInput = readFileSync("src/2022/day24/input.txt", "utf8");

type Blizzard = {
    x: number;
    y: number;
    direction: string;
};

type Position = { x: number; y: number };

console.log(part1(parseInput(rawInput.split("\n"))));
console.log(part2(parseInput(rawInput.split("\n"))));

function moveBlizzard(board: Board, blizzards: Blizzard[], blizzardsCount: Record<string, number>) {
    for (const blizzard of blizzards) {
        blizzardsCount[JSON.stringify([blizzard.x, blizzard.y])] -= 1;
        if (blizzard.direction === ">") {
            blizzard.y += 1;
            if (blizzard.y === board.length() - 1) { blizzard.y = 1; }
        }
        if (blizzard.direction === "<") {
            blizzard.y -= 1;
            if (blizzard.y === 0) { blizzard.y = board.length() - 2; }
        }
        if (blizzard.direction === "v") {
            blizzard.x += 1;
            if (blizzard.x === board.height() - 1) { blizzard.x = 1; }
        }
        if (blizzard.direction === "^") {
            blizzard.x -= 1;
            if (blizzard.x === 0) { blizzard.x = board.height() - 2; }
        }
        blizzardsCount[JSON.stringify([blizzard.x, blizzard.y])] += 1;
    }
}

function possibleMoves(board: Board, blizzardsCount: Record<string, number>, pos: Position) {
    const moves: Position[] = [];

    if (! blizzardsCount[JSON.stringify([pos.x, pos.y])]) {
        moves.push({ x: pos.x, y: pos.y });
    }
    if (pos.x > 0 && pos.x < board.height() - 1 && pos.y > 1 && ! blizzardsCount[JSON.stringify([pos.x, pos.y - 1])]) {
        moves.push({ x: pos.x, y: pos.y - 1 });
    }
    if (pos.x > 0 &&  pos.x < board.height() - 1 && pos.y < board.length() - 2 && ! blizzardsCount[JSON.stringify([pos.x, pos.y + 1])]) {
        moves.push({ x: pos.x, y: pos.y + 1 });
    }
    if (pos.x > 1 && ! blizzardsCount[JSON.stringify([pos.x - 1, pos.y])]) {
        moves.push({ x: pos.x - 1, y: pos.y });
    }
    if (pos.x < board.height() - 2 && ! blizzardsCount[JSON.stringify([pos.x + 1, pos.y])]) {
        moves.push({ x: pos.x + 1, y: pos.y });
    }

    return moves;
}

function trip(board: Board, blizzards: Blizzard[], blizzardsCount: Record<string, number>, startingPos: Position, endPos: Position) {
    let states = [startingPos];
    let nbSteps = 0;

    while(states.length) {
        const nextStates = new Set<string>();
        nbSteps += 1;

        moveBlizzard(board, blizzards, blizzardsCount);

        for (const pos of states) {
            if (pos.x === endPos.x && pos.y === endPos.y) {
                return nbSteps;
            }

            for (const move of possibleMoves(board, blizzardsCount, pos)) {
                nextStates.add(JSON.stringify({ x: move.x, y: move.y }));
            }
        }

        states = [...nextStates].map(s => JSON.parse(s));
    }
}

function part1(board: Board) {
    const blizzards: Blizzard[] = [];
    const blizzardsCount: Record<string, number> = {};
    board.iterateCells((cell, i, j) => {
        blizzardsCount[JSON.stringify([i, j])] = 0;
        if (cell === "#" || cell === ".") { return; }
        blizzards.push({ x: i, y: j, direction: cell });
        blizzardsCount[JSON.stringify([i, j])] += 1;
    });

    return trip(board, blizzards, blizzardsCount, { x: 0, y: 1 }, { x: board.height() - 2, y: board.length() - 2 });
}

function part2(board: Board) {
    const blizzards: Blizzard[] = [];
    const blizzardsCount: Record<string, number> = {};
    board.iterateCells((cell, i, j) => {
        blizzardsCount[JSON.stringify([i, j])] = 0;
        if (cell === "#" || cell === ".") { return; }
        blizzards.push({ x: i, y: j, direction: cell });
        blizzardsCount[JSON.stringify([i, j])] += 1;
    });

    return trip(board, blizzards, blizzardsCount, { x: 0, y: 1 }, { x: board.height() - 2, y: board.length() - 2 })! +
        trip(board, blizzards, blizzardsCount, { x: board.height() - 1, y: board.length() - 2 }, { x: 1, y: 1 })! +
        trip(board, blizzards, blizzardsCount, { x: 0, y: 1 }, { x: board.height() - 2, y: board.length() - 2 })!;
}

function parseInput(lines: string[]): Board {
    return new Board(lines.map(l => l.split("")));
}
