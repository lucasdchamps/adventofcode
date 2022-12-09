import { readFileSync } from "fs";
import { toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day9/input.txt", "utf8");

type Move = {
    direction: "R" | "U" | "L" | "D";
    nbSteps: number;
}

type Position = {
    x: number;
    y: number;
}

const input = parseInput(rawInput.split("\n"));
console.log(input);
console.log(part1(input));
console.log(part2(input));

function part1(moves: Move[]) {
    const visitedPositions = new Set();
    visitedPositions.add("0 0");
    const tailPosition = { x: 0, y: 0 };
    const headPosition = { x: 0, y: 0 };

    for (const move of moves) {
        for (let i = 0; i < move.nbSteps; i++) {
            moveRopeEnd(headPosition, move.direction);
            moveTail(tailPosition, headPosition);
            visitedPositions.add(`${tailPosition.x} ${tailPosition.y}`);
        }
    }

    return visitedPositions.size;
}

function moveRopeEnd(position: Position, direction: Move["direction"]) {
    if (direction === "R") {
        position.y = position.y + 1;
    } else if (direction === "U") {
        position.x = position.x + 1;
    } else if (direction === "L") {
        position.y = position.y - 1;
    } else {
        position.x = position.x - 1;
    }
}

function moveTail(tailPosition: Position, headPosition: Position) {
    if (areAdjacent(tailPosition, headPosition)) { return; }
    if (tailPosition.x === headPosition.x) {
        if (tailPosition.y < headPosition.y) {
            moveRopeEnd(tailPosition, "R");
        } else {
            moveRopeEnd(tailPosition, "L");
        }
        return;
    }

    if (tailPosition.y === headPosition.y) {
        if (tailPosition.x < headPosition.x) {
            moveRopeEnd(tailPosition, "U");
        } else {
            moveRopeEnd(tailPosition, "D");
        }
        return;
    }

    if (tailPosition.x < headPosition.x) {
        moveRopeEnd(tailPosition, "U");
        if (tailPosition.y < headPosition.y) {
            moveRopeEnd(tailPosition, "R");
        } else {
            moveRopeEnd(tailPosition, "L");
        }
        return;
    }

    if (tailPosition.x > headPosition.x) {
        moveRopeEnd(tailPosition, "D");
        if (tailPosition.y < headPosition.y) {
            moveRopeEnd(tailPosition, "R");
        } else {
            moveRopeEnd(tailPosition, "L");
        }
        return;
    }
}

function areAdjacent(tailPosition: Position, headPosition: Position) {
    if (tailPosition.x === headPosition.x) {
        return Math.abs(tailPosition.y - headPosition.y) <= 1;
    }
    if (tailPosition.y === headPosition.y) {
        return Math.abs(tailPosition.x - headPosition.x) <= 1;
    }
    return Math.abs(tailPosition.x - headPosition.x) + Math.abs(tailPosition.y - headPosition.y) <= 2;
}

function part2(moves: Move[]) {
    const visitedPositions = new Set();
    visitedPositions.add("0 0");
    const ropePositions = [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
    ]

    for (const move of moves) {
        for (let i = 0; i < move.nbSteps; i++) {
            moveRopeEnd(ropePositions[0], move.direction);
            for (let j = 0; j < ropePositions.length - 1; j++) {
                moveTail(ropePositions[j + 1], ropePositions[j]);
            }
            visitedPositions.add(`${ropePositions[9].x} ${ropePositions[9].y}`);
        }
    }

    return visitedPositions.size;
}

function parseInput(lines: string[]): Move[] {
    const moves = []

    for (const line of lines) {
        moves.push({
            direction: line.split(" ")[0],
            nbSteps: toInt(line.split(" ")[1])
        })
    }

    return moves as Move[];
}
