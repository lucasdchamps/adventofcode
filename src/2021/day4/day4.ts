import { readFileSync } from "fs";
import { Board, toInt } from "../../utils";

const input = readFileSync("src/2021/day4/day4.input.txt", "utf8");

const GRID_SIZE = 5;

type Cell = {
    value: number;
    marked: boolean;
}

let { numbers: NUMBERS, boards: BOARDS } = parseInput(input.split("\n"));

function parseInput(lines: string[]) {
    const numbers: number[] = lines[0].split(",").map(toInt);

    const boards: Board[] = [];
    let board: Cell[][] = [];
    for (const line of lines.slice(2)) {
        if (line.length === 0) {
            boards.push(new Board(board));
            board = [];
        } else {
            board.push(line.split(" ").filter(n => !! n).map((strNumber: string) => ({
                value: toInt(strNumber.trim()),
                marked: false
            })));
        }
    }
    boards.push(new Board(board));

    return { numbers, boards };
}

function markNumber(number: number, boards: Board[]) {
    for (const board of boards) {
        board.iterateCells(cell => {
            if (cell.value === number ) { cell.marked = true; }
        })
    }
}

function hasWon(board: Board) {
    for (let i = 0; i < GRID_SIZE; i++) {
        if (board.row(i).filter(cell => cell.marked).length === GRID_SIZE) { return true; }
    }
    for (let j = 0; j < GRID_SIZE; j++) {
        if (board.column(j).filter(cell => cell.marked).length === GRID_SIZE) { return true; }
    }
}

function boardValue(board: Board) {
    let sum = 0;
    board.iterateCells(cell => {
        if (! cell.marked) { sum += cell.value; }
    });
    return sum;
}

function part1() {
    for (const number of NUMBERS) {
        markNumber(number, BOARDS);
        const winningBoard = BOARDS.find(board => hasWon(board));
        if (winningBoard) {
            return boardValue(winningBoard) * number;
        }
    }
}

console.log(part1());

({ numbers: NUMBERS, boards: BOARDS } = parseInput(input.split("\n")));

function part2() {
    for (const number of NUMBERS) {
        markNumber(number, BOARDS);

        if (BOARDS.length === 1 && hasWon(BOARDS[0])) {
            return boardValue(BOARDS[0]) * number;
        }

        let winningBoardIndex = BOARDS.findIndex(board => hasWon(board));
        while (winningBoardIndex >= 0) {
            BOARDS.splice(winningBoardIndex, 1);
            winningBoardIndex = BOARDS.findIndex(board => hasWon(board))
        }
    }
}

console.log(part2());
