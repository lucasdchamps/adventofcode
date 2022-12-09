import { readFileSync } from "fs";
import { toInt } from "../../utils";

const input = readFileSync("src/2021/day16/day16.input.txt", "utf8");

function parseInput(lines: string[]) {
    return lines[0];
}

let res = parseInput(input.split("\n"));

const HEXA_TO_BINARY: Record<string, string> = {
    "0": "0000",
    "1": "0001",
    "2": "0010",
    "3": "0011",
    "4": "0100",
    "5": "0101",
    "6": "0110",
    "7": "0111",
    "8": "1000",
    "9": "1001",
    "A": "1010",
    "B": "1011",
    "C": "1100",
    "D": "1101",
    "E": "1110",
    "F": "1111"
}

function version(binaryString: string) {
    return parseInt(binaryString.slice(0, 3), 2);
}

function extractType(binaryString: string) {
    return parseInt(binaryString.slice(3, 6), 2);
}

function extractLiteralValue(binaryString: string) {
    let bitGroups = binaryString.slice(6);
    let leadingZeroGroupReached = false;
    let numberString = "";

    while(! leadingZeroGroupReached) {
        const bitGroup = bitGroups.slice(0, 5);
        numberString += bitGroup.slice(1, 5);

        if (bitGroup.split("")[0] === "0") {
            leadingZeroGroupReached = true;
        }

        bitGroups = bitGroups.slice(5);
    }

    return {
        literalValue: parseInt(numberString, 2),
        lastBitIndex: binaryString.split("").length - bitGroups.split("").length
    };
}

function extractLength(binaryString: string) {
    return binaryString[6];
}

function extract15BitsLength(binaryString: string) {
    return parseInt(binaryString.slice(7, 22), 2);
}

function extract11BitsSubPackets(binaryString: string) {
    return parseInt(binaryString.slice(7, 18), 2);
}

function computeLiteralValue(type: number, subPacketValues: number[]) {
    if (subPacketValues.length === 1) { return subPacketValues[0]; }
    
    if (type === 0) {
        return subPacketValues.reduce((prev, curr) => prev + curr);
    }
    if (type === 1) {
        return subPacketValues.reduce((prev, curr) => prev * curr);
    }
    if (type === 2) {
        return Math.min(...subPacketValues);
    }
    if (type === 3) {
        return Math.max(...subPacketValues);
    }
    if (type === 5) {
        return subPacketValues[0] > subPacketValues[1] ? 1 : 0;
    }
    if (type === 6) {
        return subPacketValues[0] < subPacketValues[1] ? 1 : 0;
    }
    if (type === 7) {
        return subPacketValues[0] === subPacketValues[1] ? 1 : 0;
    }
}

function parseBinaryString(binaryString: string) {
    let versionSum = version(binaryString);
    let literalValue;
    let lastBitIndex;
    const type = extractType(binaryString);

    if (type === 4) {
        ({ literalValue, lastBitIndex} = extractLiteralValue(binaryString));
    } else {
        const length = extractLength(binaryString);
        const subPacketValues: number[] = [];
        if (length === "0") {
            const numberBits = extract15BitsLength(binaryString);
            let subString = binaryString.slice(22);
            let parsedBits = 0;
            while(parsedBits < numberBits) {
                const { versionSum: subVersionSum, lastBitIndex: subLastBitIndex, literalValue: subLiteralValue } = parseBinaryString(subString);
                versionSum += subVersionSum;
                parsedBits += subLastBitIndex;
                subPacketValues.push(subLiteralValue!);
                subString = subString.slice(subLastBitIndex);
            }
            lastBitIndex = 22 + parsedBits;
        } else {
            const numberPackets = extract11BitsSubPackets(binaryString);
            let subString = binaryString.slice(18);
            let sumPacketLength = 0;
            let parsedPackets = 0;
            while(parsedPackets < numberPackets) {
                const { versionSum: subVersionSum, lastBitIndex: subLastBitIndex, literalValue: subLiteralValue } = parseBinaryString(subString);
                versionSum += subVersionSum;
                parsedPackets += 1;
                sumPacketLength += subLastBitIndex;
                subPacketValues.push(subLiteralValue!);
                subString = subString.slice(subLastBitIndex);
            }
            lastBitIndex = 18 + sumPacketLength;
        }

        literalValue = computeLiteralValue(type, subPacketValues);
    }

    return {
        versionSum,
        literalValue,
        lastBitIndex
    }
}

function part1(hexaString: string) {
    const binaryString = hexaString.split("").map(char => HEXA_TO_BINARY[char]).join("");
    return parseBinaryString(binaryString);
}

console.log(part1(res));

function part2(hexaString: string) {
    return 0;
}

res = parseInput(input.split("\n"));

console.log(part2(res));
