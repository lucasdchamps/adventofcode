import { readFileSync } from "fs";

const input = readFileSync("src/2021/day8/day8.input.txt", "utf8");

type InputLine = {
    patterns: string[];
    output: string[];
}

function parseInput(lines: string[]) {
    return lines.map(line => {
        const [patternString, outputString] = line.split(" | ");
        return {
            patterns: patternString.split(" ").map(pattern => pattern.split("").sort().join("")),
            output: outputString.split(" ").map(digitString => digitString.split("").sort().join(""))
        }
    });
}

const res = parseInput(input.split("\n"));

function correspondingDigit(digitString: string) {
    if (digitString.length === 2) { return 1; }
    if (digitString.length === 4) { return 4; }
    if (digitString.length === 3) { return 7; }
    if (digitString.length === 7) { return 8; }
    return null;
}

function part1(inputLines: InputLine[]) {
    const outputs = inputLines.map(inputLine => inputLine.output);
    const digits = outputs.map(output => output.map(digitString => correspondingDigit(digitString))).flat().filter(d => !! d);
    return digits.length;
}

console.log(part1(res));

function decodeDigitString(inputLine: InputLine) {
    const mapping = {
        top: new Set(["a", "b", "c", "d", "e", "f", "g"]),
        topLeft: new Set(["a", "b", "c", "d", "e", "f", "g"]),
        topRight: new Set(["a", "b", "c", "d", "e", "f", "g"]),
        middle: new Set(["a", "b", "c", "d", "e", "f", "g"]),
        bottomRight: new Set(["a", "b", "c", "d", "e", "f", "g"]),
        bottomLeft: new Set(["a", "b", "c", "d", "e", "f", "g"]),
        bottom: new Set(["a", "b", "c", "d", "e", "f", "g"])
    };
    const patterns = inputLine.patterns;
    const onePattern = new Set(patterns.find(pattern => pattern.length === 2)!.split(""));
    const sevenPattern = new Set(patterns.find(pattern => pattern.length === 3)!.split(""));
    const fourPattern = new Set(patterns.find(pattern => pattern.length === 4)!.split(""));
    const eightPattern = new Set(patterns.find(pattern => pattern.length === 7)!.split(""));

    const topLetter = [...sevenPattern].find(letter => ! onePattern.has(letter))!;
    mapping.top = new Set(topLetter);
    mapping.topLeft.delete(topLetter);
    mapping.topRight.delete(topLetter);
    mapping.middle.delete(topLetter);
    mapping.bottomRight.delete(topLetter);
    mapping.bottomLeft.delete(topLetter);
    mapping.bottom.delete(topLetter);

    onePattern.forEach(letter => {
        mapping.topLeft.delete(letter);
        mapping.middle.delete(letter);
        mapping.bottomLeft.delete(letter);
        mapping.bottom.delete(letter);
    });

    fourPattern.forEach(letter => {
        mapping.bottomLeft.delete(letter);
        mapping.bottom.delete(letter);
    });

    [...mapping.bottom].forEach(letter => {
        mapping.topLeft.delete(letter);
        mapping.topRight.delete(letter);
        mapping.middle.delete(letter);
        mapping.bottomRight.delete(letter);
    });

    [...mapping.middle].forEach(letter => {
        mapping.topRight.delete(letter);
        mapping.bottomRight.delete(letter);
    });

    const zeroPattern = patterns.filter(pattern => pattern.length === 6).find(pattern => {
        const missingLetter = [...eightPattern].find(letter => ! pattern.split("").includes(letter));
        return missingLetter && mapping.middle.has(missingLetter);
    })!;
    const middleLetter = [...eightPattern].find(letter => ! zeroPattern.split("").includes(letter))!;
    mapping.middle = new Set(middleLetter);
    mapping.topLeft.delete(middleLetter);
    mapping.topRight.delete(middleLetter);
    mapping.bottomRight.delete(middleLetter);
    mapping.bottomLeft.delete(middleLetter);
    mapping.bottom.delete(middleLetter);

    const ninePattern = patterns.filter(pattern => pattern.length === 6).find(pattern => {
        const missingLetter = [...eightPattern].find(letter => ! pattern.split("").includes(letter));
        return missingLetter && mapping.bottomLeft.has(missingLetter);
    })!;
    const bottomLeftLetter = [...eightPattern].find(letter => ! ninePattern.split("").includes(letter))!;
    mapping.bottomLeft = new Set(bottomLeftLetter);
    mapping.topLeft.delete(bottomLeftLetter);
    mapping.topRight.delete(bottomLeftLetter);
    mapping.bottomRight.delete(bottomLeftLetter);
    mapping.bottom.delete(bottomLeftLetter);

    const threePattern = patterns.find(pattern =>
        pattern.length === 5 &&
        ! pattern.split("").find(letter => mapping.topLeft.has(letter)) &&
        ! pattern.split("").find(letter => mapping.bottomLeft.has(letter))
    )!;

    const sixPattern = patterns.find(pattern =>
        pattern.length === 6 &&
        pattern !== zeroPattern &&
        pattern !== ninePattern &&
        pattern !== threePattern
    )!;

    const fivePattern = patterns.find(pattern =>
        pattern.length === 5 &&
        pattern.split("").filter(l => sixPattern.includes(l)).length === 5
    )!;

    const twoPattern = patterns.find(pattern =>
        pattern.length === 5 &&
        pattern !== fivePattern &&
        pattern !== threePattern
    )!;

    const digits = inputLine.output.map(digitString => {
        if (digitString === zeroPattern) { return 0; }
        if (digitString === [...onePattern].join("")) { return 1; }
        if (digitString === twoPattern) { return 2; }
        if (digitString === threePattern) { return 3; }
        if (digitString === [...fourPattern].join("")) { return 4; }
        if (digitString === fivePattern) { return 5; }
        if (digitString === sixPattern) { return 6; }
        if (digitString === [...sevenPattern].join("")) { return 7; }
        if (digitString === [...eightPattern].join("")) { return 8; }
        return 9;
    });

    return 1000 * digits[0] + 100 * digits[1] + 10 * digits[2] + digits[3];
}

function part2(inputLines: InputLine[]) {
    return inputLines.map(decodeDigitString).reduce((prev, curr) => prev + curr);
}

console.log(part2(res));