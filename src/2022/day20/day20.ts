import { readFileSync } from "fs";
import { prettyPrint, toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day20/input.txt", "utf8");

type NumberToMix = {
    value: number;
    mixIndex: number;
}

const input = parseInput(rawInput.split("\n"));
// prettyPrint(input);
console.log(part1(input));
console.log(part2(input));

function decryptedValue(numbers: NumberToMix[]) {
    const zeroIndex = numbers.findIndex(v => v.value === 0);
    return numbers[(zeroIndex + 1000) % numbers.length].value + numbers[(zeroIndex + 2000) % numbers.length].value + numbers[(zeroIndex + 3000) % numbers.length].value;
}

function mixNumbers(numbers: NumberToMix[]) {
    let result = [...numbers];

    for (let i = 0; i < result.length; i++) {
        const oldIdx = result.findIndex(n => n.mixIndex === i);
        const toMix = result[oldIdx];
        let newIdx = (oldIdx + toMix.value) % (result.length - 1);
        if (newIdx <= 0) {
            newIdx = result.length - 1 + newIdx;
        }

        if (oldIdx < newIdx) {
            result = [
                ...result.slice(0, oldIdx),
                result[oldIdx + 1],
                ...result.slice(oldIdx + 2, newIdx + 1),
                result[oldIdx],
                ...result.slice(newIdx + 1)
            ];
        } else if (newIdx < oldIdx) {
            result = [
                ...result.slice(0, newIdx),
                result[oldIdx],
                ...result.slice(newIdx, oldIdx),
                ...result.slice(oldIdx + 1)
            ];
        }
    }

    return result;
}

function part1(numbers: NumberToMix[]) {
    return decryptedValue(mixNumbers(numbers));
}

function part2(numbers: NumberToMix[]) {
    let result = numbers.map(n => ({ value: 811589153 * n.value, mixIndex: n.mixIndex }));

    for (let i = 0; i < 10; i++) {
        result = mixNumbers(result);
    }

    return decryptedValue(result);
}

function parseInput(lines: string[]): any[] {
    return lines.map((l, i) => ({
        value: toInt(l),
        mixIndex: i
    }));
}
