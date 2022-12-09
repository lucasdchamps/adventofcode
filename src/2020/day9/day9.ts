import { readFileSync } from "fs";
import { getTwoNumbersSummingTo } from "../day1";

function findInvalidNumberIndex(numbers: number[]) {
    for (let numberIndex = 25; numberIndex < numbers.length; numberIndex++) {
        const previousNumbers = numbers.slice(numberIndex - 25, numberIndex).sort((a, b) => a - b);

        if (! getTwoNumbersSummingTo(previousNumbers, numbers[numberIndex])) {
            return numberIndex;
        }
    }
}

function findSummingRange(numbers: number[]) {
    const invalidIndex = findInvalidNumberIndex(numbers);
    const invalidNumber = numbers[invalidIndex as number];
    let startIndex = 0;
    let endIndex = 1;
    let sum = sumRange();

    while(sum !== invalidNumber && endIndex < (invalidIndex as number)) {
        if (sum < invalidNumber) {
            endIndex += 1;
        } else {
            startIndex += 1;
            endIndex = startIndex + 1;
        }
        sum = sumRange();
    }

    return [startIndex, endIndex];

    function sumRange() {
        return numbers.slice(startIndex, endIndex + 1).reduce((a, b) => a + b);
    }
}

const inputFile = readFileSync("src/day9/day9.input.txt", "utf8");

const numbers = inputFile.split("\n").map(line => parseInt(line, 10));

console.log("invalid number", numbers[findInvalidNumberIndex(numbers) as number]);

const [startIndex, endIndex] = findSummingRange(numbers);
const sortedRange = numbers.slice(startIndex, endIndex + 1).sort((a, b) => a - b);
console.log("summing range result", sortedRange[0] + sortedRange[sortedRange.length - 1]);
