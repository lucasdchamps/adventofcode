import { readFileSync } from "fs";
import { Board } from "../../utils";

const rawInput = readFileSync("src/2022/day8/input.txt", "utf8");

const input = parseInput(rawInput.split("\n"));
console.log(input);
console.log(part1(input));
console.log(part2(input));

function part1(board: Board) {
    let nbVisible = 0;

    for(let i = 0; i < board.height(); i++) {
        for(let j = 0; j < board.length(); j++) {
            if (isVisible(board, i, j)) { nbVisible += 1; }
        }
    }

    return nbVisible;
}

function isVisible(board: Board, i: number, j: number) {
    return isVisibleFromLeft(board, i, j) || isVisibleFromTop(board, i, j) || isVisibleFromRight(board, i, j) || isVisibleFromBottom(board, i, j);
}

function isVisibleFromLeft(board: Board, i: number, j: number) {
    return ! board.row(i).slice(0, j).find(value => board.cell(i, j) <= value);
}

function isVisibleFromTop(board: Board, i: number, j: number) {
    return ! board.column(j).slice(0, i).find(value => board.cell(i, j) <= value);
}

function isVisibleFromRight(board: Board, i: number, j: number) {
    return ! board.row(i).slice(j + 1, board.length()).find(value => board.cell(i, j) <= value);
}

function isVisibleFromBottom(board: Board, i: number, j: number) {
    return ! board.column(j).slice(i + 1, board.height()).find(value => board.cell(i, j) <= value);
}

function part2(board: Board) {
    let score = 0;

    for(let i = 0; i < board.height(); i++) {
        for(let j = 0; j < board.length(); j++) {
            const cellScore = scenicScore(board, i, j);
            if (cellScore > score) { score = cellScore; }
        }
    }

    return score;
}

function scenicScore(board: Board, i: number, j: number) {
    return scenicScoreFromLeft(board, i, j) * scenicScoreFromTop(board, i, j) * scenicScoreFromRight(board, i, j) * scenicScoreFromBottom(board, i, j);
}

function scenicScoreFromLeft(board: Board, i: number, j: number) {
    let score = 0;
    for (const cell of board.row(i).slice(0, j).reverse()) {
        score += 1;
        if (board.cell(i, j) <= cell) { return score; }
    }
    return score;
}

function scenicScoreFromTop(board: Board, i: number, j: number) {
    let score = 0;
    for (const cell of board.column(j).slice(0, i).reverse()) {
        score += 1;
        if (board.cell(i, j) <= cell) { return score; }
    }
    return score;
}

function scenicScoreFromRight(board: Board, i: number, j: number) {
    let score = 0;
    for (const cell of board.row(i).slice(j + 1, board.length())) {
        score += 1;
        if (board.cell(i, j) <= cell) { return score; }
    }
    return score;
}

function scenicScoreFromBottom(board: Board, i: number, j: number) {
    let score = 0;
    for (const cell of board.column(j).slice(i + 1, board.height())) {
        score += 1;
        if (board.cell(i, j) <= cell) { return score; }
    }
    return score;
}

function parseInput(lines: string[]) {
    const result = [];

    for (const line of lines) {
        result.push(line.split(""));
    }

    return new Board(result);
}
