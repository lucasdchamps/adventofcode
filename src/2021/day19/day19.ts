import { readFileSync } from "fs";
import { toInt } from "../../utils";

const input = readFileSync("src/2021/day19/day19.input.txt", "utf8");

class RelativePosition {
    x: number;
    y: number;
    z: number;
    source: Beacon;
    target: Beacon;

    constructor(source: Beacon, target: Beacon, x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.source = source;
        this.target = target;
    }

    equals(otherPosition: RelativePosition) {
        return this.x === otherPosition.x && this.y === otherPosition.y && this.z === otherPosition.z;
    }
}

class Beacon {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    log() {
        console.log(`[${this.x}, ${this.y}, ${this.z}]`);
    }

    id() {
        return [Math.abs(this.x), Math.abs(this.y), Math.abs(this.z)].sort((a, b) => a - b).join(",");
    }
}

class Scanner {
    x: number;
    y: number;
    z: number;
    index: number;
    beacons: Beacon[];

    constructor(index: number, beacons: Beacon[]) {
        this.index = index;
        this.beacons = beacons;
    }

    orientations(): Scanner[] {
        const scanners = [];
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(beacon.x, beacon.y, beacon.z))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(beacon.x, - beacon.z, beacon.y))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(beacon.x, - beacon.y, - beacon.z))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(beacon.x, beacon.z, - beacon.y))));

        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(beacon.y, - beacon.x, beacon.z))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(beacon.y, - beacon.z, - beacon.x))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(beacon.y, - beacon.x, - beacon.z))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(beacon.y, beacon.z, beacon.x))));

        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(- beacon.x, - beacon.y, beacon.z))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(- beacon.x, - beacon.z, - beacon.y))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(- beacon.x, beacon.y, - beacon.z))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(- beacon.x, beacon.z, - beacon.y))));

        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(- beacon.y, beacon.x, beacon.z))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(- beacon.y, - beacon.z, beacon.x))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(- beacon.y, - beacon.x, - beacon.z))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(- beacon.y, beacon.z, - beacon.x))));

        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(beacon.z, beacon.y, - beacon.x))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(beacon.z, beacon.x, beacon.y))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(beacon.z, - beacon.y, - beacon.x))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(beacon.z, - beacon.x, beacon.y))));

        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(- beacon.z, beacon.y, beacon.x))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(- beacon.z, - beacon.x, beacon.y))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(- beacon.z, - beacon.y, - beacon.x))));
        scanners.push(new Scanner(this.index, this.beacons.map(beacon => new Beacon(- beacon.z, beacon.x, - beacon.y))));
        return scanners;
    }

    log() {
        console.log(`Scanner index ${this.index}`);
        this.beacons.map(beacon => beacon.log());
    }
}

function applyRotation(beaconBefore: Beacon, beaconAfter: Beacon, beaconToRotate: Beacon) {
    let x = beaconToRotate.x;
    let y = beaconToRotate.y;
    let z = beaconToRotate.z;

    if (beaconAfter.x === - beaconBefore.x) {
        x = - beaconToRotate.x;
    } else if (beaconAfter.x === beaconBefore.y) {
        x = beaconToRotate.y;
    } else if (beaconAfter.x === - beaconBefore.y) {
        x = - beaconToRotate.y;
    } else if (beaconAfter.x === beaconBefore.z) {
        x = beaconToRotate.z;
    } else if (beaconAfter.x ===  - beaconBefore.z) {
        x = - beaconToRotate.z;
    }

    if (beaconAfter.y === - beaconBefore.y) {
        y = - beaconToRotate.y;
    } else if (beaconAfter.y === beaconBefore.x) {
        y = beaconToRotate.x;
    } else if (beaconAfter.y === - beaconBefore.x) {
        y = - beaconToRotate.x;
    } else if (beaconAfter.y === beaconBefore.z) {
        y = beaconToRotate.z;
    } else if (beaconAfter.y ===  - beaconBefore.z) {
        y = - beaconToRotate.z;
    }

    if (beaconAfter.z === - beaconBefore.z) {
        z = - beaconToRotate.z;
    } else if (beaconAfter.z === beaconBefore.x) {
        z = beaconToRotate.x;
    } else if (beaconAfter.z === - beaconBefore.x) {
        z = - beaconToRotate.x;
    } else if (beaconAfter.z === beaconBefore.y) {
        z = beaconToRotate.y;
    } else if (beaconAfter.z ===  - beaconBefore.y) {
        z = - beaconToRotate.y;
    }

    return new Beacon(x, y, z);
}

function relativePosition(source: Beacon, target: Beacon) {
    return new RelativePosition(source, target, target.x - source.x, target.y - source.y, target.z - source.z);
}

function positionsRelativeToIndex(index: number, beacons: Beacon[]) {
    const source = beacons[index];
    const targets = beacons.filter((beacon, i) => i !== index);
    return [
        new RelativePosition(source, source, 0, 0, 0),
        ...targets.map(target => relativePosition(source, target))
    ];
}

function findOverlappingBeacons(beacons1: Beacon[], beacons2: Beacon[]) {
    let maxOverlaps = 1;
    let maxOverlappingBeacons = [];
    for (let i = 0; i < beacons1.length; i++) {
        for (let j = 0; j < beacons2.length; j++) {
            const relativePositions1 = positionsRelativeToIndex(i, beacons1);
            const relativePositions2 = positionsRelativeToIndex(j, beacons2);
            const overlappingBeacons: any = [];
            relativePositions1.forEach(pos1 => {
                const overlappingPos2 = relativePositions2.find(pos2 => pos1.equals(pos2));
                if (overlappingPos2) {
                    overlappingBeacons.push({
                        fromScanner1: pos1.target,
                        fromScanner2: overlappingPos2.target
                    });
                }
            });
            if (overlappingBeacons.length === 12) { return overlappingBeacons; }
            if (overlappingBeacons.length > maxOverlaps) {
                maxOverlaps = overlappingBeacons.length;
                maxOverlappingBeacons = overlappingBeacons;
            }
        }
    }
    return maxOverlappingBeacons;
}

