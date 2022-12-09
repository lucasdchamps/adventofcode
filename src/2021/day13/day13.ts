import { readFileSync } from "fs";
import { Point, toInt } from "../../utils";

const input = readFileSync("src/2021/day13/day13.input.txt", "utf8");

function parseInput(lines: string[]) {
    return lines.map(line => {
        const [x, y] = line.split(",").map(toInt);
        return new Point(x, y);
    });
}

let res = parseInput(input.split("\n"));

console.log(res);
console.log(res.length);

type Fold = {
    direction: "horizontal" | "vertical";
    coordinate: number
}

function applyFold(points: Point[], { direction, coordinate }: Fold) {
    const pointsToMove = points.filter(point => {
        if (direction === "horizontal" && point.y > coordinate) { return true; }
        if (direction === "vertical" && point.x > coordinate) { return true; }
        return false;
    });

    pointsToMove.forEach(point => {
        if (direction === "horizontal") {
            const downDistance = point.y - coordinate;
            point.y = coordinate - downDistance;
        } else {
            const rightDistance = point.x - coordinate;
            point.x = coordinate - rightDistance;
        }
    });
}

const FOLDS: Fold[] = [
    { direction: "vertical", coordinate: 655 },
    { direction: "horizontal", coordinate: 447 },
    { direction: "vertical", coordinate: 327 },
    { direction: "horizontal", coordinate: 223 },
    { direction: "vertical", coordinate: 163 },
    { direction: "horizontal", coordinate: 111 },
    { direction: "vertical", coordinate: 81 },
    { direction: "horizontal", coordinate: 55 },
    { direction: "vertical", coordinate: 40 },
    { direction: "horizontal", coordinate: 27 },
    { direction: "horizontal", coordinate: 13 },
    { direction: "horizontal", coordinate: 6 },
];

function part1(points: Point[], folds: Fold[]) {
    applyFold(points, folds[0]);

    console.log(new Set(points.map(point => point.toJSON())));
    return new Set(points.map(point => point.toJSON())).size;
}

console.log(part1(res, FOLDS));

function part2(points: Point[], folds: Fold[]) {
    folds.forEach(fold => applyFold(points, fold));

    const pointStrings = new Set(points.map(point => point.toJSON()));
    const uniqPoints: Point[] = [...pointStrings].map(coords => {
        const [x, y] = JSON.parse(coords);
        return new Point(x, y);
    });
    const maxX = Math.max(...uniqPoints.map(point => point.x));
    const maxY = Math.max(...uniqPoints.map(point => point.y));
    for (let j = 0; j <= maxY; j++) {
        let line = "";
        for (let i = 0; i <= maxX; i++) {
            if (pointStrings.has(JSON.stringify([i, j]))) {
                line += "#"
            } else {
                line += "."
            }
        }
        console.log(line);
    }
}

res = parseInput(input.split("\n"));

console.log(part2(res, FOLDS));
