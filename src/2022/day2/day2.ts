import { readFileSync } from "fs";

const rawInput = readFileSync("src/2022/day2/input.txt", "utf8");

const LETTER_TO_SHAPE: Record<string, string> = {
    "A": "ROCK",
    "B": "PAPER",
    "C": "SCISSOR",
    "X": "ROCK",
    "Y": "PAPER",
    "Z": "SCISSOR"
};

const SHAPE_TO_SCORE: Record<string, number> = { "ROCK": 1, "PAPER": 2, "SCISSOR": 3 };

const input = parseInput(rawInput.split("\n"));
console.log(input);
console.log(part1(input));
console.log(part2(input));

function part1(rounds: any[]) {
    return rounds.map(round =>
        roundResult(LETTER_TO_SHAPE[round.opponentLetter], LETTER_TO_SHAPE[round.myLetter])
    ).reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
    );
}

function part2(rounds: any[]) {
    return rounds.map(round =>
        roundResult(LETTER_TO_SHAPE[round.opponentLetter], myShapeBasedOnStrategy(LETTER_TO_SHAPE[round.opponentLetter], round.myLetter))
    ).reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
    );
}

function roundResult(opponentShape: string, myShape: string) {
    return SHAPE_TO_SCORE[myShape] + shapeResult(opponentShape, myShape);
}

function shapeResult(opponentShape: string, myShape: string) {
    if (opponentShape == myShape) { return 3; }
    if (opponentShape === "ROCK") {
        if (myShape === "PAPER") { return 6; }
        return 0;
    }
    if (opponentShape === "PAPER") {
        if (myShape === "SCISSOR") { return 6; }
        return 0;
    }
    if (opponentShape === "SCISSOR") {
        if (myShape === "ROCK") { return 6; }
        return 0;
    }
    return 0;
}

function myShapeBasedOnStrategy(opponentShape: string, strategy: string) {
    if (strategy === "Y") { return opponentShape; }
    if (strategy === "X") {
        if (opponentShape === "ROCK") { return "SCISSOR"; }
        if (opponentShape === "PAPER") { return "ROCK"; }
        if (opponentShape === "SCISSOR") { return "PAPER"; }
    }
    if (opponentShape === "ROCK") { return "PAPER"; }
    if (opponentShape === "PAPER") { return "SCISSOR"; }
    return "ROCK";
}

function parseInput(lines: string[]) {
    const result = [];

    for (const line of lines) {
        const shapes = line.split(" ");
        result.push({
            opponentLetter: shapes[0],
            myLetter: shapes[1]
        });
    }

    return result;
}
