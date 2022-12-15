import { readFileSync } from "fs";
import { prettyPrint, toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day15/input.txt", "utf8");

type Coordinates = {
    x: number;
    y: number;
}

class Sensor {
    coords: Coordinates;
    beacon: Coordinates;
    closestDistance: number;

    constructor(coords: Coordinates, beacon: Coordinates) {
        this.coords = coords;
        this.beacon = beacon;
        this.closestDistance = dist(this.coords, this.beacon);
    }

    isBeacon(coords: Coordinates) {
        return coords.x === this.beacon.x && coords.y === this.beacon.y;
    }

    greyArea(y: number) {
        const res = new Set();

        let x = 0;
        while (dist({ x: this.coords.x + x, y }, this.coords) <= this.closestDistance) {
            res.add(this.coords.x - x);
            res.add(this.coords.x + x);
            x += 1;
        }

        return res;
    }
    
    isTooClose(coords: Coordinates) {
        return dist(coords, this.coords) <= this.closestDistance;
    }
}

function dist(coords1: Coordinates, coords2: Coordinates) {
    return Math.abs(coords1.x - coords2.x) + Math.abs(coords1.y - coords2.y);
}

const MAX = 4000000;

const input = parseInput(rawInput.split("\n"));
prettyPrint(input);
// console.log(part1(input));
console.log(part2(input));

function part1(sensors: Sensor[]) {
    return positionsWithoutBeacon(10, sensors).length;
}

function positionsWithoutBeacon(row: number, sensors: Sensor[]) {
    const positions = [];
    const minX = Math.min(...sensors.map(s => s.coords.x - s.closestDistance))
    const maxX = Math.max(...sensors.map(s => s.coords.x + s.closestDistance));
    const union = sensors.reduce((acc, sensor) => new Set([...acc, ...sensor.greyArea(row)]), new Set());

    for (let x = minX; x <= maxX; x++) {
        if (sensors.find((sensor) => sensor.isBeacon({ x, y: row }))) {
            continue;
        }
        if (union.has(x)) {
            positions.push({ x, y: row });
        }
    }

    return positions;
}

function part2(sensors: Sensor[]) {
    let y = 0;
    let x = 0;
    while (y <= MAX) {
        while (x <= MAX) {
            const closeSensor = sensors.find(s => s.isTooClose({ x, y }));
            if (closeSensor) {
                x = Math.max(x, closeSensor.coords.x);
                x += closeSensor.closestDistance + 1 - Math.abs(closeSensor.coords.x - x) - Math.abs(closeSensor.coords.y - y);
            } else {
                return x * 4000000 + y;
            }
        }

        x = 0;
        y += 1;
    }
}

function parseInput(lines: string[]): Sensor[] {
    const result = [];

    for (const line of lines) {
        const sensorX = toInt(line.split(":")[0].match(/x=(-?\d+)/)![1]);
        const sensorY = toInt(line.split(":")[0].match(/y=(-?\d+)/)![1]);
        const beaconX = toInt(line.split(":")[1].match(/x=(-?\d+)/)![1]);
        const beaconY = toInt(line.split(":")[1].match(/y=(-?\d+)/)![1]);

        result.push(new Sensor({ x: sensorX, y: sensorY }, { x: beaconX, y: beaconY }));
    }

    return result;
}