function overlappingScanners(scanner1: Scanner, scanner2: Scanner) {
    let maxOverlaps = 1;
    let maxOverlappingBeacons = [];
    let orientation1 = null;
    let orientation2 = null;
    const scanner1Orientations = scanner1.orientations();
    const scanner2Orientations = scanner2.orientations();
    for (let i = 0; i < scanner1Orientations.length; i++) {
        for (let j = 0; j < scanner2Orientations.length; j++) {
            const overlappingBeacons = findOverlappingBeacons(
                scanner1Orientations[i].beacons,
                scanner2Orientations[j].beacons
            );
            if (overlappingBeacons.length === 12) {
                return {
                    overlappingBeacons,
                    orientation1: i,
                    orientation2: j
                };
            }
            if (overlappingBeacons.length > maxOverlaps) {
                maxOverlaps = overlappingBeacons.length;
                maxOverlappingBeacons = overlappingBeacons;
                orientation1 = i;
                orientation2 = j;
            }
        }
    }
    return {
        overlappingBeacons: maxOverlappingBeacons,
        orientation1,
        orientation2
    };
}

function parseInput(lines: string[]) {
    const scanners = [];
    let index = 0;
    let beacons = [];
    for (const line of lines) {
        if (line === "") {
            scanners.push(new Scanner(index, beacons));
            index += 1;
            beacons = [];
            continue;
        }
        if (! line.startsWith("---")) {
            const [x, y, z] = line.split(",").map(toInt);
            beacons.push(new Beacon(x, y, z));
        }
    }
    scanners.push(new Scanner(index, beacons));
    return scanners;
}

let res = parseInput(input.split("\n"));

function part1(scanners: Scanner[]) {
    const overlapMap: Record<string, string> = {};
    for (let i = 0; i < scanners.length; i++) {
        for(const beacon of scanners[i].beacons) {
            overlapMap[beacon.id()] = "";
        }
    }

    for (let i = 0; i < scanners.length; i++) {
        for (let j = i + 1; j < scanners.length; j++) {
            const { overlappingBeacons } = overlappingScanners(scanners[i], scanners[j]);
            for (const { fromScanner1: source, fromScanner2: target } of overlappingBeacons) {
                overlapMap[target.id()] = source.id()
            }
            if (overlappingBeacons.length > 0) {
                console.log(`Scanner ${scanners[i].index} overlaps with Scanner ${scanners[j].index}`);
            }
        }
    }

    let numberUniqueBeacons = 0;
    for (const target of Object.values(overlapMap)) {
        if (! target) { numberUniqueBeacons += 1; }
    }

    return numberUniqueBeacons;
}

// console.log(part1(res));

function part2(scanners: Scanner[]) {
    const positions: Record<number, any> = {
        0: { x: 0, y: 0, z: 0}
    };
    const rotationsMap: Record<string, any> = {};
    const inspectionStack = [0];

    while (Object.keys(positions).length < scanners.length) {
        const i = inspectionStack.shift()!;

        for (let j = 0; j < scanners.length; j++) {
            if (j === i) { continue; }
            if (positions[j]) { continue; }

            const { overlappingBeacons } = overlappingScanners(scanners[i], scanners[j]);
            if (! overlappingBeacons.length) { continue; }

            console.log(`Scanner ${i} overlaps with Scanner ${j}`);

            const beacon1 = overlappingBeacons[0].fromScanner1;
            const beacon1InOrientation1 = scanners[i].beacons.find((beacon: Beacon) => beacon.id() === beacon1.id())!;

            const beacon2 = overlappingBeacons[0].fromScanner2;
            const beacon2InOrientation2 = scanners[j].beacons.find(beacon => beacon.id() === beacon2.id())!;

            const beacon2InOrientation1 = applyRotation(beacon1, beacon1InOrientation1, beacon2);

            rotationsMap[j] = {
                targetIndex: i,
                from: beacon2InOrientation2,
                to: beacon2InOrientation1
            };

            let relativePos = new Beacon(
                beacon1InOrientation1.x - beacon2InOrientation1.x,
                beacon1InOrientation1.y - beacon2InOrientation1.y,
                beacon1InOrientation1.z - beacon2InOrientation1.z
            );

            let currentIndex = i;
            while (currentIndex !== 0) {
                const { from, to, targetIndex } = rotationsMap[currentIndex];
                relativePos = applyRotation(from, to, relativePos);
                currentIndex = targetIndex;
            }

            positions[j] = {
                x: relativePos.x + positions[i].x,
                y: relativePos.y + positions[i].y,
                z: relativePos.z + positions[i].z
            }

            inspectionStack.push(j);
        }
    }

    let maxDistance = 0;
    const beacons = Object.values(positions);
    for (let i = 0; i < beacons.length; i++) {
        for (let j = i + 1; j < beacons.length; j++) {
            const distance = Math.abs(positions[i].x - positions[j].x) + Math.abs(positions[i].y - positions[j].y) + Math.abs(positions[i].z - positions[j].z);
            if (distance > maxDistance) {
                maxDistance = distance;
            }
        }
    }

    return maxDistance;
}

res = parseInput(input.split("\n"));

console.log(part2(res));
