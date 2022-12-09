import { readFileSync } from "fs";

const input = readFileSync("src/2021/day23/day23.input.txt", "utf8");

class Amphipod {
    x: number;
    y: number;
    type: string;
    hasMoved = false;

    constructor(x: number, y: number, type: string, hasMoved: boolean) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.hasMoved = hasMoved;
    }

    copy() {
        return new Amphipod(this.x, this.y, this.type, this.hasMoved);
    }

    destinationY() {
        if (this.type === "A") { return 3; }
        if (this.type === "B") { return 5; }
        if (this.type === "C") { return 7; }
        return 9;
    }

    isAtDestination() {
        return ! this.isInHallway() && this.y === this.destinationY();
    }

    isInHallway() {
        return this.x === 1;
    }

    canMove(destX: number, destY: number) {
        if (this.isInHallway()) { return destY === this.destinationY(); }
        else {
            return ! [3,5,7,9].includes(destY);
        }
    }

    move(destX: number, destY: number) {
        this.hasMoved = true;
        const cost = this.moveCost(destX, destY);
        this.x = destX;
        this.y = destY;
        return cost;
    }

    moveCost(destX: number, destY: number) {
        const xMoves = Math.abs(destX - this.x);
        const yMoves = Math.abs(destY - this.y);
        return this.energyPerMove() * (xMoves + yMoves);
    }

    energyPerMove() {
        if (this.type === "A") { return 1; }
        if (this.type === "B") { return 10; }
        if (this.type === "C") { return 100; }
        return 1000;
    }

    stepsTaken(destX: number, destY: number) {
        const steps = [];
        if (destX < this.x) {
            for (let i = this.x - 1; destX <= i; i--) {
                steps.push([i, this.y]);
            }
            if (this.y < destY) {
                for (let i = this.y + 1; i <= destY; i++) {
                    steps.push([destX, i]);
                }
            } else {
                for (let i = this.y - 1; destY <= i; i--) {
                    steps.push([destX, i]);
                }
            }
        } else {
            if (this.y < destY) {
                for (let i = this.y + 1; i <= destY; i++) {
                    steps.push([this.x, i]);
                }
            } else {
                for (let i = this.y - 1; destY <= i; i--) {
                    steps.push([this.x, i]);
                }
            }
            for (let i = this.x + 1; i <= destX; i++) {
                steps.push([i, destY]);
            }
        }
        return steps;
    }

    id() {
        return `${this.x},${this.y},${this.type}`;
    }
}

class Burrow {
    amphipods: Amphipod[];
    energySpent: number;

    constructor(amphipods: Amphipod[], energySpent: number) {
        this.amphipods = amphipods;
        this.energySpent = energySpent;
    }

    copy() {
        return new Burrow(this.amphipods.map(a => a.copy()), this.energySpent);
    }

    toString() {
        for (let i = 0; i < 7; i++) {
            let line = "";
            for (let j = 0; j < 13; j++) {
                const amphipod = this.amphipods.find(a => a.x === i && a.y === j)
                if (amphipod) {
                    line += amphipod.type;
                } else {
                    if (i === 0) { line += "#"; }
                    if (i === 1 && j === 0) { line += "#"; }
                    if (i === 1 && 1 <= j && j <= 11) { line += "."; }
                    if (i === 1 && j === 12) { line += "#"; }
                    if (i === 2 && j <= 2) { line += "#"; }
                    if (i === 2 && j === 3) { line += "."; }
                    if (i === 2 && j === 4) { line += "#"; }
                    if (i === 2 && j === 5) { line += "."; }
                    if (i === 2 && j === 6) { line += "#"; }
                    if (i === 2 && j === 7) { line += "."; }
                    if (i === 2 && j === 8) { line += "#"; }
                    if (i === 2 && j === 9) { line += "."; }
                    if (i === 2 && j >= 10) { line += "#"; }
                    if (3 <= i && i <= 5) {
                        if (j <= 1) { line += " "; }
                        if (j === 2) { line += "#"; }
                        if (j === 3) { line += "."; }
                        if (j === 4) { line += "#"; }
                        if (j === 5) { line += "."; }
                        if (j === 6) { line += "#"; }
                        if (j === 7) { line += "."; }
                        if (j === 8) { line += "#"; }
                        if (j === 9) { line += "."; }
                        if (j === 10) { line += "#"; }
                    }
                    if (i === 6 && j <= 1) { line += " "; }
                    if (i === 6 && 3 <= j && j <= 11) { line += "#"; }
                }
            }
            console.log(line);
        }
    }

