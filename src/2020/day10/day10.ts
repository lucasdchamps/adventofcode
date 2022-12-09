import { readFileSync } from "fs";

const inputFile = readFileSync("src/day10/day10.input.txt", "utf8");

function getDifferences(joltages: number[]) {
    const differences: number[] = [];
    differences.push(joltages[0]);
    for (let joltageIndex = 1; joltageIndex < joltages.length; joltageIndex++) {
        differences.push(joltages[joltageIndex] - joltages[joltageIndex - 1]);
    }
    differences.push(3);
    return differences;
}

function countJotlageDifferences(differences: number[]) {
    const oneJoltDifferences = differences.filter(difference => difference === 1).length;
    const threeJoltDifferences = differences.filter(difference => difference === 3).length;
    return [oneJoltDifferences, threeJoltDifferences];
}

function countArrangements(oneJoltDifferencesLength: number) {
    if (oneJoltDifferencesLength < 2) { return 1; }
    if (oneJoltDifferencesLength === 2) { return 2; }
    if (oneJoltDifferencesLength === 3) { return 4; }
    if (oneJoltDifferencesLength === 4) { return 7; }
}

function countDeviceArrangements(differences: number[]): number {
    const startIndex = differences.findIndex(difference => difference === 1);
    if (startIndex === -1) { return 1; }

    const nextDifferences = differences.slice(startIndex);
    const endIndex = nextDifferences.findIndex(difference => difference === 3);
    if (endIndex === -1) { return countArrangements(nextDifferences.length) as number; }

    return countArrangements(endIndex) as number * countDeviceArrangements(nextDifferences.slice(endIndex));
}

const joltages = inputFile.split("\n").map(row => parseInt(row, 10)).sort((a, b) => a - b);
console.log(joltages);
const differences = getDifferences(joltages);
console.log(differences);
const [oneJoltDifferences, threeJoltDifferences] = countJotlageDifferences(differences);
console.log(oneJoltDifferences * threeJoltDifferences);

console.log(countDeviceArrangements(differences));
