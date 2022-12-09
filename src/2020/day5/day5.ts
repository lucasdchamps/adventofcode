import { DAY5_INPUT } from "./day5.input";

function getHighestSeatId(boardingPasses: string[]) {
    return Math.max(...boardingPasses.map(boardingPass => getSeatId(boardingPass)));
}

function getMissingId(boardingPasses: string[]) {
    const seatIds = boardingPasses.map(boardingPass => getSeatId(boardingPass));
    const sortedSeatIds = seatIds.sort((a, b) => a - b);
    for (let seatIdx = 0; seatIdx < sortedSeatIds.length - 1; seatIdx ++) {
        if (sortedSeatIds[seatIdx + 1] - sortedSeatIds[seatIdx] > 1) {
            return sortedSeatIds[seatIdx] + 1;
        }
    }
}

function getSeatId(boardingPass: string): number {
    const rowIndicators = boardingPass.split("").slice(0, 7);
    const columnIndicators = boardingPass.split("").slice(7, 10);

    const row = getRow(rowIndicators);
    const column = getColumn(columnIndicators);
    return row * 8 + column;
}

function getRow(rowIndicators: string[]): number {
    let lowerBound = 0;
    let upperBound = 127;
    rowIndicators.forEach(rowIndicator => {
        if (rowIndicator === "F") {
            upperBound = upperBound - Math.ceil((upperBound - lowerBound) / 2);
        } else {
            lowerBound = lowerBound + Math.ceil((upperBound - lowerBound) / 2);
        }
    })
    if (rowIndicators[rowIndicators.length - 1] === "F") { return lowerBound; }
    return upperBound;
}

function getColumn(columnIndicators: string[]): number {
    let lowerBound = 0;
    let upperBound = 7;
    columnIndicators.forEach(columnIndicator => {
        if (columnIndicator === "L") {
            upperBound = upperBound - Math.ceil((upperBound - lowerBound) / 2);
        } else {
            lowerBound = lowerBound + Math.ceil((upperBound - lowerBound) / 2);
        }
    })
    if (columnIndicators[columnIndicators.length - 1] === "L") { return lowerBound; }
    return upperBound;
}

console.log(getHighestSeatId(DAY5_INPUT));

console.log(getMissingId(DAY5_INPUT));
