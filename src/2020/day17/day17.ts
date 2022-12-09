import { readFileSync } from "fs";

interface Coordinates {
    x: number;
    y: number;
    z: number;
    w: number;
}

function parseCubes(inputFile: string) {
    const cubes: Record<string, string> = {};
    const z = 0;
    const w = 0;
    inputFile.split("\n").forEach((line, y) => {
        line.split("").forEach((cubeState, x) => {
            const coordinates = { x, y, z, w };
            cubes[coordinatesToString(coordinates)] = cubeState;
        });
    });
    return cubes;
}

function adjacentCoordinates(strCoordinates: string) {
    const coordinates = stringToCoordinates(strCoordinates);
    return [
        { x: coordinates.x - 1, y: coordinates.y, z: coordinates.z, w: coordinates.w },
        { x: coordinates.x - 1, y: coordinates.y, z: coordinates.z, w: coordinates.w - 1 },
        { x: coordinates.x - 1, y: coordinates.y, z: coordinates.z, w: coordinates.w + 1 },
        { x: coordinates.x - 1, y: coordinates.y, z: coordinates.z - 1, w: coordinates.w },
        { x: coordinates.x - 1, y: coordinates.y, z: coordinates.z - 1, w: coordinates.w - 1 },
        { x: coordinates.x - 1, y: coordinates.y, z: coordinates.z - 1, w: coordinates.w + 1 },
        { x: coordinates.x - 1, y: coordinates.y, z: coordinates.z + 1, w: coordinates.w },
        { x: coordinates.x - 1, y: coordinates.y, z: coordinates.z + 1, w: coordinates.w - 1 },
        { x: coordinates.x - 1, y: coordinates.y, z: coordinates.z + 1, w: coordinates.w + 1 },
        { x: coordinates.x - 1, y: coordinates.y - 1, z: coordinates.z, w: coordinates.w },
        { x: coordinates.x - 1, y: coordinates.y - 1, z: coordinates.z, w: coordinates.w - 1 },
        { x: coordinates.x - 1, y: coordinates.y - 1, z: coordinates.z, w: coordinates.w + 1 },
        { x: coordinates.x - 1, y: coordinates.y - 1, z: coordinates.z - 1, w: coordinates.w },
        { x: coordinates.x - 1, y: coordinates.y - 1, z: coordinates.z - 1, w: coordinates.w - 1 },
        { x: coordinates.x - 1, y: coordinates.y - 1, z: coordinates.z - 1, w: coordinates.w + 1 },
        { x: coordinates.x - 1, y: coordinates.y - 1, z: coordinates.z + 1, w: coordinates.w },
        { x: coordinates.x - 1, y: coordinates.y - 1, z: coordinates.z + 1, w: coordinates.w - 1 },
        { x: coordinates.x - 1, y: coordinates.y - 1, z: coordinates.z + 1, w: coordinates.w + 1 },
        { x: coordinates.x - 1, y: coordinates.y + 1, z: coordinates.z, w: coordinates.w },
        { x: coordinates.x - 1, y: coordinates.y + 1, z: coordinates.z, w: coordinates.w - 1 },
        { x: coordinates.x - 1, y: coordinates.y + 1, z: coordinates.z, w: coordinates.w + 1 },
        { x: coordinates.x - 1, y: coordinates.y + 1, z: coordinates.z - 1, w: coordinates.w },
        { x: coordinates.x - 1, y: coordinates.y + 1, z: coordinates.z - 1, w: coordinates.w - 1 },
        { x: coordinates.x - 1, y: coordinates.y + 1, z: coordinates.z - 1, w: coordinates.w + 1 },
        { x: coordinates.x - 1, y: coordinates.y + 1, z: coordinates.z + 1, w: coordinates.w },
        { x: coordinates.x - 1, y: coordinates.y + 1, z: coordinates.z + 1, w: coordinates.w - 1 },
        { x: coordinates.x - 1, y: coordinates.y + 1, z: coordinates.z + 1, w: coordinates.w + 1 },
        { x: coordinates.x, y: coordinates.y, z: coordinates.z, w: coordinates.w - 1 },
        { x: coordinates.x, y: coordinates.y, z: coordinates.z, w: coordinates.w + 1 },
        { x: coordinates.x, y: coordinates.y, z: coordinates.z - 1, w: coordinates.w },
        { x: coordinates.x, y: coordinates.y, z: coordinates.z - 1, w: coordinates.w - 1 },
        { x: coordinates.x, y: coordinates.y, z: coordinates.z - 1, w: coordinates.w + 1 },
        { x: coordinates.x, y: coordinates.y, z: coordinates.z + 1, w: coordinates.w },
        { x: coordinates.x, y: coordinates.y, z: coordinates.z + 1, w: coordinates.w - 1},
        { x: coordinates.x, y: coordinates.y, z: coordinates.z + 1, w: coordinates.w + 1 },
        { x: coordinates.x, y: coordinates.y - 1, z: coordinates.z, w: coordinates.w },
        { x: coordinates.x, y: coordinates.y - 1, z: coordinates.z, w: coordinates.w - 1 },
        { x: coordinates.x, y: coordinates.y - 1, z: coordinates.z, w: coordinates.w + 1 },
        { x: coordinates.x, y: coordinates.y - 1, z: coordinates.z - 1, w: coordinates.w },
        { x: coordinates.x, y: coordinates.y - 1, z: coordinates.z - 1, w: coordinates.w - 1  },
        { x: coordinates.x, y: coordinates.y - 1, z: coordinates.z - 1, w: coordinates.w + 1  },
        { x: coordinates.x, y: coordinates.y - 1, z: coordinates.z + 1, w: coordinates.w },
        { x: coordinates.x, y: coordinates.y - 1, z: coordinates.z + 1, w: coordinates.w - 1 },
        { x: coordinates.x, y: coordinates.y - 1, z: coordinates.z + 1, w: coordinates.w + 1 },
        { x: coordinates.x, y: coordinates.y + 1, z: coordinates.z, w: coordinates.w },
        { x: coordinates.x, y: coordinates.y + 1, z: coordinates.z, w: coordinates.w - 1 },
        { x: coordinates.x, y: coordinates.y + 1, z: coordinates.z, w: coordinates.w + 1 },
        { x: coordinates.x, y: coordinates.y + 1, z: coordinates.z - 1, w: coordinates.w },
        { x: coordinates.x, y: coordinates.y + 1, z: coordinates.z - 1, w: coordinates.w - 1 },
        { x: coordinates.x, y: coordinates.y + 1, z: coordinates.z - 1, w: coordinates.w + 1 },
        { x: coordinates.x, y: coordinates.y + 1, z: coordinates.z + 1, w: coordinates.w },
        { x: coordinates.x, y: coordinates.y + 1, z: coordinates.z + 1, w: coordinates.w - 1 },
        { x: coordinates.x, y: coordinates.y + 1, z: coordinates.z + 1, w: coordinates.w + 1 },
        { x: coordinates.x + 1, y: coordinates.y, z: coordinates.z, w: coordinates.w },
        { x: coordinates.x + 1, y: coordinates.y, z: coordinates.z, w: coordinates.w - 1 },
        { x: coordinates.x + 1, y: coordinates.y, z: coordinates.z, w: coordinates.w + 1 },
        { x: coordinates.x + 1, y: coordinates.y, z: coordinates.z - 1, w: coordinates.w },
        { x: coordinates.x + 1, y: coordinates.y, z: coordinates.z - 1, w: coordinates.w - 1 },
        { x: coordinates.x + 1, y: coordinates.y, z: coordinates.z - 1, w: coordinates.w + 1 },
        { x: coordinates.x + 1, y: coordinates.y, z: coordinates.z + 1, w: coordinates.w },
        { x: coordinates.x + 1, y: coordinates.y, z: coordinates.z + 1, w: coordinates.w - 1 },
        { x: coordinates.x + 1, y: coordinates.y, z: coordinates.z + 1, w: coordinates.w + 1 },
        { x: coordinates.x + 1, y: coordinates.y - 1, z: coordinates.z, w: coordinates.w },
        { x: coordinates.x + 1, y: coordinates.y - 1, z: coordinates.z, w: coordinates.w - 1 },
        { x: coordinates.x + 1, y: coordinates.y - 1, z: coordinates.z, w: coordinates.w + 1 },
        { x: coordinates.x + 1, y: coordinates.y - 1, z: coordinates.z - 1, w: coordinates.w },
        { x: coordinates.x + 1, y: coordinates.y - 1, z: coordinates.z - 1, w: coordinates.w - 1 },
        { x: coordinates.x + 1, y: coordinates.y - 1, z: coordinates.z - 1, w: coordinates.w + 1 },
        { x: coordinates.x + 1, y: coordinates.y - 1, z: coordinates.z + 1, w: coordinates.w },
        { x: coordinates.x + 1, y: coordinates.y - 1, z: coordinates.z + 1, w: coordinates.w - 1 },
        { x: coordinates.x + 1, y: coordinates.y - 1, z: coordinates.z + 1, w: coordinates.w + 1 },
        { x: coordinates.x + 1, y: coordinates.y + 1, z: coordinates.z, w: coordinates.w },
        { x: coordinates.x + 1, y: coordinates.y + 1, z: coordinates.z, w: coordinates.w - 1 },
        { x: coordinates.x + 1, y: coordinates.y + 1, z: coordinates.z, w: coordinates.w + 1 },
        { x: coordinates.x + 1, y: coordinates.y + 1, z: coordinates.z - 1, w: coordinates.w  },
        { x: coordinates.x + 1, y: coordinates.y + 1, z: coordinates.z - 1, w: coordinates.w - 1 },
        { x: coordinates.x + 1, y: coordinates.y + 1, z: coordinates.z - 1, w: coordinates.w + 1 },
        { x: coordinates.x + 1, y: coordinates.y + 1, z: coordinates.z + 1, w: coordinates.w },
        { x: coordinates.x + 1, y: coordinates.y + 1, z: coordinates.z + 1, w: coordinates.w - 1 },
        { x: coordinates.x + 1, y: coordinates.y + 1, z: coordinates.z + 1, w: coordinates.w + 1 },
    ].map(c => coordinatesToString(c));
}

