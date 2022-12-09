import { readFileSync } from "fs";

function boardingTimestamps(busIds: (number | string)[], minutesToWait: number) {
    return busIds.map(busId => {
        if (busId === "x") { return "x"; }
        let offset = minutesToWait - minutesToWait % (busId as number);
        while (offset < minutesToWait) { offset += (busId as number); }
        return offset;
    });
}

function checkTimestamps(busIds: (number | string)[], timestamp: number) {
    return busIds.every((busId, index) => busId === "x" || (timestamp + index) % (busId as number) === 0);
}

function findMagicTimeStamp(busIds: (number | string)[]): number {
    if (busIds.length === 1) { return busIds[0] as number; }

    const previousIds = busIds.slice(0, busIds.length - 1);
    let partialTimestamp = findMagicTimeStamp(previousIds);
    if (busIds[busIds.length - 1] === "x") { return partialTimestamp; }

    const product = (previousIds.filter(busId => busId !== "x") as number[]).reduce((a, b) => a * b);
    while(! checkTimestamps(busIds, partialTimestamp)) {
        partialTimestamp += product;
    }
    return partialTimestamp;
}

const inputFile = readFileSync("src/day13/day13.input.txt", "utf8");
const minutesToWait = parseInt(inputFile.split("\n")[0], 10);
const busIds = inputFile.split("\n")[1].split(",").map(stringId => stringId === "x" ? "x" : parseInt(stringId, 10));
const timestamps = boardingTimestamps(busIds, minutesToWait);
console.log(timestamps);
console.log(7 * 421);

console.log(findMagicTimeStamp(busIds));
