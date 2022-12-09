import { readFileSync } from "fs";

const input = readFileSync("src/2021/day18/day18.input.txt", "utf8");

class SFNumber {
    left: SFNumber | number;
    right: SFNumber | number;
    parent: SFNumber;

    constructor(left: SFNumber | number, right: SFNumber | number) {
        this.left = left;
        this.right = right;

        if (typeof this.left !== "number") {
            this.left.parent = this;
        }
        if (typeof this.right !== "number") {
            this.right.parent = this;
        }
    }

    log(): string {
        const left = typeof this.left === "number" ? this.left : this.left.log();
        const right = typeof this.right === "number" ? this.right : this.right.log();
        return `[${left},${right}]`;
    }

    shouldExplode() {
        if (typeof this.left !== "number" || typeof this.right !== "number") { return false; }
        return !! this.parent?.parent?.parent?.parent;
    }

    lastParent() {
        return this.parent.parent.parent.parent;
    }

    rightMostChild(): SFNumber {
        if (typeof this.right === "number") { return this; }
        return this.right.rightMostChild();
    }

    leftMostChild(): SFNumber {
        if (typeof this.left === "number") { return this; }
        return this.left.leftMostChild();
    }

    shouldSplit() {
        return typeof this.left === "number" && this.left >= 10 ||
            typeof this.right === "number" && this.right >= 10;
    }

    magnitude(): number {
        const left = typeof this.left === "number" ? this.left : this.left.magnitude();
        const right = typeof this.right === "number" ? this.right : this.right.magnitude();
        return 3 * left + 2 * right;
    }

    copy(): SFNumber {
        if (typeof this.left === "number" && typeof this.right === "number") {
            return new SFNumber(this.left, this.right);
        }
        if (typeof this.left === "number") {
            return new SFNumber(this.left, (this.right as SFNumber).copy());
        }
        if (typeof this.right === "number") {
            return new SFNumber(this.left.copy(), this.right);
        }
        return new SFNumber(this.left.copy(), this.right.copy())
    }
}

function parseInput(lines: string[]) {
    return lines.map(line => parseSFNumber(line));
}

let res = parseInput(input.split("\n")) as SFNumber[];

function add(left: SFNumber, right: SFNumber) {
    const parent = new SFNumber(left.copy(), right.copy());
    left.parent = parent;
    right.parent = parent;
    return parent;
}

function parseSFNumber(sfNumberString: string): SFNumber | number {
    if (sfNumberString.length === 1) {
        return parseInt(sfNumberString);
    }

    const chars = sfNumberString.slice(1).split("");
    if (parseInt(chars[0]) && parseInt(chars[2])) {
        return new SFNumber(parseInt(chars[0]), parseInt(chars[2]));
    }

    let leftPartIndex = 1;
    let bracketCount = 0;
    if (chars[0] === "[") { bracketCount += 1; }
    while (bracketCount > 0) {
        if (chars[leftPartIndex] === "[") { bracketCount += 1; }
        else if (chars[leftPartIndex] === "]") { bracketCount -= 1; }
        leftPartIndex += 1;
    }

    const leftPart = sfNumberString.slice(1, leftPartIndex + 1);
    const rightPart = sfNumberString.slice(leftPartIndex + 2, sfNumberString.length - 1);
    return new SFNumber(parseSFNumber(leftPart), parseSFNumber(rightPart));
}

function findExplodingSFNumber(sfNumber: SFNumber | number): SFNumber | null {
    if (typeof sfNumber === "number") { return null; }

    if (sfNumber.shouldExplode()) { return sfNumber; }
    return findExplodingSFNumber(sfNumber.left) || findExplodingSFNumber(sfNumber.right);
}

function findNumberToSplit(sfNumber: SFNumber | number): SFNumber | null {
    if (typeof sfNumber === "number") { return null; }

    if (sfNumber.shouldSplit()) {
        if (typeof sfNumber.left === "number" && sfNumber.left >= 10) {
            return sfNumber;
        } else if (findNumberToSplit(sfNumber.left)) {
            return findNumberToSplit(sfNumber.left);
        } else if (typeof sfNumber.right === "number" && sfNumber.right >= 10) {
            return sfNumber;
        } else if (findNumberToSplit(sfNumber.right)) {
            return findNumberToSplit(sfNumber.right);
        }

    }
    return findNumberToSplit(sfNumber.left) || findNumberToSplit(sfNumber.right);
}

