import { readFileSync } from "fs";

const input = readFileSync("src/2021/day10/day10.input.txt", "utf8");

const matchingParens: Record<string, string> = {
    "{": "}",
    "[": "]",
    "(": ")",
    "<": ">"
};

const openingParens = Object.keys(matchingParens);
const closingParens = Object.values(matchingParens);

let parenPoints: Record<string, number> = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137
}

function parseInput(lines: string[]) {
    return lines.map(line => line.split(""));
}

const res = parseInput(input.split("\n"));

function findIllegalCharacter(chunkLine: string[]) {
    const stack: string[] = [];
    for (const chunkChar of chunkLine) {
        if (openingParens.includes(chunkChar)) {
            stack.push(matchingParens[chunkChar]);
        } else {
            if (stack.length === 0) { return null; }
            const closingParen = stack.pop();
            if (closingParen !== chunkChar) {
                return chunkChar;
            }
        }
    }
    return null;
}

function part1(chunkLines: string[][]) {
    const illegalCharacters = [];
    for (const chunkLine of chunkLines) {
        const illegalCharacter = findIllegalCharacter(chunkLine);
        if (illegalCharacter) { illegalCharacters.push(illegalCharacter); }
    }
    return illegalCharacters.map(char => parenPoints[char]).reduce((prev, curr) => prev + curr);
}

console.log(part1(res));

function autocompleteLine(chunkLine: string[]) {
    const stack: string[] = [];
    for (const chunkChar of chunkLine) {
        if (openingParens.includes(chunkChar)) {
            stack.push(matchingParens[chunkChar]);
        } else {
            if (stack.length === 0) { return null; }
            const closingParen = stack.pop();
            if (closingParen !== chunkChar) {
                return null;
            }
        }
    }
    return stack.reverse();
}

parenPoints = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4
}

function scoreCompletion(completion: string[]) {
    let score = 0
    for (const char of completion) {
        score *= 5;
        score += parenPoints[char];
    }
    return score;
}

function part2(chunkLines: string[][]) {
    const autocompletes = [];
    for (const chunkLine of chunkLines) {
        const completion = autocompleteLine(chunkLine);
        if (completion) { autocompletes.push(completion); }
    }
    const sortedScores = autocompletes.map(scoreCompletion).sort((a, b) => a - b);
    return sortedScores[(sortedScores.length - 1)/ 2];
}

console.log(part2(res));
