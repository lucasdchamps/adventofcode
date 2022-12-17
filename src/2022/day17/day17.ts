import { readFileSync } from "fs";
import { Board, prettyPrint } from "../../utils";

const rawInput = readFileSync("src/2022/day17/input.txt", "utf8");

const input = parseInput(rawInput.split("\n"));
prettyPrint(input);
console.log(part1(input));
console.log(part2(input));

type Position = {
    x: number,
    y: number
}

function buildRockPatterns() {
    return [
        new Board([
            ["#", "#", "#", "#"]
        ]),
        new Board([
            [".", "#", "."],
            ["#", "#", "#"],
            [".", "#", "."]
        ]),
        new Board([
            [".", ".", "#"],
            [".", ".", "#"],
            ["#", "#", "#"]
        ]),
        new Board([
            ["#"],
            ["#"],
            ["#"],
            ["#"]
        ]),
        new Board([
            ["#", "#"],
            ["#", "#"]
        ])
    ];
}

function buildCarvern() {
    return new Board([
        [".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", "."],
    ]);
}

function canGoDown(pos: Position, rock: Board, cavern: Board) {
    if (pos.y + rock.height() >= cavern.height()) { return false; }
    for (let y = 0; y < rock.height(); y++) {
        for (let x = 0; x < rock.length(); x++) {
            if (rock.cell(y, x) === "#" && cavern.cell(pos.y + y + 1, pos.x + x) === "#") { return false; }
        }
    }
    return true;
}

function canGoRight(pos: Position, rock: Board, cavern: Board) {
    if (pos.x + rock.length() === cavern.length()) { return false; }
    for (let y = 0; y < rock.height(); y++) {
        for (let x = 0; x < rock.length(); x++) {
            if (rock.cell(y, x) === "#" && cavern.cell(pos.y + y, pos.x + x + 1) === "#") { return false; }
        }
    }
    return true;
}

function canGoLeft(pos: Position, rock: Board, cavern: Board) {
    if(pos.x === 0) { return false; }
    for (let y = 0; y < rock.height(); y++) {
        for (let x = 0; x < rock.length(); x++) {
            if (rock.cell(y, x) === "#" && cavern.cell(pos.y + y, pos.x + x - 1) === "#") { return false; }
        }
    }
    return true;
}

function placeRock(pos: Position, rock: Board, cavern: Board) {
    for (let y = 0; y < rock.height(); y++) {
        for (let x = 0; x < rock.length(); x++) {
            if (rock.cell(y, x) === "#") { cavern.setCellValue(pos.y + y, pos.x + x, "#"); }
        }
    }
}

function computeNewHighestPoint(highestPoint: number, cavern: Board) {
    for (let y = cavern.height() - 1 - highestPoint; y > 0; y--) {
        if (cavern.row(y).filter(c => c === ".").length === cavern.length()) {
            return cavern.height() - 1 - y;
        }
    }
}

function increaseCavern(nextRock: Board, highestPoint: number, cavern: Board) {
    while (nextRock.height() + 3 > cavern.height() - highestPoint) {
        cavern.grid.unshift([".", ".", ".", ".", ".", ".", "."]);
    }
}

function cavernState(rockIndex: number, jetIndex: number, highestPoint: number, cavern: Board) {
    const rows = [];
    for (let i = 0; i < Math.min(60, highestPoint); i++) {
        rows.push(cavern.row(cavern.height() - highestPoint + i));
    }
    return `rocketIndex: ${rockIndex};jetIndex: ${jetIndex}; ${rows.join("")}`;
}

function part1(jetPatterns: string[]) {
    const rockPatterns = buildRockPatterns();
    const cavern = buildCarvern();
    let jetIndex = 0;
    let rockIndex = 0;
    let highestPoint = 0;

    for (let i = 0; i < 2022; i++) {
        const rock = rockPatterns[rockIndex];
        const pos = { x: 2, y: cavern.height() - highestPoint - 3  - rock.height()};

        // eslint-disable-next-line no-constant-condition
        while(true) {
            const jet = jetPatterns[jetIndex];
            if (jet === ">" && canGoRight(pos, rock, cavern)) {
                pos.x += 1;
            } else if (jet === "<" && canGoLeft(pos, rock, cavern)) {
                pos.x -= 1;
            }
            jetIndex = (jetIndex + 1) % jetPatterns.length;

            if (canGoDown(pos, rock, cavern)) {
                pos.y += 1;
            } else {
                break;
            }
        }

        placeRock(pos, rock, cavern);
        highestPoint = computeNewHighestPoint(highestPoint, cavern)!;

        rockIndex = (rockIndex + 1) % rockPatterns.length;
        const nextRock = rockPatterns[rockIndex];
        increaseCavern(nextRock, highestPoint, cavern);
    }

    return highestPoint;
}

function part2(jetPatterns: any[]) {
    const rockPatterns = buildRockPatterns();
    const cavern = buildCarvern();
    let jetIndex = 0;
    let rockIndex = 0;
    let highestPoint = 0;
    const states: Record<string, any> = {};
    const max = 1000000000000;

    for (let i = 0; i < max; i++) {
        const rock = rockPatterns[rockIndex];
        const pos = { x: 2, y: cavern.height() - highestPoint - 3  - rock.height()};

        // eslint-disable-next-line no-constant-condition
        while(true) {
            const jet = jetPatterns[jetIndex];
            if (jet === ">" && canGoRight(pos, rock, cavern)) {
                pos.x += 1;
            } else if (jet === "<" && canGoLeft(pos, rock, cavern)) {
                pos.x -= 1;
            }
            jetIndex = (jetIndex + 1) % jetPatterns.length;

            if (canGoDown(pos, rock, cavern)) {
                pos.y += 1;
            } else {
                break;
            }
        }

        placeRock(pos, rock, cavern);
        highestPoint = computeNewHighestPoint(highestPoint, cavern)!;

        const state = cavernState(rockIndex, jetIndex, highestPoint, cavern);
        if (states[state] !== undefined) {
            const prevIndex = states[state].index;
            const prevHighestPoint = states[state].highestPoint;
            const nbRocksLeft = max - i;

            const remainder = nbRocksLeft % (i - prevIndex);
            const stateAtRemainder = Object.values(states).find(({ index }) => index === prevIndex + remainder - 1);

            return highestPoint +
                Math.floor((nbRocksLeft / (i - prevIndex))) * (highestPoint - prevHighestPoint) +
                stateAtRemainder.highestPoint - prevHighestPoint
        }
        states[state] = { index: i, highestPoint }


        rockIndex = (rockIndex + 1) % rockPatterns.length;
        const nextRock = rockPatterns[rockIndex];
        increaseCavern(nextRock, highestPoint, cavern);
    }

    return highestPoint;
}

function parseInput(lines: string[]): any[] {
    return lines[0].split("");
}