    isInvalidRoom(roomY: number) {
        if (roomY === 3) {
            return this.amphipods.find(a => {
                return a.type !== "A" && a.y === 3 && (a.x === 2 || a.x === 3 || a.x === 4 || a.x === 5);
            });
        }
        if (roomY === 5) {
            return this.amphipods.find(a => {
                return a.type !== "B" && a.y === 5 && (a.x === 2 || a.x === 3 || a.x === 4 || a.x === 5);
            });
        }
        if (roomY === 7) {
            return this.amphipods.find(a => {
                return a.type !== "C" && a.y === 7 && (a.x === 2 || a.x === 3 || a.x === 4 || a.x === 5);
            });
        }
        if (roomY === 9) {
            return this.amphipods.find(a => {
                return a.type !== "D" && a.y === 9 && (a.x === 2 || a.x === 3 || a.x === 4 || a.x === 5);
            });
        }
    }

    isEmptyRoom(destY: number) {
        return ! this.amphipods.find(a => a.y === destY && (a.x === 2 || a.x === 3 || a.x === 4 || a.x === 5));
    }

    isValid() {
        return this.amphipods.length === this.nbValidAmphipods();
    }

    nbValidAmphipods() {
        return this.amphipods.filter(a => a.isAtDestination()).length;
    }

    possibleNextMoves() {
        let possibleDestinations = [];
        for (let j = 1; j <= 11; j++) {
            if (! [3,5,7,9].includes(j)) { possibleDestinations.push([1, j]) }
        }
        for (const j of [3,5,7,9]) {
            if (this.isInvalidRoom(j)) { continue; }
            possibleDestinations.push([2,j]);
            possibleDestinations.push([3,j]);
            possibleDestinations.push([4,j]);
            possibleDestinations.push([5,j]);
        }
        possibleDestinations = possibleDestinations.filter(([x, y]) => ! this.amphipods.find(a => a.x === x && a.y === y));

        const nextMoves: any[] = [];
        possibleDestinations.forEach(([destX, destY]) => {
            if ([3,5,7,9].includes(destY) && this.isEmptyRoom(destY) && destX < 5) { return; }

            this.amphipods.forEach((amphipod, index) => {
                if (amphipod.hasMoved && amphipod.isAtDestination()) { return; }
                if (! amphipod.canMove(destX, destY)) { return; }

                const stepsTaken = amphipod.stepsTaken(destX, destY);
                if (stepsTaken.find(([x, y]) => this.amphipods.find(a => a.x === x && a.y === y))) { return; }

                nextMoves.push({ index, destX, destY, moveCost: this.moveCost(index, destX, destY) });
            })
        });
        
        return nextMoves.sort(compareMoves);

        function compareMoves(m1: any, m2: any) {
            if (m1.destX > m2.destX) { return -1; }
            if (m2.destX > m1.destX) { return 1; }
            return m1.moveCost - m2.moveCost;
        }
    }

    moveCost(index: number, destX: number, destY: number) {
        return this.amphipods[index].moveCost(destX, destY);
    }

    moveAmphipod(index: number, destX: number, destY: number) {
        this.energySpent += this.amphipods[index].move(destX, destY);
    }

    id() {
        return this.amphipods.map(a => a.id()).join(";") + this.energySpent;
    }
}

function parseInput(lines: string[]) {
    const lineChars = lines.map(line => line.split(""));
    const amphipods: Amphipod[] = [];

    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 12; j++) {
            if (lineChars[i][j] === "A" || lineChars[i][j] === "B" || lineChars[i][j] === "C" || lineChars[i][j] === "D") {
                amphipods.push(new Amphipod(i, j, lineChars[i][j], false));
            }
        }
    }

    return new Burrow(amphipods, 0);
}

const res = parseInput(input.split("\n"));

res.toString();

function part1(burrow: Burrow) {
    const burrows = [burrow];
    let minimumEnergy = 300000000000000000000;
    const seen: Set<string> = new Set();

    while(burrows.length) {
        const nextBurrow = burrows.pop()!;
        if (seen.has(nextBurrow.id())) {
            continue;
        } else {
            seen.add(nextBurrow.id());
        }
        if (nextBurrow.energySpent >= minimumEnergy) {
            continue;
        }
        if (nextBurrow.isValid()) {
            if (nextBurrow.energySpent < minimumEnergy) {
                minimumEnergy = nextBurrow.energySpent;
                console.log(minimumEnergy);
            }
            continue;
        }

        const nextMoves = nextBurrow.possibleNextMoves();
        nextMoves.forEach(({ index, destX, destY }) => {
            const newBurrow = nextBurrow.copy();
            newBurrow.moveAmphipod(index, destX, destY);
            burrows.push(newBurrow);
        });
    }

    return minimumEnergy;
}

console.log(part1(res));
