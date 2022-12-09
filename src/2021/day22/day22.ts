import { readFileSync } from "fs";
import { toInt } from "../../utils";

const input = readFileSync("src/2021/day22/day22.input.txt", "utf8");

class Interval {
    type: string;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;

    constructor(type: string, minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number) {
        this.type = type;
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
        this.minZ = minZ;
        this.maxZ = maxZ;
    }

    toString() {
        return `${this.type} x=${this.minX}..${this.maxX},y=${this.minY}..${this.maxY},z=${this.minZ}..${this.maxZ}`;
    }

    nbCubes() {
        return (this.maxX - this.minX + 1) * (this.maxY - this.minY + 1) * (this.maxZ - this.minZ + 1);
    }
}

function parseInput(lines: string[]): Interval[] {
    return lines.map(line => {
        const state = line.split(" ")[0];
        const coords = line.match(/x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/)!;
        return new Interval(state, toInt(coords[1]), toInt(coords[2]), toInt(coords[3]),toInt(coords[4]), toInt(coords[5]), toInt(coords[6]));
    });
}

function part2(steps: Interval[]) {
    let currOnIntervals = [steps[0]];
    console.log(currOnIntervals.map(interval => interval.nbCubes()).reduce((curr, next) => curr + next));
    let nextOnIntervals = [];

    for (let i = 1; i < steps.length; i++) {
        const other = steps[i];

        for (const current of currOnIntervals) {
            if (other.maxX < current.minX || current.maxX < other.minX || other.maxY < current.minY || current.maxY < other.minY || other.maxZ < current.minZ || current.maxZ < other.minZ) {
                nextOnIntervals.push(current);
                continue;
            }

            if (current.minX < other.minX) {
                nextOnIntervals.push(new Interval(current.type, current.minX, other.minX - 1, current.minY, current.maxY, current.minZ, current.maxZ));
            }
            if (other.maxX < current.maxX) {
                nextOnIntervals.push(new Interval(current.type, other.maxX + 1, current.maxX, current.minY, current.maxY, current.minZ, current.maxZ));
            }
            if (current.minY < other.minY) {
                nextOnIntervals.push(new Interval(current.type, Math.max(current.minX, other.minX), Math.min(current.maxX, other.maxX), current.minY, other.minY - 1, current.minZ, current.maxZ));
            }
            if (other.maxY < current.maxY) {
                nextOnIntervals.push(new Interval(current.type, Math.max(current.minX, other.minX), Math.min(current.maxX, other.maxX), other.maxY + 1, current.maxY, current.minZ, current.maxZ));
            }
            if (current.minZ < other.minZ) {
                nextOnIntervals.push(new Interval(current.type, Math.max(current.minX, other.minX), Math.min(current.maxX, other.maxX), Math.max(current.minY, other.minY), Math.min(current.maxY, other.maxY), current.minZ, other.minZ - 1));
            }
            if (other.maxZ < current.maxZ) {
                nextOnIntervals.push(new Interval(current.type, Math.max(current.minX, other.minX), Math.min(current.maxX, other.maxX), Math.max(current.minY, other.minY), Math.min(current.maxY, other.maxY), other.maxZ + 1, current.maxZ));
            }
        }

        if (other.type === "on") {
            nextOnIntervals.push(other);
        }

        currOnIntervals = nextOnIntervals;
        nextOnIntervals = [];

        console.log(currOnIntervals.map(interval => interval.nbCubes()).reduce((curr, next) => curr + next));
    }

    return currOnIntervals.map(interval => interval.nbCubes()).reduce((curr, next) => curr + next);
}

const res = parseInput(input.split("\n"));

console.log(part2(res));
