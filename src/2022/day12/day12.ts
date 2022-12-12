import { readFileSync } from "fs";
import { Board, toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day12/input.txt", "utf8");

const input = parseInput(rawInput.split("\n"));
console.log(input);
console.log(part1(input));
console.log(part2(input));

function part1(board: Board) {
    const dist: Record<string, number> = {};
    const queue: Set<string> = new Set();
    let endCoordinates = "";

    board.iterateCells((cell: string, i: number, j: number) => {
        dist[toString(i, j)] = 100000000000;
        queue.add(toString(i, j));
        if (cell === "E") {
            endCoordinates = toString(i, j);
        }
        if (cell === "S") {
            dist[toString(i, j)] = 0;
        }
    });

    while (queue.size) {
        const u = [...queue].sort((n1, n2) => dist[n1] - dist[n2])[0];
        queue.delete(u);
        const [ui, uj] = toIndex(u);

        for (const [vi, vj] of board.adjacentCoordinates(ui, uj)) {
            if (! queue.has(toString(vi, vj))) { continue; }
            if (heightDifference(board.cell(ui, uj), board.cell(vi, vj)) > 1) { continue; }

            const d = dist[toString(ui, uj)] + 1;
            if (d < dist[toString(vi, vj)]) {
                dist[toString(vi, vj)] = d;
            }
        }
    }

    return dist[endCoordinates];
}

function toString(i: number, j: number) {
    return `${i} ${j}`;
}

function toIndex(str: string) {
    return str.split(" ").map(toInt);
}

function heightDifference(cell1: string, cell2: string) {
    const from = mapToDowncase(cell1);
    const to = mapToDowncase(cell2);
    return to - from;

    function mapToDowncase(cell: string) {
        if (cell === "S") { return "a".charCodeAt(0); }
        if (cell === "E") { return "z".charCodeAt(0); }
        return cell.charCodeAt(0);
    }
}

function part2(board: Board) {
    const dist: Record<string, number> = {};
    const queue: Set<string> = new Set();
    let endCoordinates = "";

    board.iterateCells((cell: string, i: number, j: number) => {
        dist[toString(i, j)] = 100000000000;
        queue.add(toString(i, j));
        if (cell === "E") {
            endCoordinates = toString(i, j);
        }
        if (cell === "S" || cell === "a") {
            dist[toString(i, j)] = 0;
        }
    });

    while (queue.size) {
        const u = [...queue].sort((n1, n2) => dist[n1] - dist[n2])[0];
        queue.delete(u);
        const [ui, uj] = toIndex(u);

        for (const [vi, vj] of board.adjacentCoordinates(ui, uj)) {
            if (! queue.has(toString(vi, vj))) { continue; }
            if (heightDifference(board.cell(ui, uj), board.cell(vi, vj)) > 1) { continue; }

            const d = dist[toString(ui, uj)] + 1;
            if (d < dist[toString(vi, vj)]) {
                dist[toString(vi, vj)] = d;
            }
        }
    }

    return dist[endCoordinates];
}

function parseInput(lines: string[]): Board {
    const result = [];

    for (const line of lines) {
        result.push(line.split(""));
    }

    return new Board(result);
}