function applyCycle(cubes: Record<string, string>) {
    const nextCycleCubes = { ...cubes };

    const coordinatesToVisit = new Set(Object.keys(cubes));
    for (const strCoordinates of Object.keys(cubes)) {
        const adjacents = adjacentCoordinates(strCoordinates);
        adjacents.forEach(a => coordinatesToVisit.add(a));
    }

    for (const strCoordinates of coordinatesToVisit) {
        const cubeState = cubes[strCoordinates];
        const adjacentCubes = adjacentCoordinates(strCoordinates).map(a => cubes[a]);
        const adjacentActives = adjacentCubes.filter(c => isActive(c)).length;

        if (isActive(cubeState) && adjacentActives !== 2 && adjacentActives !== 3) {
            nextCycleCubes[strCoordinates] = ".";
        }
        if (isInactive(cubeState) && adjacentActives === 3) {
            nextCycleCubes[strCoordinates] = "#";
        }
    }

    return nextCycleCubes;
}

function applyNCycles(cubes: Record<string, string>, N: number) {
    let i = 0;
    let newCubes = { ...cubes };
    while(i < N) {
        newCubes = applyCycle(newCubes);
        i += 1;
    }
    return Object.values(newCubes).filter(v => isActive(v)).length;
}

function coordinatesToString(coordinates: Coordinates): string {
    return `${coordinates.x},${coordinates.y},${coordinates.z},${coordinates.w}`;
}
function stringToCoordinates(str: string): Coordinates {
    const [x, y, z, w] = str.split(",");
    return {
        x: parseInt(x, 10),
        y: parseInt(y, 10),
        z: parseInt(z, 10),
        w: parseInt(w, 10)
    };
}
function isActive(cubeState: string) {
    return cubeState === "#";
}
function isInactive(cubeState: string) {
    return cubeState === undefined || cubeState === ".";
}

const inputFile = readFileSync("src/day17/day17.input.txt", "utf8");
const cubes = parseCubes(inputFile);
console.log(applyNCycles(cubes, 6));