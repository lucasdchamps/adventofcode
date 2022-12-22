import { readFileSync } from "fs";
import { Board, toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day22/input.txt", "utf8");

type Input = {
    board: Board;
    instructions: string[];
};

type Position = { x: number; y: number; facing: string };

console.log(part1(parseInput(rawInput.split("\n"))));
console.log(part2(parseInput(rawInput.split("\n"))));

function nextTile(board: Board, pos: Position) {
    const tile = { x: pos.x, y: pos.y };

    if (pos.facing === "R") {
        tile.y += 1;
        if (tile.y > board.length() - 1 || board.cell(tile.x, tile.y) === " ") {
            tile.y = 0;
            while(board.cell(tile.x, tile.y) === " ") { tile.y += 1; }
        }
    }
    if (pos.facing === "L") {
        tile.y -= 1;
        if (tile.y < 0 || board.cell(tile.x, tile.y) === " ") {
            tile.y = board.length() - 1;
            while(board.cell(tile.x, tile.y) === " ") { tile.y -= 1; }
        }
    }
    if (pos.facing === "D") {
        tile.x += 1;
        if (tile.x > board.height() - 1 || board.cell(tile.x, tile.y) === " ") {
            tile.x = 0;
            while(board.cell(tile.x, tile.y) === " ") { tile.x += 1; }
        }
    }
    if (pos.facing === "U") {
        tile.x -= 1;
        if (tile.x < 0 || board.cell(tile.x, tile.y) === " ") {
            tile.x = board.height() - 1;
            while(board.cell(tile.x, tile.y) === " ") { tile.x -= 1; }
        }
    }

    if (board.cell(tile.x, tile.y) === "#") { return null; }
    
    return tile;
}

function nextTile2(board: Board, pos: Position) {
    let x = pos.x;
    let y = pos.y;
    let facing = pos.facing;

    if (pos.facing === "R") {
        y += 1;
        if (y > board.length() - 1) {
            x = 100 + (49 - x);
            y = 99;
            facing = "L";
        } else if (49 < x && x < 100 && y > 99) {
            y = 100 + (x - 50);
            x = 49;
            facing = "U";
        } else if (99 < x && x < 150 && y > 99) {
            x = 149 - x;
            y = 149;
            facing = "L";
        } else if (x > 149 && y > 49) {
            y = 50 + (x - 150);
            x = 149;
            facing = "U";
        }
    }
    if (pos.facing === "L") {
        y -= 1;
        if (x < 50 && y < 50) {
            x = 100 + (49 - x);
            y = 0;
            facing = "R";
        } else if (x < 100 && y < 50) {
            y = x - 50;
            x = 100;
            facing = "D";
        } else if (x < 150 && y < 0) {
            x = 149 - x;
            y = 50;
            facing = "R";
        } else if (y < 0) {
            y = 50 + (x - 150);
            x = 0;
            facing = "D";
        }
    }
    if (pos.facing === "D") {
        x += 1;
        if (x > 49 && y > 99) {
            x = y - 50;
            y = 99;
            facing = "L";
        } else if (x > 149 && y > 49) {
            x = 150 + (y - 50);
            y = 49;
            facing = "L";
        } else if (x > 199) {
            y = 100 + y;
            x = 0;
            facing = "D";
        }
    }
    if (pos.facing === "U") {
        x -= 1;
        if (x < 0 && y < 100) {
            x = 150 + (y - 50);
            y = 0;
            facing = "R";
        } else if (x < 0) {
            y = y - 100;
            x = 199;
            facing = "U";
        } else if (x < 100 && y < 50) {
            x = 50 + y;
            y = 50;
            facing = "R";
        }
    }

    if (board.cell(x, y) === "#") { return null; }

    return { x, y, facing };
}

function nextFacing(pos: Position, rotation: string) {
    if (rotation === "R") {
        if (pos.facing === "R") { return "D"; }
        if (pos.facing === "D") { return "L"; }
        if (pos.facing === "L") { return "U"; }
        return "R";
    } else {
        if (pos.facing === "R") { return "U"; }
        if (pos.facing === "D") { return "R"; }
        if (pos.facing === "L") { return "D"; }
        return "L";
    }
}

function facingValue(pos: Position) {
    if (pos.facing === "R") { return 0; }
    if (pos.facing === "D") { return 1; }
    if (pos.facing === "L") { return 2; }
    return 3;
}

function part1(input: Input) {
    const pos = { x: 0, y: 0, facing: "R" };
    while(input.board.cell(pos.x, pos.y) === " ") { pos.y += 1; }

    let i = 0;
    while(i < input.instructions.length - 1) {
        const nbMoves = toInt(input.instructions[i]);

        let m = 0;
        let nextPos = nextTile(input.board, pos);
        while (m < nbMoves && nextPos) {
            pos.x = nextPos.x;
            pos.y = nextPos.y;
            m += 1;
            nextPos = nextTile(input.board, pos);
        }

        pos.facing = nextFacing(pos, input.instructions[i + 1]);
        i += 2;
    }

    return 1000 * (pos.x + 1) + 4 * (pos.y + 1) + facingValue(pos);
}

function part2(input: Input) {
    const pos = { x: 0, y: 0, facing: "R" };
    while(input.board.cell(pos.x, pos.y) === " ") { pos.y += 1; }

    let i = 0;
    while(i < input.instructions.length) {
        const nbMoves = toInt(input.instructions[i]);

        let m = 0;
        let nextPos = nextTile2(input.board, pos);
        while (m < nbMoves && nextPos) {
            pos.x = nextPos.x;
            pos.y = nextPos.y;
            pos.facing = nextPos.facing;

            m += 1;
            nextPos = nextTile2(input.board, pos);
        }

        if (i < input.instructions.length - 1) {
            pos.facing = nextFacing(pos, input.instructions[i + 1]);
        }
        i += 2;
    }

    return 1000 * (pos.x + 1) + 4 * (pos.y + 1) + facingValue(pos);
}

function parseInput(lines: string[]): Input {
    const board = new Board(lines.slice(0, lines.length - 2).map(l => l.split("")));

    for (let i = 0; i < board.height(); i++) {
        if (board.row(i).length < board.row(0).length) {
            board.grid[i] = board.grid[i].concat(Array(board.row(0).length - board.row(i).length).fill(" "));
        }
    }

    return {
        board,
        instructions: lines[lines.length - 1].split(/([RL])/)
    };
}