function explode(sfNumber: SFNumber): void {
    let leftParentToChange = null;
    let current = sfNumber;
    let parent = current.parent;
    while (parent) {
        if (parent.left !== current) {
            leftParentToChange = parent;
            break;
        }
        current = parent;
        parent = current.parent;
    }

    if (leftParentToChange) {
        if (typeof (leftParentToChange as SFNumber).left === "number") {
            (leftParentToChange.left as number) += (sfNumber.left as number);
        } else {
            ((leftParentToChange.left as SFNumber).rightMostChild().right as number) += (sfNumber.left as number);
        }
    }

    let rightParentToChange = null;
    current = sfNumber;
    parent = current.parent;
    while (parent) {
        if (parent.right !== current) {
            rightParentToChange = parent;
            break;
        }
        current = parent;
        parent = current.parent;
    }

    if (rightParentToChange) {
        if (typeof (rightParentToChange as SFNumber).right === "number") {
            (rightParentToChange.right as number) += (sfNumber.right as number);
        } else {
            ((rightParentToChange.right as SFNumber).leftMostChild().left as number) += (sfNumber.right as number);
        }
    }

    if (sfNumber.parent.left === sfNumber) {
        sfNumber.parent.left = 0;
    } else {
        sfNumber.parent.right = 0;
    }
}

function split(sfNumber: SFNumber): void {
    if (sfNumber.left >= 10) {
        const left = new SFNumber(Math.floor(sfNumber.left as number / 2), Math.ceil(sfNumber.left as number / 2));
        sfNumber.left = left;
        left.parent = sfNumber;
    } else {
        const right = new SFNumber(Math.floor(sfNumber.right as number / 2), Math.ceil(sfNumber.right as number / 2));
        sfNumber.right = right;
        right.parent = sfNumber;
    }
}

function shouldReduce(sfNumber: SFNumber) {
    return !! findExplodingSFNumber(sfNumber) || !! findNumberToSplit(sfNumber);
}

function reduce(sfNumber: SFNumber): void {
    const numberToExplode = findExplodingSFNumber(sfNumber);
    if (numberToExplode) {
        explode(numberToExplode);
        return;
    }

    const numberToSplit = findNumberToSplit(sfNumber);
    if (numberToSplit) {
        split(numberToSplit);
    }
}

function part1(sfNumbers: SFNumber[]) {
    let sfNumber = sfNumbers.shift();

    while (sfNumbers.length > 0) {
        sfNumber = add(sfNumber as SFNumber, sfNumbers.shift() as SFNumber);
        while(shouldReduce(sfNumber)) {
            console.log(sfNumber!.log());
            reduce(sfNumber);
        }
    }

    console.log(sfNumber!.log());
    return sfNumber!.magnitude();
}

// console.log(part1(res));

function part2(sfNumbers: SFNumber[]) {
    let max = 0;
    for (let i = 0; i < sfNumbers.length; i++) {
        for (let j = i + 1; j < sfNumbers.length; j++) {
            let sfNumber = add(sfNumbers[i] as SFNumber, sfNumbers[j] as SFNumber);
            while(shouldReduce(sfNumber)) {
                reduce(sfNumber);
            }
            let magnitude = sfNumber.magnitude();
            if (magnitude > max) {
                max = magnitude;
            }

            sfNumber = add(sfNumbers[j] as SFNumber, sfNumbers[i] as SFNumber);
            while(shouldReduce(sfNumber)) {
                reduce(sfNumber);
            }
            magnitude = sfNumber.magnitude();
            if (magnitude > max) {
                max = magnitude;
            }
        }
    }

    return max;
}

res = parseInput(input.split("\n")) as SFNumber[];

console.log(part2(res));
